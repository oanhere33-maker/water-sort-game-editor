/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-20
 */
import CwgState from "./CwgState";

export type StageInfo = {
    position: { x: number; y: number };
    colors: number[],
    hideCnt: number,       // 隐藏的个数
    ad: boolean,            // 是否广告
}

export type LevelStruct = {
    level: StageInfo[]
}

export default class FunlandInfo {

    public static debug: boolean = false;

    public glasses: StageInfo[];

    public state: CwgState;

    public init(state: CwgState) {
        this.state = state;
    }

    public async reset() {
        const data = await this.state.getData().catch(() => {
            return null;
        });
        if (data) {
            this.resetLvData(data as LevelStruct);
        } else {
        }
    }

    /**
     * 切换到上一关卡
     * @remarks 当关卡数≤0时不执行操作
     */
    public preLevel() {
        if (this.state.info.level <= 0) {
            return;
        }
        this.state.info.level--;
        this.state.save();
    }

    /**
     * 切换到下一关卡
     * @todo 实现关卡循环逻辑
     */
    public nextLevel() {
        this.state.info.level++;
        this.state.save();
    }

    public resetLvData(save: LevelStruct) {
        this.glasses = save.level;
        // 重新排序，根据position.y
        this.glasses.sort((a: StageInfo, b: StageInfo) => {
            return b.position.y - a.position.y;
        });
    }

}