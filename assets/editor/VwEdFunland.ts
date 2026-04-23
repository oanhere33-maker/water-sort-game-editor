/**
 * @Descripttion:游乐场编辑器视图
 * @classdesc 负责游乐场布局编辑的视图组件
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, Component, EventTouch, Node, Vec2} from 'cc';
import {CwgPools} from '../core/CwgPools';
import UiEdColumn from './UiEdColumn';
import VwEdGlassSetting from './VwEdGlassSetting';
import EdFunlandInfo, {EdStageInfo} from './EdFunlandInfo';
import EdGlass from './EdGlass';
import UiEdColorCount from './UiEdColorCount';
import UiEdColumnCount from './UiEdColumnCount';

const {ccclass, menu, property} = _decorator;

@ccclass('VwEdFunland')
@menu('cwg/VwEdFunland')
export class VwEdFunland extends Component {

    /** 玻璃瓶容器节点 */
    @property(Node)
    protected contentNode: Node;

    /** 特效展示节点 */
    @property(Node)
    protected effectNode: Node;

    /** 对象池管理器 */
    @property(CwgPools)
    protected pools: CwgPools;

    /** 玻璃瓶配置菜单 */
    @property(VwEdGlassSetting)
    protected glassMenu: VwEdGlassSetting;

    /** 列数配置UI组件 */
    @property(UiEdColumnCount)
    protected uiColumnCount: UiEdColumnCount;

    /** 颜色数量配置UI组件 */
    @property(UiEdColorCount)
    protected uiColorCount: UiEdColorCount;

    protected funland: EdFunlandInfo;

    protected onLoad() {
        console.log("StVwFunland")
    }

    /**
     * 初始化游乐场布局
     * @param funland 游乐场配置数据
     */
    public reset(funland: EdFunlandInfo) {
        this.funland = funland;
        this.uiColumnCount.reset(funland);
    }

    // 触摸事件处理
    protected registerTouchEvents() {
        this.contentNode.targetOff(this);

        // 注册触摸结束事件
        this.contentNode.on(Node.EventType.TOUCH_END, (touch: EventTouch) => {

            // 判断哪个瓶子被点击到了
            // 查找被点击的玻璃瓶
            const currentSelected = this.handleTouchEnd(touch.getUILocation());
            if (currentSelected) {
                this.showGlassConfigMenu(currentSelected);
            }

        }, this);
    }

    protected showGlassConfigMenu(glass: EdGlass) {
        console.log('showMenu')
        this.glassMenu.node.active = true;
        this.glassMenu.init(glass);
        this.glassMenu.onClose = (info: EdStageInfo) => {
            console.log('onClose', info);

            this.uiColorCount.updateColorConfiguration();
        }
    }

    /**
     * 处理触摸结束事件
     * @param location 触摸点的UI坐标
     * @returns 被选中的玻璃瓶实例
     */
    private handleTouchEnd(location: Vec2) {
        let selectedGlass: EdGlass;
        // 遍历所有列查找被点击的玻璃瓶
        this.contentNode.children.find((node, index) => {
            const column = node.getComponent(UiEdColumn);
            // 在列中查找具体玻璃瓶
            return column.glassesNode.children.find((node) => {
                const glass = node.getComponent(EdGlass);
                if (glass.getTouchBoundingBoxToWorld().contains(location)) {
                    selectedGlass = glass;
                    return glass;
                }
            })
        });
        return selectedGlass;
    }

    protected pickupGlass(glass: EdGlass) {
        glass.pickup();
    }

    /** 开始游戏交互 */
    public playStart() {
        this.registerTouchEvents();
    }
}