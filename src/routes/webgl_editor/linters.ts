import * as acorn from "acorn";
import { EditorView } from "codemirror";    
import { linter, type Diagnostic } from "@codemirror/lint";

export function createShaderLinter(errorLog: string) {
    return linter((view: EditorView) => {
        const diagnostics: Diagnostic[] = [];
        const regex = /ERROR:\s+0:(\d+):\s+(.*)/g;
        let match;

        while ((match = regex.exec(errorLog)) !== null) {
            const [, lineStr, message] = match;
            const line = parseInt(lineStr, 10) - 1;

            const lineInfo = view.state.doc.line(line + 1);

            diagnostics.push({
                from: lineInfo.from,
                to: lineInfo.to,
                severity: "error",
                message,
            });
        }

        return diagnostics;
    });
}

export function createEvalLinter(error: Error | null, code: string) {
    return linter((view: EditorView) => {
        const diagnostics: Diagnostic[] = [];
        if (!error) return diagnostics;

        // --- Try Acorn parse for syntax/declaration errors ---
        try {
            acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" });
        } catch (parseErr: any) {
            // Acorn gives {loc: {line, column}}
            console.log('Acorn parse error', parseErr);
            if (parseErr.loc) {
                const line = parseErr.loc.line - 1; // 0-based
                const col = parseErr.loc.column;

                const lineInfo = view.state.doc.line(line + 1);
                const from = Math.min(lineInfo.from + col, lineInfo.to);

                diagnostics.push({
                from,
                to: lineInfo.to,
                severity: "error",
                message: parseErr.message,
                });
                return diagnostics;
            }
        }

        // --- Parse stack trace ---
        const stack = error.stack ?? error.message;

        // Generic regex: matches any moduleId, row, col
        const regex = /^\s*at\s+(?:.+?\s+\()?(.+?):(\d+):(\d+)\)?$/gm;
        let match: RegExpExecArray | null;
        let found = false;

        console.log("=== ERROR STACK ===");
        console.log(stack);

        while ((match = regex.exec(stack)) !== null) {
            found = true;
            const moduleId = match[1];  // module name, blob id, or URL
            const line = parseInt(match[2], 10) - 1; // 0-based
            const col = parseInt(match[3], 10) - 1;

            console.log("Matched module:", moduleId, "line:", line + 1, "col:", col + 1);

            // Get line info from CodeMirror
            const lineInfo = view.state.doc.line(line + 1);
            const from = Math.min(lineInfo.from + col, lineInfo.to);
            const to = lineInfo.to;

            diagnostics.push({
                from,
                to,
                severity: "error",
                message: error.message,
            });
            return diagnostics;
        }

        if (!found) {
            console.log("No line/column info found in stack, showing fallback diagnostic.");
            // fallback: whole document
            diagnostics.push({
                from: 0,
                to: 0,
                severity: "error",
                message: error.message,
            });
        }

        return diagnostics;
    });
}