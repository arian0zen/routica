import * as vscode from "vscode";
import {
  analyzeProject,
  isTypeScriptProject,
  ParsedController,
} from "../parser";

const analyzeCommandFunction = () => {
  let analyzeCommandDisposable = vscode.commands.registerCommand(
    "routica.analyzeProject",
    async () => {
      const directory = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      if (!directory) {
        vscode.window.showWarningMessage("No workspace folder found.");
        return;
      }

      try {
        const isTs = isTypeScriptProject(directory);
        vscode.window.showInformationMessage(
          `Analyzing as a ${isTs ? "TypeScript" : "JavaScript"} project...`
        );

        const analysis = analyzeProject(directory);

        const panel = vscode.window.createWebviewPanel(
          "projectAnalysis",
          "Project Routes Analysis",
          vscode.ViewColumn.Beside,
          { enableScripts: true }
        );

        panel.webview.html = getWebviewContent(analysis);
      } catch (error: any) {
        console.error("Routica Error:", error);
        vscode.window.showErrorMessage(`Analysis failed: ${error.message}`);
      }
    }
  );

  return analyzeCommandDisposable;
};

function getWebviewContent(analysis: ParsedController) {
  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body { padding: 20px; }
          .route { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; }
          .method { color: #0066cc; font-weight: bold; }
          .path { color: #666; }
          .middleware { color: #009933; }
        </style>
      </head>
      <body>
        <h1>Project Routes Analysis</h1>
        ${analysis.routes
          .map(
            (route) => `
          <div class="route">
            <div><span class="method">${
              route.method
            }</span> <span class="path">${route.path}</span></div>
            <div>Middlewares: <span class="middleware">${
              route.middleware.join(", ") || "none"
            }</span></div>
            <div>Parameters: ${route.params.join(", ") || "none"}</div>
          </div>
        `
          )
          .join("")}
      </body>
    </html>`;
}

export { analyzeCommandFunction, getWebviewContent };
