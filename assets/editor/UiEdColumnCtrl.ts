/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {_decorator, Component, Node, UITransform} from 'cc';
import UiEdColumn from './UiEdColumn';
import {StageInfo} from '../core/FunlandInfo';

const {ccclass, menu, property} = _decorator;

@ccclass('UiEdColumnCtrl')
@menu('cwg/UiEdColumnCtrl')
export default class UiEdColumnCtrl extends Component {

    /** 列容器UI变换组件 */
    @property(UITransform)
    public uiTransform: UITransform;

    /** 列控件实例 */
    @property(UiEdColumn)
    public column: UiEdColumn;

    /** 当前列包含的玻璃杯数量 */
    protected glassCount: number = 3;

    onLoad() {
        this.node.on(Node.EventType.SIZE_CHANGED, this.sizeChanged, this);
        this.node.on(Node.EventType.ACTIVE_CHANGED, this.activeChanged, this);
    }

    protected start(): void {
        this.column.adjustGlassCount(this.glassCount);
    }

    /**
     * 重置列状态
     * @param stageInfos 关卡配置数据
     */
    public reset(stageInfos: StageInfo[]) {
        this.glassCount = stageInfos.length;
        this.column.reset(stageInfos);
    }

    protected sizeChanged() {
        this.column.uiTransform.width = this.uiTransform.width;
    }

    protected activeChanged() {
        this.column.node.active = this.node.active;
    }

    /**
     * 调整玻璃杯数量
     * @param countStr 输入的数量字符串
     */
    protected resetCount(_, countStr: string) {
        this.glassCount = parseInt(countStr);
        this.column.adjustGlassCount(this.glassCount);
    }

    protected moveUp() {
        this.column.moveUp();
    }

    protected moveDown() {
        this.column.moveDown();
    }

}