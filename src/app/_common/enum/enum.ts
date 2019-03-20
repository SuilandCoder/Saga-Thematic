export enum FieldToGetData {
    BY_AUTHOR = "listByAuthor",
    BY_DATA_ITEM_ID = "listByDataItemId",
    BY_FILE_NAME = "listByFileNameContains",
    BY_MDL_ID = "listByMdlId"
}

export enum DataUploadStatus{
    NOT_READY = 0,
    ON_UPLOADING = 1,
    READY = 2,
}