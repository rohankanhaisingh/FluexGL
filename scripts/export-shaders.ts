import fs from "node:fs";
import path from "node:path";

// @ts-ignore
import replaceAll from "string.prototype.replaceall";

import { glob } from "glob";

(async function () {

    const libraryDirectory = path.join(__dirname, "../lib"),
        sourceDirectory = path.join(libraryDirectory, "src"),
        shadersDirectory = path.join(sourceDirectory, "shaders");

    const startTimestamp: number = Date.now();

    if (!fs.existsSync(shadersDirectory))
        throw new Error("Shaders directory does not exist");

    let shaderFiles = await glob("**/*.wgsl", {
        cwd: shadersDirectory,
        nodir: true
    });

    shaderFiles = shaderFiles.sort(function (a: string, b: string) {
        return a.localeCompare(b);
    });

    const shaderEntries = shaderFiles.map(function (shaderFile: string) {

        const normalizedShaderFile: string = replaceAll(shaderFile, "\\", "/"),
            shaderPath: string = path.join(shadersDirectory, shaderFile),
            fileContent: string = fs.readFileSync(shaderPath, "utf-8");

        return {
            key: normalizedShaderFile,
            value: fileContent
        };
    });

    const objectBody = shaderEntries
        .map(function ({ key, value }) {
            const escapedValue: string = value
                .replace(/\\/g, "\\\\")
                .replace(/`/g, "\\`")
                .replace(/\${/g, "\\${");

            return `  ${JSON.stringify(key)}: \`${escapedValue}\``;
        })
        .join(",\n");

    const generatedFile = [
        `// Exported from ${shaderFiles.length} shader files(s).`,
        "",
        "export const shaderSources: Record<string, string> = {",
        objectBody,
        "};",
        "",
        "export default shaderSources;",
        ""
    ].join("\n");

    const exportsFile = path.join(shadersDirectory, "exports.ts");
    fs.writeFileSync(exportsFile, generatedFile, "utf-8");
})();
