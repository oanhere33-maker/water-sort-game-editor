/**
 * @Descripttion:
 * @version: 1.0
 * @Author:
 * @Date: 2024-06-26
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-07
 */

export default class Rand {

    public static intNum(start: number, end: number) {
        return Math.floor(Math.random() * (end - start) + start);
    }

    public static one(arr: any[], rm = false) {
        const len = arr.length;
        if (len <= 0) {
            return;
        }
        if (rm) {
            return arr.splice(this.intNum(0, len), 1);
        }
        return arr[this.intNum(0, len)];
    }

    public static sort(arr: any[]) {
        arr.sort((a, b) => { return Math.random() - 0.5; });
    }
}