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
            acorn.parse(code, { ecmaVersion: "latest" });
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

        // Use stack trace if available, otherwise message
        const stack = error.stack ?? error.message;
        const regex = /<anonymous>:(\d+):(\d+)/;
        const match = stack.match(regex);

        if (match) {
            const line = parseInt(match[1], 10) - 1;  // 0-based
            const col = parseInt(match[2], 10) - 1;
            const message = error.message;

            const lineInfo = view.state.doc.line(line + 1);
            const from = Math.min(lineInfo.from + col, lineInfo.to);
            const to = lineInfo.to;

            diagnostics.push({
                from,
                to,
                severity: "error",
                message,
            });
        } else {
            // fallback: show whole-doc error if no line info
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