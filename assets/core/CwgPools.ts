/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, Component, Node, Tween} from 'cc';
import Pool from "../common/Pool";
import Glass from "./Glass";
import GlassPourOut from "./glass-anims/GlassPourOut";
import GlassFlowing from "./glass-anims/GlassFlowing";
import Toolkit from "../common/Toolkit";
import {WaterColor} from "./CwgConstant";
import { StageInfo } from './FunlandInfo';

const {ccclass, menu, property} = _decorator;

@ccclass('CwgPools')
@menu('cwg/CwgPools')
export class CwgPools extends Component {

    @property(Node)
    protected glassNode: Node;

    @property(Node)
    protected pourOutAnimNode: Node;

    @property(Node)
    protected flowingAnimNode: Node;

    protected glassPool: Pool;

    protected pourOutAnimPool: Pool;

    protected flowingAnimPool: Pool;

    /**
     * @description 对象池初始化（Cocos Creator生命周期函数）
     */
    onLoad() {
        this.glassPool = Pool.create(this.glassNode);
        this.pourOutAnimPool = Pool.create(this.pourOutAnimNode);
        this.flowingAnimPool = Pool.create(this.flowingAnimNode);
    }

    /**
     * @description 从对象池获取玻璃杯实例
     * @returns 玻璃杯组件实例
     */
    public getGlass(): Glass {
        const node = this.glassPool.get();
        return node.getComponent(Glass);
    }

    /**
     * @description 回收玻璃杯到对象池
     * @param glass 需要回收的玻璃杯组件
     */
    public recycleGlass(glass: Glass) {
        if (!glass?.node?.isValid) return;
        Tween.stopAllByTarget(glass.node);
        this.glassPool.put(glass.node);
    }

    public getPourOutAnim(glass: Glass, parentNode: Node) {
        const node = this.pourOutAnimPool.get();
        node.parent = parentNode;
        node.worldPosition = glass.node.worldPosition.clone();
        const glassAnim = node.getComponent(GlassPourOut);
        glassAnim.init(Toolkit.cloneObj(glass.info) as StageInfo);
        return glassAnim;
    }

    public recyclePourOutAnim(anim: GlassPourOut) {
        if (!anim?.node?.isValid) return;
        Tween.stopAllByTarget(anim.node);
        this.pourOutAnimPool.put(anim.node);
    }

    /**
     * @description 获取水流动画实例
     * @param sourceGlass 来源玻璃杯组件
     * @param parentNode 父级节点
     * @returns 初始化后的水流动画组件
     */
    public getFlowingAnim(sourceGlass: Glass, parentNode: Node) {
        const node = this.flowingAnimPool.get();
        node.parent = parentNode;
        node.worldPosition = sourceGlass.node.worldPosition.clone();
        node.setSiblingIndex(sourceGlass.node.getSiblingIndex());
        const glassAnim = node.getComponent(GlassFlowing);
        glassAnim.init(Toolkit.cloneObj(sourceGlass.info) as StageInfo);
        return glassAnim;
    }

    public recycleFlowingAnim(anim: GlassFlowing) {
        if (!anim?.node?.isValid) return;
        Tween.stopAllByTarget(anim.node);
        this.flowingAnimPool.put(anim.node);
    }

    onDestroy() {
        if (this.glassPool) {
            this.glassPool.destroy();
            this.glassPool = undefined;
        }
    }
}