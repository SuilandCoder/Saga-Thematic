import { FiledToGetData } from './../enum/enum';
import { _HttpClient } from './../httpUtils/http.client';
import { Observable } from 'rxjs';
import { DataInfo } from './../data_model/data-model';
import { Injectable, Inject } from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

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

    // public get userDatas(){
    //     return this.userDatas;
    // }

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
    getDatas(method:FiledToGetData,content:string):Observable<any>{ 
        return this.http.get(`${this.dataResUrl}/`+method+"/"+content);
    }

}