struct Uniforms {
    mvp: mat4x4<f32>
};

@group(0) @binding(0)
var<uniform> uniform: Uniforms;

struct VertexShaderOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f
};

@vertex
fn vertexShaderMain(
    @location(0) positionInput: vec3f,
    @location(1) colorInput: vec3f,
) -> VertexShaderOutput {

    var output: VertexShaderOutput;
    
    output.position = uniform.mvp * vec4f(positionInput, 1.0);
    output.color = colorInput;
    return output;
};

@fragment
fn fragmentShaderMain(
    @location(0) color: vec3f
) -> @location(0) vec4f {
    return vec4f(color, 1.0);
}