import { Injectable } from '@angular/core'
import { ToolIOData, uploadResponseData, postData, GeoData } from '../data_model';
import { HttpService } from './http.service';

@Injectable()
export class ModelService {
    //上传文件

    constructor(private httpService: HttpService) {

    }

    //获取模型信息
    getModelInfo(ToolId: string): Promise<ToolIOData> {
        return new Promise((resolve, reject) => {
            this.httpService.getModelInfo(ToolId).then(data => {
                resolve(data);
            }, (error => {
                reject(error);
            }));
        })
    }

    //上传文件
    uploadData(toolIOData: ToolIOData, file: Array<File>): Promise<uploadResponseData[]> {
        return new Promise((resolve, reject) => {
            let postDataArray = new Array<postData>();

            let inputFileArray: Array<GeoData> = toolIOData.input;

            if (inputFileArray.length !== file.length) {
                return reject("The number of files does not match the input data.");
            }
            inputFileArray.forEach((value, index) => {
                postDataArray.push(new postData(toolIOData.stateId, toolIOData.stateName,
                    toolIOData.stateDesc, value.name, file[index]));
            })
            this.httpService.uploadInputData(postDataArray).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }


    //调用模型
    runModel(ToolId: string, responseData: uploadResponseData[]): Promise<string> {
        return new Promise((resolve, reject) => {
            this.httpService.runModel_new(ToolId, responseData).then(msr_id => {
                resolve(msr_id);
            }).catch(reason => {
                reject(reason);
            })

        })
    }

    //等待模型返回结果
    onWaitModelRun(msr_id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpService.waitForResult(msr_id).then(data => {
                resolve(data);
            })
        })
    }

    getRemoteTextFile(remoteIp: string, remoteDataId: String): Promise<any> {

        return new Promise((resolve, reject) => {
            let url = "http://"
                + remoteIp
                + ":8060/geodata/"
                + remoteDataId;
            this.httpService.getRemoteData(url).then(res => {
                resolve(res);
            },err=>{
                reject(err);
            })

        })

    }

}