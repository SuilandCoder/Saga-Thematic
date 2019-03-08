import { Injectable } from '@angular/core'
import { TreeModel } from 'ng2-tree'
import { ToolsTreeNode } from '../data_model'
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
@Injectable()
export class ToolsTreeService {
    private RsltTree: TreeModel;

    constructor(private http: HttpClient) {

    }

    getToolsTree_leftTab(url): Promise<any> {
        return new Promise((resolve, reject) => {
            $.getJSON(url, data => {
                console.log(data);
                resolve(data);
            })
        })
    }



    getToolsTree(): Promise<any> {
        return this.organizeTree().then(next => {
            let ResponseData: Array<ToolsTreeNode> = next['data'];
            let RootNodeArray: Array<ToolsTreeNode> = ResponseData.filter(value => {
                return value.parentId === 'NULL';
            })
            //组装树
            RootNodeArray.forEach((value, index) => {
                this.generateTree(value, ResponseData);
            });
            return RootNodeArray;
        });
    }


    addTool(toolsTreeNode: ToolsTreeNode): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('/modelItem/create', null, {
                params: {
                    'modelId': toolsTreeNode.modelId,
                    'value': toolsTreeNode.value,
                    'parentId': toolsTreeNode.parentId
                }
            }).toPromise().then(res => {
                resolve(res);
            }, error => {
                reject(error);
            })
        })
    }

    updateTool(toolsTreeNode: ToolsTreeNode): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post('/modelItem/update', null, {
                params: {
                    'id': toolsTreeNode.id,
                    'modelId': toolsTreeNode.modelId,
                    'value': toolsTreeNode.value,
                    'parentId': toolsTreeNode.parentId
                }
            }).toPromise().then(res => {
                resolve(res);
            }, error => {
                reject(error);
            })
        })
    }
    deleteTool(toolId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.delete('/modelItem/delete', {
                params: {
                    'id': toolId
                }
            }).toPromise().then(res => {
                resolve(res);
            }, error => {
                reject(error);
            })
        })
    }

    /////private//////////////////
    private organizeTestTree(): Promise<any> {

        return new Promise((resolve, reject) => {

            resolve([
                {
                    value: "Analysis Tools",
                    id: 1,
                    loadChildren: (callback) => {
                        callback([
                            {
                                value: "Extract",
                                id: 11,
                                loadChildren: (callback) => {
                                    callback([
                                        {
                                            value: "Clip",
                                            modelId: '59f57d0fc38772305035333f',
                                            id: '59f57d0fc38772305035333f'
                                        },
                                        {
                                            value: "Select",
                                            id: '59f981e55c482c3958e7c022'
                                        },
                                        {
                                            value: "Split",
                                            id: '59f981e55c482c3958e7c022'
                                        }, {
                                            value: "Table Select",
                                            id: '59f981e55c482c3958e7c022'
                                        }
                                    ])
                                }
                            },
                            {
                                value: "Overlay",
                                loadChildren: (callback) => { 
                                    callback([
                                    ])
                                }
                            },
                            {
                                value: "Proximity",
                                loadChildren: (callback) => {
                                    callback([
                                    ])
                                }
                            },
                            {
                                value: "Statistics",
                                loadChildren: (callback) => {
                                    callback([
                                    ])
                                }
                            }
                        ]);
                    }
                }
            ])
        })

    }

    private organizeTree(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get('/modelItem/list', {
                params: {
                    queryCondition: 'all',
                    value: 'NULL'
                }
            }).toPromise().then(data => {
                resolve(data);

            }, error => {
                reject(error);
            })
        })






    }

    private generateTree(RootNode: ToolsTreeNode, AllTreeNodes: Array<ToolsTreeNode>) {
        let childNodes: Array<ToolsTreeNode> = AllTreeNodes.filter((element, index, array) => {
            return element.parentId === RootNode.id;   //注意别写成一个=
        });
        if (childNodes.length > 0) {
            RootNode.children = childNodes;
            childNodes.forEach((value, index) => {
                this.generateTree(value, AllTreeNodes);
            })
        }
    }
}