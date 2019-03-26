import { DataUploadStatus } from "../enum";

export class DataUploadInfo {
    public fileName: string;
    public sourceStoreId: string;
    public suffix: string;

}

export class DataInfo {
    public author: string;
    public dataItemId: string;
    public fileName: string;
    public mdlId: string;
    public sourceStoreId: string;
    public suffix: string;
    public tags: Array<string>;
    public type: string;
    public file: File;
    public createDate: string;
    public toGeoserver: boolean;
    constructor() { 
        this.tags = new Array<string>();
    }
}

export class ToolParam {
    public constraints: string;
    public description: string;
    public identifier: string;
    public name: string;
    public optional: string;
    public type: string;
    public dataStatus: DataUploadStatus = DataUploadStatus.NOT_READY;
}


export class ToolInfo {
    public author: string;
    public parameters: Array<any>;
    public tool_description: string;
    public tool_id: string;
    public tool_name: string;
    public tool_path: string;
    public oid: string;
    public stateId: string;
    public mdlId:string;
}


export class GeoData {
    public name: string;
    public id: string;
    public description: string;
    public optional: number;
    public type: string;
    constructor(
        name: string,
        description?: string,
        optional?: number,
        id?: string,
    ) {
        this.name = name;

        if (id) {
            this.id = id;
        }
        if (description) {
            this.description = description;
        }
        if (optional) {
            this.optional = optional
        } else {
            this.optional = 0;
        }
    }
}

export class ToolIOData {
    public stateId: string;
    public stateName: string;
    public stateDesc: string;
    public input: Array<GeoData>;
    public output: Array<GeoData>;
    constructor(
        stateId: string,
        stateName: string,
        stateDesc: string,
        input: Array<GeoData>,
        output: Array<GeoData>
    ) {
        this.input = input;
        this.output = output;
        this.stateId = stateId;
        this.stateName = stateName;
        this.stateDesc = stateDesc
    }
}

export class postData {
    public stateid: string;
    public statename: string;
    public statedesc: string;
    public eventname: string;
    public myfile: File;
    public dataId: string;

    constructor(stateid: string,
        statename: string,
        statedesc: string,
        eventname: string,
        myfile: File | null,
        dataId?: string) {
        this.stateid = stateid;
        this.statename = statename;
        this.statedesc = statedesc
        this.eventname = eventname;
        if (dataId) {
            this.dataId = dataId;
            this.myfile = null;
        } else {
            this.myfile = myfile;
        }


    }
}

export class uploadResponseData {
    public StateId: string;
    public StateName: string;
    public StateDesc: string;
    public Event: string;
    public ResponseData: any;
    constructor(StateId: string,
        StateName: string,
        StateDesc: string,
        EventName: string,
        ResponseData: any
    ) {
        this.StateId = StateId;
        this.StateName = StateName,
            this.StateDesc = StateDesc,
            this.Event = EventName;
        this.ResponseData = ResponseData;
    }
}
// /modelser/:msid?ac=run&inputdata=[{"StateId":":sid","Event":":eventname","DataId":":gdid"},{"StateId":":sid","Event":":eventname","DataId":":gdid"}]
export class DataForRunModel {
    public StateId: string;
    public StateName: string;
    public StateDes: string;
    public Event: string;
    public DataId: string;
    constructor(
        StateId: string,
        StateName: string,
        StateDes: string,
        event: string,
        DataId: string
    ) {
        this.StateId = StateId;
        this.StateName = StateName;
        this.StateDes = StateDes;
        this.Event = event;
        this.DataId = DataId;
    }
}


////layer

export class LayerItem {
    public name: string;
    public file: File;
    public dataId: string;
    public visible: boolean;
    public isOnMap: boolean;
    public uploaded: boolean;
    public layerShowing: boolean;
    public type: string;
    public layerSetting: LayerSetting;
    public dataPath: string = "";
    public tableInfo: TableInfo;
    constructor(
        name: string,
        file?: File,
        type?: string,
        dataId?: string,
    ) {
        this.name = name;

        if (file) {
            this.file = file;
        }
        if (type) {
            this.type = type;
        }
        this.dataId = this.NewGuid();
        this.uploaded = false;
        if (dataId) {
            this.file = null;
            this.dataId = dataId;
            this.uploaded = true;
        }

        this.visible = false;
        this.isOnMap = false;
        this.layerShowing = false;
        this.layerSetting = new LayerSetting();
        //clone
    }

