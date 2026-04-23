/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime:2025-07-20
 */
import {_decorator, Component, director} from 'cc';
import {VwFunland} from "./VwFunland";
import {VwUi} from "./VwUi";
import CwgState from "./CwgState";
import FunlandInfo from './FunlandInfo';

const {ccclass, menu, property} = _decorator;

@ccclass('VwPlay')
@menu('cwg/VwPlay')
export class VwPlay extends Component {

    @property(VwFunland)
    protected play: VwFunland;

    @property(VwUi)
    protected ui: VwUi;

    public funland: FunlandInfo;
    public gameState: CwgState;

    start() {
        this.gameState = new CwgState();
        this.funland = new FunlandInfo();
        this.funland.init(this.gameState);

        this.restartLevel();
    }

    /**
     * 重新开始当前关卡
     * 重置游戏状态、关卡数据，并重新初始化视图
     */
    protected async restartLevel() {
        // 重置游戏状态
        this.gameState.reset();
        // 重置关卡数据
        await this.funland.reset();

        this.play.reset(this.funland);
        this.ui.reset(this.gameState.info);

        // 开始游戏
        this.play.playStart();
    }

    /**
     * 切换到上一个或下一个关卡
     * @param _ - 事件对象（未使用）
     * @param direction - 切换方向，'-1'表示上一关，其他值表示下一关
     */
    protected switchLevel(_, direction: string) {
        if (direction == '-1') {
            this.funland.preLevel();
        } else {
            this.funland.nextLevel();
        }
        this.restartLevel();
    }

    protected openLevelEditor() {
        director.loadScene('editor');
    }
}