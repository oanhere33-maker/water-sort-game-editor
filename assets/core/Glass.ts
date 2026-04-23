/**
 * @Descripttion: 水瓶交互控制组件
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, Color, Component, Node, Sprite, tween, UIOpacity, UITransform} from 'cc';
import {WaterColor, WaterColors} from './CwgConstant';
import WaterSurface from './glass-anims/WaterSurface';
import { StageInfo } from './FunlandInfo';

const {ccclass, menu, property} = _decorator;


@ccclass('Glass')
@menu('cwg/Glass')
export default class Glass extends Component {

    @property({type: Node, tooltip: '瓶体碰撞节点（用于触摸检测）'})
    protected glassNode: Node;

    @property({type: Node, tooltip: '水层节点容器（包含4层水柱节点）'})
    protected watersNode: Node;

    @property({type: Node, tooltip: '密封状态瓶盖节点'})
    protected capNode: Node;                // 瓶盖

    @property
    protected waterHeight: number = 40;          // 每节水柱的高度

    @property
    public pickupHeight: number = 32;

    @property(Node)
    public shadowNode: Node;

    @property(WaterSurface)
    protected waterSurface: WaterSurface;

    @property(Node)
    protected adNode: Node;

    public info: StageInfo = undefined;

    protected waters: WaterColor[] = [];    // 水瓶内的水颜色

    /** 标记瓶子是否处于拿起状态 */
    public isPickedUp: boolean = false;

    /**
     * 初始化水瓶状态
     * @param info
     */
    public init(info: StageInfo) {
        this.capNode.active = false;
        this.info = info;
        this.waters = info.colors;
        this.reset(info.colors);
        this.updateDisplayState();
    }

    /**
     * 重置水柱显示状态
     * @param waters 新的水色配置数组
     */
    public reset(waters: WaterColor[]) {
        this.waters = waters;
        const waterCnt = waters.length;
        for (let i = 0; i < waterCnt; i++) {
            this.setWater(i, this.waters[i]);
        }
        for (let i = waterCnt; i < 4; i++) {
            const waterNode = this.watersNode.children[i];
            waterNode.active = false;
        }
        this.resetSurface();
    }

    public resetSurface() {
        this.waterSurface && this.waterSurface.reset();
    }

    /**
     * 更新瓶子视觉状态
     * 1. 显示水面波纹效果
     * 2. 满瓶时自动加盖
     * 3. 根据水位调整阴影透明度
     */
    public updateDisplayState() {
        this.showSurface();
        if (this.isSealed()) {
            this.putOnCap();
        }
        this.updateShadowOpacity();
        if (this.adNode) {
            this.adNode.active = this.info.ad;
        }
    }

    // 根据水多水少调整影子的颜色深浅
    private updateShadowOpacity() {
        const opacityLevels = [64, 80, 96, 112, 128];
        this.shadowNode.getComponent(UIOpacity).opacity = opacityLevels[this.waters.length];
    }

    protected showSurface() {
        const topIndex = this.waters.length - 1;
        if (topIndex >= 0) {
            const topWaterNode = this.watersNode.children[topIndex];
            topWaterNode.children[0].active = true;
        }
    }

    public getTouchBoundingBoxToWorld() {
        return this.glassNode.getComponent(UITransform).getBoundingBoxToWorld();
    }

    /**
     * 设置指定层水柱颜色
     * @param index 水柱层级（0-3）
     * @param waterColor 目标水色
     * @param black2color
     */
    protected setWater(index: number, waterColor: WaterColor, black2color?: boolean) {
        const waterNode = this.watersNode.children[index];
        if (waterColor == WaterColor.None) {
            waterNode.active = false;
            return;
        }
        if (index < this.info.hideCnt) {
            waterColor = WaterColor.Black;
            waterNode.children[1].active = true;
        } else {
            waterNode.children[1].active = false;
        }
        waterNode.active = true;
        waterNode.children[0].active = false;
        const waterSprite = waterNode.getComponent(Sprite);
        const surfaceSprite = waterNode.children[0].getComponent(Sprite);

        const baseColor = new Color(WaterColors[waterColor].base);
        const surfaceColor = new Color(WaterColors[waterColor].surface);
        if (black2color) {
            tween(waterSprite).to(0.3, {color: baseColor}).start();
            tween(surfaceSprite).to(0.3, {color: surfaceColor}).start();
        } else {
            waterSprite.color = baseColor;
            surfaceSprite.color = surfaceColor;
        }
    }

    // 把瓶子放下来
    public putDown() {
        if (!this.isPickedUp) {
            return;
        }
        this.isPickedUp = false;
        tween(this.glassNode).to(0.17, {y: 0}).start();
        tween(this.shadowNode).to(0.17, {x: 0, y: 0}).start();
        this.resetSurface();
    }

    // 把瓶子拿起来
    public pickup() {
        if (this.isPickedUp) {
            return;
        }
        this.isPickedUp = true;
        this.glassNode.y = this.pickupHeight;
        tween(this.glassNode).to(0.17, {y: this.pickupHeight}).start();
        tween(this.shadowNode).to(0.17, {x: 17.3, y: 10}).start();
        this.resetSurface();
    }

    public hide() {
        this.node.active = false;
    }

    public show() {
        if (this.node.active == false) {
            this.node.active = true;
            this.resetSurface();
            return;
        }
        this.node.active = true;
    }

    /**
     * 获取顶层水色
     * @returns 顶层水色值，空瓶时返回WaterColor.None
     */
    public get waterColor(): WaterColor {
        const len = this.waters.length;
        if (len == 0) {
            return 0;
        }
        return this.waters[len - 1];
    }

    /**
     * 倒出顶层水
     * @returns 返回被倒出的水颜色，当瓶子为空时返回WaterColor.None
     */
    public pourOutWater(): WaterColor {
        const water = this.waters.pop();
        const index = this.waters.length;
        this.setWater(index, WaterColor.None);
        this.resetSurface();
        return water;
    }

    public addIntoWater(color: WaterColor) {
        const index = this.waters.length;
        this.waters.push(color);
        this.setWater(index, color);
        this.resetSurface();
    }

    public isAllHide() {
        if (this.info.hideCnt <= 0) {
            return false;
        }
        return this.info.hideCnt == this.waters.length;
    }

    public showHide() {
        if (this.info.hideCnt <= 0) {
            return;
        }
        this.info.hideCnt--;
        this.setWater(this.info.hideCnt, this.waters[this.info.hideCnt], true);
        this.updateDisplayState();
    }

    public isAd() {
        return this.info.ad;
    }

    /**
     * 判断是否达到密封状态（4层同色水）
     */
    public isSealed() {
        if (this.waters.length < 4) {
            return false;
        }
        return this.waters[0] == this.waters[1] && this.waters[1] == this.waters[2] && this.waters[2] == this.waters[3];
    }

    public putOnCap() {
        this.capNode.active = true;
    }

    public get isFull() {
        return this.waters.length == 4;
    }

    public get isEmpty() {
        return this.waters.length == 0;
    }

    public toString() {
        return JSON.stringify({waters: this.waters});
    }

}