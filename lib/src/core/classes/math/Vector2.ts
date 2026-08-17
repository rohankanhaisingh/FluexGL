import { type Vector2 } from "../../../typings";

export class Vec2 implements Vector2 {

    declare public x: number;
    declare public y: number;

    constructor(x?: number, y?: number) {

        this.x = typeof x === "number" ? x : 0;
        this.y = typeof y === "number" ? y : 0;

    }

    /**
     * Sets the x and y components of this vector.
     * Passing `null` for a component leaves it unchanged.
     */
    public set(x: number | null, y: number | null) {
        this.x = typeof x === "number" ? x : this.x;
        this.y = typeof y === "number" ? y : this.y;
        return this;
    }

    /**
     * Returns a new vector with the same x and y components as this one.
     */
    public clone() {
        return new Vec2(this.x, this.y);
    }

    /**
     * Copies the x and y components of the given vector into this one.
     */
    public copy(value: Vector2 | Vec2) {

        this.x = value.x;
        this.y = value.y;

        return this;
    }

    /**
     * Adds the given vector to this vector, component-wise.
     */
    public add(value: Vector2 | Vec2) {

        this.x += value.x;
        this.y += value.y;

        return this;
    }

    /**
     * Adds a scalar value to both the x and y components of this vector.
     */
    public addScalar(scalar: number) {

        this.x += scalar;
        this.y += scalar;

        return this;
    }

    /**
     * Subtracts the given vector from this vector, component-wise.
     */
    public subtract(value: Vector2 | Vec2) {

        this.x -= value.x;
        this.y -= value.y;

        return this;
    }

    /**
     * Subtracts a scalar value from both the x and y components of this vector.
     */
    public subtractScalar(scalar: number) {

        this.x -= scalar;
        this.y -= scalar;

        return this;
    }

    /**
     * Multiplies this vector by the given vector, component-wise.
     */
    public multiply(value: Vector2 | Vec2) {

        this.x *= value.x;
        this.y *= value.y;

        return this;
    }

    /**
     * Multiplies both the x and y components of this vector by a scalar value.
     */
    public multiplyScalar(scalar: number) {

        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    /**
     * Divides this vector by the given vector, component-wise.
     */
    public divide(value: Vector2 | Vec2) {

        this.x /= value.x;
        this.y /= value.y;

        return this;
    }

    /**
     * Divides both the x and y components of this vector by a scalar value.
     */
    public divideScalar(scalar: number) {

        this.x /= scalar;
        this.y /= scalar;

        return this;
    }

    /**
     * Flips the sign of both the x and y components of this vector.
     */
    public negate() {

        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    /**
     * Sets this vector's components to the lowest values between itself and the given vector.
     */
    public min(value: Vector2 | Vec2) {

        this.x = Math.min(this.x, value.x);
        this.y = Math.min(this.y, value.y);

        return this;
    }

    /**
     * Sets this vector's components to the highest values between itself and the given vector.
     */
    public max(value: Vector2 | Vec2) {

        this.x = Math.max(this.x, value.x);
        this.y = Math.max(this.y, value.y);

        return this;
    }

    /**
     * Clamps this vector's components between the components of the given min and max vectors.
     */
    public clamp(min: Vector2 | Vec2, max: Vector2 | Vec2) {

        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));

        return this;
    }

    /**
     * Clamps both the x and y components of this vector between a min and max scalar value.
     */
    public clampScalar(min: number, max: number) {

        this.x = Math.max(min, Math.min(max, this.x));
        this.y = Math.max(min, Math.min(max, this.y));

        return this;
    }

    /**
     * Rounds both the x and y components of this vector down to the nearest integer.
     */
    public floor() {

        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        return this;
    }

    /**
     * Rounds both the x and y components of this vector up to the nearest integer.
     */
    public ceil() {

        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

        return this;
    }

