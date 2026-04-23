/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {_decorator, EditBox, Node} from 'cc';
import UiEdColumnCount from './UiEdColumnCount';
import EdFunlandInfo, {EdStageInfo} from './EdFunlandInfo';
import {VwUi} from '../core/VwUi';
import {CwgStateInfo} from '../core/CwgState';

const {ccclass, menu, property} = _decorator;

@ccclass('VwEdUi')
@menu('cwg/VwEdUi')
export default class VwEdUi extends VwUi {

    @property(UiEdColumnCount)
    protected colCnt: UiEdColumnCount;

    @property(Node)
    public columnCtrlsContent: Node;

    @property(Node)
    public columnsContent: Node;

    @property(EditBox)
    protected levelDataEditBox: EditBox;

    public reset(info: CwgStateInfo, funlandInfo?: EdFunlandInfo) {
        super.reset(info);
        this.levelDataEditBox.string = JSON.stringify(funlandInfo?.curLevelData);
    }

    public saveLevelData(infos: EdStageInfo[]) {
        const level_str = JSON.stringify({level: infos});
        console.log(level_str);
        this.levelDataEditBox.string = level_str;
    }

}