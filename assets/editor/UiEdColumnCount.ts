/**
 * @Descripttion: 控制列数
 * 1. 管理关卡编辑器的列数显示
 * 2. 同步列数与关卡数据的映射关系
 * 3. 控制列数增减操作
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {_decorator, Component, Label, Node} from 'cc';
import UiEdColumnCtrl from './UiEdColumnCtrl';
import EdFunlandInfo from './EdFunlandInfo';
import {StageInfo} from '../core/FunlandInfo';

const {ccclass, menu, property} = _decorator;

@ccclass('UiEdColumnCount')
@menu('cwg/UiEdColumnCount')
export default class UiEdColumnCount extends Component {

    /** 列控制器容器节点 */
    @property(Node)
    public columnCtrlsContent: Node;

    /** 当前列数显示标签 */
    @property(Label)
    protected countLabel: Label;

    public count: number = 5;
    protected columnMap: Map<number, StageInfo[]> = new Map();
    /** 当前配置的关卡数据 */
    protected currentStageConfig: EdFunlandInfo;

    /**
     * 重置控制器状态
     * @param funland 关卡数据（为空时重置为默认状态）
     */
    reset(funland?: EdFunlandInfo) {
        if (funland) {
            const columnMap: Map<number, StageInfo[]> = new Map();
            funland.glasses.forEach((item) => {
                const key = item.position.x;
                const items: StageInfo[] = columnMap.get(key) || [];
                items.push(item);
                columnMap.set(key, items);
            })
            this.columnMap = columnMap;
            this.count = this.columnMap.size;
            this.currentStageConfig = funland;
        } else {
            this.count = 5;
            this.currentStageConfig = undefined;
        }
        this.updateCountDisplay();
    }

    /** 增加列数（最大不超过8列） */
    protected increaseColumnCount() {
        if (this.count >= 8) {
            return;
        }
        this.count++;
        this.updateCountDisplay();
    }

    /** 减少列数（最小不低于0列） */
    protected decreaseColumnCount() {
        if (this.count <= 0) {
            return;
        }
        this.count--;
        this.updateCountDisplay();
    }

    /** 更新列数显示和控制器布局 */
    protected updateCountDisplay() {
        this.countLabel.string = this.count.toString();
        // 总宽度744px根据列数均分（假设为固定容器宽度）
        const width = 744 / this.count;

        const sortedEntries = Array.from(this.columnMap.entries()).sort((a, b) => a[0] - b[0]);
        const maxCnt = sortedEntries.length;
        this.columnCtrlsContent.children.forEach((item, index) => {
            const colument = item.getComponent(UiEdColumnCtrl);
            if (index < maxCnt) {
                colument.reset(sortedEntries[index][1]);
            } else {
                colument.reset([]);
            }
            colument.uiTransform.width = width;
            item.active = index < this.count;
        })
    }
}