    public clone(): LayerItem {
        let cloneItem = new LayerItem(this.name);
        cloneItem.dataId = this.dataId;
        cloneItem.file = this.file;
        cloneItem.isOnMap = this.isOnMap;
        cloneItem.layerShowing = this.layerShowing;
        cloneItem.uploaded = this.uploaded;
        cloneItem.visible = this.visible;
        return cloneItem;
    }

    private S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    private NewGuid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    }

}


export class GeoJsonLayer {
    public id: string;
    public data: any;

    constructor(id: string, data: any) {
        this.id = id;
        this.data = data;
    }

}

export class ImageLayer {
    public src: string;
    public proj: WktProjection;
    public extent: Array<number>;
    public id: string;
    constructor(src: string,
        proj: WktProjection,
        extent: Array<number>,
        id?: string) {
        this.src = src;
        this.proj = proj;
        this.extent = extent;
        this.id = id;
    }
}

export class WktProjection {
    public name: string;
    public wkt: string;
    constructor(name: string,
        wkt: string) {
        this.name = name;
        this.wkt = wkt;
    }

}

export class MouseEventValue {
    public type: string;
    public pos: Number_XY;
    constructor(type: string,
        pos: Number_XY
    ) {
        this.pos = pos;
        this.type = type;
    }
}

//图层设置
export class LayerSetting {
    public ColorBand: ColorBand;
    public VectorStyle: VectorStyle;
    public Opacity: number;
    public ShowLabel: boolean;
    constructor(LayerItem?: LayerItem,
        ColorBand?: ColorBand) {
        if (ColorBand) {
            this.ColorBand = ColorBand;
        }
        this.ShowLabel = false;
        this.Opacity = 1;
    }
    public clone(): LayerSetting {
        let RsltLayerSetting = new LayerSetting();
        RsltLayerSetting.ColorBand = this.ColorBand ? this.ColorBand.clone() : null;
        RsltLayerSetting.Opacity = this.Opacity;
        RsltLayerSetting.ShowLabel = this.ShowLabel;
        RsltLayerSetting.VectorStyle = this.VectorStyle ? this.VectorStyle.clone() : null;
        return RsltLayerSetting;
    }
}

//色带
export class ColorBand {
    public Index: number;
    public ColorArrayStr: string;
    public ImageUrl: string;
    constructor(Index: number,
        ImageUrl: string,
        ColorArrayStr: string) {
        this.Index = Index;
        this.ImageUrl = ImageUrl;
        this.ColorArrayStr = ColorArrayStr;
    }
    public clone(): ColorBand {
        let RsltColorBand = new ColorBand(this.Index, this.ImageUrl, this.ColorArrayStr);
        return RsltColorBand;
    }
}

//矢量数据样式
export class VectorStyle {
    public FillColor: string;
    public StrokeColor: string;
    public StrokeWidth: number;
    public ImageFillColor: string;
    public ImageStrokeColor: string;
    public ImageStrokeWidth: number;
    public ImageRadius: number;
    public TextField: string;
    public TextStyle: TextStyle;
    constructor() {
        this.TextStyle = new TextStyle();
    }
    public clone(): VectorStyle {
        let RsltVectorStyle = new VectorStyle();
        RsltVectorStyle.FillColor = this.FillColor;
        RsltVectorStyle.ImageFillColor = this.ImageFillColor;
        RsltVectorStyle.ImageRadius = this.ImageRadius;
        RsltVectorStyle.ImageStrokeColor = this.ImageStrokeColor;
        RsltVectorStyle.ImageStrokeWidth = this.ImageStrokeWidth;
        RsltVectorStyle.StrokeColor = this.StrokeColor;
        RsltVectorStyle.StrokeWidth = this.StrokeWidth;
        RsltVectorStyle.TextField = this.TextField;
        RsltVectorStyle.TextStyle = this.TextStyle ? this.TextStyle.clone() : null;
        return RsltVectorStyle;
    }
}

