/**
 * Converts a hex string into an array of bytes (0–255).
 *
 * Accepts both uppercase and lowercase hex characters.
 * Any invalid pairs are skipped.
 *
 * @example
 * ```ts
 * ConvertHexToByteArray("FFA07A"); // [255, 160, 122]
 * ConvertHexToByteArray("ff00ff"); // [255, 0, 255]
 * ```
 *
 * @param hex Hexadecimal string (without #).
 * @returns Array of bytes [0–255].
 */
export function ConvertHexToByteArray(hex: string): number[] {
    const bytes: number[] = [];

    for (let c = 0; c < hex.length; c += 2) {
        const byte = parseInt(hex.substr(c, 2), 16);
        if (!isNaN(byte)) bytes.push(byte);
    }

    return bytes;
}

/**
 * Converts an array of bytes (0–255) into a hex string.
 *
 * @example
 * ```ts
 * ConvertByteArrayToHex([255, 160, 122]); // "ffa07a"
 * ```
 *
 * @param bytes Array of numbers in [0,255].
 * @returns Hexadecimal string (lowercase, no #).
 */
export function ConvertByteArrayToHex(bytes: number[]): string {
    
    const hex: string[] = [];

    for (let i = 0; i < bytes.length; i++) {
        const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }

    return hex.join("");
}

/**
 * Converts an RGB triplet (0–255 each) to a hex string.
 *
 * @example
 * ```ts
 * RGBToHex(255, 160, 122); // "#ffa07a"
 * ```
 *
 * @param r Red in [0,255].
 * @param g Green in [0,255].
 * @param b Blue in [0,255].
 * @returns Hex string with leading "#".
 */
export function RGBToHex(r: number, g: number, b: number): string {
    return (
        "#" +
        [r, g, b]
            .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0"))
            .join("")
    );
}

/**
 * Converts a hex string to an RGB object (0–255 each).
 *
 * @example
 * ```ts
 * HexToRGB("#ffa07a"); // { r: 255, g: 160, b: 122 }
 * ```
 *
 * @param hex Hex string (with or without #).
 * @returns Object with { r, g, b }.
 */
export function HexToRGB(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace(/^#/, "");
    const [r, g, b] = ConvertHexToByteArray(clean);
    return { r, g, b };
}

/**
 * Converts RGB (0–255 each) to an HSL object (h in [0,360), s & l in [0,1]).
 *
 * @example
 * ```ts
 * RGBToHSL(255, 160, 122); // { h: 17, s: 1, l: 0.74 }
 * ```
 */
export function RGBToHSL(r: number, g: number, b: number): { h: number; s: number; l: number } {

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);

    let h = 0,
        s = 0,
        l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;

        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }

    return { h, s, l };
}

/**
 * Converts HSL (h in [0,360), s & l in [0,1]) to RGB (0–255 each).
 *
 * @example
 * ```ts
 * HSLToRGB(17, 1, 0.74); // { r: 255, g: 160, b: 122 }
 * ```
 */
export function HSLToRGB( h: number, s: number, l: number): { r: number; g: number; b: number } {
    
    const C = (1 - Math.abs(2 * l - 1)) * s;
    const Hp = h / 60;
    const X = C * (1 - Math.abs((Hp % 2) - 1));

    let r1 = 0,
        g1 = 0,
        b1 = 0;
    if (0 <= Hp && Hp < 1) [r1, g1, b1] = [C, X, 0];
    else if (1 <= Hp && Hp < 2) [r1, g1, b1] = [X, C, 0];
    else if (2 <= Hp && Hp < 3) [r1, g1, b1] = [0, C, X];
    else if (3 <= Hp && Hp < 4) [r1, g1, b1] = [0, X, C];
    else if (4 <= Hp && Hp < 5) [r1, g1, b1] = [X, 0, C];
    else if (5 <= Hp && Hp < 6) [r1, g1, b1] = [C, 0, X];

    const m = l - C / 2;
    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255),
    };
}