    /**
     * Rounds both the x and y components of this vector to the nearest integer.
     */
    public round() {

        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    /**
     * Computes the dot product of this vector and the given vector.
     */
    public dot(value: Vector2 | Vec2) {

        return this.x * value.x + this.y * value.y;
    }

    /**
     * Computes the 2D cross product (the z component of the 3D cross product) of this vector and the given vector.
     */
    public cross(value: Vector2 | Vec2) {

        return this.x * value.y - this.y * value.x;
    }

    /**
     * Returns the length (magnitude) of this vector.
     */
    public length() {

        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Returns the squared length of this vector. Cheaper than `length` since it avoids a square root, useful for comparisons.
     */
    public lengthSquared() {

        return this.x * this.x + this.y * this.y;
    }

    /**
     * Returns the distance between this vector and the given vector.
     */
    public distanceTo(value: Vector2 | Vec2) {

        const x = this.x - value.x,
            y = this.y - value.y;

        return Math.sqrt(x * x + y * y);
    }

    /**
     * Returns the squared distance between this vector and the given vector. Cheaper than `distanceTo` since it avoids a square root, useful for comparisons.
     */
    public distanceToSquared(value: Vector2 | Vec2) {

        const x = this.x - value.x,
            y = this.y - value.y;

        return x * x + y * y;
    }

    /**
     * Normalizes this vector so its length becomes 1, preserving its direction. Vectors with a length of 0 are left unchanged.
     */
    public normalize() {

        const length = this.length();

        if (length > 0) {
            this.x /= length;
            this.y /= length;
        }

        return this;
    }

    /**
     * Linearly interpolates this vector towards the given vector by the given alpha, where 0 is this vector and 1 is the given vector.
     */
    public lerp(value: Vector2 | Vec2, alpha: number) {

        this.x += (value.x - this.x) * alpha;
        this.y += (value.y - this.y) * alpha;

        return this;
    }

    /**
     * Checks whether this vector's components are equal to the given vector's components.
     */
    public equals(value: Vector2 | Vec2) {

        return this.x === value.x && this.y === value.y;
    }

    /**
     * Checks whether both the x and y components of this vector are 0.
     */
    public isZero() {

        return this.x === 0 && this.y === 0;
    }

    /**
     * Returns this vector's components as a plain `[x, y]` array.
     */
    public toArray(): [number, number] {

        return [this.x, this.y];
    }

    /**
     * Computes the angle of this vector in radians, measured from the positive x-axis.
     */
    public computeAngle() {

        const angle = Math.atan2(- this.y, - this.x) + Math.PI;

        return angle;
    }

    /**
     * Computes the angle in radians between this vector and the given vector.
     */
    public angleTo(value: Vector2 | Vec2) {

        const denominator = Math.sqrt(this.lengthSquared() * (value.x * value.x + value.y * value.y));

        if (denominator === 0) return Math.PI / 2;

        const theta = this.dot(value) / denominator;

        return Math.acos(Math.max(-1, Math.min(1, theta)));
    }

    /**
     * Rotates this vector around the given center point by the given angle, in radians.
     */
    public rotateAround(center: Vector2 | Vec2, angle: number) {

        const c: number = Math.cos(angle),
            s: number = Math.sin(angle);

        const x = this.x - center.x;
        const y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;
    }

    /**
     * Returns a new vector with this vector's components converted from pixels to meters.
     */
    public convertPixelsToMeters(): Vec2 {

        const x = this.x * (1 / 30),
            y = this.y * (1 / 30);

        return new Vec2(x, y);
    }

    /**
     * Converts this vector's components from pixels to meters in place.
     */
    public saveConvertPixelsToMeters(): Vec2 {

        const x = this.x * (1 / 30),
            y = this.y * (1 / 30);

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Returns a new vector with this vector's components converted from meters to pixels.
     */
    public convertMetersToPixels(): Vec2 {

        const x = this.x * 30,
            y = this.y * 30;

        return new Vec2(x, y);
    }

    /**
     * Converts this vector's components from meters to pixels in place.
     */
    public saveConvertMetersToPixels(): Vec2 {

        const x = this.x * 30,
            y = this.y * 30;

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * Creates a new vector with both components set to 0.
     */
    public static zero(): Vec2 {
        return new Vec2(0, 0);
    }

    /**
     * Creates a new vector with both components set to 1.
     */
    public static one(): Vec2 {
        return new Vec2(1, 1);
    }
}
