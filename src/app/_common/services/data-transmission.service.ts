import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { GeoJsonLayer, GeoData, ToolsTreeNode, LayerItem, Point, CustomFile, ImageLayer, ModifiedProjection, DataForPopup, LoadingInfo, DataInfo, ToolDataInfo } from '../data_model'
@Injectable()
export class DataTransmissionService {

    constructor(){
        console.log("init data DataTransmissionService");
    }

    //输出数据添加进 output列表
    private OutputDataSubject = new Subject<any>();
    
    //用模型容器的 geoserve 做可视化
    private MCGeoServerSubject = new Subject<any>();
    //传输文件
    private CustomFileSubject = new Subject<any>();
    //传输dataid，用于显示图层或者隐藏图层
    private VisibleByIdSubject = new Subject<string>();
    //传输实例运行结束后的运行记录
    private ModelRunRecordSubject = new Subject<any>();
    //传输服务容器返回的数据id,用于生成layerlist
    private RemoteDataSubject = new Subject<any>();
    //准备工作完成，tool-box的finish向tool-panel发送数据提交请求,并运行模型
    private ReadySubject = new Subject<any>();
    //返回工具输入的准备状态
    private PreparedStateSubject = new Subject<any>();
    //当鼠标右击，返回点击事件event
    private SettingTreeContextMenuSubject = new Subject<any>();
    //在编辑工具箱时，选中一个工具，向编辑面板发送节点内容
    private SelectedToolNodeSubject = new Subject<any>();
    //当工具箱有更新时，提醒各位订阅者更新
    private ToolsTreeUpdatedSubject = new Subject<any>();
    //删除图层
    private DeleteLayerSubject = new Subject<any>();
    //返回地图区域resize之后event
    private MapResizeSubject = new Subject<any>();
    //传输layers list中所有的数据
    private LayerListSubject = new Subject<Array<LayerItem>>();
    //发起请求
    private ReqAllLayerData = new Subject<any>();
    //用于显示图层弹出菜单
    private DataForPopupSubject = new Subject<DataForPopup>();
    //用于显示等待动画
    private LoadingStateSubject = new Subject<LoadingInfo>();

    ///////////////////map////////////////
    //启用与关闭feature选择功能
    private FeatureSelectedSubject = new Subject<boolean>();
    //当有图层被选中时触发
    private LayerSelectedSubject = new Subject<string>();
    //当点击缩放图层的时候触发
    private LayerFullExtentSubject = new Subject<string>();
    //当鼠标在地图上移动时触发
    private MouseMoveAtMapSubject = new Subject<Point>();
    //当地图更换投影坐标系的时候触发
    private UpdateProjectionSubject = new Subject<any>();
    //当点击数据导出时触发
    private ExportDataSubject = new Subject<LayerItem>();
    //发起获取所有选中Features的请求
    private ReqAllSelectedFeaturesSubject = new Subject<any>();
    //传输所有选中的Features
    private AllSelectedFeaturesSubject = new Subject<any>();
    //切换左侧Tab页的时候，返回切换后的Tab index
    private TabIndexSwitchedSubject = new Subject<any>();
    //是否激活identify功能
    private IdentifySubject = new Subject<boolean>();
    //点击图层属性的按钮
    private LayerSettingSubject = new Subject<LayerItem>();
    //Map对象被创建之后，发送给各个订阅者
    private MapObjectSubject = new Subject<any>();
    //用于更新所有已存在的投影列表
    private updateProjectionList =new Subject<ModifiedProjection>();
    //发送隐藏投影列表的指令
    private modifyProjectionListVisible = new Subject<boolean>();
    //当图层列表排序时触发
    private LayerListOnSortSubject = new Subject<any>();
    //当点击显示图层信息时触发
    private LayerInfoSubject = new Subject<LayerItem>();
    //当添加在线图层时
    private OnlineLayerSubject = new Subject<string>();
    //当重设投影范围时
    private ViewExtentSubject = new Subject<Array<number>>();


    sendOutputDataSubject(toolDataInfo:ToolDataInfo){
        this.OutputDataSubject.next(toolDataInfo);
    }

