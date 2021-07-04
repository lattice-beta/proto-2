import * as Code from './codeConstants.js';

export const DEFAULT_PAGE_TITLE = 'Untitled';
export const Y_NAVIGATION_OFFSET = 150;
export const DEFAULT_WORKSPACE_MODE = {
  consoleOutputText: [],
  currentFile: Code.STARTFILE.p5,
  files: Code.FILES.p5,
  isPlaying: false,
  isRefreshing: false,
  editorMode: 'p5',
  innerWidth: 500,
  pythonRunMode: ''
};
export const STARTER_WORKSPACE_LAYOUT = [
  {
    h: 3,
    i: 'editor-0',
    maxH: 100,
    maxW: 30,
    minH: 11,
    minW: 13,
    moved: false,
    static: false,
    w: 30,
    x: 0,
    y: 0,
  },
  {
    h: 30,
    i: 'editor-1',
    maxH: 100,
    maxW: 30,
    minH: 11,
    minW: 13,
    moved: false,
    static: false,
    w: 30,
    x: 0,
    y: 10
  }];
export const SNAPSHOT_DEFAULT_IMG = 'https://s3.amazonaws.com/peblio-files/_Pebl_Snapshots/default.png';
