import { ErrorCodes } from "../../codes";
import { Direction, Vec2 } from "../../typings";
import { Debug, Vector2 } from "../exports";

/**
 * Calculates the arithmetic mean of the given numbers.
 *
 * Filters out non-finite values (NaN/±Infinity). Throws on empty/fully-invalid input.
 *
 * @param input Array of numbers.
 * @returns Average value.
 * @throws If no finite numbers are provided.
 */
export function CalculateAverageArrayValue(input: number[]): number | null {

    if(!input) {

        Debug.Error("CalculateAverageArrayValue: invalid input (null or undefined).", [
            "Input must be a non-null array of numbers.",
            `Received: ${typeof input}`
        ], ErrorCodes.NUMBER_NO_VALID_INPUT_PROVIDED);

        return null;
    }

    const valid = input.filter(Number.isFinite);

    if (valid.length === 0) {

        Debug.Error("CalculateAverageArrayValue: no valid input provided.", [
            "Input array must contain at least one finite number.",
            `Received: [${input.join(", ")}]`
        ], ErrorCodes.NUMBER_NO_VALID_INPUT_PROVIDED);

        return null;
    }

    const sum = valid.reduce((acc, v) => acc + v, 0);

    return sum / valid.length;
}

/**
 * Euclidean distance between two 2D points.
 *
 * @param point1 First point.
 * @param point2 Second point.
 * @returns Distance (>= 0).
 */
export function CalculateVectorDistance(point1: Vec2 | Vector2, point2: Vec2 | Vector2): number {
    
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;

    return Math.hypot(dx, dy);
}

/**
 * Angle from `point1` to `point2` in **degrees**, normalized to [0, 360).
 *
 * For radians, use `Math.atan2(dy, dx)` directly or create a `CalculateVectorAngleRadians` helper.
 *
 * @param point1 Origin point.
 * @param point2 Target point.
 * @returns Angle in degrees within [0, 360).
 */
export function CalculateVectorAngle( point1: Vec2 | Vector2, point2: Vec2 | Vector2): number {
    
    const dy = point2.y - point1.y;
    const dx = point2.x - point1.x;

    let thetaDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    
    if (thetaDeg < 0) thetaDeg += 360;

    return thetaDeg;
}

/**
 * Computes the **intersection point of two infinite lines**:
 * Line A: p1 <-> p2, Line B: p3 <-> p4.
 *
 * Note: this is not a segment intersection test. For line segments, 
 * additional checks are needed to verify the intersection lies within both segments.
 *
 * @param p1 Line A start.
 * @param p2 Line A end.
 * @param p3 Line B start.
 * @param p4 Line B end.
 * @returns Intersection point as { x, y }.
 * @throws If lines are parallel or coincident (no unique intersection).
 */
export function CalculateIntersection(p1: Vec2 | Vector2, p2: Vec2 | Vector2, p3: Vec2 | Vector2, p4: Vec2 | Vector2): Vec2 {
   
    const d1 = (p1.x - p2.x) * (p3.y - p4.y);
    const d2 = (p1.y - p2.y) * (p3.x - p4.x);
    const det = d1 - d2;

    const EPS = 1e-12;
    
    if (Math.abs(det) < EPS) 
        throw new Error("CalculateIntersection: lines are parallel or coincident.");

    const u1 = p1.x * p2.y - p1.y * p2.x;
    const u4 = p3.x * p4.y - p3.y * p4.x;

    const u2x = p3.x - p4.x;
    const u3x = p1.x - p2.x;
    const u2y = p3.y - p4.y;
    const u3y = p1.y - p2.y;

    const px = (u1 * u2x - u3x * u4) / det;
    const py = (u1 * u2y - u3y * u4) / det;

    return { x: px, y: py };
}

/**
 * Computes the direction from point (x1, y1) to (x2, y2).
 *
 * Returns:
 *  - `angle` (radians, from +X axis)
 *  - `cos` and `sin`
 *  - helper methods:
 *    - `normalize()` cos/sin rounded to 2 decimals
 *    - `complete()` cos/sin rounded to nearest integers
 *    - `multiply(len)` cos/sin scaled by `len`
 *
 * @param x1 Start x.
 * @param y1 Start y.
 * @param x2 End x.
 * @param y2 End y.
 * @returns Object with angle, cos, sin, and helpers.
 */
export function CalculateDirection(point1: Vec2 | Vector2, point2: Vec2 | Vector2): Direction {

    const angle = Math.atan2(point2.y - point1.y, point2.x - point2.y);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        angle, cos, sin,
        normalize: (): Vec2 => ({
            x: +cos.toFixed(2),
            y: +sin.toFixed(2),
        }),
        complete: (): Vec2 => ({
            x: Math.round(cos),
            y: Math.round(sin),
        }),
        multiply: (len: number): Vec2 => ({
            x: cos * len,
            y: sin * len,
        }),
    };
}