    sendMCGeoServerSubject(geoServerDataInfo:DataInfo){
        this.MCGeoServerSubject.next(geoServerDataInfo);
    }

    sendCustomFileSubject(file: CustomFile) {
        this.CustomFileSubject.next(file);
    }
 
    sendVisibleByIdSubject(LayerId: string) {
        this.VisibleByIdSubject.next(LayerId);
    }
    sendModelRunRecord(modelRunRecord: string) {
        this.ModelRunRecordSubject.next(modelRunRecord);
    }
    sendRemoteData(data: GeoData) {
        this.RemoteDataSubject.next(data);
    }
    sendReadySubject() {
        this.ReadySubject.next();
    }
    sendPreparedStateSubject(prepared: boolean) {
        this.PreparedStateSubject.next(prepared);
    }
    sendSettingTreeContextMenuSubject(event: MouseEvent) {
        this.SettingTreeContextMenuSubject.next(event);
    }
    sendSelectedToolNodeSubject(TreeNode: ToolsTreeNode) {
        this.SelectedToolNodeSubject.next(TreeNode);
    }
    sendToolsTreeUpdatedSubject() {
        this.ToolsTreeUpdatedSubject.next();
    }
    sendDeleteLayerSubject(LayerId: any) {
        this.DeleteLayerSubject.next(LayerId);
    }
    sendMapResizeSubject(eventTarget: any) {
        this.MapResizeSubject.next(eventTarget);
    }
    sendLayerListSubject(LayerArray: Array<LayerItem>) {
        this.LayerListSubject.next(LayerArray);
    }
    sendReqAllLayerData() {
        this.ReqAllLayerData.next();
    }
    sendDataForPopupSubject(dataForPopup:DataForPopup){
        this.DataForPopupSubject.next(dataForPopup);
    }
    sendLoadingStateSubject(loadingInfo:LoadingInfo){
        this.LoadingStateSubject.next(loadingInfo);
    }

    /////////////////////////////////
    sendFeatureSelectedSubject(IsActive: boolean) {
        this.FeatureSelectedSubject.next(IsActive);
    }
    sendLayerSelectedSubject(LayerId: string) {
        this.LayerSelectedSubject.next(LayerId);
    }
    sendLayerFullExtentSubject(LayerId?: string) {
        this.LayerFullExtentSubject.next(LayerId);
    }
    sendMouseMoveAtMapSubject(point: Point
    ) {
        this.MouseMoveAtMapSubject.next(point);
    }
    sendUpdateProjectionSubject(Projection: any) {
        this.UpdateProjectionSubject.next(Projection);
    }
    sendExportDataSubject(layerItem: LayerItem) {
        this.ExportDataSubject.next(layerItem);
    }
    sendReqAllSelectedFeaturesSubject() {
        this.ReqAllSelectedFeaturesSubject.next();
    }
    sendAllSelectedFeaturesSubject(select: any) {
        this.AllSelectedFeaturesSubject.next(select);
    }
    sendTabIndexSwitchedSubject(TabIndex: number) {
        this.TabIndexSwitchedSubject.next(TabIndex);
    }
    sendIdentifySubject(IdentifyIsActive: boolean) {
        this.IdentifySubject.next(IdentifyIsActive);
    }
    sendLayerSettingSubject(settingLayer: LayerItem) {
        this.LayerSettingSubject.next(settingLayer);
    }
    sendMapObjectSubject(MapObject: any) {
        this.MapObjectSubject.next(MapObject);
    }
    sendUpdateProjectionList(modifiedProjection:ModifiedProjection){
        this.updateProjectionList.next(modifiedProjection);
    }
    sendModifyProjectionListVisible(Visible:boolean){
        this.modifyProjectionListVisible.next(Visible);
    }
    sendLayerListOnSortSubject(){
        this.LayerListOnSortSubject.next();
    }
    sendLayerInfoSubject(layerItem:LayerItem){
        this.LayerInfoSubject.next(layerItem);
    }
    sendOnlineLayerSubject(OnlineLayerName:string){
        this.OnlineLayerSubject.next(OnlineLayerName);
    }
    sendViewExtentSubject(extent:Array<number>){
        this.ViewExtentSubject.next(extent);
    }



