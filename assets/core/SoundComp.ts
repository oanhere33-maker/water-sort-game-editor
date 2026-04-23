/**
 * @Descripttion: 水瓶交互控制组件
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator, AudioClip, AudioSource, Color, Component, Node, Sprite, tween, UIOpacity, UITransform} from 'cc';

const {ccclass, menu, property} = _decorator;


@ccclass('SoundComp')
@menu('cwg/SoundComp')
export default class SoundComp extends Component {

    @property(AudioSource)
    audioSource: AudioSource;
    
    @property(AudioClip)
    public waterClips: AudioClip[] = [];

    public playWater(idx: number) {
        if (idx < 0 || idx >= this.waterClips.length) {
            return;
        }
        this.playOneShot(this.waterClips[idx]);
    }

    protected playOneShot(clip: AudioClip) {
        this.audioSource.playOneShot(clip);
    }


}