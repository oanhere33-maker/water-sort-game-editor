/**
 * @Descripttion: 水瓶交互控制组件
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */
import {_decorator} from 'cc';
import Glass from '../core/Glass';
import {EdStageInfo} from './EdFunlandInfo';

const {ccclass, menu, property} = _decorator;


@ccclass('EdGlass')
@menu('cwg/EdGlass')
export default class EdGlass extends Glass {

    public info: EdStageInfo = undefined;

    public init(info: EdStageInfo) {
        super.init(info);
    }

}