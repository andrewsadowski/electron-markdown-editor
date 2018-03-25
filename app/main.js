const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;
const windows = new Set();

const createWindow = () => {
  const newWindow = new BrowserWindow({ show: false });
  windows.add(newWindow);

  newWindow.loadURL(`file://${__dirname}/index.html`);

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    newWindow = null;
  });
};

const getFileFromUserSelection = (exports.getFileFromUserSelection = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  });

  if (!files) return;

  return files[0];
});

const openFile = (exports.openFile = filePath => {
  const file = filePath || getFileFromUserSelection();
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send('file-opened', file, content);
});

app.on('ready', () => {
  require('devtron').install();
});
