import { _HttpClient } from './../httpUtils/http.client';
import { Observable, Subject } from 'rxjs';
import { DataInfo, DataUploadInfo } from './../data_model/data-model';
import { Injectable, Inject } from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { FieldToGetData } from '../enum';

@Injectable({
    providedIn:'root'
})
export class UserDataService{
    private fileUrl;
    private dataResUrl;
    public userDatas:Array<DataInfo>=null;

    constructor(
        @Inject("API") private api,
        private http: _HttpClient,
    ){
        this.dataResUrl = `${this.api.backend_data_resource}`;
        this.fileUrl = `${this.api.backend_file}`;
    }

    //*数据上传结果
    private dataUploadResultSubject = new Subject<any>();

    sendDataUploadResultSubjec(uploadDataInfo:any){
        this.dataUploadResultSubject.next(uploadDataInfo);
    }

    getDataUploadResultSubject():Observable<any>{
        return this.dataUploadResultSubject.asObservable();
    }




    //* 上传数据至数据容器：
    uploadData(dataInfo:DataInfo):Observable<any> {
        var fd = new FormData();
        fd.append("file",dataInfo.file);
        return this.http.post(`${this.fileUrl}/upload/store_dataResource_files`,fd)
            .map(res => res)
            .mergeMap(uploadRes=>{
                dataInfo.sourceStoreId = uploadRes.data;
                return this.http.post(`${this.dataResUrl}`,dataInfo)
                .map(res2=>res2);
            })
    }

    //* 查询数据集
    getDatas(method:FieldToGetData,content:string):Observable<any>{ 
        return this.http.get(`${this.dataResUrl}/`+method+"/"+content);
    }

}