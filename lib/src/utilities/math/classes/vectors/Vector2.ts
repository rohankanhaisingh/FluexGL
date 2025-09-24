import { Vec2 } from "../../../../typings";

/**
 * A mutable two-dimensional vector with `x` and `y` components.
 *
 * Commonly used for positions, directions, velocities, and other 2D math
 * operations in graphics and game development.
 *
 * All mutating methods return `this` to allow chaining.
 *
 * @example
 * ```ts
 * const a = new Vector2(4, 12);
 * const b = new Vector2(6, 53);
 *
 * a.Add(b);  // a is now { x: 10, y: 65 }
 * const len = a.Length(); // magnitude of the vector
 * ```
 */
export class Vector2 implements Vec2 {
    /**
     * The horizontal component.
     */
    public x: number;

    /**
     * The vertical component.
     */
    public y: number;


    /** Pixels-per-meter scale used for conversions. */
    public static readonly PPM = 30;
    
    /**
     * Creates a new 2D vector.
     *
     * @param x Horizontal component (defaults to 0).
     * @param y Vertical component (defaults to 0).
     */
    constructor(x: number = 0, y: number = 0) {
        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;
    }

    /**
     * Sets the components of this vector.
     *
     * Non-number arguments are ignored (keeps existing component).
     *
     * @example
     * ```ts
     * const a = new Vector2(5, 2);
     * a.Set(8, 5); // a => { x: 8, y: 5 }
     * ```
     *
     * @param x Horizontal value (or `null` to keep current).
     * @param y Vertical value (or `null` to keep current).
     * @returns {Vector2} `this`
     */
    public Set(x: number | null, y: number | null): Vector2 {
        this.x = typeof x === "number" ? x : this.x;
        this.y = typeof y === "number" ? y : this.y;
        return this;
    }

