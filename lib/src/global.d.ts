// Global support for importing .wgsl files.
// Very important in order to let the library work with shaders.
declare module "*.wgsl"{
    const source: string;
    export default source;
}