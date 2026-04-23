import FunlandInfo, {LevelStruct, StageInfo} from "../core/FunlandInfo";


export interface EdStageInfo extends StageInfo {
    colorCnt?: number,       // 水的个数
}

export default class EdFunlandInfo extends FunlandInfo {

    /** 当前编辑的关卡数据 */
    public curLevelData: LevelStruct;

    /**
     * 重置编辑器数据
     * @async
     * @returns 初始化后的关卡数据
     */
    public async reset() {
        let data = await this.state.getData().catch(() => {
            return null;
        });
        if (!data) {
            data = {
                "level": [{
                    "position": {"x": -248, "y": -120},
                    "colors": [],
                    "hideCnt": 0,
                    "ad": false
                }, {"position": {"x": 0, "y": -120}, "colors": [], "hideCnt": 0, "ad": false}, {
                    "position": {
                        "x": 248,
                        "y": -120
                    }, "colors": [], "hideCnt": 0, "ad": false
                }]
            }
        }
        this.curLevelData = data as LevelStruct;
        this.resetLvData(this.curLevelData);
    }
}