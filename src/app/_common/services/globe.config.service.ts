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
        'OrdnanceSurvey'
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

