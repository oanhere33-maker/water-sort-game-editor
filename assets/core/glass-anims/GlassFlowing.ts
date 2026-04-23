/**
 * @Descripttion:
 * 液体流动玻璃杯动画控制器
 * 处理液体注入和瓶盖动画的播放逻辑
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, Color, Node, Sprite, tween, UITransform} from 'cc';
import Toolkit from '../../common/Toolkit';
import SoundComp from '../SoundComp';
import Glass from "../Glass";
import {WaterColor, WaterColors} from "../CwgConstant";

const {ccclass, menu, property} = _decorator;


@ccclass('GlassFlowing')
@menu('cwg/GlassFlowing')
export default class GlassFlowing extends Glass {

    @property(Node)
    public flowingNode: Node;

    @property(SoundComp)
    protected soundComp: SoundComp;

    /**
     * 播放水位上升动画
     * @param index 水位索引（从0开始）
     */
    protected async playWaterUpAnim(index: number) {
        const waterNode = this.watersNode.children[index];
        const waterTransform = waterNode.getComponent(UITransform);
        const height = waterTransform.height;
        waterTransform.height = 46; // 初始高度设为46像素

        // 水流根据水位高度变化
        const flowingTf = this.flowingNode.getComponent(UITransform);
        tween(flowingTf).by(0.333, {height: -this.waterHeight}).start();

        return Toolkit.waitForTween(tween(waterTransform).to(0.333, {height}));
    }

    /**
     * 播放瓶盖盖合动画
     */
    public async playPutOnCapAnim() {
        this.capNode.active = true;
        this.capNode.y = 276;
        await Toolkit.waitForTween(tween(this.capNode).to(0.3, {y: 216}));
    }

    /**
     * 主播放流程
     * @param color 需要添加的新水颜色
     */
    public play(color: WaterColor) {

        const flowingSprite = this.flowingNode.getComponent(Sprite);
        flowingSprite.color = Color.WHITE.fromHEX(WaterColors[color].base);

        const startIdx = this.waters.length;

        const flowingTransform = this.flowingNode.getComponent(UITransform);
        flowingTransform.height = 350 - 40 * startIdx; // 计算流动效果初始高度

        // 激活流动效果节点
        this.capNode.active = false;
        this.flowingNode.active = true;

        // 逐层添加新水并播放动画
        this.addIntoWater(color);
        this.playWaterUpAnim(startIdx)
    }

    // 添加水结束
    public async complete() {
        // 关闭流动效果
        this.flowingNode.active = false;
        if (this.isSealed()) {
            await this.playPutOnCapAnim();
        }
    }

    public playWaterSound(id: number): void {
        // 播发倒水声音
        this.soundComp.playWater(id - 1);
    }
}