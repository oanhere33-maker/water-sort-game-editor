/**
 * @Descripttion: 编辑模式下的游戏控制器 - 用于关卡编辑和测试
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime:2025-07-20
 * 
 * 功能说明：
 * - 管理编辑模式下的游戏状态
 * - 提供关卡重置、切换、导出功能
 * - 协调视图层和逻辑层的交互
 */
import {_decorator, Component, Node, profiler, director} from 'cc';
import {VwEdFunland} from './VwEdFunland';
import CwgState from '../core/CwgState';
import EdFunlandInfo, {EdStageInfo} from './EdFunlandInfo';
import UiEdColumn from './UiEdColumn';
import EdGlass from './EdGlass';
import {StageInfo} from '../core/FunlandInfo';
import VwEdUi from './VwEdUi';
import { VwPlay } from '../core/VwPlay';

const {ccclass, menu, property} = _decorator;

/**
 * 编辑模式游戏控制器
 * 负责管理编辑模式下的游戏流程，包括关卡测试、数据导出等
 */
@ccclass('VwEdPlay')
@menu('cwg/VwEdPlay')
export class VwEdPlay extends VwPlay {

    /** 编辑模式的游乐场视图控制器 */
    @property({type: VwEdFunland, override: true})
    protected vwFunland: VwEdFunland;

    /** 编辑模式的UI控制器 */
    @property({type: VwEdUi, override: true})
    protected ui: VwEdUi;

    /** 关卡列节点容器 - 包含所有关卡列的父节点 */
    @property(Node)
    protected columnsNode: Node;

    /** 游乐场数据管理器 - 管理当前编辑的关卡数据 */
    public funland: EdFunlandInfo;

    /**
     * 组件初始化
     * 隐藏性能统计，初始化游戏状态和关卡数据
     */
    start() {
        profiler.hideStats();
        this.gameState = new CwgState();
        this.funland = new EdFunlandInfo();
        this.funland.init(this.gameState);

        // 开始
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
        
        this.vwFunland.reset(this.funland);
        this.ui.reset(this.gameState.info, this.funland);
        // 开始游戏
        this.vwFunland.playStart();
    }

    /**
     * 导出当前编辑的关卡数据
     * 收集所有激活的关卡列和杯子数据，保存为关卡配置
     */
    protected exportLevelData() {
        const stageInfos: EdStageInfo[] = [];
        // 遍历所有关卡列节点
        this.columnsNode.children.forEach((node) => {
            // 跳过未激活的节点
            if (!node.active) {
                return;
            }
            const columnController = node.getComponent(UiEdColumn);
            // 收集该列中的所有杯子数据
            columnController.glassesNode.children.forEach((glassNode) => {
                const glassController = glassNode.getComponent(EdGlass);
                const glassData: StageInfo = glassController.info;
                // 记录杯子的位置信息
                glassData.position = {x: node.x, y: glassNode.y};
                stageInfos.push(glassData);
            })
        })
        
        // 对stageInfos进行排序，按y从大到小排，x从小到大排序
        stageInfos.sort((a, b) => {
            if (a.position.y != b.position.y) {
                return b.position.y - a.position.y;
            }
            return a.position.x - b.position.x;
        })

        // 保存关卡数据到文件
        this.ui.saveLevelData(stageInfos);
    }

    protected openGame() {
        director.loadScene('game');
    }
}