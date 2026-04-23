/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-10
 */
import LocalStorage from "../common/LocalStorage";
import ResLoader from "../common/ResLoader";

export interface CwgStateInfo {
    level: number,
    time: number,
    step: number,
    width: number,
    height: number
}

export default class CwgState {

    public info: CwgStateInfo = {level: 0, time: 0, step: 0, width: 3, height: 3};

    constructor() {
        this.info = LocalStorage.getJson("CwgState");
        if (!this.info) {
            this.info = {level: 0, time: 1000, step: 2, width: 2, height: 2};
        }
        // this.info = {level: 2, time: 1000, step: 2, width: 2, height: 2};
    }

    public reset() {
    }

    public getData() {
        return ResLoader.loadJson('resources', `data/level_${this.info.level + 1}`);
    }

    public save() {
        LocalStorage.setJson("CwgState", this.info);
    }
}