const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile('index.html');
}

function saveItinerariesToFile(itineraries) {
    const filePath = path.join(__dirname, 'itineraries.txt');
    fs.writeFile(filePath, JSON.stringify(itineraries), (err) => {
        if (err) console.error('Error writing to file', err);
        else console.log('Itineraries saved to file successfully:', itineraries);
    });
}

function loadItinerariesFromFile() {
    const filePath = path.join(__dirname, 'itineraries.txt');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

ipcMain.on('save-itineraries', (event, itineraries) => {
    saveItinerariesToFile(itineraries);
});

app.whenReady().then(() => {
    const itineraries = loadItinerariesFromFile();
    createWindow();
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('load-itineraries', itineraries);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