//textStyle
export class TextStyle {
    public Align: string;
    public BaseLine: string;
    public Rotation: number;
    public Font: string;
    public Weight: string;
    public Placement: string;
    public MaxAngle: number;
    public MaxResolution: number;
    public ExceedLen: boolean;
    public Size: number;
    public OffsetX: number;
    public OffsetY: number;
    public Color: string;
    public OutLineColor: string;
    public OutLineWidth: number;
    public Type: string;
    constructor() {
    }
    clone(): TextStyle {
        let Rslt: TextStyle = new TextStyle();
        Rslt.Align = this.Align;
        Rslt.BaseLine = this.BaseLine;
        Rslt.Rotation = this.Rotation;
        Rslt.Font = this.Font;
        Rslt.Weight = this.Weight;
        Rslt.Placement = this.Placement;
        Rslt.MaxAngle = this.MaxAngle;
        Rslt.MaxResolution = this.MaxResolution;
        Rslt.ExceedLen = this.ExceedLen;
        Rslt.Size = this.Size;
        Rslt.OffsetX = this.OffsetX;
        Rslt.OffsetY = this.OffsetY;
        Rslt.Color = this.Color;
        Rslt.OutLineColor = this.OutLineColor;
        Rslt.OutLineWidth = this.OutLineWidth;
        Rslt.Type = this.Type;
        return Rslt;
    }
}

////Tree

export class ToolsTreeNode {
    public id: string = null;
    public modelId: string = null;
    public parentId: string = null;
    public value: string = null;
    public children: Array<ToolsTreeNode> = null;
    constructor(id?: string,
        modelId?: string,
        value?: string,
        parentId?: string,
        children?: Array<ToolsTreeNode>) {

        if (id) this.id = id;
        if (modelId) this.modelId = modelId;
        if (parentId) this.parentId = parentId;
        if (value) this.value = value;
        if (children) this.children = children;

    }

    public setTreeNode(treeNode: {
        id?: string,
        modelId?: string,
        value?: string,
        parentId?: string,
        children?: Array<ToolsTreeNode>
    }) {
        if (treeNode.id) this.id = treeNode.id;
        if (treeNode.modelId) this.modelId = treeNode.modelId;
        if (treeNode.parentId) this.parentId = treeNode.parentId;
        if (treeNode.value) this.value = treeNode.value;
        if (treeNode.children) this.children = treeNode.children;
    }


}

////mouse click event

export class Number_XY {
    public X: number;
    public Y: number;
    constructor(X: number,
        Y: number) {
        this.X = X;
        this.Y = Y;
    }
    setXY(X: number,
        Y: number) {
        this.X = X;
        this.Y = Y;
    }
}

////平面坐标点
export class Point {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number,
        y: number,
        z?: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

////data format
export class DataItem {
    public id: string;
    public name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

}
//模型返回的table数据
export class TableInfo {
    public fieldArr: Array<string>;
    public fieldVal: Array<any>;
    constructor(fieldArr?: Array<string>, fieldVal?: Array<any>) {
        this.fieldArr = fieldArr;
        this.fieldVal = fieldVal;
    }
}


// 上传显示到图层列表的数据
export class CustomFile {
    public file: File;
    public type: string;
    constructor(file: File,
        type: string) {
        this.file = file;
        this.type = type;
    }
}

//用于更新投影坐标系列表的数据
export class ModifiedProjection {
    public type: string;
    public layer: any;
    constructor(type: string,
        layer: any) {
        this.type = type;
        this.layer = layer;
    }
}

//用于显示图层信息
export class LayerItemInfo {
    public itemName: string;
    public itemContent: string;
    constructor(itemName: string,
        itemContent: string) {
        this.itemName = itemName;
        this.itemContent = itemContent;
    }
}

//用于点击图层弹出菜单
export class DataForPopup {
    public layerItem: LayerItem;
    public clickEvent: MouseEvent;
    constructor(layerItem: LayerItem,
        clickEvent: MouseEvent) {
        this.layerItem = layerItem;
        this.clickEvent = clickEvent;
    }
}

//用于显示等待动画
export class LoadingInfo {
    public ShowFlag: boolean;
    public ShowInfo: string;
    constructor(ShowFlag: boolean,
        ShowInfo?: string) {
        this.ShowFlag = ShowFlag;
        if (ShowInfo) {
            this.ShowInfo = ShowInfo;
        }
    }
}


//公交换乘返回数据

export class BusTransferPlan {
    public Cost: number;
    public Length: number;
    public Bus: Array<string>;
    public Routes: Array<string>;

    constructor() {
        this.Cost = 0;
        this.Length = 0;
        this.Bus = new Array<string>();
        this.Routes = new Array<string>();
    }
}

// //后台返回数据格式
// export class Response {
//     public code: number;
//     public data: string;
//     public msg: string;
//     constructor(code: number,
//         data: string,
//         msg: string) {
//         this.code = code;
//         this.data = data;
//         this.msg = msg;
//     }

//}