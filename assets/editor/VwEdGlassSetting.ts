/**
 * @Descripttion: 玻璃杯设置界面组件 - 用于编辑单个玻璃杯的颜色数量和隐藏数量
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-20
 * 
 * 该组件提供以下功能：
 * 1. 设置玻璃杯中的颜色数量（0-4种颜色）
 * 2. 设置玻璃杯的隐藏数量（0-4层隐藏）
 * 3. 切换为广告模式（特殊状态）
 * 4. 保存设置并关闭界面
 */
import {_decorator, Component, ToggleContainer} from 'cc';
import {EdStageInfo} from './EdFunlandInfo';
import EdGlass from './EdGlass';

const {ccclass, menu, property} = _decorator;

@ccclass('VwEdGlassSetting')
@menu('cwg/VwEdGlassSetting')
export default class VwEdGlassSetting extends Component {

    /** 模式选择开关容器 - 用于切换普通模式和广告模式 */
    @property(ToggleContainer)
    protected modeToggleContainer: ToggleContainer;

    /** 颜色数量选择开关容器 - 用于选择玻璃杯中的颜色数量（0-4） */
    @property(ToggleContainer)
    protected colorCountToggleContainer: ToggleContainer;

    /** 隐藏数量选择开关容器 - 用于选择玻璃杯的隐藏层数（0-4） */
    @property(ToggleContainer)
    protected hideCountToggleContainer: ToggleContainer;

    /** 关闭回调函数 - 当设置完成并关闭界面时调用，传递更新后的关卡信息 */
    public onClose: (updatedStageInfo: EdStageInfo) => void;

    /** 当前正在编辑的玻璃杯实例 */
    protected currentGlass: EdGlass;

    /**
     * 初始化设置界面
     * @param glass - 需要编辑的玻璃杯实例
     * 
     * 根据玻璃杯的当前状态初始化界面控件：
     * - 如果是广告模式，选中第二个开关
     * - 如果是普通模式，选中第一个开关，并设置对应的颜色数量和隐藏数量
     */
    init(glass: EdGlass) {
        this.currentGlass = glass;
        if (this.currentGlass.info.ad) {
            // 广告模式 - 选中第二个开关（索引1）
            this.modeToggleContainer.toggleItems[1].isChecked = true;
        } else {
            // 普通模式 - 选中第一个开关（索引0）
            this.modeToggleContainer.toggleItems[0].isChecked = true;
            // 根据当前颜色数量设置对应的开关状态
            this.colorCountToggleContainer.toggleItems.forEach((item, index) => {
                item.isChecked = index <= this.currentGlass.info.colorCnt;
            })
            // 根据当前隐藏数量设置对应的开关状态
            this.hideCountToggleContainer.toggleItems.forEach((item, index) => {
                item.isChecked = index <= this.currentGlass.info.hideCnt;
            })
        }
    }

    /**
     * 关闭设置界面并保存设置
     * 
     * 处理逻辑：
     * 1. 隐藏设置界面
     * 2. 获取当前选中的设置值
     * 3. 更新玻璃杯的关卡信息
     * 4. 触发关闭回调函数
     */
    protected choseClose() {
        // 隐藏设置界面
        this.node.active = false;

        const updatedInfo: EdStageInfo = this.currentGlass.info;

        if (this.modeToggleContainer.toggleItems[0].isChecked) {
            // 普通模式 - 获取用户选择的颜色数量和隐藏数量
            
            // 获取选中的颜色数量（最后一个选中的开关索引）
            this.colorCountToggleContainer.toggleItems.forEach((item, index) => {
                if (item.isChecked) {
                    updatedInfo.colorCnt = index;
                }
            })

            // 获取选中的隐藏数量（最后一个选中的开关索引）
            this.hideCountToggleContainer.toggleItems.forEach((item, index) => {
                if (item.isChecked) {
                    updatedInfo.hideCnt = index;
                }
            })
        } else {
            // 广告模式 - 设置为广告状态
            updatedInfo.ad = true;
        }
        // 触发关闭回调，传递更新后的关卡信息
        this.onClose && this.onClose(updatedInfo);
    }

}