/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, Component, Material, Node, Sprite, Tween} from 'cc';

const {ccclass, menu, property} = _decorator;


@ccclass('WaterSurface')
@menu('cwg/WaterSurface')
export default class WaterSurface extends Component {

    @property({tooltip: '是否开启水面波动效果'})
    protected surfaceEffect: boolean = false;

    @property({type: Node, tooltip: '包含不同水位节点的容器（0-3级水位）'})
    protected watersNode: Node;

    private waterMaterial: Material = null;
    private _waveTime = 0;
    private _waveAmplitude = 5;

    protected tweenProperty: Tween = null;

    /**
     * 重置水面特效参数
     * 初始化水面材质并设置默认波动参数
     */
    public reset() {
        this.waterMaterial = undefined;
        const surfaceSprite = this.getSurfaceSprite();
        if (!surfaceSprite) {
            return;
        }
        if (!surfaceSprite.node.active) {
            surfaceSprite.node.active = true;
        }
        this.waterMaterial = surfaceSprite.getMaterialInstance(0);
        if (this.waterMaterial) {
            this.surfaceEffect = true;
            this._waveAmplitude = 8;
            this.waterMaterial.setProperty('randomSeed', Math.random() * 1000);
            this.waterMaterial.setProperty('waveAmplitude', this._waveAmplitude);
            this.waterMaterial.setProperty('waveFrequency', 50);
            this.waterMaterial.setProperty('waveSpeed', 5);
            this.waterMaterial.setProperty('edgeDamping', 1);
            this.waterMaterial.setProperty('time', 0);
            this.waterMaterial.setProperty('mainTexture', surfaceSprite.spriteFrame.texture);

        }
    }

    /**
     * 获取当前激活水面的精灵组件
     * @returns 水面精灵对象，未找到时返回null
     */
    protected getSurfaceSprite() {
        const surfaceNode = this.getSurfaceNode();
        if (surfaceNode) {
            return surfaceNode.children[0].getComponent(Sprite);
        }
    }

    /**
     * 遍历水位容器查找当前激活的水位节点
     * @returns 当前激活的最高级别水位节点
     */
    protected getSurfaceNode() {
        for (let i = 3; i >= 0; i--) {
            const waterNode = this.watersNode.children[i];
            if (waterNode.active) {
                return waterNode;
            }
        }
    }

    protected update(dt: number) {
        if (!this.surfaceEffect) return;
        if (!this.waterMaterial && this.getSurfaceNode()) {
            this._waveTime = 0;
            this.reset();
        }
        if (!this.waterMaterial) return;

        /** 累计波动时间（用于材质动画） */
        this._waveTime += dt;

        /** 当前波动幅度随时间衰减 */
        this._waveAmplitude -= dt;
        if (this._waveAmplitude < 0) {
            this._waveAmplitude = 0;
            this.surfaceEffect = false;
        }

        /** 更新材质参数 */
        this.waterMaterial.setProperty('time', this._waveTime);
        this.waterMaterial.setProperty('waveAmplitude', this._waveAmplitude);
    }

}