    /**
     * Returns a new vector cloned from this vector.
     *
     * @example
     * ```ts
     * const a = new Vector2(12, 12);
     * const b = a.Clone(); // { x: 12, y: 12 }
     * ```
     */
    public Clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    /**
     * Adds another vector to this vector (in place).
     *
     * @param v The vector to add.
     * @returns {Vector2} `this`
     */
    public Add(v: Vector2 | Vec2): Vector2 {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Subtracts another vector from this vector (in place).
     *
     * @param v The vector to subtract.
     * @returns {Vector2} `this`
     */
    public Subtract(v: Vector2 | Vec2): Vector2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Multiplies this vector component-wise by another vector (in place).
     *
     * @example
     * ```ts
     * const a = new Vector2(2, 2);
     * const b = new Vector2(4, 4);
     * a.Multiply(b); // a => { x: 8, y: 8 }
     * ```
     *
     * @param value Vector to multiply with.
     * @returns {Vector2} `this`
     */
    public Multiply(value: Vector2 | Vec2): Vector2 {
        this.x *= value.x;
        this.y *= value.y;
        return this;
    }

    /**
     * Multiplies this vector by a scalar (in place).
     *
     * @example
     * ```ts
     * const a = new Vector2(2, 4);
     * a.MultiplyScalar(4); // a => { x: 8, y: 16 }
     * ```
     *
     * @param scalar Scalar value to multiply with.
     * @returns {Vector2} `this`
     */
    public MultiplyScalar(scalar: number): Vector2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divides this vector component-wise by another vector (in place).
     *
     * @deprecated Use {@link Divide} (correct spelling).
     * @param value Vector to divide by.
     * @returns {Vector2} `this`
     */
    public Devide(value: Vector2 | Vec2): Vector2 {
        // keep for backward compatibility
        this.x /= value.x;
        this.y /= value.y;
        return this;
    }

    /**
     * Divides this vector component-wise by another vector (in place).
     *
     * @param value Vector to divide by.
     * @returns {Vector2} `this`
     */
    public Divide(value: Vector2 | Vec2): Vector2 {
        this.x /= value.x;
        this.y /= value.y;
        return this;
    }

    /**
     * Sets each component to the minimum of itself and the given vector's component.
     *
     * @param value Vector providing per-component maxima.
     * @returns {Vector2} `this`
     */
    public Min(value: Vector2 | Vec2): Vector2 {
        this.x = Math.min(this.x, value.x);
        this.y = Math.min(this.y, value.y);
        return this;
    }

    /**
     * Sets each component to the maximum of itself and the given vector's component.
     *
     * @param value Vector providing per-component minima.
     * @returns {Vector2} `this`
     */
    public Max(value: Vector2 | Vec2): Vector2 {
        this.x = Math.max(this.x, value.x);
        this.y = Math.max(this.y, value.y);
        return this;
    }

    /**
     * Clamps this vector per component between `min` and `max` vectors (inclusive).
     *
     * @param min Minimum per-component vector.
     * @param max Maximum per-component vector.
     * @returns {Vector2} `this`
     */
    public Clamp(min: Vector2 | Vec2, max: Vector2 | Vec2): Vector2 {
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    }

    /**
     * Clamps this vector per component between scalar `min` and `max` (inclusive).
     *
     * @param min Minimum allowed value.
     * @param max Maximum allowed value.
     * @returns {Vector2} `this`
     */
    public ClampScalar(min: number, max: number): Vector2 {
        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));
        return this;
    }

    /**
     * Floors each component (in place).
     * @returns {Vector2} `this`
     */
    public Floor(): Vector2 {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /**
     * Ceils each component (in place).
     * @returns {Vector2} `this`
     */
    public Ceil(): Vector2 {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /**
     * Rounds each component (in place).
     * @returns {Vector2} `this`
     */
    public Round(): Vector2 {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    /**
     * Dot product with another vector.
     *
     * @param value The other vector.
     * @returns {number} Dot product.
     */
    public Dot(value: Vector2 | Vec2): number {
        return this.x * value.x + this.y * value.y;
    }

    /**
     * Returns the Euclidean length (magnitude) of this vector.
     *
     * @returns {number} √(x² + y²)
     */
    public Length(): number {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Normalizes this vector (in place) to unit length.
     * If the length is 0, the vector remains (0, 0).
     *
     * @returns {Vector2} `this`
     */
    public Normalize(): Vector2 {
        const len = this.Length();
        if (len !== 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    /**
     * Computes the angle of this vector in radians relative to the +X axis.
     * Range is [0, 2π).
     *
     * Note: Implementation uses `atan2(-y, -x) + π`, which is equivalent to
     * `atan2(y, x)` but ensures the result is in [0, 2π).
     *
     * @returns {number} Angle in radians.
     */
    public ComputeAngle(): number {
        return Math.atan2(-this.y, -this.x) + Math.PI;
    }

    /**
     * Rotates this vector around a given center by an angle in radians (in place).
     *
     * Positive angles rotate counterclockwise.
     *
     * @param center The pivot point.
     * @param angle  Angle in radians.
     * @returns {Vector2} `this`
     */
    public RotateAround(center: Vector2 | Vec2, angle: number): Vector2 {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const x = this.x - center.x;
        const y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    }

    /**
     * Distance from this vector to another vector.
     *
     * @param v The other vector.
     * @returns {number} Euclidean distance.
     */
    public DistanceTo(v: Vector2 | Vec2): number {
        return Math.hypot(this.x - v.x, this.y - v.y);
    }

    /**
     * Exact or epsilon-based equality check.
     *
     * @param v The other vector.
     * @param epsilon Tolerance for comparison (defaults to 1e-6).
     * @returns {boolean} Whether vectors are equal within tolerance.
     */
    public Equals(v: Vector2 | Vec2, epsilon: number = 1e-6): boolean {
        return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
    }

    /**
     * Converts pixel values to meters and returns a **new** vector.
     *
     * Scale: `1 meter = 30 pixels` (configurable via code change).
     *
     * @returns {Vec2} New vector in meters.
     */
    public ConvertPixelsToMeters(): Vec2 {
        const x = this.x * (1 / Vector2.PPM);
        const y = this.y * (1 / Vector2.PPM);
        return new Vector2(x, y);
    }

    /**
     * Converts pixel values to meters **in place**.
     *
     * Scale: `1 meter = 30 pixels`.
     *
     * @returns {Vector2} `this`
     */
    public SaveConvertPixelsToMeters(): Vector2 {
        this.x *= 1 / Vector2.PPM;
        this.y *= 1 / Vector2.PPM;
        return this;
    }

    /**
     * Converts meter values to pixels and returns a **new** vector.
     *
     * Scale: `1 meter = 30 pixels`.
     *
     * @returns {Vec2} New vector in pixels.
     */
    public ConvertMetersToPixels(): Vec2 {
        const x = this.x * Vector2.PPM;
        const y = this.y * Vector2.PPM;
        return new Vector2(x, y);
    }

    /**
     * Converts meter values to pixels **in place**.
     *
     * Scale: `1 meter = 30 pixels`.
     *
     * @returns {Vector2} `this`
     */
    public SaveConvertMetersToPixels(): Vector2 {
        this.x *= Vector2.PPM;
        this.y *= Vector2.PPM;
        return this;
    }
}
