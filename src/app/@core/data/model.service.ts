import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as $ from "jquery";
import { _HttpClient } from '../utils/httpUtils';

@Injectable({
    providedIn: 'root'
})
export class ModelService {

    constructor(
        private http:_HttpClient
    ) { }

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
        return this.http.post("http://localhost:8082/queryModelPathServlet",`model_name=${toolName}`);
    }

    private handleJSONResponse(response) {
        //       let contentType = response.headers.get('content-type');
        //       if(contentType.includes('application/json')){
        return response.json().then(json => {
            if (response.ok) {
                return json;
            } else {
                return Promise.reject(Object.assign({}, json, {
                    status: response.status,
                    statusText: response.statusText
                }))
            }
        })
        //   }else{
        //       throw new Error(`Sorry, content-type ${contentType} not supported`);
        //   }

    }
}
