// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { analyzeCommandFunction, getWebviewContent } from "./utils/commands";
import { parseController } from "./utils/parser";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "routica" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "routica.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello world to VS Code!");
    }
  );

  const activateCommand = vscode.commands.registerCommand(
    "routica.activate",
    () => {
      vscode.window.showWarningMessage("Routica is activated!");
    }
  );

  // Command: Show Current Date
  const showDateCommand = vscode.commands.registerCommand(
    "routica.showDate",
    () => {
      const currentDate = new Date().toLocaleString();
      vscode.window.showInformationMessage(
        `Current Date and Time: ${currentDate}`
      );
    }
  );

  let analyzeCommandDisposable = analyzeCommandFunction();

  context.subscriptions.push(
    disposable,
    activateCommand,
    analyzeCommandDisposable,
    showDateCommand
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
