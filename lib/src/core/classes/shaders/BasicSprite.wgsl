struct VertexInput {
    @location(0) position: vec2<f32>
};

struct VertexOutput {
    @builtin(position) clipPosition: vec4<f32>
};

@group(0) @binding(0)
var<uniform> viewProjection: mat4x4<f32>;

@vertex
fn vertexShaderMain(input: VertexInput) -> VertexOutput {

    var output: VertexOutput;
    output.clipPosition = viewProjection * vec4<f32>(input.position, 0.0, 1.0);

    return output;
}

@fragment
fn fragmentShaderMain(input: VertexOutput) -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}
