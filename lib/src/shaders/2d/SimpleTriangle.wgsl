struct VertexShaderOutput {
    @builtin(position) position: vec4f
}

@vertex fn vertexShaderMain(@location(0) position: vec2f) -> VertexShaderOutput {
    
    var output: VertexShaderOutput;

    output.position = vec4f(position, 0, 1);
    return output;
}

@fragment fn fragmentShaderMain() -> @location(0) vec4f {
    return vec4f(0.9, 0.3, 0.2, 1);
}