    getOutputDataSubject():Observable<ToolDataInfo>{
        return this.OutputDataSubject.asObservable();
    }

    getMCGeoServerSubject(): Observable<DataInfo> {
        return this.MCGeoServerSubject.asObservable();
    }

    getCustomFileSubject(): Observable<CustomFile> {
        return this.CustomFileSubject.asObservable();
    }
    getVisibleByIdSubject(): Observable<any> {
        return this.VisibleByIdSubject.asObservable();
    }
    getModelRunRecord(): Observable<any> {
        return this.ModelRunRecordSubject.asObservable();
    }
    getRemoteData(): Observable<GeoData> {
        return this.RemoteDataSubject.asObservable();
    }

    getReadySubject(): Observable<any> {
        return this.ReadySubject.asObservable();
    }
    getPreparedStateSubject(): Observable<any> {
        return this.PreparedStateSubject.asObservable();
    }
    getSettingTreeContextMenuSubject(): Observable<MouseEvent> {
        return this.SettingTreeContextMenuSubject.asObservable();
    }
    getSelectedToolNodeSubject(): Observable<ToolsTreeNode> {
        return this.SelectedToolNodeSubject.asObservable();
    }
    getToolsTreeUpdatedSubject(): Observable<any> {
        return this.ToolsTreeUpdatedSubject.asObservable();
    }
    getDeleteLayerSubject(): Observable<any> {
        return this.DeleteLayerSubject.asObservable();
    }
    getMapResizeSubject(): Observable<any> {
        return this.MapResizeSubject.asObservable();
    }
    getLayerListSubject(): Observable<Array<LayerItem>> {
        return this.LayerListSubject.asObservable();
    }
    getReqAllLayerData(): Observable<any> {
        return this.ReqAllLayerData.asObservable();
    }
    getDataForPopupSubject():Observable<DataForPopup>{
        return this.DataForPopupSubject.asObservable();
    }
    getLoadingStateSubject():Observable<LoadingInfo>{
        return this.LoadingStateSubject.asObservable();
    }


    //////////

    getFeatureSelectedSubject(): Observable<boolean> {
        return this.FeatureSelectedSubject.asObservable();
    }
    getLayerSelectedSubject(): Observable<string> {
        return this.LayerSelectedSubject.asObservable();
    }
    getLayerFullExtentSubject(): Observable<string> {
        return this.LayerFullExtentSubject.asObservable();
    }
    getMouseMoveAtMapSubject(): Observable<Point> {
        return this.MouseMoveAtMapSubject.asObservable();
    }
    getUpdateProjectionSubject(): Observable<any> {
        return this.UpdateProjectionSubject.asObservable();
    }
    getExportDataSubject(): Observable<LayerItem> {
        return this.ExportDataSubject.asObservable();
    }
    getReqAllSelectedFeaturesSubject(): Observable<any> {
        return this.ReqAllSelectedFeaturesSubject.asObservable();
    }
    getAllSelectedFeaturesSubject(): Observable<any> {
        return this.AllSelectedFeaturesSubject.asObservable();
    }
    getTabIndexSwitchedSubject(): Observable<number> {
        return this.TabIndexSwitchedSubject.asObservable();
    }
    getIdentifySubject(): Observable<boolean> {
        return this.IdentifySubject.asObservable();
    }
    getLayerSettingSubject(): Observable<LayerItem> {
        return this.LayerSettingSubject.asObservable();
    }
    getMapObjectSubject(): Observable<any> {
        return this.MapObjectSubject.asObservable();
    }
    getUpdateProjectionList():Observable<ModifiedProjection>{
        return this.updateProjectionList.asObservable();
    }
    getModifyProjectionListVisible():Observable<boolean>{
        return this.modifyProjectionListVisible.asObservable();
    }
    getLayerListOnSortSubject():Observable<any>{
        return this.LayerListOnSortSubject.asObservable();
    }
    getLayerInfoSubject():Observable<LayerItem>{
        return this.LayerInfoSubject.asObservable();
    }
    getOnlineLayerSubject(){
        return this.OnlineLayerSubject.asObservable();
    }
    getViewExtentSubject(){
        return this.ViewExtentSubject.asObservable();
    }

}