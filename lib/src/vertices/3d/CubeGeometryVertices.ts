export default function CubeGeometryVertices(): number[] {
    return [
        // X, Y, Z,   R, G, B
        // Front face
        -1, -1,  1,  1, 0, 0,
        1, -1,  1,  0, 1, 0,
        1,  1,  1,  0, 0, 1,
        -1,  1,  1,  1, 1, 1,
        // Back face
        -1, -1, -1,  1, 0, 0,
        1, -1, -1,  0, 1, 0,
        1,  1, -1,  0, 0, 1,
        -1,  1, -1,  1, 1, 1,
    ]
}