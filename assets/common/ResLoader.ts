/**
 * @Descripttion: 资源加载器 - 统一管理游戏资源加载
 * @version: 1.0
 * @Author: Lioesquieu
 * @Date: 2024-05-09
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-13
 */
import {assetManager, JsonAsset} from 'cc';


export default class ResLoader {

    public static loadBundle(bundle: string) {
        return new Promise((resolve, reject) => {
            console.log("loadBundle", bundle)
            assetManager.loadBundle(bundle, (err, assets) => {
                resolve(true);
            });
        });
    }

    public static loadJson(bundleName: string, paths: string) {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    console.error(err);
                    reject(err.message);
                    return;
                }
                bundle.load<JsonAsset>(paths, (err, jsonAsset) => {
                    if (err) {
                        console.error(err);
                        reject(err.message);
                        return;
                    }
                    resolve(jsonAsset.json);
                })
            });
        })
    }
}