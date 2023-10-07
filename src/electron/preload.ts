// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge } from 'electron';
import ipcAPI from '_/ipc/ipcApi';

contextBridge.exposeInMainWorld('ipcAPI', ipcAPI);
