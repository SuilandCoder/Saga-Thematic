import { Component, OnInit } from '@angular/core';
import { DataTransmissionService } from '../../_common';
import { CustomFile } from '../../_common/data_model';
import { ToastrService } from 'ngx-toastr';
import * as JSZip from 'jszip';
@Component({
  selector: 'app-add-layer',
  templateUrl: './add-layer.component.html',
  styleUrls: ['./add-layer.component.css'],
})
export class AddLayerComponent implements OnInit {
  FileInputValue: string;
  constructor(private dataTransmissionService: DataTransmissionService,
    private toast: ToastrService) { }

  ngOnInit() {

  }


  onUploadOutput(ev: any, InputElement: HTMLInputElement) {
    
    if (ev.file && ev.type === "addedToQueue") {
      let currentFile = ev.file.nativeFile;
      JSZip.loadAsync(currentFile).then(data => {
        let Type = "";
        data.forEach((relativePath, file) => {
          let currentFileName: string = relativePath;
          let extName = currentFileName.substr(currentFileName.lastIndexOf('.') + 1);
          switch (extName) {
            case "shp":
              Type = "shp";
              break;
            case "tif":
              Type = "tif";
              break;
            case "sgrd":
              Type = "sgrd";
              break;
            default:
              break;
          }
          if (Type !== "") {
            return false;
          }
        });
        if (Type !== "") {
          this.dataTransmissionService.sendCustomFileSubject(new CustomFile(currentFile, Type));
          InputElement.value = ''; //清空文件列表，避免不能重复上传文件的情况
        } else {
          this.toast.warning("This type of file is not supported.", "Warning", { timeOut: 2000 });
        }
      }, error => {
        //not zip file 
        console.log(error);
        this.toast.warning("This type of file is not supported.", "Warning", { timeOut: 2000 });
      });
    }
  }

  beforeFileUpload(e) {
    console.log('before: ' + e);
  }
}
