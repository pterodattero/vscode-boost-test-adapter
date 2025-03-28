import * as vscode from 'vscode';
const path = require('path');
const crypto = require("crypto");

export function stringHash(s: string): string {
    return crypto.createHash("sha1").update(s).digest("hex");
}

// detokenizeVariables is based on https://github.com/DominicVonk/vscode-variables
export function detokenizeVariables(rawValue: string, workspaceFolder: vscode.WorkspaceFolder, recursive = false): string {
    let activeFile = vscode.window.activeTextEditor?.document;
    let absoluteFilePath = activeFile?.uri.fsPath
    rawValue = rawValue.replace(/\${workspaceFolder}/g, workspaceFolder?.uri.fsPath ?? "");
    rawValue = rawValue.replace(/\${workspaceFolderBasename}/g, workspaceFolder?.name ?? "");
    rawValue = rawValue.replace(/\${file}/g, absoluteFilePath ?? "");
    let relativeFilePath = absoluteFilePath;

    let parsedPath = path.parse(absoluteFilePath);
    rawValue = rawValue.replace(/\${fileWorkspaceFolder}/g, workspaceFolder?.uri.fsPath ?? "");
    rawValue = rawValue.replace(/\${relativeFile}/g, relativeFilePath ?? "");
    rawValue = rawValue.replace(/\${relativeFileDirname}/g, relativeFilePath?.substr(0, relativeFilePath.lastIndexOf(path.sep)) ?? "");
    rawValue = rawValue.replace(/\${fileBasename}/g, parsedPath.base ?? "");
    rawValue = rawValue.replace(/\${fileBasenameNoExtension}/g, parsedPath.name ?? "");
    rawValue = rawValue.replace(/\${fileExtname}/g, parsedPath.ext ?? "");
    rawValue = rawValue.replace(/\${fileDirname}/g, parsedPath.dir.substr(parsedPath.dir.lastIndexOf(path.sep) + 1));
    rawValue = rawValue.replace(/\${cwd}/g, parsedPath.dir);
    rawValue = rawValue.replace(/\${pathSeparator}/g, path.sep);
    return rawValue;
}
