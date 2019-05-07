
import { UserService } from './../../services/user.service';
import { UserDataService } from './../../services/user-data.service';
import { DataTransmissionService } from './../../services/data-transmission.service';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataInfo } from '../../data_model';
import { UtilService } from '../../services';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {
  visibleCss:string;
  @Input()
  set visibleInfo(show:any){
    this.visibleCss= show?"visible":"hidden";
  }

  get visibleInfo(){
    return this.visibleCss;
  }
  @Output()
  showEmiter: EventEmitter<boolean> = new EventEmitter();

  loading:boolean = false;

  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  options: UploaderOptions;
  fileUploadUrl: string;
  constructor(
    private dataTransmissionService: DataTransmissionService,
    private utilService: UtilService,
    private toast: ToastrService,
    private userDataService: UserDataService,
    private userService: UserService,
    @Inject("API") private api,
  ) {
    this.options = { concurrency: 1, maxUploads: 20 };
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    // this.fileUploadUrl = `${this.api.backend_file}/upload/store_dataResource_files`;
    this.fileUploadUrl = `${this.api.backend_data_resource}/uploadFile_saga`;
  }

  openMyDialog() {
    // this.show = false;
    // this.showEmiter.emit(this.show);
    this.dataTransmissionService.sendUploadListControlSubject();
  }

  onUploadOutput(output: UploadOutput, InputElement: HTMLInputElement): void {
    if (output.type === 'allAddedToQueue') {
      // this.loading = false;
      if(InputElement){
        InputElement.value = ''; //清空文件列表，避免不能重复上传文件的情况
      } 
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.loading = true;
      //* 文件不可大于1G
      // if (output.file.size > 1073741824) {
      //   this.toast.warning('File cannot be larger than 1G.', "Warning", { timeOut: 2000 });
      //   this.loading = false;
      //   return;
      // }
      let currentFile = output.file.nativeFile;
      this.utilService.getFileMd5(currentFile).subscribe({
        next: res => {
          if (res.error) {
            this.loading = false;
            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
          } else {
            console.log("md5:", res.data);
            let md5 = res.data;
            //*获取到 MD5 值，先发送到后台验证
            this.userDataService.fastUpload(md5).subscribe({
              next: res => {
                let userName: string = this.userService.user.userId;
                  // this.loading = false;
                if (res.error) {
                  //*上传文件
                  output.file.form.append("md5", md5);
                  output.file.form.append("author",userName);
                  this.files.push(output.file);
                  this.loading = false;
                } else {
                  this.userDataService.fileFastUpload(res.data,userName,md5).subscribe({
                    next:res=>{
                      if (res.error) {
                        this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                        this.loading = false;
                      } else {
                        output.file.progress.status = 2;
                        this.files.push(output.file);
                        this.loading = false;
                        this.dataTransmissionService.sendLoadUserDataSubject();
                      }
                    },
                    error:err=>{
                      this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                      this.loading = false;
                    }
                  });
                }
              },
              error: err => {
                this.toast.warning('oops, something went wrong.', "Warning", { timeOut: 2000 });
                this.loading = false;
                if(InputElement){
                  InputElement.value = ''; //清空文件列表，避免不能重复上传文件的情况
                } 
              }
            });
          }
        },
        error: err => {
          this.toast.warning('oops, something went wrong.', "Warning", { timeOut: 2000 });
          // this.loading = false;
        }
      });
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      console.log(output.file);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      console.log("移除文件");
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
      // this.startUpload();
    } else if (output.type === 'cancelled') {
      console.log("取消上传");
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    } else if (output.type === 'done') {
      console.log("上传结束:", output.file.response);
      if(output.file.response.data==null){
        output.file.progress.status = 0;
        this.toast.error("oops, something went wrong.", "error", { timeOut: 2000 });
        return;
      }
      this.dataTransmissionService.sendLoadUserDataSubject();
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.fileUploadUrl,
      method: 'POST',
      data: { type: 'store_dataResource_files' }
    };
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  resume(id: string): void {
    console.log("更新前：", this.files);
    let index = _.findIndex(this.files, ["id", id]);
    if (index >= 0) {
      this.files[index].progress.status = 0;
      // let tmp_file = this.files[index];
      // this.files.splice(index, 1);
      // this.files.push(tmp_file);
      console.log("更新后：", this.files);
      this.startUpload();
    }
  }
}
