// @ts-nocheck
import { log } from '@janhq/core/node'
import { app, Menu, shell, dialog } from 'electron'
import { join, resolve } from 'path'
import { autoUpdater } from 'electron-updater'
import { log } from '@janhq/core/node'
const isMac = process.platform === 'darwin'
import { windowManager } from '../managers/window'

const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
  {
    label: app.name,
    submenu: [
      {
        label: `Switch to Private mode`,
        click: () => {
          const rendererPath = join(__dirname, '..', 'renderer')
          const mainPath = join(rendererPath, 'index.html')
          const mainUrl = 'http://localhost:3000'
          const modePath = app.isPackaged ? `file://${mainPath}` : mainUrl
          windowManager.mainWindow?.loadURL(modePath)
        },
      },
      {
        label: `Switch to Online mode`,
        click: () => {
          windowManager.mainWindow?.loadURL('https://os.newcoin.org')
        },
      },
      {
        label: `About ${app.name}`,
        click: () =>
          dialog.showMessageBox({
            title: `newOS`,
            message: `newOS Version v${app.getVersion()}\n\nCopyright © 2025 newOS`,
          }),
      },
      {
        label: 'Check for Updates...',
        click: () =>
          // Check for updates and notify user if there are any
          autoUpdater
            .checkForUpdatesAndNotify()
            .then((updateCheckResult) => {
              if (
                !updateCheckResult?.updateInfo ||
                updateCheckResult?.updateInfo.version === app.getVersion()
              ) {
                dialog.showMessageBox({
                  message: `No updates available.`,
                })
                return
              }
            })
            .catch((error) => {
              log('Error checking for updates:' + JSON.stringify(error))
            }),
      },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      {
        label: `Settings`,
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          windowManager.showMainWindow()
          windowManager.sendMainViewState('Settings')
        },
      },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
            },
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' },
          ]
        : [{ role: 'close' }]),
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://jan.ai/guides/')
        },
      },
    ],
  },
]

export const menu = Menu.buildFromTemplate(template)

export const setupMenu = () => {
  Menu.setApplicationMenu(menu)
}
