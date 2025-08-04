import { checkBrowser } from './wasm/public.js';

const loadScript = (src) => {
  const dom = document.createElement('script');
  dom.src = src;
  document.head.appendChild(dom);
};

const loadLibDHPlay = (bSupportMultiThread) => {
  let libPath = '/WasmLib/MultiThread/libplay.js';
  if (!bSupportMultiThread) {
    libPath = '/WasmLib/SingleThread/libplay.js';
  }
  loadScript(libPath);
};

const init = (players) => {
  if (!players) return;
  if (!Array.isArray(players)) players = [players];
  let cPlusVisibleDecCallBack = () => {};
  let cDigitalSignCallBack = () => {};
  let cExtraDrawDataCallBack = () => {};
  let cExtraDrawDrawCallBack = () => {};
  let cRecordDataCallBack = () => {};
  if (players.length) {
    cPlusVisibleDecCallBack = (
      nPort,
      pBufY,
      pBufU,
      pBufV,
      nSize,
      pFrameInfo
    ) => {
      players.forEach((player) => {
        // Multiple windows need to execute the corresponding methods of multiple window objects
        player &&
          player.cPlusVisibleDecCallBack(
            nPort,
            pBufY,
            pBufU,
            pBufV,
            nSize,
            pFrameInfo
          );
      });
    };
    cDigitalSignCallBack = (nPort, nFrameID, bSuccess) => {
      players.forEach((player) => {
        // Multiple windows need to execute the corresponding methods of multiple window objects
        player && player.cDigitalSignCallBack(nPort, nFrameID, bSuccess);
      });
    };
    cExtraDrawDataCallBack = (nPort, nDataType, pDrawData, nDataLen) => {
      players.forEach((player) => {
        // Multiple windows need to execute the corresponding methods of multiple window objects
        player &&
          player.cExtraDrawDataCallBack(nPort, nDataType, pDrawData, nDataLen);
      });
    };
    cExtraDrawDrawCallBack = (nPort) => {
      players.forEach((player) => {
        // Multiple windows need to execute the corresponding methods of multiple window objects
        player && player.cExtraDrawDrawCallBack(nPort);
      });
    };
    cRecordDataCallBack = (
      nPort,
      pData,
      nDataLen,
      nOffset,
      pRecordFrameInfo
    ) => {
      players.forEach((player) => {
        // Multiple windows need to execute the corresponding methods of multiple window objects
        player &&
          player.cRecordDataCallBack(
            nPort,
            pData,
            nDataLen,
            nOffset,
            pRecordFrameInfo
          );
      });
    };
  }
  window.cPlusVisibleDecCallBack = cPlusVisibleDecCallBack;

  window.cDigitalSignCallBack = cDigitalSignCallBack;

  window.cExtraDrawDataCallBack = cExtraDrawDataCallBack;

  window.cExtraDrawDrawCallBack = cExtraDrawDrawCallBack;

  window.cRecordDataCallBack = cRecordDataCallBack;

  const { bSupportMultiThread } = checkBrowser();
  loadLibDHPlay(bSupportMultiThread);
};

export default { init };
