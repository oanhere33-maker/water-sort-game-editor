/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {_decorator, Component, Label} from 'cc';
import { CwgStateInfo } from './CwgState';

const {ccclass, menu, property} = _decorator;

@ccclass('VwUi')
@menu('cwg/VwUi')
export class VwUi extends Component {

    @property(Label)
    protected levelLabel: Label;

    public reset(info: CwgStateInfo) {
        this.levelLabel.string = "第" + (info.level + 1).toString() + "关";
    }
}