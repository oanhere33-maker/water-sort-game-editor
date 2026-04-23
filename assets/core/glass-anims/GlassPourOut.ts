/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, Animation, AnimationClip, Color, math, Node, Sprite, tween, UIOpacity, v3, Vec3} from 'cc';
import Glass from "../Glass";
import {WaterColor, WaterColors} from "../CwgConstant";
import Toolkit from '../../common/Toolkit';
import { StageInfo } from '../FunlandInfo';

const {ccclass, menu, property} = _decorator;


@ccclass('GlassPourOut')
@menu('cwg/GlassPourOut')
export default class GlassPourOut extends Glass {

    /** 动画组件引用 */
    @property(Animation)
    protected anim: Animation;

    /** 瓶子前面的反光 */
    @property(Node)
    protected frontNode: Node;

    @property([Sprite])
    protected flowingSprites: Sprite[] = [];

    /** 起始列索引（0-based） */
    protected startColumnIndex: number = 0;

    private _eventCallbacks: { [event: string]: (layerIdx: number, color: WaterColor) => void } = {};

    /**
     * 注册事件回调
     * @param event 事件类型：'startPour' | 'completePour'
     * @param callback 回调函数
     * @returns this
     */
    public on(event: 'startPour' | 'completePour', callback: (layerIdx: number, color: WaterColor) => void): this {
        this._eventCallbacks[event] = callback;
        return this;
    }

    /** 是否完成倒水流程 */
    protected isPourOutCompleted: boolean = false;

    /** 玻璃瓶原始位置缓存 */
    protected oriPosition: math.Vec3;

    public init(info: StageInfo): void {
        super.init(info);
        this.flowingSprites.forEach((sprite) => {
            sprite.node.active = false;
        })
    }

    /**
     * 拿起并移动玻璃瓶到目标位置
     * @param from 起始世界坐标
     * @param to 目标世界坐标
     */
    public pickUpMoveTo(from: math.Vec3, to: Readonly<Vec3>) {
        this.oriPosition = from.clone();
        if (this.node.scale.x < 0) {
            this.oriPosition.x -= 17.244 * 2;
        }
        this.node.worldPosition = from;
        tween(this.node).to(0.666, {worldPosition: to}).start();

        // 影子飞走
        if (this.shadowNode) {
            this.shadowNode.position = v3(0, 0, 0);
            tween(this.shadowNode).to(0.3, {x: 380 * this.node.scale.x, y: 22}).start();
            const uiOpacity = this.shadowNode.getComponent(UIOpacity);
            if (uiOpacity) {
                tween(uiOpacity).to(0.3, {opacity: 0}).start();
            }
        }
        this.frontNode.scale = this.node.scale;
    }

    /**
     * 放回玻璃瓶到原始位置
     * @returns 返回移动完成的Promise
     */
    public putDownBack() {
        const layerID = this.startColumnIndex + 1;
        const speed = [0, 6, 5, 4, 3][layerID];
        const tw = tween(this.node).to((0.666 + ((5 - layerID) * 0.333)) / speed, {worldPosition: this.oriPosition});
        return Toolkit.waitForTween(tw);
    }

    /**
     * 处理倒水完成事件
     * @param currentLayerIdx 当前液体层Index
     */
    protected pourOutFinish(currentLayerIdx: number) {
        if (this.isPourOutCompleted) {
            return;
        }
        if (currentLayerIdx == this.startColumnIndex) {
            // 把倒出去的水隐藏起来
            for (let i = 3; i >= this.startColumnIndex; i--) {
                this.watersNode.children[i].active = false;
            }

            const animState = this.anim.getState(this.anim.defaultClip.name);
            const currentTime = animState.time; // 获取当前播放时间

            this.anim.pause();  // 暂停动画
            // 设置倒播模式和倒播时间
            animState.wrapMode = AnimationClip.WrapMode.Reverse;
            animState.time = animState.duration - currentTime;
            animState.speed = [6, 5, 4, 3][currentLayerIdx]; // 倒播速度
            this.anim.resume(); // 开始倒播

            // 倒水完成（触发complete事件）
            // 这时还在做回正的状态
            this.isPourOutCompleted = true;
            this._eventCallbacks.completePour?.(currentLayerIdx, this.waters[currentLayerIdx]);
            this.recycle();
        } else {
            // 把下层的水面显示出来
            this.showNextLayerSurface(currentLayerIdx);
        }
    }

    /**
     * 显示下层水面
     * @param currentLayerIdx 当前液体层Index（0-based）
     */
    protected showNextLayerSurface(index: number) {
        const nextIndex = index - 1;
        if (nextIndex >= 0) {
            const nextNode = this.watersNode.children[nextIndex];
            if (nextNode.active) {
                nextNode.children[0].active = true;
            }
        }
    }

    /**
     * 处理倒水开始事件
     * @param layerID 当前操作的液体层ID
     */
    protected pourOutStart(layerIdx: number) {
        if (this.isPourOutCompleted) {
            return;
        }
        if (layerIdx >= this.startColumnIndex && layerIdx < this.waters.length) {

            const colorIdx = this.waters[layerIdx];
            this._eventCallbacks.startPour?.(layerIdx, colorIdx);

            const color = Color.WHITE.fromHEX(WaterColors[colorIdx].base);
            this.flowingSprites.forEach((sprite) => {
                sprite.node.active = true;
                sprite.color = color;
            })
        }
    }

    /**
     * 重置动画状态到初始值
     */
    protected resetAnim() {
        const animState = this.anim.getState(this.anim.defaultClip.name);
        animState.speed = 1; // 重置播放速度
        animState.time = 0;  // 重置播放位置
        animState.wrapMode = AnimationClip.WrapMode.Normal;
    }

    private initAnimationParams(addWaters: WaterColor[]) {
        this.isPourOutCompleted = false;
        this.startColumnIndex = this.waters.length - addWaters.length;
    }

    /**
     * 播放倒水动画
     * 返回可链式调用的对象
     * @param addWaters 要添加的水颜色数组
     * @returns 动画播放完成的Promise
     */
    public play(addWaters: WaterColor[]) {
        this.resetAnim();

        // 初始化动画参数
        this.initAnimationParams(addWaters);

        this.showSurface();
        this.anim.play();

        return this;
    }

    // 在回收方法中清理回调
    public recycle() {
        this._eventCallbacks = {};
        this.flowingSprites.forEach((sprite) => {
            sprite.node.active = false;
        })
    }
}