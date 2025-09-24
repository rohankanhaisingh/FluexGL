import { Vec3 } from "../../../../typings";

/**
 * A mutable three-dimensional vector with `x`, `y`, and `z` components.
 *
 * Commonly used for positions, directions, velocities, and other 3D math
 * operations in graphics, physics, and game development.
 *
 * All mutating methods return `this` to allow chaining.
 *
 * @example
 * ```ts
 * const a = new Vector3(1, 2, 3);
 * const b = new Vector3(4, 5, 6);
 *
 * a.Add(b);        // a => { x: 5, y: 7, z: 9 }
 * const len = a.Length(); // magnitude
 * const n = a.Clone().Normalize(); // unit vector
 * ```
 */
export class Vector3 implements Vec3 {
    /**
     * The horizontal component.
     */
    public x: number;

    /**
     * The vertical component.
     */
    public y: number;

    /**
     * The depth component.
     */
    public z: number;

    /**
     * Creates a new 3D vector.
     *
     * @param x X component (defaults to 0).
     * @param y Y component (defaults to 0).
     * @param z Z component (defaults to 0).
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
        this.z = typeof z === "number" ? z : 0;
    }

    /**
     * Sets the components of this vector.
     *
     * Non-number arguments are ignored (keeps existing component).
     *
     * @example
     * ```ts
     * const a = new Vector3(1, 2, 3);
     * a.Set(7, null, 9); // a => { x: 7, y: 2, z: 9 }
     * ```
     *
     * @param x X value (or `null` to keep current).
     * @param y Y value (or `null` to keep current).
     * @param z Z value (or `null` to keep current).
     * @returns {Vector3} `this`
     */
    public Set(x: number | null, y: number | null, z: number | null): Vector3 {
        this.x = typeof x === "number" ? x : this.x;
        this.y = typeof y === "number" ? y : this.y;
        this.z = typeof z === "number" ? z : this.z;
        return this;
    }

    /**
     * Returns a new vector cloned from this vector.
     */
    public Clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Adds another vector to this vector (in place).
     *
     * @param v The vector to add.
     * @returns {Vector3} `this`
     */
    public Add(v: Vector3 | Vec3): Vector3 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    /**
     * Subtracts another vector from this vector (in place).
     *
     * @param v The vector to subtract.
     * @returns {Vector3} `this`
     */
    public Subtract(v: Vector3 | Vec3): Vector3 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    /**
     * Multiplies this vector component-wise by another vector (in place).
     *
     * @example
     * ```ts
     * const a = new Vector3(2, 3, 4);
     * const b = new Vector3(5, 6, 7);
     * a.Multiply(b); // a => { x: 10, y: 18, z: 28 }
     * ```
     *
     * @param value Vector to multiply with.
     * @returns {Vector3} `this`
     */
    public Multiply(value: Vector3 | Vec3): Vector3 {
        this.x *= value.x;
        this.y *= value.y;
        this.z *= value.z;
        return this;
    }

    /**
     * Multiplies this vector by a scalar (in place).
     *
     * @param scalar Scalar value to multiply with.
     * @returns {Vector3} `this`
     */
    public MultiplyScalar(scalar: number): Vector3 {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    /**
     * Divides this vector component-wise by another vector (in place).
     *
     * @deprecated Use {@link Divide} (correct spelling).
     * @param value Vector to divide by.
     * @returns {Vector3} `this`
     */
    public Devide(value: Vector3 | Vec3): Vector3 {
        // backward compatibility
        this.x /= value.x;
        this.y /= value.y;
        this.z /= value.z;
        return this;
    }

    /**
     * Divides this vector component-wise by another vector (in place).
     *
     * @param value Vector to divide by.
     * @returns {Vector3} `this`
     */
    public Divide(value: Vector3 | Vec3): Vector3 {
        this.x /= value.x;
        this.y /= value.y;
        this.z /= value.z;
        return this;
    }

    /**
     * Sets each component to the minimum of itself and the given vector's component.
     *
     * @param value Vector providing per-component maxima.
     * @returns {Vector3} `this`
     */
    public Min(value: Vector3 | Vec3): Vector3 {
        this.x = Math.min(this.x, value.x);
        this.y = Math.min(this.y, value.y);
        this.z = Math.min(this.z, value.z);
        return this;
    }

    /**
     * Sets each component to the maximum of itself and the given vector's component.
     *
     * @param value Vector providing per-component minima.
     * @returns {Vector3} `this`
     */
    public Max(value: Vector3 | Vec3): Vector3 {
        this.x = Math.max(this.x, value.x);
        this.y = Math.max(this.y, value.y);
        this.z = Math.max(this.z, value.z);
        return this;
    }

    /**
     * Clamps this vector per component between `min` and `max` vectors (inclusive).
     *
     * @param min Minimum per-component vector.
     * @param max Maximum per-component vector.
     * @returns {Vector3} `this`
     */
    public Clamp(min: Vector3 | Vec3, max: Vector3 | Vec3): Vector3 {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
    }

    /**
     * Clamps this vector per component between scalar `min` and `max` (inclusive).
     *
     * @param min Minimum allowed value.
     * @param max Maximum allowed value.
     * @returns {Vector3} `this`
     */
    public ClampScalar(min: number, max: number): Vector3 {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        this.z = Math.max(min, Math.min(max, this.z));
        return this;
    }

    /**
     * Floors each component (in place).
     * @returns {Vector3} `this`
     */
    public Floor(): Vector3 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }

