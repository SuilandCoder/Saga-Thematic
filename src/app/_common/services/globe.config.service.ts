import { Projection } from 'ol/proj/projection';
import { Injectable } from '@angular/core';
declare var ol: any;
import {
    getWidth
} from 'ol/extent.js';
import {
    get as getProjection
} from 'ol/proj.js';


@Injectable()
export class GlobeConfigService {

    webKey = 'b40562686efa2ffbe579e05331f07e86';

    wmtsUrl_1 = 'http://t{0-7}.tianditu.gov.cn/vec_c/wmts?tk='; //矢量底图
    wmtsUrl_2 = 'http://t{0-7}.tianditu.gov.cn/cva_c/wmts?tk='; //矢量注记

    wmtsUrl_3 = 'http://t{0-7}.tianditu.gov.cn/img_c/wmts?tk='; //影像底图
    wmtsUrl_4 = 'http://t{0-7}.tianditu.gov.cn/cia_c/wmts?tk='; //影像注记

    wmtsUrl_5 = 'http://t{0-7}.tianditu.gov.cn/ter_w/wmts?tk='; //地形底图
    wmtsUrl_6 = 'http://t{0-7}.tianditu.gov.cn/cta_w/wmts?tk='; //地形注记

    wmtsUrl_7 = 'http://t{0-7}.tianditu.gov.cn/ibo_w/wmts?tk='; //境界（省级以上）
    wmtsUrl_8 = 'http://t{0-7}.tianditu.gov.cn/eva_w/wmts?tk='; //矢量英文注记
    wmtsUrl_9 = 'http://t{0-7}.tianditu.gov.cn/eia_w/wmts?tk='; //影像英文注记

    projection;
    projectionExtent;
    matrixIds;
    resolutions;
    size;


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
        this.projection = getProjection('EPSG:4326');
        this.projectionExtent = this.projection.getExtent();
        this.matrixIds = new Array(18);
        this.resolutions = new Array(18);

        this.size = getWidth(this.projectionExtent) / 256;

        for (var z = 1; z < 19; ++z) {
            // generate resolutions and matrixIds arrays for this WMTS
            this.resolutions[z] = this.size / Math.pow(2, z);
            this.matrixIds[z] = z;
        }
        // this.projectionExtent = [-180,-90,180,90]; 
        // this.resolutions = new Array(19);
        // this.matrixIds = new Array(19);
        // this.size = getWidth(this.projectionExtent)/256;
        // for (var z = 0; z < 19; ++z) {  
        //     this.resolutions[z] = this.size / Math.pow(2, z);  
        //     this.matrixIds[z]=z;
        // } 

        this.onlineLayers = [
            {
                name: 'OSM',
                id: 'osm',
                layer: [new ol.layer.Tile({
                    source: new ol.source.OSM(),
                    projection:this.projection
                })]

            }
        ];
        for (let i = 0; i < this.styles.length; i++) {
            if (this.styles[i] === "TDT") {
                this.onlineLayers.push({
                    name: '天地图',
                    id: this.styles[i],
                    layer: [
                        new ol.layer.Tile({
                            source: new ol.source.WMTS({
                                url: this.wmtsUrl_1 + this.webKey,
                                layer: 'vec',
                                matrixSet: 'c',
                                format: 'tiles',
                                style: 'default',
                                projection: this.projection,
                                tileGrid: new ol.tilegrid.WMTS({
                                    origin: ol.extent.getTopLeft(this.projectionExtent),
                                    resolutions: this.resolutions,
                                    matrixIds: this.matrixIds
                                }),
                                wrapX: true
                            })
                        }),
                        new ol.layer.Tile({
                            source: new ol.source.WMTS({
                                url: this.wmtsUrl_2 + this.webKey,
                                layer: 'cva',
                                matrixSet: 'c',
                                format: 'tiles',
                                style: 'default',
                                projection: this.projection,
                                tileGrid: new ol.tilegrid.WMTS({
                                    origin: ol.extent.getTopLeft(this.projectionExtent),
                                    resolutions: this.resolutions,
                                    matrixIds: this.matrixIds
                                }),
                                wrapX: true
                            })
                        })
                    ]
                })
            } else if (this.styles[i] === "TDT_ima") {
                this.onlineLayers.push({
                    name: '天地图影像',
                    id: this.styles[i],
                    layer: [
                        new ol.layer.Tile({
                            preload: Infinity,
                            source: new ol.source.WMTS({
                                url: this.wmtsUrl_3 + this.webKey,
                                layer: 'img',
                                matrixSet: 'c',
                                format: 'tiles',
                                style: 'default',
                                projection: this.projection,
                                tileGrid: new ol.tilegrid.WMTS({
                                    origin: ol.extent.getTopLeft(this.projectionExtent),
                                    resolutions: this.resolutions,
                                    matrixIds: this.matrixIds
                                }),
                                wrapX: true
                            })
                        }),
                        new ol.layer.Tile({
                            source: new ol.source.WMTS({
                                url: this.wmtsUrl_4 + this.webKey,
                                layer: 'cia',
                                matrixSet: 'c',
                                format: 'tiles',
                                style: 'default',
                                projection: this.projection,
                                tileGrid: new ol.tilegrid.WMTS({
                                    origin: ol.extent.getTopLeft(this.projectionExtent),
                                    resolutions: this.resolutions,
                                    matrixIds: this.matrixIds
                                }),
                                wrapX: true
                            })
                        })
                    ]
                })
            } else {
                this.onlineLayers.push({
                    name: this.styles[i],
                    id: this.styles[i],
                    layer: [
                        new ol.layer.Tile({
                            preload: Infinity,
                            source: new ol.source.BingMaps({
                                key: 'AjJc6AsekcsRocEYk3NhrXNYcAZaD9owLDe7pWr_lI0rT3lmdz0i3WQe7zIO3OcT',
                                imagerySet: this.styles[i]
                            }),
                            projection:this.projection
                        })
                    ]
                })
            }
        }
    }


}

