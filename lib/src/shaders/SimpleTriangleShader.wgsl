struct VertexShaderOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f
};

@vertex
fn vertexShaderMain(
    @location(0) positionInpit: vec2f,
    @location(1) colorInput: vec3f
) -> VertexShaderOutput {
    
    var output: VertexShaderOutput;
    output.position = vec4f(positionInpit, 0.0, 1.0);
    output.color = colorInput;

    return output;
}

@fragment
fn fragmentShaderMain(
    @location(0) color: vec3f
) -> @location(0) vec4f {
    return vec4f(color, 1.0);
}