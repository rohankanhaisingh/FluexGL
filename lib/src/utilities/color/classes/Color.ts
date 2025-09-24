import { ColorfulObject } from "../../../typings";

function clamp(value: number): number {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

export class Color implements ColorfulObject {

    constructor(public red: number = 0, public green: number = 0, public blue: number = 0, public alpha: number = 1) { }

    public Clone(): Color {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }

    public Add(color: Color | ColorfulObject): Color {

        this.red = clamp(this.red + color.red);
        this.green = clamp(this.green + color.green);
        this.blue = clamp(this.blue + color.blue);
        this.alpha = clamp(this.alpha + color.alpha);

        return this;
    }

    public Multiply(color: Color | ColorfulObject): Color {

        this.red = clamp(this.red * color.red);
        this.green = clamp(this.green * color.green);
        this.blue = clamp(this.blue * color.blue);
        this.alpha = clamp(this.alpha * color.alpha);

        return this;
    }
}