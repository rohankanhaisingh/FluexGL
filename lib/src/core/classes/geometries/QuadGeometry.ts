import { Geometry } from "./Geometry";

export class QuadGeometry extends Geometry {
    constructor(width: number = 100, height: number = 100) {

        const hw: number = width / 2;
        const hh: number = height / 2;

        const vertices = new Float32Array([
            -hw, -hh,
            hw, -hh,
            hw, hh,
            -hw, -hh,
            hw, hh,
            -hw, hh,
        ]);

        super(vertices, 6);
    }
}