import { v4 } from "uuid";

import { Component } from "./Component";

type ComponentCallee<T> = new (...args: any[]) => T;

export class RenderObject {

    public readonly id: string = v4();

    public components: Map<ComponentCallee<Component>, Component> = new Map();


}