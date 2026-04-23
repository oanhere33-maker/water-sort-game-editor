/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2025-07-20
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2025-07-22
 */

export const enum WaterColor {
    None = 0,
    Red,
    Orange,
    Yellow,
    Green,
    Cya,
    Blue,
    Purple,
    Silver, // 银色
    Gold, // 金色
    Gray, // 灰色
    Pink, // 粉色
    Black,
    Count
}

interface ColorSet {
    base: string;
    surface: string;
}

export const WaterColors: Record<WaterColor, ColorSet> = {
    [WaterColor.None]: {base: '#00000000', surface: '#00000000'},
    [WaterColor.Red]: {base: '#FF0000', surface: '#FF6464'},
    [WaterColor.Orange]: {base: '#FF7F00', surface: '#FFAF5F'},
    [WaterColor.Yellow]: {base: '#EBEB00', surface: '#FFFF69'},
    [WaterColor.Green]: {base: '#00EE00', surface: '#00FF00'},
    [WaterColor.Cya]: {base: '#00E7E7', surface: '#00FFFF'},
    [WaterColor.Blue]: {base: '#0085FF', surface: '#359EFF'},
    [WaterColor.Purple]: {base: '#800080', surface: '#B900B9'},
    [WaterColor.Silver]: {base: '#C0C0C0', surface: '#E2E2E2'},
    [WaterColor.Gold]: {base: '#FFD700', surface: '#DFBC00'},
    [WaterColor.Gray]: {base: '#808080', surface: '#AAAAAA'},
    [WaterColor.Pink]: {base: '#FF7E94', surface: '#FFC0CB'},
    [WaterColor.Black]: {base: '#000000FF', surface: '#000000FF'},
    [WaterColor.Count]: {base: '#FFFFFFFF', surface: '#FFFFFFFF'},
};