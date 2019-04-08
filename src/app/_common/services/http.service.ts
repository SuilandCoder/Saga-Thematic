import { Injectable,Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http"; 
import { DataTransmissionService } from "./data-transmission.service";
import { UtilService } from "./util.service";
import { ToastrService } from 'ngx-toastr';
import { ToolIOData, GeoData, postData, uploadResponseData, LayerItem, DataForRunModel, ImageLayer, WktProjection, ToolRecord, ToolDataInfo, DataInfo } from "../data_model";
import * as Xml2js from 'xml2js';
import { API } from "src/config";
import { resolve } from "url";
import { UserService } from "./user.service";
import { MODEL_RUN_STATUS } from "../enum";
import { UserDataService } from "./user-data.service";

@Injectable()
export class HttpService {
    Ip: string; //default ip of model container.
    SagaIp:string; 
    
    baseUrl:string;
    constructor(private http: HttpClient,
        private dataTransmissionService: DataTransmissionService,
        private utilService: UtilService,
        private toast: ToastrService,
        private userService:UserService,
        private userDataService:UserDataService,
        @Inject('API') public api,
        ) {
        // this.Ip = '172.21.212.119';
        this.SagaIp = '172.21.212.75';
        this.Ip = '172.21.212.75';
        this.baseUrl = `${this.api.backend}`;
    }

    //获取模型信息，用于获取输入输出
    getModelInfo(ToolId: string): Promise<ToolIOData> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.baseUrl}/info`,
                {
                    params: {
                        'ip': this.Ip,
                        'id': ToolId
                    }
                }).toPromise().then(data => {
                    let RsltJson = JSON.parse(data['data']);
                    if (!RsltJson) {
                        this.toast.error("Result format is not correct.");
                        reject(RsltJson);
                    } else {
                        if (RsltJson && RsltJson.result === 'err') {
                            console.log(RsltJson);
                            reject(RsltJson);
                        } else if (RsltJson && RsltJson.result === 'suc') {
                            return RsltJson.data;
                        }
                    }
                }, error => {
                    console.log(error);
                    reject(error);
                }).then(data => {
                    let inputDataArray = new Array<GeoData>();
                    let outputDataArray = new Array<GeoData>();
                    let StateId = '';
                    let StateName = '';
                    let StateDesc = '';
                    
                    if (data && data.States && data.States[0] && data.States[0].$ && data.States[0].Event) {
                        StateId = data.States[0].$.id;
                        StateName = data.States[0].$.name;
                        StateDesc = data.States[0].$.description;
                        let EventCount = data.States[0].Event.length;
                        for (let i = 0; i < EventCount; i++) {

                            let CurrentEvent = data.States[0].Event[i].$;

                            let CurrentGeoData = new GeoData(CurrentEvent.name,
                                CurrentEvent.description,
                                CurrentEvent.optional);

                            if (CurrentEvent.type === 'response') {
                                inputDataArray.push(CurrentGeoData);
                            } else {
                                outputDataArray.push(CurrentGeoData)
                            }
                        }
                        resolve(new ToolIOData(StateId, StateName, StateDesc, inputDataArray, outputDataArray));
                    } else {
                        reject("Unresolved data");
                    }
                })
        })
    }

    //上传输入数据
    uploadInputData(uploadData: Array<postData>): Promise<Array<uploadResponseData>> {
        return new Promise((resolve, reject) => {
            this.PromiseForEach(uploadData, (value) => {

                let fd = new FormData();
                fd.append("stateid", value.stateid);
                fd.append("eventname", value.eventname)
                fd.append('myfile', value.myfile);
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.http.post(`${this.baseUrl}/upload`, fd, {
                            params: {
                                'ip': this.Ip,
                            }
                        }).toPromise().then(data => {

                            resolve(data);
                        }, error => {
                            reject(error);
                        })
                    }, 100);
                })
            }).then((data) => {
                resolve(data);
            }).catch((err) => {
                console.log(err);
                reject(err);

            });
        })

    }

    //运行模型
    runModel(modelId: string,
        StateInfo: ToolIOData,
        InputDataMap: Map<string, LayerItem>): Promise<any> {
        //预处理数据
        let inputData = [];
        if (StateInfo) {
            InputDataMap.forEach((value, key) => {
                let gd_id = value.dataId;
                if (gd_id) {
                    inputData.push(new DataForRunModel(StateInfo.stateId,
                        StateInfo.stateName,
                        StateInfo.stateDesc,
                        key,
                        gd_id));
                }
            })
        }
        return new Promise((resolve, reject) => {
            let inputDataParameter = JSON.stringify(inputData);
            this.http.get(`${this.baseUrl}/run`, {
                params: {
                    'id': modelId,
                    'ip': this.Ip,
                    'ac': 'run',
                    'inputdata': inputDataParameter
                }
            }).toPromise().then(responseData => {
                let RsltJson = JSON.parse(responseData["data"]);
                if (!RsltJson) {
                    console.error("Result format is not correct.");
                    reject(RsltJson);
                } else {
                    if (RsltJson.result === 'err') {
                        reject(RsltJson);
                    } else if (RsltJson.result === 'suc') {
                        resolve(RsltJson.data);
                    }
                }
            }, error => {
                reject("error to run model");
            })
        })
    }

    runModel_new(modelId: string, mUploadResponseData: uploadResponseData[]): Promise<any> {
        return new Promise((resolve, reject) => {
            //预处理数据
            let inputData = [];
            if (mUploadResponseData.length > 0) {
                mUploadResponseData.forEach(value => {
                    if (value.ResponseData != null && value.ResponseData.code !== null) {
                        if (value.ResponseData.code === 0) {
                            if (value.ResponseData.data != null) {
                                let gd_id = JSON.parse(value.ResponseData.data)['gd_id'];

                                inputData.push(new DataForRunModel(value.StateId,
                                    value.StateName,
                                    value.StateName,
                                    value.Event,
                                    gd_id));
                            }
                        }

                    } else {
                        return reject("no response data.");
                    }
                })

                let inputDataParameter = JSON.stringify(inputData);
                this.http.get(`${this.baseUrl}/run`, {
                    params: {
                        'id': modelId,
                        'ip': this.Ip,
                        'ac': 'run',
                        'inputdata': inputDataParameter
                    }
                }).toPromise().then(responseData => {
                    let RsltJson = JSON.parse(responseData["data"]);
                    if (!RsltJson) {
                        console.error("Result format is not correct.");
                        reject(RsltJson);
                    } else {
                        if (RsltJson.res === 'err') {
                            reject(RsltJson);
                        } else if (RsltJson.res === 'suc') {
                            resolve(RsltJson.msr_id);
                        }
                    }
                }, error => {
                    reject("error to run model");
                })
            } else {
                reject("Length of input data array is 0.");
            }




        })
    }
    //* 等待指定的模型运行完成
    waitForResult(msr_id: string,userId?:string): Promise<any> {
        return new Promise((resolve, reject) => {
            let timer = setInterval(() => {
                this.getModelRunRecord(msr_id).then(res => {
                    let JsonObject = JSON.parse(res['data']);
                    if (JsonObject['data'] && JsonObject['data']['msr_span']!=null) {
                        if (JsonObject['data']['msr_span'] !== 0) {
                            // this.dataTransmissionService.sendModelRunRecord(res);
                            if(userId){
                                console.log("模型运行成功，更新模型运行记录");
                                this.userService.addToolRecord(userId,msr_id,MODEL_RUN_STATUS.SUCCESS).subscribe({
                                    next: res => {
                                        if (res.error) {
                                            this.toast.warning(res.error, "Warning", { timeOut: 2000 });
                                        } else {
                                            //* 输出数据已在后台上传至数据容器
                                            //* 将输出数据加载至图层
                                            let recordInfo:ToolRecord = res.data;
                                            let outputs:Array<ToolDataInfo> = recordInfo.outputList;
                                            outputs.forEach(element => {
                                                let dataInfo = new DataInfo();
                                                dataInfo.id = element.dataResourceId;
                                                dataInfo.toGeoserver = false;
                                                dataInfo.fileName = element.dataName;
                                                dataInfo.type = this.utilService.parseDataType(element.type);
                                                this.userDataService.addToLayer(dataInfo);
                                            });
                                        }
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            }
                            clearInterval(timer);
                        }
                    }
                }, error => {
                    console.log(error);
                    if(userId){
                        console.log("模型运行失败，更新模型运行记录");
                        this.userService.addToolRecord(userId,msr_id,MODEL_RUN_STATUS.FAILED).subscribe();
                    }
                    clearInterval(timer);
                })

            }, 1000);
            resolve('waiting for result...');

        })

    }

    //将shpfile 转为 geojson
    getGeoJson(layerItem: LayerItem): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!layerItem) {
                return reject("LayerItem is null");
            }
            if (layerItem.uploaded && layerItem.dataId !== null) { //远程
                this.http.get(`${this.baseUrl}/getData`, {
                    params: {
                        'id': layerItem.dataId,
                        'ip': this.Ip,
                    }
                }).toPromise().then(data => {
                    resolve(data);
                })
            } else { //本地
                if (!layerItem.file) {
                    reject('Input file is null');
                } else {
                    let postData = new FormData();
                    postData.append('shpfile', layerItem.file);
                    this.http.post(`${this.baseUrl}/shp2json`, postData)
                        .toPromise().then(data => {
                            resolve(data);
                        }, error => {
                            reject(error);
                        })
                }
            }
        })
    }
    //将geojson转换为shape file
    geojsonToShape(geojson: any, srsStr: string): Promise<any> {
        let fd = new FormData();
        fd.append("geojsonString", JSON.stringify(geojson));
        fd.append("ip", this.Ip);
        fd.append('projString', srsStr);
        return new Promise((resolve, reject) => {
            this.http.post(`${this.baseUrl}/json2shp`, fd).toPromise().then(res => {
                resolve(res);
            }).catch(error => {
                console.log(error);
            })
        })
    }

    //根据数据id获取真实数据的类型
    getRemoteDataType(dataId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.baseUrl}/getDataType`, {
                params: {
                    id: dataId,
                    ip: this.SagaIp
                }
            }).toPromise().then(next => {
                let ResponseJson = next;
                if (ResponseJson !== undefined &&
                    ResponseJson['code'] !== undefined &&
                    ResponseJson['data'] !== undefined &&
                    ResponseJson['msg'] !== undefined) {
                    if (ResponseJson['code'] === 0) {
                        resolve(ResponseJson['data']);
                    } else {
                        reject(ResponseJson['msg']);
                    }
                } else {
                    reject(next);
                }
            })
        })
    }

    getTableFile(layerItem:LayerItem):Promise<Object>{
        return new Promise((resolve,reject)=>{
            if(!layerItem){
                return reject("LayerItem is null");
            }
            if(layerItem.uploaded && layerItem.dataId !==null){
                let postData = new FormData();
                postData.append('id', layerItem.dataId);
                postData.append('ip', this.SagaIp);
                this.http.post(`${this.baseUrl}/getTableFile`, postData).toPromise().then(next => {
                    resolve(next);
                }).catch(error => {
                    reject(error);
                })
            }
        })
    }


    get_SGRD_ColorMap(layerItem:LayerItem):Promise<Object>{
        return new Promise((resolve,reject)=>{
            if(!layerItem){
                return reject("LayerItem is null");
            }
            //* 远程
            if(layerItem.uploaded && layerItem.dataId !==null){
                let postData = new FormData();
                postData.append('id', layerItem.dataId);
                postData.append('ip', this.SagaIp);
                this.http.post(`${this.baseUrl}/getRemoteSgrdInformation`, postData).toPromise().then(next => {
                    resolve(next);
                }).catch(error => {
                    reject(error);
                })
            }else{
                if (!layerItem.file) {
                    return reject("File in layerItem is null");
                }
                let postData = new FormData();
                postData.append('sgrdFile', layerItem.file);
                this.http.post(`${this.baseUrl}/getSgrdInformation`, postData).toPromise().then(next => {
                    resolve(next);
                }).catch(error => {
                    reject(error);
                })
            }
        })
    }


    //dataId + colorband => 着色后的图片+投影+6参数
    getColorMap(layerItem: LayerItem, colorBand: string): Promise<Object> {
        return new Promise((resolve, reject) => {
            if (!layerItem) {
                return reject("LayerItem is null");
            }
            //远程
            if (layerItem.uploaded && layerItem.dataId !== null) {
                let postData = new FormData();
                postData.append('id', layerItem.dataId);
                postData.append('ip', this.Ip);

                if (colorBand) {
                    postData.append('colorMapping', colorBand)
                } else {
                    postData.append('colorMapping', "0,0,0,0;1,1,1,1;2,3,3,3;3,5,5,5;4,7,7,7;5,9,9,9;6,11,11,11;7,13,13,13;8,15,15,15;9,17,17,17;10,19,19,19;11,21,21,21;12,23,23,23;13,25,25,25;14,27,27,27;15,29,29,29;16,31,31,31;17,33,33,33;18,35,35,35;19,37,37,37;20,39,39,39;21,41,41,41;22,43,43,43;23,45,45,45;24,47,47,47;25,49,49,49;26,51,51,51;27,53,53,53;28,55,55,55;29,57,57,57;30,59,59,59;31,61,61,61;32,63,63,63;33,66,66,66;34,67,67,67;35,70,70,70;36,71,71,71;37,74,74,74;38,75,75,75;39,78,78,78;40,79,79,79;41,82,82,82;42,83,83,83;43,86,86,86;44,87,87,87;45,90,90,90;46,91,91,91;47,94,94,94;48,95,95,95;49,98,98,98;50,99,99,99;51,102,102,102;52,103,103,103;53,106,106,106;54,107,107,107;55,110,110,110;56,111,111,111;57,114,114,114;58,115,115,115;59,118,118,118;60,119,119,119;61,122,122,122;62,123,123,123;63,126,126,126;64,127,127,127;65,129,129,129;66,132,132,132;67,134,134,134;68,135,135,135;69,137,137,137;70,140,140,140;71,142,142,142;72,143,143,143;73,145,145,145;74,148,148,148;75,150,150,150;76,151,151,151;77,153,153,153;78,156,156,156;79,158,158,158;80,159,159,159;81,161,161,161;82,164,164,164;83,166,166,166;84,167,167,167;85,169,169,169;86,172,172,172;87,174,174,174;88,175,175,175;89,177,177,177;90,180,180,180;91,182,182,182;92,183,183,183;93,185,185,185;94,188,188,188;95,190,190,190;96,191,191,191;97,193,193,193;98,196,196,196;99,198,198,198;100,199,199,199;101,201,201,201;102,204,204,204;103,206,206,206;104,207,207,207;105,209,209,209;106,212,212,212;107,214,214,214;108,215,215,215;109,217,217,217;110,220,220,220;111,222,222,222;112,223,223,223;113,225,225,225;114,228,228,228;115,230,230,230;116,231,231,231;117,233,233,233;118,236,236,236;119,238,238,238;120,239,239,239;121,241,241,241;122,244,244,244;123,246,246,246;124,247,247,247;125,249,249,249;126,252,252,252;127,254,254,254;128,254,254,254;129,252,252,252;130,249,249,249;131,247,247,247;132,246,246,246;133,244,244,244;134,241,241,241;135,239,239,239;136,238,238,238;137,236,236,236;138,233,233,233;139,231,231,231;140,230,230,230;141,228,228,228;142,225,225,225;143,223,223,223;144,222,222,222;145,220,220,220;146,217,217,217;147,215,215,215;148,214,214,214;149,212,212,212;150,209,209,209;151,207,207,207;152,206,206,206;153,204,204,204;154,201,201,201;155,199,199,199;156,198,198,198;157,196,196,196;158,193,193,193;159,191,191,191;160,190,190,190;161,188,188,188;162,185,185,185;163,183,183,183;164,182,182,182;165,180,180,180;166,177,177,177;167,175,175,175;168,174,174,174;169,172,172,172;170,169,169,169;171,167,167,167;172,166,166,166;173,164,164,164;174,161,161,161;175,159,159,159;176,158,158,158;177,156,156,156;178,153,153,153;179,151,151,151;180,150,150,150;181,148,148,148;182,145,145,145;183,143,143,143;184,142,142,142;185,140,140,140;186,137,137,137;187,135,135,135;188,134,134,134;189,132,132,132;190,129,129,129;191,127,127,127;192,126,126,126;193,123,123,123;194,122,122,122;195,119,119,119;196,118,118,118;197,115,115,115;198,114,114,114;199,111,111,111;200,110,110,110;201,107,107,107;202,106,106,106;203,103,103,103;204,102,102,102;205,99,99,99;206,98,98,98;207,95,95,95;208,94,94,94;209,91,91,91;210,90,90,90;211,87,87,87;212,86,86,86;213,83,83,83;214,82,82,82;215,79,79,79;216,78,78,78;217,75,75,75;218,74,74,74;219,71,71,71;220,70,70,70;221,67,67,67;222,66,66,66;223,63,63,63;224,61,61,61;225,59,59,59;226,57,57,57;227,55,55,55;228,53,53,53;229,51,51,51;230,49,49,49;231,47,47,47;232,45,45,45;233,43,43,43;234,41,41,41;235,39,39,39;236,37,37,37;237,35,35,35;238,33,33,33;239,31,31,31;240,29,29,29;241,27,27,27;242,25,25,25;243,23,23,23;244,21,21,21;245,19,19,19;246,17,17,17;247,15,15,15;248,13,13,13;249,11,11,11;250,9,9,9;251,7,7,7;252,5,5,5;253,3,3,3;254,1,1,1;255,0,0,0")
                }
                this.http.post(`${this.baseUrl}/getRemoteTifInformation`, postData).toPromise().then(next => {
                    // let RsltJson = next;
                    // if (RsltJson && RsltJson["code"] !== undefined) {
                    //     if (RsltJson["code"] === 0) {
                    //         if (RsltJson['data']) {
                    //             //let src = RsltJson.data.base64;
                    //             let src = RsltJson['data']['filePosition'];
                    //             let projName = this.utilService.getProjByWkt(RsltJson['data']['srs']);
                    //             let proj = new WktProjection(projName, RsltJson['data']['srs']);
                    //             let extent = this.utilService.getExtentByGeoTransform(RsltJson['data']['geoTransform']);
                    //             resolve(new ImageLayer(src, proj, extent));
                    //         } else {
                    //             reject(next);
                    //         }
                    //     } else {
                    //         reject(next);
                    //     }
                    // } else {
                    //     reject(next);
                    // }
                    resolve(next);
                }).catch(error => {
                    reject(error);
                })
            } else {
                if (!layerItem.file) {
                    return reject("File in layerItem is null");
                }
                let postData = new FormData();
                postData.append('tifFile', layerItem.file);
                if (colorBand) {
                    postData.append('colorMapping', colorBand);
                } else {
                    postData.append('colorMapping', "0,0,0,0;1,1,1,1;2,3,3,3;3,5,5,5;4,7,7,7;5,9,9,9;6,11,11,11;7,13,13,13;8,15,15,15;9,17,17,17;10,19,19,19;11,21,21,21;12,23,23,23;13,25,25,25;14,27,27,27;15,29,29,29;16,31,31,31;17,33,33,33;18,35,35,35;19,37,37,37;20,39,39,39;21,41,41,41;22,43,43,43;23,45,45,45;24,47,47,47;25,49,49,49;26,51,51,51;27,53,53,53;28,55,55,55;29,57,57,57;30,59,59,59;31,61,61,61;32,63,63,63;33,66,66,66;34,67,67,67;35,70,70,70;36,71,71,71;37,74,74,74;38,75,75,75;39,78,78,78;40,79,79,79;41,82,82,82;42,83,83,83;43,86,86,86;44,87,87,87;45,90,90,90;46,91,91,91;47,94,94,94;48,95,95,95;49,98,98,98;50,99,99,99;51,102,102,102;52,103,103,103;53,106,106,106;54,107,107,107;55,110,110,110;56,111,111,111;57,114,114,114;58,115,115,115;59,118,118,118;60,119,119,119;61,122,122,122;62,123,123,123;63,126,126,126;64,127,127,127;65,129,129,129;66,132,132,132;67,134,134,134;68,135,135,135;69,137,137,137;70,140,140,140;71,142,142,142;72,143,143,143;73,145,145,145;74,148,148,148;75,150,150,150;76,151,151,151;77,153,153,153;78,156,156,156;79,158,158,158;80,159,159,159;81,161,161,161;82,164,164,164;83,166,166,166;84,167,167,167;85,169,169,169;86,172,172,172;87,174,174,174;88,175,175,175;89,177,177,177;90,180,180,180;91,182,182,182;92,183,183,183;93,185,185,185;94,188,188,188;95,190,190,190;96,191,191,191;97,193,193,193;98,196,196,196;99,198,198,198;100,199,199,199;101,201,201,201;102,204,204,204;103,206,206,206;104,207,207,207;105,209,209,209;106,212,212,212;107,214,214,214;108,215,215,215;109,217,217,217;110,220,220,220;111,222,222,222;112,223,223,223;113,225,225,225;114,228,228,228;115,230,230,230;116,231,231,231;117,233,233,233;118,236,236,236;119,238,238,238;120,239,239,239;121,241,241,241;122,244,244,244;123,246,246,246;124,247,247,247;125,249,249,249;126,252,252,252;127,254,254,254;128,254,254,254;129,252,252,252;130,249,249,249;131,247,247,247;132,246,246,246;133,244,244,244;134,241,241,241;135,239,239,239;136,238,238,238;137,236,236,236;138,233,233,233;139,231,231,231;140,230,230,230;141,228,228,228;142,225,225,225;143,223,223,223;144,222,222,222;145,220,220,220;146,217,217,217;147,215,215,215;148,214,214,214;149,212,212,212;150,209,209,209;151,207,207,207;152,206,206,206;153,204,204,204;154,201,201,201;155,199,199,199;156,198,198,198;157,196,196,196;158,193,193,193;159,191,191,191;160,190,190,190;161,188,188,188;162,185,185,185;163,183,183,183;164,182,182,182;165,180,180,180;166,177,177,177;167,175,175,175;168,174,174,174;169,172,172,172;170,169,169,169;171,167,167,167;172,166,166,166;173,164,164,164;174,161,161,161;175,159,159,159;176,158,158,158;177,156,156,156;178,153,153,153;179,151,151,151;180,150,150,150;181,148,148,148;182,145,145,145;183,143,143,143;184,142,142,142;185,140,140,140;186,137,137,137;187,135,135,135;188,134,134,134;189,132,132,132;190,129,129,129;191,127,127,127;192,126,126,126;193,123,123,123;194,122,122,122;195,119,119,119;196,118,118,118;197,115,115,115;198,114,114,114;199,111,111,111;200,110,110,110;201,107,107,107;202,106,106,106;203,103,103,103;204,102,102,102;205,99,99,99;206,98,98,98;207,95,95,95;208,94,94,94;209,91,91,91;210,90,90,90;211,87,87,87;212,86,86,86;213,83,83,83;214,82,82,82;215,79,79,79;216,78,78,78;217,75,75,75;218,74,74,74;219,71,71,71;220,70,70,70;221,67,67,67;222,66,66,66;223,63,63,63;224,61,61,61;225,59,59,59;226,57,57,57;227,55,55,55;228,53,53,53;229,51,51,51;230,49,49,49;231,47,47,47;232,45,45,45;233,43,43,43;234,41,41,41;235,39,39,39;236,37,37,37;237,35,35,35;238,33,33,33;239,31,31,31;240,29,29,29;241,27,27,27;242,25,25,25;243,23,23,23;244,21,21,21;245,19,19,19;246,17,17,17;247,15,15,15;248,13,13,13;249,11,11,11;250,9,9,9;251,7,7,7;252,5,5,5;253,3,3,3;254,1,1,1;255,0,0,0")
                }
                this.http.post(`${this.baseUrl}/getTifInformation`, postData).toPromise().then(next => {
                    resolve(next);
                }).catch(error => {
                    reject(error);
                })
            }
        })
    }

    //待完成，还不能使用
    // getImageWMSExtent(workDirctory:string,coverageid:string): Promise<Array<number>> {
    //         return new Promise((resolve, reject) => {
    //             let Rslt: Array<number>;
    //             this.http.get('/saga_theme/api/remoteGet', {
    //                 params: {
    //                     url: 'http://localhost:8080/geoserver/'+workDirctory+'/wcs'+
    //                     service=wcs,
    //                     service: 'WCS',
    //                     version: '2.0.1',
    //                     request: 'describecoverage',
    //                     coverageid: 'ogms_ws:geotiff_chazhi'
    //                 }
    //             }).toPromise().then(next => {
    //                 let JsonObject:any = next;
    //                 if (JsonObject && JsonObject.code !== null) {
    //                     if (JsonObject.code === 0 && JsonObject.data) {
    //                         Xml2js.parseString(JsonObject.data, function (err, result) {
    //                             let wcsInfoJson: JSON = result;
    //                             if (wcsInfoJson && wcsInfoJson['wcs:CoverageDescriptions']) {
    //                                 let CoverageDescriptionArray: Array<any> = wcsInfoJson['wcs:CoverageDescriptions']['wcs:CoverageDescription'];
    //                                 if (CoverageDescriptionArray && CoverageDescriptionArray.length > 0) {
    //                                     let boundedByArray = CoverageDescriptionArray[0]['gml:boundedBy'];
    //                                     if (boundedByArray && boundedByArray.length > 0) {
    //                                         let EnvelopeArray = boundedByArray[0]['gml:Envelope'];
    //                                         if (EnvelopeArray && EnvelopeArray.length > 0) {
    //                                             let lowerCornerStringArray: Array<string> = EnvelopeArray[0]['gml:lowerCorner'];
    //                                             let upperCornerStringArray: Array<string> = EnvelopeArray[0]['gml:upperCorner'];
    //                                             if (lowerCornerStringArray &&
    //                                                 lowerCornerStringArray.length > 0 &&
    //                                                 upperCornerStringArray &&
    //                                                 upperCornerStringArray.length > 0) {
    //                                                 let lowerCorner = lowerCornerStringArray[0].trim().split(/\s+/);
    //                                                 let upperCorner = upperCornerStringArray[0].trim().split(/\s+/);

    //                                                 if (lowerCorner && lowerCorner.length === 2 &&
    //                                                     upperCorner && upperCorner.length === 2) {
    //                                                     if (this.utilService.isNumber(Number(lowerCorner[0])) &&
    //                                                     this.utilService.isNumber(Number(lowerCorner[1])) &&
    //                                                     this.utilService.isNumber(Number(upperCorner[0])) &&
    //                                                     this.utilService.isNumber(Number(upperCorner[1]))) {
    //                                                         Rslt = new Array<number>();

    //                                                         Rslt.push(Number(lowerCorner[1]));
    //                                                         Rslt.push(Number(lowerCorner[0]));
    //                                                         Rslt.push(Number(upperCorner[1]));
    //                                                         Rslt.push(Number(upperCorner[0]));
    //                                                         return resolve(Rslt);
    //                                                     }
    //                                                 }
    //                                             }
    //                                         }
    //                                     }
    //                                 }
    //                             }
    //                             return resolve(Rslt);
    //                         });
    //                         return resolve(Rslt);
    //                     } else {
    //                         reject(Rslt);
    //                     }
    //                 } else {
    //                     reject(Rslt);
    //                 }
    //             })
    //         })
    // }

    //////////////////////private method////////////////////////////
    // 遍历所有的文件，并依次上传
    private PromiseForEach(dataArray: Array<postData>, callback: Function): Promise<any> {
        let realResult = [];
        let TempResult = Promise.resolve();
        dataArray.forEach((value, index) => {
            //将连接了新的.then的result替换掉原来的，最后所得到一长串的result.then().then().then()...达到串行的效果
            //callback为异步操作，希望返回的是一个Promise<any>对象
            TempResult = TempResult.then(() => {
                return callback(value).then((callbackRes) => {
                    realResult.push(new uploadResponseData(
                        value.stateid,
                        value.statename,
                        value.statedesc,
                        value.eventname,
                        callbackRes));
                })
            })
        })
        return TempResult.then(() => {
            return realResult;
        })
    }

    //获取模型运行记录
    getModelRunRecord(msr_id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.baseUrl}/instance`, {
                params: {
                    'ip': this.SagaIp,
                    'id': msr_id
                }
            }).toPromise().then(res => {
                resolve(res);
            }, error => {
                reject(error);
            })
        })
    }

    //加载资源文件
    getSource(filePath: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(filePath).toPromise().then(res => {
                resolve(res);
            }, error => {
                reject(error);
            })
        })
    }

    //获取模型服务容器上的文件
    getRemoteData(url:string):Promise<any>{
        return new Promise((resolve,reject)=>{
            this.http.get(`${this.baseUrl}/remoteGet`,{
                params:{
                    url:url
                }
            }).toPromise().then(res=>{
                resolve(res);
            })
        })
    }

}