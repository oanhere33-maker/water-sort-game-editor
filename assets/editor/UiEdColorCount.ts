/**
 * @Descripttion: 控制颜色数量
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {_decorator, Component, Label, Node} from 'cc';
import UiEdColumn from './UiEdColumn';
import Rand from '../common/Rand';
import {WaterColor} from '../core/CwgConstant';
import EdGlass from './EdGlass';

const {ccclass, menu, property} = _decorator;

@ccclass('UiEdColorCount')
@menu('cwg/UiEdColorCount')
export default class UiEdColorCount extends Component {

    @property(Node)
    public columnsContent: Node;

    @property(Label)
    protected cntLabel: Label;

    public count: number = 5;

    protected start(): void {
        this.updateColorConfiguration();
    }

    protected handleIncrement() {
        if (this.count >= 8) {
            return;
        }
        this.count++;
        this.updateColorConfiguration();
    }

    protected handleDecrement() {
        if (this.count <= 0) {
            return;
        }
        this.count--;
        this.updateColorConfiguration();
    }

    /**
     * 计算当前场景中所有水柱的总段数
     * 每瓶水最多可分割为4段（对应4种颜色）
     */
    protected calculateTotalWaterSegments() {
        let total = 0;  // 瓶子总数
        this.columnsContent.children.forEach((node) => {
            if (!node.active) {
                return;
            }
            const item: UiEdColumn = node.getComponent(UiEdColumn);
            item.glassesNode.children.forEach((node) => {
                const glass = node.getComponent(EdGlass);
                if (glass.info.colorCnt == undefined) {
                    total += 4;
                } else {
                    total += glass.info.colorCnt;
                }
            })
        })
        return total;
    }

    /**
     * 更新颜色配置
     * 1. 根据总水柱段数计算最大可用颜色数
     * 2. 生成随机颜色序列
     * 3. 分配颜色到各个玻璃瓶
     */
    public updateColorConfiguration() {
        // 计算最大可用颜色数（每4段水柱对应1种颜色）
        const totalSegments = Math.floor(this.calculateTotalWaterSegments() / 4);
        if (this.count > totalSegments) {
            this.count = totalSegments;
        }
        if (this.count == 0) {
            this.count = 1;
        }
        this.cntLabel.string = this.count.toString();

        // 生成基础颜色序列（确保颜色不重复循环）
        let colors: WaterColor[] = [];
        let color = WaterColor.None + 1;
        for (let i = 0; i < this.count; i++) {
            colors.push(color)
            color++;
            if (color >= WaterColor.Black) {
                color = WaterColor.None + 1;
            }
        }

        // 分配颜色到水柱（每颜色重复4次形成完整水柱）
        const waterSegments: WaterColor[] = [];
        for (let i = 0; i < totalSegments; i++) {
            const color = colors.shift();
            waterSegments.push(color);
            waterSegments.push(color);
            waterSegments.push(color);
            waterSegments.push(color);
            colors.push(color);
        }

        // 随机打乱颜色顺序实现自然分布
        Rand.sort(waterSegments);

        this.columnsContent.children.forEach((node) => {
            if (!node.active) {
                return;
            }
            const item: UiEdColumn = node.getComponent(UiEdColumn);
            for (let i = 0, len = item.glassesNode.children.length; i < len; i++) {
                const node = item.glassesNode.children[i];
                const glass = node.getComponent(EdGlass);
                if (glass.info.ad) {
                    glass.info.colorCnt = 0;
                    glass.info.colors = [];
                } else {
                    if (glass.info.colorCnt == undefined) {
                        glass.info.colorCnt = 4;
                    }
                    if (waterSegments.length < glass.info.colorCnt) {
                        glass.info.colors = waterSegments.splice(0, waterSegments.length);
                    } else {
                        glass.info.colors = waterSegments.splice(0, glass.info.colorCnt);
                    }
                }
                glass.init(glass.info);
            }
        })
    }

    protected choseReset() {
        this.updateColorConfiguration();
    }
}