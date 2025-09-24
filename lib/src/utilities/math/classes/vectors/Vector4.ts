import { Vec4 } from "../../../../typings";

/**
 * A mutable four-dimensional vector with `x`, `y`, `z`, and `w` components.
 *
 * Commonly used for homogeneous coordinates, quaternions, colors (RGBA),
 * and other 4D math operations in graphics and game development.
 *
 * All mutating methods return `this` to allow chaining.
 *
 * @example
 * ```ts
 * const a = new Vector4(1, 2, 3, 1);
 * const b = new Vector4(4, 5, 6, 1);
 *
 * a.Add(b);        // a => { x: 5, y: 7, z: 9, w: 2 }
 * const len = a.Length(); // magnitude
 * const n = a.Clone().Normalize(); // unit vector
 * ```
 */
export class Vector4 implements Vec4 {
    /** The X component. */
    public x: number;
    /** The Y component. */
    public y: number;
    /** The Z component. */
    public z: number;
    /** The W component. */
    public w: number;

    /**
     * Creates a new 4D vector.
     *
     * @param x X component (defaults to 0).
     * @param y Y component (defaults to 0).
     * @param z Z component (defaults to 0).
     * @param w W component (defaults to 0).
     */
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
        this.z = typeof z === "number" ? z : 0;
        this.w = typeof w === "number" ? w : 0;
    }

    /**
     * Sets the components of this vector.
     *
     * Non-number arguments are ignored (keeps existing component).
     *
     * @example
     * ```ts
     * const a = new Vector4(1, 2, 3, 4);
     * a.Set(7, null, 9, null); // a => { x: 7, y: 2, z: 9, w: 4 }
     * ```
     *
     * @returns {Vector4} `this`
     */
    public Set(x: number | null, y: number | null, z: number | null, w: number | null): Vector4 {
        this.x = typeof x === "number" ? x : this.x;
        this.y = typeof y === "number" ? y : this.y;
        this.z = typeof z === "number" ? z : this.z;
        this.w = typeof w === "number" ? w : this.w;
        return this;
    }

    /** Returns a new vector cloned from this vector. */
    public Clone(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    /** Adds another vector to this vector (in place). */
    public Add(v: Vector4 | Vec4): Vector4 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    }

    /** Subtracts another vector from this vector (in place). */
    public Subtract(v: Vector4 | Vec4): Vector4 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    }

    /**
     * Multiplies this vector component-wise by another vector (in place).
     *
     * @example
     * ```ts
     * const a = new Vector4(1, 2, 3, 4);
     * const b = new Vector4(2, 2, 2, 2);
     * a.Multiply(b); // a => { x: 2, y: 4, z: 6, w: 8 }
     * ```
     */
    public Multiply(v: Vector4 | Vec4): Vector4 {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        this.w *= v.w;
        return this;
    }

    /** Multiplies this vector by a scalar (in place). */
    public MultiplyScalar(s: number): Vector4 {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }

    /**
     * Divides this vector component-wise by another vector (in place).
     *
     * @deprecated Use {@link Divide} (correct spelling).
     */
    public Devide(v: Vector4 | Vec4): Vector4 {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        this.w /= v.w;
        return this;
    }

    /** Divides this vector component-wise by another vector (in place). */
    public Divide(v: Vector4 | Vec4): Vector4 {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        this.w /= v.w;
        return this;
    }

    /** Floors each component (in place). */
    public Floor(): Vector4 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
    }

    /** Ceils each component (in place). */
    public Ceil(): Vector4 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
    }

    /** Rounds each component (in place). */
    public Round(): Vector4 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
    }

    /** Dot product with another vector. */
    public Dot(v: Vector4 | Vec4): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

    /** Returns the Euclidean length (magnitude) of this vector. */
    public Length(): number {
        return Math.hypot(this.x, this.y, this.z, this.w);
    }

    /**
     * Normalizes this vector (in place) to unit length.
     * If the length is 0, the vector remains (0,0,0,0).
     */
    public Normalize(): Vector4 {
        const len = this.Length();
        if (len !== 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
            this.w /= len;
        }
        return this;
    }

    /**
     * Linear interpolation between this vector and another vector (in place).
     *
     * @param v Target vector.
     * @param t Interpolation factor [0,1].
     */
    public Lerp(v: Vector4 | Vec4, t: number): Vector4 {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        this.z += (v.z - this.z) * t;
        this.w += (v.w - this.w) * t;
        return this;
    }

    /** Euclidean distance to another vector. */
    public DistanceTo(v: Vector4 | Vec4): number {
        return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }

    /**
     * Exact or epsilon-based equality check.
     *
     * @param v The other vector.
     * @param epsilon Tolerance (default 1e-6).
     */
    public Equals(v: Vector4 | Vec4, epsilon: number = 1e-6): boolean {
        return (
            Math.abs(this.x - v.x) <= epsilon &&
            Math.abs(this.y - v.y) <= epsilon &&
            Math.abs(this.z - v.z) <= epsilon &&
            Math.abs(this.w - v.w) <= epsilon
        );
    }

    /** Returns an array [x, y, z, w]. */
    public ToArray(): [number, number, number, number] {
        return [this.x, this.y, this.z, this.w];
    }

    /** Sets values from an array [x, y, z, w]. */
    public FromArray(arr: [number, number, number, number]): Vector4 {
        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
        this.w = arr[3];
        return this;
    }
}
