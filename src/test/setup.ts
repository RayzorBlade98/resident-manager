import { toMatchImageSnapshot } from 'jest-image-snapshot';
import mockedIpcAPI from './ipcApiMock';

// Extensions
import '_/extensions/date/date.extension';

expect.extend({ toMatchImageSnapshot });

window.ipcAPI = mockedIpcAPI;
