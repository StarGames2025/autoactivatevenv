import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

export function activate() {
    const config = vscode.workspace.getConfiguration('autoactivatevenv');
    const isWindows = os.platform() === 'win32';
    
    const activateVenvInTerminal = (terminal: vscode.Terminal, clearScreen: boolean) => {
        const venvPath = config.get<string>('venvPath', '.venv');
        
        if (fs.existsSync(path.isAbsolute(venvPath) ? venvPath : path.join(vscode.workspace.workspaceFolders?.[0].uri.fsPath || '', venvPath))) {
            if (isWindows) {
                sendCommandToTerminal(terminal, `${venvPath}\\Scripts\\activate`);
                
                if (clearScreen) {
                    sendCommandToTerminal(terminal, 'cls');
                }
            } else {
                sendCommandToTerminal(terminal, `source ${venvPath}/bin/activate`);
                
                if (clearScreen) {
                    sendCommandToTerminal(terminal, 'clear');
                }
            }
        }
    };

    vscode.window.terminals.forEach(terminal => {
        activateVenvInTerminal(terminal, false);
    });
    
    vscode.window.onDidOpenTerminal((terminal) => {
        const config = vscode.workspace.getConfiguration('autoactivatevenv');
        activateVenvInTerminal(terminal, config.get<boolean>('clearScreen', true));
    });
}

function sendCommandToTerminal(terminal: vscode.Terminal, command: string) {
    terminal.sendText(command);
}