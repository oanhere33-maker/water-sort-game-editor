/**
 * @Descripttion:
 * @version: 1.0
 * @Author:
 * @Date: 2024-06-24
 * @LastEditors: Lioesquieu
 * @LastEditTime: 2024-08-06
 */
import {instantiate, Node, NodePool, Prefab} from 'cc';

export default class Pool {

    protected pool: NodePool;
    protected _prefab: Prefab | Node = null;

    constructor() {
        this.pool = new NodePool();
    }

    public static create(prefab: Prefab | Node, count: number = 0) {
        const pool = new Pool();
        pool.init(prefab, count);
        return pool;
    }

    public destroy() {
        this.clear();
        this._prefab = null;
    }

    public init(prefab: Prefab | Node, count: number = 0) {
        this._prefab = prefab;
        for (let i = 0; i < count; i++) {
            const node = instantiate(this._prefab) as Node;
            this.pool.put(node);
        }
    }

    public clear() {
        this.pool.clear();
    }

    public get() {
        let node = this.pool.get();
        if (!node) {
            node = instantiate(this._prefab) as Node;
        }
        node.active = true;
        return node;
    }

    public put(node: Node) {
        if (!node) {
            return;
        }
        node.active = false;
        node.parent = null;
        this.pool.put(node);
    }

}