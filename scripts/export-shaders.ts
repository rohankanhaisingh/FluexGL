import fs from "node:fs";
import path from "node:path";

import { glob } from "glob";

const libraryDirectory = path.join(__dirname, "../lib"),
    sourceDirectory = path.join(libraryDirectory, "src");

function escapeTemplateLiteral(value: string): string {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\${/g, "\\${");
}

async function exportShaders(): Promise<number> {

    if (!fs.existsSync(sourceDirectory))
        throw new Error("Source directory does not exist");

    let shaderFiles = await glob("**/*.wgsl", {
        cwd: sourceDirectory,
        nodir: true
    });

    shaderFiles = shaderFiles.sort(function (a: string, b: string) {
        return a.localeCompare(b);
    });

    for (const shaderFile of shaderFiles) {

        const shaderPath: string = path.join(sourceDirectory, shaderFile),
            fileContent: string = fs.readFileSync(shaderPath, "utf-8"),
            escapedContent: string = escapeTemplateLiteral(fileContent);

        const generatedFile = [
            `// Auto-generated from ${path.basename(shaderFile)}. Do not edit manually.`,
            `// Regenerate with "npm run export-shaders".`,
            "",
            `const shaderSource: string = \`${escapedContent}\`;`,
            "",
            "export default shaderSource;",
            ""
        ].join("\n");

        const outputFile = `${shaderPath}.ts`;
        fs.writeFileSync(outputFile, generatedFile, "utf-8");
    }

    return shaderFiles.length;
}

function watchShaders(): void {

    console.log(`Watching ${sourceDirectory} for *.wgsl changes...`);

    let debounceTimer: NodeJS.Timeout | null = null;

    fs.watch(sourceDirectory, { recursive: true }, function (_event, filename) {

        if (!filename || !filename.toString().endsWith(".wgsl"))
            return;

        if (debounceTimer)
            clearTimeout(debounceTimer);

        debounceTimer = setTimeout(function () {
            const startTimestamp: number = Date.now();

            exportShaders()
                .then(function (count) {
                    const elapsed: number = Date.now() - startTimestamp;
                    console.log(`[${new Date().toLocaleTimeString()}] Re-exported ${count} shader(s) (${elapsed}ms).`);
                })
                .catch(function (error) {
                    console.error("Failed to re-export shaders:", error);
                });
        }, 150);
    });
}

(async function () {

    const startTimestamp: number = Date.now();
    const count = await exportShaders();
    const elapsed: number = Date.now() - startTimestamp;

    console.log(`Exported ${count} shader(s) (${elapsed}ms).`);

    if (process.argv.includes("--watch"))
        watchShaders();
})();
