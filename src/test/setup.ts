import { toMatchImageSnapshot } from 'jest-image-snapshot';
import mockedIpcAPI from './ipcApiMock';

expect.extend({ toMatchImageSnapshot });

window.ipcAPI = mockedIpcAPI;
