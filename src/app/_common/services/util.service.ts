import { Injectable } from "@angular/core";
import proj4 from 'proj4'
import { VectorStyle, WktProjection, ImageLayer, ShpMeta, TiffMeta } from "../data_model";
import * as _ from 'lodash';
import { DC_DATA_TYPE } from "../enum";

@Injectable()
export class UtilService {

    constructor() { }

    //将http请求返回的结果组装成imageLayer
    ResToImageLayer(ResponseData: Object) {
        let src = ResponseData['data']['filePosition'];
        let projName = this.getProjByWkt(ResponseData['data']['srs']);
        let proj = new WktProjection(projName, ResponseData['data']['srs']);
        let extent = this.getExtentByGeoTransform(ResponseData['data']['geoTransform']);
        return new ImageLayer(src, proj, extent);
    }

    ResDataToImageLayer(resData: Object) {
        let src = resData['filePosition'];
        let projName = this.getProjByWkt(resData['srs']);
        let proj = new WktProjection(projName, resData['srs']);
        let extent = this.getExtentByGeoTransform(resData['geoTransform']);
        return new ImageLayer(src, proj, extent);
    }

    //由wkt字符串定义投影
    getProjByWkt(projWktString: string): string {
        let ProjName = projWktString.substring(projWktString.indexOf("\"") + 1, projWktString.indexOf(",") - 1);
        proj4.defs(ProjName, projWktString);
        return ProjName;
    }

    getExtentByGeoTransform(GeoTransform: string): Array<number> {

        let RsltArray: Array<number> = GeoTransform.split(',').map((value) => {
            return Number(value);
        });
        if (RsltArray.length === 6) {
            return RsltArray;
        } else {
            return [];
        }
    }

    //获取在地图上图层的几何图形类型 Point ,Polygon ...
    getGeometryType(LayerOnMap: any): string {
        let FeatureType: string = "";
        if (LayerOnMap.getSource() && LayerOnMap.getSource().getFeatures()) {
            let TempFeatures = LayerOnMap.getSource().getFeatures();
            if (TempFeatures.length > 0) {
                if (TempFeatures[0].getGeometry() && TempFeatures[0].getGeometry().getType()) {
                    FeatureType = TempFeatures[0].getGeometry().getType();
                }
            }
        }
        return FeatureType;
    }

    getGeometryTypeFromSource(VectorSource: any): string {
        let FeatureType: string = "";
        if (VectorSource && VectorSource.getFeatures()) {
            let TempFeatures = VectorSource.getFeatures();
            if (TempFeatures.length > 0) {
                if (TempFeatures[0].getGeometry() && TempFeatures[0].getGeometry().getType()) {
                    FeatureType = TempFeatures[0].getGeometry().getType();
                }
            }
        }
        return FeatureType;
    }

    //*获取在地图上图层的几何图形的字段数组
    getFieldArray(LayerOnMap: any): Array<string> {
        let RsltArray: Array<string> = null;
        if (LayerOnMap && LayerOnMap.getSource() && LayerOnMap.getSource().getFeatures()) {
            let Features = LayerOnMap.getSource().getFeatures();
            if (Features.length > 0) {
                let TempArray: Array<string> = Features[0].getKeys();

                if (TempArray) {
                    RsltArray = TempArray.filter((value) => {
                        return value !== "geometry";
                    })
                }
            }
        }
        return RsltArray;
    }

    //获取所有属性
    getFieldValue(LayerOnMap: any): Array<any> {
        let RsltArray: Array<string> = null;
        if (LayerOnMap && LayerOnMap.getSource() && LayerOnMap.getSource().getFeatures()) {
            let Features = LayerOnMap.getSource().getFeatures();
            if (Features.length > 0) {
                let TempArray: Array<string> = Features[0].getKeys();
                let FieldArray: Array<string>;
                if (TempArray) {
                    FieldArray = TempArray.filter((value) => {
                        return value !== "geometry";
                    })
                }
                if (FieldArray) {
                    RsltArray = new Array<any>();
                    for (let Feature of Features) {
                        RsltArray.push(Feature.getProperties());
                    }
                }
            }
        }
        return RsltArray;
    }

