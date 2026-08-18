import { v4 } from "uuid";
import { mat4, vec3 } from "gl-matrix";

import { Vec2 } from "../math/Vector2";

export interface Camera2DOptions {
    zoom?: number;
}

export class Camera2D {

    public readonly id: string = v4();

    public position: Vec2 = Vec2.zero();
    public zoom: number = 1;

    public viewProjectionMatrix: mat4 = mat4.create();
    public dirty: boolean = true;

    constructor({ zoom }: Camera2DOptions = {}) {
        this.zoom = zoom ?? this.zoom;
    }

    public setPosition(x: number, y: number): Camera2D {
        this.position.x = x;
        this.position.y = y;
        this.dirty = true;
        return this;
    }

    public setZoom(zoom: number = 1): Camera2D {
        this.zoom = zoom;
        this.dirty = true;
        return this;
    }

    public move(dx: number, dy: number): Camera2D {
        this.position.x += dx;
        this.position.y += dy;
        this.dirty = true;
        return this;
    }

    public markDirty(): Camera2D {
        this.dirty = true;
        return this;
    }

    public update(width: number, height: number): mat4 {

        if (!this.dirty) return this.viewProjectionMatrix;

        const hw: number = (width / 2) / this.zoom,
            hh: number = (height / 2) / this.zoom;

        const left: number = this.position.x - hw,
            right: number = this.position.x + hw,
            top: number = this.position.y + hh,
            bottom: number = this.position.y - hh;

        mat4.ortho(
            this.viewProjectionMatrix,
            left, right,
            bottom, top,
            -1, 1
        );

        this.dirty = false;
        return this.viewProjectionMatrix;
    }

    public screenToWorld(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number): Vec2 {

        const worldX = (screenX - canvasWidth / 2) / this.zoom + this.position.x;
        const worldY = (screenY - canvasHeight / 2) / this.zoom + this.position.y;

        return { x: worldX, y: worldY } as Vec2;
    }
}