import { _HttpClient } from './../httpUtils/http.client';
import { Observable, Subject } from 'rxjs';
import { DataInfo } from './../data_model/data-model';
import { Injectable, Inject } from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { FieldToGetData } from '../enum';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService } from './data-transmission.service';

@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    private fileUrl;
    private dataResUrl;
    public userDatas: Array<DataInfo> = null;

    constructor(
        @Inject("API") private api,
        private http: _HttpClient,
        private userDataService: UserDataService,
        private toast: ToastrService,
        private dataTransmissionService: DataTransmissionService,
    ) {
        this.dataResUrl = `${this.api.backend_data_resource}`;
        this.fileUrl = `${this.api.backend_file}`;
    }

    //*数据上传结果
    private dataUploadResultSubject = new Subject<any>();

    sendDataUploadResultSubjec(uploadDataInfo: any) {
        this.dataUploadResultSubject.next(uploadDataInfo);
    }

    getDataUploadResultSubject(): Observable<any> {
        return this.dataUploadResultSubject.asObservable();
    }


    //* 上传数据至数据容器：
    uploadData(dataInfo: DataInfo): Observable<any> {
        var fd = new FormData();
        fd.append("file", dataInfo.file);
        //* 上传文件至DC
        return this.http.post(`${this.fileUrl}/upload/store_dataResource_files`, fd)
            .map(res => res)
            .mergeMap(uploadRes => {
                dataInfo.sourceStoreId = uploadRes.data;
                //* 通过本地后台将数据上传至 dataresource 并发送 getMeta请求，将上传的数据存储在本地后台数据库。
                return this.http.post(`${this.dataResUrl}`, dataInfo)
                    .map(res2 => res2);
            })
    }


    //* 查询数据集
    getDatas(method: FieldToGetData, content: string, filter?: {
        pageIndex: number,
        pageSize: number
    }): Observable<any> {
        var reqFilter = "";
        if (filter) {
            reqFilter = "?page=" + filter.pageIndex + "&pageSize=" + filter.pageSize;
        }
        return this.http.get(`${this.dataResUrl}/` + method + "/" + content + reqFilter);
    }

    //* 发布数据到geoserver
    dataToGeoServer(id: string): Observable<any> {
        return this.http.get(`${this.dataResUrl}/toGeoserver/` + id);
    }

    //* 获取数据 meta
    getMeta(id: string): Observable<any> {
        return this.http.get(`${this.dataResUrl}/getMeta/` + id);
    }

    //* 将数据添加进图层并显示
    addToLayer(dataInfo: DataInfo) {
        console.log("添加至图层按钮被点击");
        //*判断是否为shp或geotiff格式
        if (dataInfo.type === "GEOTIFF" || dataInfo.type === "SHAPEFILE") {
            //*判断有没有发布服务
            if (!dataInfo.toGeoserver) {
                this.dataToGeoServer(dataInfo.id).subscribe({
                    next: res => {
                        if (res.error) {
                            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                        } else {
                            let data: string = res.data;
                            let layerName = data.substring(data.indexOf('fileName:'), data.indexOf('发布成功'));
                            dataInfo.layerName = layerName;
                            dataInfo.toGeoserver = true;
                            console.log("geoserver服务发布成功:", layerName);
                            //* 发布成功，将数据添加至图层：
                            this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
                        }
                    },
                    error: e => {
                        console.log(e);
                    }
                })
            } else {
                //* 已发布，将数据添加至图层：
                this.dataTransmissionService.sendMCGeoServerSubject(dataInfo);
            }
        } else {
            this.toast.warning("Does not support this type.", "Warning", { timeOut: 2000 });
        }
    }

}