    //从图层中获取样式信息
    getStyleFromLayerOnMap(LayerOnMap: any) {
        let vectorStyle = new VectorStyle();
        if (LayerOnMap) {
            let CurrentStyle = LayerOnMap.getStyle()();
            if (CurrentStyle) {
                vectorStyle.ImageFillColor = CurrentStyle.getImage().getFill().getColor() ? CurrentStyle.getImage().getFill().getColor() : '#6699cc';
                vectorStyle.ImageStrokeColor = CurrentStyle.getImage().getStroke().getColor() ? CurrentStyle.getImage().getStroke().getColor() : '#6699cc';
                vectorStyle.ImageStrokeWidth = CurrentStyle.getImage().getStroke().getWidth() ? CurrentStyle.getImage().getStroke().getWidth() : 1.25;
                vectorStyle.ImageRadius = CurrentStyle.getImage().getRadius() ? CurrentStyle.getImage().getRadius() : 5;
                vectorStyle.StrokeColor = CurrentStyle.getStroke().getColor() ? CurrentStyle.getStroke().getColor() : "#6699cc";
                vectorStyle.StrokeWidth = CurrentStyle.getStroke().getWidth() ? CurrentStyle.getStroke().getWidth() : 1.25;
                vectorStyle.FillColor = CurrentStyle.getFill().getColor() ? CurrentStyle.getFill().getColor() : "#6699cc";
                vectorStyle.StrokeColor = CurrentStyle.getStroke().getColor() ? CurrentStyle.getStroke().getColor() : "#6699cc";
                vectorStyle.StrokeWidth = CurrentStyle.getStroke().getWidth() ? CurrentStyle.getStroke().getWidth() : 1.25;
            }
        }
        return vectorStyle;
    }

    //字符串截断
    stringTrunc(str: string, maxKeepLen: number) {
        return str.length > maxKeepLen ? str.substr(0, maxKeepLen - 1) + '...' : str.substr(0);
    }

    //判断是否是数字
    isNumber(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    stringDivider(str: string, width: number, spaceReplacer: string) {
        if (str.length > width) {
            var p = width;
            while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
                p--;
            }
            if (p > 0) {
                var left;
                if (str.substring(p, p + 1) == '-') {
                    left = str.substring(0, p + 1);
                } else {
                    left = str.substring(0, p);
                }
                var right = str.substring(p + 1);
                return left + spaceReplacer + this.stringDivider(right, width, spaceReplacer);
            }
        }
        return str;
    }


    getTableFieldArray(file: File, callback) {
        var reader = new FileReader();
        reader.readAsText(file, "utf-8");
        var fieldArr = new Array<string>();
        var filedValue: Array<any> = [];
        reader.onload = function (evt) {
            var result = reader.result;
            var res = result.toString();
            var arr = res.split("\n");
            arr.forEach((element, index) => {
                var elArr = element.split("\t");
                if (index == 0) {
                    fieldArr = elArr;
                } else {
                    var obj = {};
                    elArr.forEach((el, elIndex) => {
                        obj[fieldArr[elIndex]] = el;
                    })
                    filedValue.push(obj);
                }
            })
            callback(fieldArr, filedValue);
        }
    }

    //* 解析shapefile文件的 meta 字符串
    getShpMetaObj(meta: any) {
        if (meta == null || meta == undefined) {
            return meta;
        }
        meta = JSON.parse(meta);
        let shpMeta = new ShpMeta();
        shpMeta.count = meta.featureCount;
        shpMeta.name = meta.name;
        shpMeta.proj = meta.proj;
        shpMeta.geometry = meta.geometry;
        shpMeta.fields = meta.fields.map(item => {
            return { "field": item.Field, "type": item.Type };
        })
        shpMeta.extent = [];
        let lower = meta.lowerCorner;
        let upper = meta.upperCorner;
        if(lower==null && upper==null){
            shpMeta.extent =[73,18,126,53]
        }else if(lower==null){
            shpMeta.extent = _.concat(upper,upper);
        }else if(upper==null){
            shpMeta.extent = _.concat(lower,lower);
        }else{
            shpMeta.extent = _.concat(lower,upper);
        }
        console.log(JSON.stringify(shpMeta));
        return shpMeta;
    }


    getTiffMetaObj(meta:any){
        if (meta == null || meta == undefined) {
            return meta;
        }
        meta = JSON.parse(meta);
        let tiffMeta = new TiffMeta();
        tiffMeta.proj = meta.proj;
        tiffMeta.bandCount = meta.bandCount;
        tiffMeta.high = meta.high;
        tiffMeta.low = meta.low;
        tiffMeta.name = meta.name;
        tiffMeta.pixelScales = meta.pixelScales;
        tiffMeta.extent = [];
        let lower = meta.lowerCorner;
        let upper = meta.upperCorner;
        if(lower==null && upper==null){
            tiffMeta.extent =[73,18,126,53]
        }else if(lower==null){
            tiffMeta.extent = _.concat(upper,upper);
        }else if(upper==null){
            tiffMeta.extent = _.concat(lower,lower);
        }else{
            tiffMeta.extent = _.concat(lower,upper);
        }
        console.log(JSON.stringify(tiffMeta));
        return tiffMeta;
    }

    parseDataType(sagaType:string){
        let type:string = "";
        if(!sagaType){
            type = DC_DATA_TYPE.OTHER;
        }else if(sagaType.includes("Shapes list")){
            type=DC_DATA_TYPE.OTHER;
        }else if(sagaType.includes("Shapes")){
            type=DC_DATA_TYPE.SHAPEFILE;
        }else if(sagaType.includes("Grid list")){
            type=DC_DATA_TYPE.OTHER;
        }else if(sagaType.includes("Grid")){
            type=DC_DATA_TYPE.SDAT;
        }else{
            type = DC_DATA_TYPE.OTHER;
        }
        return type;
    }

}