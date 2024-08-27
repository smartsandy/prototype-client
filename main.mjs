import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });



  // mainWindow.loadURL('http://localhost:3000');
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 5000);

  mainWindow.on('closed', function () {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

app.whenReady().then(() => {
  const serverScriptPath = isDev
    ? path.join(__dirname, 'server', 'main.py')
    : path.join(process.resourcesPath, 'server', 'main.py');

  const venvPythonPath = isDev
    ? path.join(__dirname, 'server', 'venv', 'Scripts', 'python.exe')
    : path.join(process.resourcesPath, 'venv', 'Scripts', 'python.exe');

  console.log('Server script path:', serverScriptPath);
  console.log('Python path:', venvPythonPath);

  serverProcess = exec(`${venvPythonPath} -m uvicorn main:app --reload --host 127.0.0.1 --port 8000`, { cwd: path.dirname(serverScriptPath) }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting FastAPI server: ${error}`);
      return;
    }
    console.log(`FastAPI stdout: ${stdout}`);
    console.error(`FastAPI stderr: ${stderr}`);
  });

  createWindow();

  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});
