import { Vec2 } from "./core/classes/math/Vector2";

/**
 * Basic two-point vector.
 */
export interface Vector2 {
    x: number;
    y: number;
}

export interface MouseButton {
    isActive: boolean;
}

export interface MouseButtonMap {
    left: MouseButton;
    middle: MouseButton;
    right: MouseButton;
}

export interface Mouse {
    position: Vec2;
    buttons: MouseButtonMap;
    isInWindow: boolean;
}