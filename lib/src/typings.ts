export interface Vec2 {
    x: number;
    y: number;
}

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface Vec4 {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface ColorfulObject {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

export interface Direction {
    angle: number;
    cos: number;
    sin: number;
    normalize: () => Vec2;
    complete: () => Vec2;
    multiply: (len: number) => Vec2;
}