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

export interface CanvasMouseObject {
    position: Vector2;
    buttons: MouseButtonMap;
    isInWindow: boolean;
}