/**
 * @Descripttion: 控制瓶子数量和移动瓶子位置
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {_decorator, Component, Node, UITransform, v3} from 'cc';
import {CwgPools} from '../core/CwgPools';
import Glass from '../core/Glass';
import EdGlass from './EdGlass';
import {StageInfo} from '../core/FunlandInfo';

const {ccclass, menu, property} = _decorator;

@ccclass('UiEdColumn')
@menu('cwg/UiEdColumn')
export default class UiEdColumn extends Component {

    /** UI变换组件，用于控制容器尺寸和位置 */
    @property(UITransform)
    public uiTransform: UITransform;

    /** 玻璃瓶容器节点，用于存放所有玻璃瓶实例 */
    @property(Node)
    public glassesNode: Node;

    /** 对象池管理器，用于玻璃瓶的创建和回收 */
    @property(CwgPools)
    protected glassPools: CwgPools;

    /** 垂直移动步长（单位：像素） */
    @property({tooltip: "垂直移动步长"})
    protected verticalStep: number = 20;

    /** 创建单个玻璃瓶并加入场景 */
    protected createGlass() {
        // 从对象池获取可编辑玻璃瓶实例
        const glass: EdGlass = this.glassPools.getGlass() as EdGlass;
        // 初始化玻璃瓶参数（位置、颜色等）
        glass.init({position: {x: 0, y: 0}, colors: [], hideCnt: 0, ad: false, colorCnt: undefined});

        // 设置玻璃瓶位置并激活
        const glassNode = glass.node;
        glassNode.position = v3(0, 0, 0);
        glassNode.parent = this.glassesNode;
        glassNode.active = true;
    }

    /** 下移所有玻璃瓶 */
    public moveDown() {
        this.glassesNode.children.forEach((node) => {
            node.y -= this.verticalStep;
        })
    }

    /** 上移所有玻璃瓶 */
    public moveUp() {
        this.glassesNode.children.forEach((node) => {
            node.y += this.verticalStep;
        })
    }

    /** 
     * 根据关卡配置重置玻璃瓶
     * @param stageConfigs 关卡配置数组，包含每个玻璃瓶的位置和状态
     */
    public reset(stageConfigs: StageInfo[]) {
        // 调整玻璃瓶数量匹配关卡配置
        this.adjustGlassCount(stageConfigs.length);
        // 设置每个玻璃瓶的初始位置和状态
        for (let i = 0; i < stageConfigs.length; i++) {
            const info = stageConfigs[i];
            const node = this.glassesNode.children[i];
            node.y = info.position.y;
            const glass = node.getComponent(Glass);
            glass && glass.init(info);
        }
    }

    /**
     * 调整玻璃瓶数量
     * @param targetCount 目标数量
     */
    public adjustGlassCount(targetCount: number) {
        // 补充缺少的玻璃瓶
        for (let i = this.glassesNode.children.length; i < targetCount; i++) {
            // 从对象池获取玻璃瓶实例
            this.createGlass();
        }
        // 回收多余的玻璃瓶
        for (let i = this.glassesNode.children.length - 1; i >= targetCount; i--) {
            const node = this.glassesNode.children[i];
            const glass = node.getComponent(Glass);
            glass && this.glassPools.recycleGlass(glass);
        }
        // 重新排列所有玻璃瓶位置
        if (targetCount > 0) {
            const height = this.glassesNode.children[0].getComponent(UITransform).height;
            const bottom_y = -targetCount * height / 2;
            this.glassesNode.children.forEach((node, index) => {
                node.y = bottom_y + index * (height + this.verticalStep);
            })
        }
    }


}