/**
 * Returns a random integer between min and max (inclusive).
 *
 * @param min Minimum integer.
 * @param max Maximum integer.
 */
export function RandomIntegerInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random float between min (inclusive) and max (exclusive).
 *
 * @param min Minimum value.
 * @param max Maximum value.
 */
export function RandomFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Returns true or false randomly, with optional probability bias.
 *
 * @param probability Probability of returning true (0–1).
 */
export function RandomBoolean(probability: number = 0.5): boolean {
    return Math.random() < probability;
}

/**
 * Returns a random item from an array.
 *
 * @param arr Array of items.
 * @throws If array is empty.
 */
export function RandomItem<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error("RandomItem: array is empty.");
    
    const idx = RandomIntegerInRange(0, arr.length - 1);
    return arr[idx];
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 *
 * @param arr Array to shuffle.
 * @returns The same array, shuffled.
 */
export function ShuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = RandomIntegerInRange(0, i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Returns a random unit vector in 2D (length = 1).
 */
export function RandomUnitVector2D(): { x: number; y: number } {
    const angle = Math.random() * Math.PI * 2;
    return { x: Math.cos(angle), y: Math.sin(angle) };
}

/**
 * Returns a random unit vector in 3D (length = 1).
 *
 * Uniformly distributed on the unit sphere.
 */
export function RandomUnitVector3D(): { x: number; y: number; z: number } {
    const theta = Math.random() * Math.PI * 2; // azimuth
    const phi = Math.acos(2 * Math.random() - 1); // inclination
    return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
    };
}

/**
 * Returns a normally distributed random number using Box-Muller transform.
 *
 * @param mean The mean (center).
 * @param stdDev The standard deviation (spread).
 */
export function RandomNormal(mean: number = 0, stdDev: number = 1): number {
    const u = 1 - Math.random(); // [0,1)
    const v = 1 - Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}