    /**
     * Ceils each component (in place).
     * @returns {Vector3} `this`
     */
    public Ceil(): Vector3 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }

    /**
     * Rounds each component (in place).
     * @returns {Vector3} `this`
     */
    public Round(): Vector3 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }

    /**
     * Dot product with another vector.
     *
     * @param v The other vector.
     * @returns {number} Dot product.
     */
    public Dot(v: Vector3 | Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Cross product with another vector (returns a **new** vector).
     *
     * Right-handed coordinate system.
     *
     * @param v The other vector.
     * @returns {Vector3} New vector perpendicular to both.
     */
    public Cross(v: Vector3 | Vec3): Vector3 {
        const x = this.y * v.z - this.z * v.y;
        const y = this.z * v.x - this.x * v.z;
        const z = this.x * v.y - this.y * v.x;
        return new Vector3(x, y, z);
    }

    /**
     * Returns the Euclidean length (magnitude) of this vector.
     *
     * @returns {number} √(x² + y² + z²)
     */
    public Length(): number {
        return Math.hypot(this.x, this.y, this.z);
    }

    /**
     * Normalizes this vector (in place) to unit length.
     * If the length is 0, the vector remains (0, 0, 0).
     *
     * @returns {Vector3} `this`
     */
    public Normalize(): Vector3 {
        const len = this.Length();
        if (len !== 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }

    /**
     * Angle between this vector and another vector, in radians.
     * Returns values in [0, π].
     *
     * @param v The other vector.
     * @returns {number} Angle in radians.
     */
    public AngleTo(v: Vector3 | Vec3): number {
        const denom = this.Length() * Math.hypot(v.x, v.y, v.z);
        if (denom === 0) return 0;
        const cos = this.Dot(v) / denom;
        // clamp against floating point error
        const t = Math.max(-1, Math.min(1, cos));
        return Math.acos(t);
    }

    /**
     * Rotates this vector around a given axis by an angle in radians (in place).
     *
     * Uses Rodrigues' rotation formula. Positive angles rotate counterclockwise
     * around the axis following the right-hand rule.
     *
     * @param axis Rotation axis (does not need to be normalized).
     * @param angle Angle in radians.
     * @returns {Vector3} `this`
     */
    public RotateAroundAxis(axis: Vector3 | Vec3, angle: number): Vector3 {
        // normalize axis
        const axLen = Math.hypot(axis.x, axis.y, axis.z);
        if (axLen === 0) return this; // no-op
        const ux = axis.x / axLen;
        const uy = axis.y / axLen;
        const uz = axis.z / axLen;

        const c = Math.cos(angle);
        const s = Math.sin(angle);

        const { x, y, z } = this;

        // Rodrigues' rotation
        this.x = x * (c + ux * ux * (1 - c)) + y * (ux * uy * (1 - c) - uz * s) + z * (ux * uz * (1 - c) + uy * s);
        this.y = x * (uy * ux * (1 - c) + uz * s) + y * (c + uy * uy * (1 - c)) + z * (uy * uz * (1 - c) - ux * s);
        this.z = x * (uz * ux * (1 - c) - uy * s) + y * (uz * uy * (1 - c) + ux * s) + z * (c + uz * uz * (1 - c));

        return this;
    }

    /**
     * Distance from this vector to another vector.
     *
     * @param v The other vector.
     * @returns {number} Euclidean distance.
     */
    public DistanceTo(v: Vector3 | Vec3): number {
        return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * Exact or epsilon-based equality check.
     *
     * @param v The other vector.
     * @param epsilon Tolerance for comparison (defaults to 1e-6).
     * @returns {boolean} Whether vectors are equal within tolerance.
     */
    public Equals(v: Vector3 | Vec3, epsilon: number = 1e-6): boolean {
        return (
            Math.abs(this.x - v.x) <= epsilon &&
            Math.abs(this.y - v.y) <= epsilon &&
            Math.abs(this.z - v.z) <= epsilon
        );
    }

    /** Pixels-per-meter scale used for conversions. */
    private static readonly PPM = 30;

    /**
     * Converts pixel values to meters and returns a **new** vector.
     *
     * Scale: `1 meter = 30 pixels` (configurable via code change).
     *
     * @returns {Vec3} New vector in meters.
     */
    public ConvertPixelsToMeters(): Vec3 {
        const inv = 1 / Vector3.PPM;
        return new Vector3(this.x * inv, this.y * inv, this.z * inv);
    }

    /**
     * Converts pixel values to meters **in place**.
     *
     * Scale: `1 meter = 30 pixels`.
     *
     * @returns {Vector3} `this`
     */
    public SaveConvertPixelsToMeters(): Vector3 {
        const inv = 1 / Vector3.PPM;
        this.x *= inv;
        this.y *= inv;
        this.z *= inv;
        return this;
    }

    /**
     * Converts meter values to pixels and returns a **new** vector.
     *
     * Scale: `1 meter = 30 pixels`.
     *
     * @returns {Vec3} New vector in pixels.
     */
    public ConvertMetersToPixels(): Vec3 {
        const s = Vector3.PPM;
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    /**
     * Converts meter values to pixels **in place**.
     *
     * Scale: `1 meter = 30 pixels`.
     *
     * @returns {Vector3} `this`
     */
    public SaveConvertMetersToPixels(): Vector3 {
        const s = Vector3.PPM;
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
}
