import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable, Inject} from '@angular/core';
import * as $ from "jquery";
import { _HttpClient } from '../utils/httpUtils';
import {Observable} from 'rxjs';
import { Subject } from 'rxjs'; 
@Injectable()
export class ToolService {

    baseUrl:string;
    constructor(
        private http:_HttpClient,
        private httpc: HttpClient,
        @Inject('API') public api,
    ) { 
        this.baseUrl = `${this.api.backend}`;
    }

    public queryModelPath(library_name, tool): Observable<any> {
        //组织modelName
        var toolName = library_name + "_" + tool.tool_id + "-" + tool.tool_name;
        toolName = toolName.replace(/ /g, "_");
        toolName = toolName.replace(/\(/g, "_");
        toolName = toolName.replace(/\)/g, "");
        toolName = toolName.replace(/\:/g, "");
        toolName = toolName.replace(/\,/g, "");
        console.log("toolName:" + toolName);

        return this.http.get("")
        // return this.http.post("http://localhost:8082/queryModelPathServlet",`model_name=${toolName}`);
    }

    public getToolById(path,id){
        var filePath = "assets/"+path;
        return new Promise((resolve,reject)=>{
            $.getJSON(filePath,data=>{
                console.log(data);
                var tools = data.tools;
                if(!tools){
                    return reject("No Such library");
                }
                var tool = tools.filter(tool=>tool.tool_id===id);
                if(tool && tool.length>0){
                    return resolve(tool[0]);
                }else{
                    return reject("No Such Tool");
                }
            })
        })
    }


    public runSagaModel(formdata):  Promise<any> {
        var header = new HttpHeaders();
        header.append('Content-Type', 'multipart/form-data');
        header.append("X-HTTP-Method-Override","post");
        var url =`${this.baseUrl}/runSagaModel`;
        return new Promise((resolve,reject)=>{
            this.httpc.post(url,formdata,{
                headers:header
            }).toPromise().then(responseData => {
                console.log("responseData"+responseData);
                if (responseData !== undefined &&
                    responseData['code'] !== undefined &&
                    responseData['data'] !== undefined &&
                    responseData['msg'] !== undefined) {
                    if (responseData['code'] === 0) {
                        resolve(responseData['data']);
                    } else {
                        reject(responseData['msg']);
                    }
                } else {
                    reject("error to run model");
                }
            }, error => {
                reject("error to run model");
            });
        });
    }


    private modelInfoSubject = new Subject<any>();
    private rightSideSubject = new Subject<any>();

    sendModelInfoMessage(path,id){
        this.modelInfoSubject.next({"path":path,"id":id});
    }

    clearMessage(){
        this.modelInfoSubject.next();
    }

    getModelInfoMessage():Observable<any>{
        return this.modelInfoSubject.asObservable();
    }

    sendRightSideMessage(){
        this.rightSideSubject.next();
    }

    getRightSideMessage(){
        return this.rightSideSubject.asObservable();
    }

}
