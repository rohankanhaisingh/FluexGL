struct Uniforms {
    modelViewProjectionMatrix: mat4x4<f32>
}

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

struct VertexShaderInputData {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>
}

struct VertexShaderOutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec3<f32>
}

@vertex
fn vertexShaderMain(inputData: VertexShaderInputData) -> VertexShaderOutputData {

    var outputData: VertexShaderOutputData;

    outputData.position = uniforms.modelViewProjectionMatrix * vec4<f32>(inputData.position, 1.0);
    outputData.color = inputData.color;

    return outputData;
}

@fragment
fn fragmentShaderMain(inputData: VertexShaderOutputData) -> @location(0) vec4<f32> {

    return vec4<f32>(inputData.color, 1.0);
}