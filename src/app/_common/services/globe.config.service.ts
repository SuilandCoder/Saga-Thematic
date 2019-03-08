import { Injectable } from '@angular/core';
declare var ol: any;


@Injectable()
export class GlobeConfigService {
    public onlineLayers: Array<Object>;
    private styles = [
        'Road',
        'RoadOnDemand',
        'Aerial',
        'AerialWithLabels',
        'OrdnanceSurvey',
        'TDT',
        'TDT_ima'
    ];

    constructor() {
        this.onlineLayers = [
            {
                name: 'OSM',
                id: 'osm',
                layer: new ol.layer.Tile({
                    source: new ol.source.OSM()
                })

            }
        ];

        for (let i = 0; i < this.styles.length; i++) {
            if(this.styles[i]==="TDT"){
                this.onlineLayers.push({
                    name: '天地图',
                    id: this.styles[i],
                    layer: new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.XYZ({
                            // key: 'b40562686efa2ffbe579e05331f07e86',
                            // imagerySet: this.styles[i],
                            url: "http://t0.tianditu.gov.cn/vec_c/wmts?tk=b40562686efa2ffbe579e05331f07e86"
                        })
                    })
                })
            }else if(this.styles[i]==="TDT_ima"){
                this.onlineLayers.push({
                    name: '天地图影像',
                    id: this.styles[i],
                    layer: new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.XYZ({
                            url:'http://t0.tianditu.gov.cn/img_c/wmts?tk=b40562686efa2ffbe579e05331f07e86'//天地图影像
                        })
                    })
                })
            }else{
                this.onlineLayers.push({
                    name: this.styles[i],
                    id: this.styles[i],
                    layer: new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.BingMaps({
                            key: 'AjJc6AsekcsRocEYk3NhrXNYcAZaD9owLDe7pWr_lI0rT3lmdz0i3WQe7zIO3OcT',
                            imagerySet: this.styles[i]
                        })
                    })
                })
            } 
        } 
    }


}

