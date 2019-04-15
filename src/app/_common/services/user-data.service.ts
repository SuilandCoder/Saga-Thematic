import { _HttpClient } from './../httpUtils/http.client';
import { Observable, Subject } from 'rxjs';
import { DataInfo } from './../data_model/data-model';
import { Injectable, Inject } from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { FieldToGetData, DC_DATA_TYPE } from '../enum';
import { ToastrService } from 'ngx-toastr';
import { DataTransmissionService } from './data-transmission.service';
import { properties } from 'ng-zorro-antd';

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
        asc: boolean,
        pageIndex: number,
        pageSize: number,
        properties: Array<string>,
    }): Observable<any> {
        var reqFilter = "";
        if (filter) {
            reqFilter = "?asc=" + filter.asc + "&page=" + filter.pageIndex + "&pageSize=" + filter.pageSize;
            filter.properties.forEach(item => {
                reqFilter = reqFilter + "&properties=" + item;
            })
        }
        if (method == FieldToGetData.BY_AUTHOR) {
            return this.http.get(`${this.dataResUrl}` + "/" + reqFilter + "&type=" + method + "&value=" + content);
        } else {
            return this.http.get(`${this.dataResUrl}/listByCondition` + "?type=" + method + "&value=" + content);
        }

    }

    //* 根据id查询shapefile dbf
    getShpDBF(id: string): Observable<any> {
        return this.http.get(`${this.dataResUrl}/` + id + "/getDbf");
    }

    //* 根据 id 查询 数据
    getDataById(id: string): Observable<any> {
        return this.http.get(`${this.dataResUrl}/` + id);
    }

    //* 发布数据到geoserver
    dataToGeoServer(id: string): Observable<any> {
        return this.http.get(`${this.dataResUrl}/` + id + "/toGeoserver");
    }

    //* 获取数据 meta
    getMeta(id: string): Observable<any> {
        return this.http.get(`${this.dataResUrl}/` + id + "/getMeta");
    }

    //* 将数据添加进图层并显示
    addToLayer(dataInfo: DataInfo) {
        console.log("添加至图层按钮被点击");
        //*判断是否为shp或geotiff格式
        if (dataInfo.type === DC_DATA_TYPE.GEOTIFF || dataInfo.type === DC_DATA_TYPE.SHAPEFILE || dataInfo.type === DC_DATA_TYPE.SDAT) {
            //*判断有没有发布服务
            if (!dataInfo.toGeoserver) {
                this.dataToGeoServer(dataInfo.id).subscribe({
                    next: res => {
                        if (res.error) {
                            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                        } else {
                            dataInfo = res.data;
                            console.log("geoserver服务发布成功:", dataInfo.layerName);
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