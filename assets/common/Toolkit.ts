/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2020-03-04
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-08
 */
import {Tween} from 'cc';

export default class Toolkit {

    public static cloneObj(obj) {
        let newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (let key in obj) {
            const val = obj[key];
            newObj[key] = typeof val === 'object' ? Toolkit.cloneObj(val) : val;
        }
        return newObj;
    }

    public static waitForTween(tween: Tween) {
        return new Promise<void>(resolve => tween.call(resolve).start());
    }
}