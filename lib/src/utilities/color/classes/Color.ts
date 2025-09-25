import { ColorfulObject } from "../../../typings";

/**
 * Clamp a number to the [0, 1] range.
 *
 * @param value Input value.
 * @returns The clamped value between 0 and 1.
 */
function clamp(value: number): number {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Represents an RGBA color with float components in the range [0, 1].
 *
 * Useful for color manipulation, blending, and interpolation.
 * All mutating methods return `this` to allow chaining.
 */
export class Color implements ColorfulObject {
    /**
     * Creates a new color.
     *
     * @param red   Red component in [0, 1]. Defaults to 0.
     * @param green Green component in [0, 1]. Defaults to 0.
     * @param blue  Blue component in [0, 1]. Defaults to 0.
     * @param alpha Alpha (opacity) in [0, 1]. Defaults to 1.
     */
    constructor(public red: number = 0, public green: number = 0, public blue: number = 0, public alpha: number = 1) { }

    /**
     * Creates a clone of this color.
     *
     * @example
     * ```ts
     * const a = new Color(1, 0, 0);
     * const b = a.Clone(); // { red: 1, green: 0, blue: 0, alpha: 1 }
     * ```
     *
     * @returns A new {@link Color} with the same components.
     */
    public Clone(): Color {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }

    /**
     * Adds another color component-wise (clamped to [0, 1]).
     *
     * @param color The color to add.
     * @returns {Color} This color after modification.
     */
    public Add(color: Color | ColorfulObject): Color {
        this.red = clamp(this.red + color.red);
        this.green = clamp(this.green + color.green);
        this.blue = clamp(this.blue + color.blue);
        this.alpha = clamp(this.alpha + color.alpha);
        return this;
    }

    /**
     * Multiplies this color by another color component-wise (clamped to [0, 1]).
     *
     * @param color The color to multiply with.
     * @returns {Color} This color after modification.
     */
    public Multiply(color: Color | ColorfulObject): Color {
        this.red = clamp(this.red * color.red);
        this.green = clamp(this.green * color.green);
        this.blue = clamp(this.blue * color.blue);
        this.alpha = clamp(this.alpha * color.alpha);
        return this;
    }

    /**
     * Multiplies this color by a scalar (clamped to [0, 1]).
     *
     * @param scalar The scalar value to multiply with.
     * @returns {Color} This color after modification.
     */
    public MultiplyScalar(scalar: number): Color {
        this.red = clamp(this.red * scalar);
        this.green = clamp(this.green * scalar);
        this.blue = clamp(this.blue * scalar);
        this.alpha = clamp(this.alpha * scalar);
        return this;
    }

    /**
     * Linearly interpolates this color towards another color.
     *
     * @example
     * ```ts
     * const a = new Color(1, 0, 0);
     * const b = new Color(0, 0, 1);
     * a.Lerp(b, 0.5); // midway: { red: 0.5, green: 0, blue: 0.5, alpha: 1 }
     * ```
     *
     * @param color  Target color.
     * @param factor Interpolation factor in [0, 1].
     * @returns {Color} This color after modification.
     */
    public Lerp(color: Color, factor: number): Color {
        const k = clamp(factor);
        this.red += (color.red - this.red) * k;
        this.green += (color.green - this.green) * k;
        this.blue += (color.blue - this.blue) * k;
        this.alpha += (color.alpha - this.alpha) * k;
        return this;
    }

    /**
     * Compares this color to another color with an optional epsilon tolerance.
     *
     * @param color The color to compare against.
     * @param eps   Tolerance for component differences (defaults to 1e-6).
     * @returns {boolean} True if colors are equal within tolerance, false otherwise.
     */
    public Equals(color: Color, eps: number = 1e-6): boolean {
        return (
            Math.abs(this.red - color.red) <= eps &&
            Math.abs(this.green - color.green) <= eps &&
            Math.abs(this.blue - color.blue) <= eps &&
            Math.abs(this.alpha - color.alpha) <= eps
        );
    }
}
