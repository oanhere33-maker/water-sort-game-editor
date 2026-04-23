/**
 * @Descripttion:
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2020-03-04
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2022-11-01
 */
import {sys} from 'cc';

export default class LocalStorage {

    public static getItem(key: string, defaultValue: string = null): string {
        let item: string = sys.localStorage.getItem(key);
        if (!item) {
            return defaultValue;
        }
        return item;
    }

    public static setItem(key: string, value: string) {
        if (!value) {
            value = "";
        }
        sys.localStorage.setItem(key, value);
    }

    public static getJson(key: string, defaultValue: any = null) {
        let item: string = this.getItem(key);
        if (!item) {
            return defaultValue;
        }
        try {
            return JSON.parse(item);
        } catch (e) {
        }
        return defaultValue;
    }

    public static setJson(key: string, value: any) {
        const item: string = JSON.stringify(value);
        this.setItem(key, item);
    }
}