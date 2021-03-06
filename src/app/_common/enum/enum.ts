export enum FieldToGetData {
    BY_AUTHOR = "author",
    BY_DATA_ITEM_ID = "dataItem",
    BY_FILE_NAME = "fileName",
    BY_MDL_ID = "mdl"
}

export enum DataUploadStatus {
    NOT_READY = 0,
    ON_UPLOADING = 1,
    READY = 2,
}


export enum MODEL_RUN_STATUS {
    FAILED = -1,
    RUNNING = 0,
    SUCCESS = 1,
}

export enum DC_DATA_TYPE {
    SHAPEFILE = "SHAPEFILE",
    GEOTIFF = "GEOTIFF",
    UDX = "UDX",
    OTHER = "OTHER",
    SDAT = "SDAT",
    SHAPEFILE_LIST = "SHAPEFILE_LIST",
    GEOTIFF_LIST = "GEOTIFF_LIST",
    SDAT_LIST = "SDAT_LIST",
}

export enum VISIBLE_STATUS {
    NOT_VISIBLE = 0,
    ON_LOADING = 1,
    VISIBLE = 2,
}