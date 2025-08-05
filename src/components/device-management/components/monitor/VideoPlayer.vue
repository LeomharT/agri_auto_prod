<template>
  <div :id="props.id" class="video-player-context">
    <canvas
      :ref="(el) => setItemRef(el, `download-${props.id}`)"
      :id="`download-${props.id}`"
      class="kind-stream-canvas video-player-canvas"
      kind-channel-id="0"
      width="1920"
      height="1080"
      style="visibility: hidden"
    ></canvas>
    <canvas
      :ref="(el) => setItemRef(el, `downloadIvs-${props.id}`)"
      :id="`downloadIvs-${props.id}`"
      class="kind-stream-canvas video-player-canvas"
      width="1920"
      height="1080"
      style="visibility: hidden"
    ></canvas>
    <canvas
      :ref="(el) => setItemRef(el, `talk-${props.id}`)"
      :id="`talk-${props.id}`"
      class="kind-stream-canvas video-player-canvas"
      kind-channel-id="0"
      width="1920"
      height="1080"
      style="visibility: hidden"
    ></canvas>
    <canvas
      :ref="(el) => setItemRef(el, `talkIvs-${props.id}`)"
      :id="`talkIvs-${props.id}`"
      class="kind-stream-canvas video-player-canvas"
      width="1920"
      height="1080"
      style="visibility: hidden"
    ></canvas>
    <canvas
      :ref="(el) => setItemRef(el, `can-${props.id}`)"
      :id="`can-${props.id}`"
      class="kind-stream-canvas video-player-canvas"
      kind-channel-id="0"
      width="1920"
      height="1080"
      :style="{ visibility: isPlay ? 'visible' : 'hidden' }"
    ></canvas>
    <canvas
      :ref="(el) => setItemRef(el, `ivsCan-${props.id}`)"
      :id="`ivsCan-${props.id}`"
      class="kind-stream-canvas video-player-canvas"
      width="1920"
      height="1080"
      :style="{ visibility: isPlay ? 'visible' : 'hidden' }"
    ></canvas>
    <video
      :ref="(el) => setItemRef(el, `video-${props.id}`)"
      :id="`video-${props.id}`"
      class="kind-stream-canvas"
      kind-channel-id="0"
      width="1920"
      height="1080"
      :style="{
        visibility: isPlay ? 'visible' : 'hidden',
        position: 'absolute',
        top: 0,
      }"
    ></video>
    <video
      :ref="(el) => setItemRef(el, `download-video-${props.id}`)"
      :id="`download-video-${props.id}`"
      class="kind-stream-canvas"
      kind-channel-id="0"
      width="1920"
      height="1080"
      style="visibility: hidden"
    ></video>
    <video
      :ref="(el) => setItemRef(el, `talk-video-${props.id}`)"
      :id="`talk-video-${props.id}`"
      class="kind-stream-canvas"
      kind-channel-id="0"
      width="1920"
      height="1080"
      style="visibility: hidden; display: none"
    ></video>
    <img :src="loading" v-if="isLoading" />
  </div>
</template>
<script setup name="VideoPlayer">
import { computed, ref, watch } from 'vue';
import LoadingImg from './img/loading.png';
import PlayerControl from './wasm/PlayerControl.js';

const props = defineProps({
  id: {
    type: String,
    default: Date.now().toString(),
  },
  videoURL: {
    type: String,
    required: true,
  },
  // intercom url
  audioURL: {
    type: String,
  },
  // video download url
  downloadURL: {
    type: String,
  },
  channelId: {
    type: String,
    default: '0',
  },
  // Main and auxiliary stream  0 main stream 1 Secondary stream
  bitStream: {
    type: Number,
    default: 0,
  },
  // Is it a live broadcast
  isLive: {
    type: Boolean,
    default: true,
  },
  // Offset
  npt: {
    type: String,
  },
  isEncrypt: {
    type: Boolean,
    default: false,
  },
  // AES encryption type, hexadecimal array format
  // 1  AES256 encryption type, hexadecimal array format；2 AES encryption type, string format；3  unknown encryption type；0
  encryptMode: {
    type: Number,
    default: 1,
  },
  szKey: {
    type: String,
  },
  keyId: {
    type: String,
  },
});

const emit = defineEmits([
  'downloadProgressUpdate',
  'playProgressUpdate',
  'downloadComplete',
  'playError',
  'talkError',
  'downloadError',
  'recordError',
  'update:videoURL',
  'talkStart',
  'playFileOver',
]);

const isLoading = ref(false);
const loading = LoadingImg;
const isPlay = ref(false);
let isPrivateProtocol = false;

watch(
  () => props.videoURL,
  (val) => {
    isPrivateProtocol = val.includes('rtsp://') ? false : true;
  }
);
watch(
  () => props.audioURL,
  (val) => {
    isPrivateProtocol = val.includes('rtsp://') ? false : true;
  }
);
watch(
  () => props.downloadURL,
  (val) => {
    isPrivateProtocol = val.includes('rtsp://') ? false : true;
  }
);
// websocket connection address
const wsURL = computed(() => {
  const { protocol } = location;
  const [wsIP] = props.videoURL.replace('rtsp://', '').split('/');
  const ws = `${
    protocol === 'http:' && !props.videoURL.includes('8556') ? 'ws' : 'wss'
  }://${wsIP}`;
  return !isPrivateProtocol ? ws : `${ws}/httpprivateoverwebsocket`;
});

// Intercom websocket connection address
const audioWsURL = computed(() => {
  const { protocol } = location;
  const [wsIP] = props.audioURL.replace('rtsp://', '').split('/');
  const ws = `${
    protocol === 'http:' && !props.audioURL.includes('8556') ? 'ws' : 'wss'
  }://${wsIP}`;
  return !isPrivateProtocol ? ws : `${ws}/httpprivateoverwebsocket`;
});

// websocket connection address
const downloadWsURL = computed(() => {
  const { protocol } = location;
  const [wsIP] = props.downloadURL.replace('rtsp://', '').split('/');
  const ws = `${
    protocol === 'http:' && !props.downloadURL.includes('8556') ? 'ws' : 'wss'
  }://${wsIP}`;
  return !isPrivateProtocol ? ws : `${ws}/httpprivateoverwebsocket`;
});

// rtsp stream address
const rtspStream = computed(() => {
  const rtsp = props.videoURL.includes('rtsp://')
    ? props.videoURL
    : `rtsp://${props.videoURL}`;
  return !isPrivateProtocol
    ? props.isLive
      ? rtsp
      : rtsp.replace(
          /&beginTime=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}&endTime=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
          ''
        )
    : props.isLive
    ? `/live/realmonitor.xav?channel=${props.channelId}&subtype=${props.bitStream}`
    : `/vod/playback.xav?channel=${props.channelId}&subtype=${props.bitStream}`;
});

// Video download stream address
const downloadStream = computed(() => {
  const rtsp = props.downloadURL.includes('rtsp://')
    ? props.downloadURL
    : `rtsp://${props.downloadURL}`;
  return !isPrivateProtocol
    ? props.isLive
      ? rtsp
      : rtsp.replace(
          /&beginTime=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}&endTime=\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
          ''
        )
    : props.isLive
    ? `/live/realmonitor.xav?channel=${props.channelId}&subtype=${props.bitStream}`
    : `/vod/playback.xav?channel=${props.channelId}&subtype=${props.bitStream}`;
});

// intercom stream address
const audioStream = computed(() => {
  const audioURL = props.audioURL.includes('rtsp://')
    ? props.audioURL
    : `rtsp://${props.audioURL}`;
  return !isPrivateProtocol
    ? audioURL
    : `/live/talk.xav?channel=${props.channelId}&subtype=${props.bitStream}`;
});

// The sourceId carried in the private stream sending signaling test
const sourceId = computed(() => {
  return props.videoURL.replace('rtsp://', '').split('/')[1];
});

const audioSourceId = computed(() => {
  return props.audioURL.replace('rtsp://', '').split('/')[1];
});

const downloadSourceId = computed(() => {
  return props.downloadURL.replace('rtsp://', '').split('/')[1];
});

let player = null;
let playerPort = null;
let timer = null;
let volume = 1;
const playRefs = {};
const setItemRef = (el, key) => {
  if (el) {
    playRefs[key] = el;
  }
};
/**
 * @method play
 */
const play = () => {
  if (!props.videoURL) return;
  if (player) {
    player.close();
  }
  let firstTime = 0;
  const options = {
    wsURL: wsURL.value,
    rtspURL: rtspStream.value,
    sourceId: sourceId.value,
    lessRateCanvas: true,
    // Currently live or playback
    playback: props.isLive === false,
    isPrivateProtocol: isPrivateProtocol,
    // demo defaults to an empty string, it should actually be the realm returned when the device logs in
    realm: '',
    npt: props.npt,
    isEncrypt: props.isEncrypt,
    key: props.szKey,
    encryptMode: props.encryptMode,
    keyId: props.keyId,
  };
  player = new PlayerControl(options);
  timer = setTimeout(() => {
    isLoading.value = false;
    emit('playError', {
      errorCode: 500,
      description: 'Service Error',
    });
  }, 10000);
  isLoading.value = true;
  player.on('FileOver', () => {
    console.log('-------------FileOver---------------');
    close();
    emit('playFileOver');
  });
  player.on('ResolutionChanged', (e) => {
    console.log('-------------ResolutionChanged--------------:', e);
  });
  player.on('PlayStart', () => {
    console.log('-------------PlayStart---------------');
    isPlay.value = true;
    if (isLoading.value) isLoading.value = false;
  });
  player.on('CaptureChanged', (blob) => {
    console.log('--------CaptureChanged---------', blob);
    emit('captureCallback', blob);
  });
  player.on('DecodeStart', (e) => {
    clearTimeout(timer);
    console.log('-------------DecodeStart------------------');
    if (e.decodeMode === 'video') {
      playRefs[`can-${props.id}`].style.display = 'none';
      playRefs[`video-${props.id}`].style.display = '';
    } else {
      playRefs[`can-${props.id}`].style.display = '';
      playRefs[`video-${props.id}`].style.display = 'none';
    }
  });
  player.on('UpdateCanvas', (e) => {
    if (firstTime === 0) {
      firstTime = e.timeStamp;
    }
    const playTime = (e.timeStamp - firstTime) / 1000;
    const msg = {
      playTime: playTime,
      time: e.timeStamp,
      utcTime: e.utcTimeStamp,
    };
    // console.log('--------------msg--------:', msg)
    emit('playProgressUpdate', msg);
  });
  player.on('GetFrameRate', (e) => {
    console.log('-------------GetFrameRate--------------:', e);
  });
  player.on('FrameTypeChange', (e) => {
    console.log('-------------FrameTypeChange--------------:', e);
  });
  player.on('Error', (e) => {
    isPlay.value = false;
    emit('playError', e);
  });
  player.on('IvsDraw', () => {
    console.log('-------------IvsDraw--------------:', e);
  });
  player.on('WorkerReady', () => {
    player.connect();
  });
  player.init(
    playRefs[`can-${props.id}`],
    playRefs[`video-${props.id}`],
    playRefs[`ivsCan-${props.id}`]
  );
  // player.init(playRefs[`can-${props.id}`], playRefs[`video-${props.id}`])
  player.connect();
  playerPort = player.getPlayPort();
};

/**
 * @method openIVS Turn on Smart Frames
 */
const openIVS = () => {
  player && player.openIVS();
};

/**
 * @method closeIVS Turn off Smart Frames
 */
const closeIVS = () => {
  player && player.closeIVS();
};

let talkPlayer = null;
let talkPort = null;
/**
 * @method talk intercom
 */
const talk = () => {
  const optionsAudio = {
    // rtsp intercom
    wsURL: audioWsURL.value,
    rtspURL: audioStream.value,
    sourceId: audioSourceId.value,
    isTalkService: true,
    isPrivateProtocol: isPrivateProtocol,
    // demo defaults to an empty string, it should actually be the realm returned when the device logs in
    realm: '',
    npt: props.npt,
    isEncrypt: props.isEncrypt,
    pwd: props.pwd,
    encryptMode: props.encryptMode,
    keyId: props.keyId,
  };
  if (talkPlayer) {
    talkPlayer.talk('off');
    talkPlayer = null;
  } else {
    talkPlayer = new PlayerControl(optionsAudio);
    timer = setTimeout(() => {
      emit('talkError', {
        errorCode: 500,
        description: 'Service Error',
      });
    }, 10000);
    // If the video is not played, it needs to be initialized first, if the video has been played first, it does not need to be initialized
    talkPlayer.on('GetFrameRate', () => {
      clearTimeout(timer);
      emit('talkStart');
    });
    talkPlayer.talk(
      'on',
      playRefs[`talk-${props.id}`],
      playRefs[`talk-video-${props.id}`],
      playRefs[`talkIvs-${props.id}`],
      !isPlay.value
    );
    if (!isPlay.value) talkPort = talkPlayer.getPlayPort();
    talkPlayer.on('Error', (e) => {
      emit('talkError', e);
    });
  }
};

let isRecording = false;
/**
 * @method record real time video
 * @param { String } fileName video file name
 */
const record = (fileName) => {
  if (!player) return;
  if (!isRecording) {
    isRecording = true;
    player.startRecord(fileName || Date.now() + '.mp4');
  } else {
    isRecording = false;
    player.stopRecord();
  }
};

let downloadPlayer = null;
let downloadPlayerPort = null;
/**
 * @method download
 * @param { String } fileName video file name
 */
const download = (fileName) => {
  const optionsRecord = {
    wsURL: downloadWsURL.value,
    rtspURL: downloadStream.value,
    sourceId: downloadSourceId.value,
    lessRateCanvas: true,
    playback: true,
    isPrivateProtocol: isPrivateProtocol,
    realm: '',
    isDownloadService: true,
    npt: props.npt,
    isEncrypt: props.isEncrypt,
    pwd: props.pwd,
    encryptMode: props.encryptMode,
    keyId: props.keyId,
  };
  if (!downloadPlayer) {
    downloadPlayer = new PlayerControl(optionsRecord);
    timer = setTimeout(() => {
      emit('downloadError', {
        errorCode: 500,
        description: 'Service Error',
      });
    }, 10000);
    downloadPlayer.on('GetFrameRate', () => {
      clearTimeout(timer);
    });
    downloadPlayer.on('Error', (e) => {
      emit('downloadError', e);
    });
    downloadPlayer.on('recordChanged', (e) => {
      if (e.type == 'pendding' && e.time) {
        const msg = {
          size: e.size,
          time: e.time,
          utcTime: e.utcTime,
        };
        emit('downloadProgressUpdate', msg);
      } else if (e.type == 'closed') {
        emit('downloadComplete');
        downloadPlayer = null;
      }
    });
    downloadPlayer.download(
      playRefs[`download-${props.id}`],
      playRefs[`download-video-${props.id}`],
      playRefs[`downloadIvs-${props.id}`],
      fileName
    );
    downloadPlayer.connect();
    downloadPlayerPort = downloadPlayer.getPlayPort();
    downloadPlayer.startRecord(fileName || Date.now() + '.mp4');
  } else {
    downloadPlayer.stopRecord();
  }
};

/**
 * @method screenshot
 */
const screenshot = () => {
  player && player.capture(Date.now(), playRefs[`can-${props.id}`]);
};

/**
 * @method getScreenshot Get the current screenshot
 */
const getScreenshot = () => {
  player && player.getCapture(Date.now(), playRefs[`can-${props.id}`]);
};

/**
 * @method close video off
 */
const close = () => {
  if (talkPlayer) {
    talkPlayer.talk('off');
    talkPlayer = null;
  }
  timer && clearTimeout(timer);
  player && player.close();
  isPlay.value = false;
  isLoading.value = false;
  player = null;
  emit('update:rtspURL', '');
};

/**
 * @method setAudioVolume sound settings
 */
const setAudioVolume = (val) => {
  if (!window.webAudioPlayer) {
    let intervalId = setInterval(() => {
      if (window.webAudioPlayer) {
        window.webAudioPlayer.resume();
        clearInterval(intervalId);
      }
    });
  } else {
    window.webAudioPlayer.resume();
  }
  volume = val;
  player && player.setAudioVolume(val);
  talkPlayer && talkPlayer.setAudioVolume(val);
};

/**
 * @method pause Pause streaming
 */
const pause = () => {
  player && player.pause();
};

/**
 * @method start keep pulling
 */
const start = () => {
  player && player.continue();
};

/**
 * @method downloadPause pause download
 */
const downloadPause = () => {
  downloadPlayer && downloadPlayer.pause();
};

/**
 * @method downloadStart continue downloading
 */
const downloadStart = () => {
  downloadPlayer && downloadPlayer.continue();
};

/**
 * @method downloadClose close download
 */
const downloadClose = () => {
  downloadPlayer && downloadPlayer.close();
  downloadPlayer.cancelRecord();
  downloadPlayer = null;
};

/**
 * @method playFF fast forward/rewind
 */
const playFF = (speed) => {
  player && player.playFF(speed);
};

const cPlusVisibleDecCallBack = (
  nPort,
  pBufY,
  pBufU,
  pBufV,
  nSize,
  pFrameInfo
) => {
  if (nPort == playerPort) {
    player &&
      player.setFrameData(
        nPort,
        pBufY,
        pBufU,
        pBufV,
        nSize,
        pFrameInfo,
        volume
      );
  }
  if (nPort == downloadPlayerPort) {
    downloadPlayer &&
      downloadPlayer.setFrameData(
        nPort,
        pBufY,
        pBufU,
        pBufV,
        nSize,
        pFrameInfo,
        0
      );
  }
  if (nPort == talkPort) {
    talkPlayer &&
      talkPlayer.setFrameData(
        nPort,
        pBufY,
        pBufU,
        pBufV,
        nSize,
        pFrameInfo,
        volume,
        true
      );
  }
};

const cDigitalSignCallBack = (nPort, nFrameID, bSuccess) => {
  if (nPort == playerPort) {
    player && player.setDecryptionResult(nPort, nFrameID, bSuccess);
  }
  if (nPort == downloadPlayerPort) {
    downloadPlayer &&
      downloadPlayer.setDecryptionResult(nPort, nFrameID, bSuccess);
  }
};

const cExtraDrawDataCallBack = (nPort, nDataType, pDrawData, nDataLen) => {
  if (nPort == playerPort) {
    player && player.setIVSData(nPort, nDataType, pDrawData, nDataLen);
  }
  if (nPort == downloadPlayerPort) {
    downloadPlayer &&
      downloadPlayer.setIVSData(nPort, nDataType, pDrawData, nDataLen);
  }
};

const cExtraDrawDrawCallBack = (nPort) => {
  if (nPort == playerPort) {
    player && player.drawIVSData(nPort);
  }
  if (nPort == downloadPlayerPort) {
    downloadPlayer && downloadPlayer.drawIVSData(nPort);
  }
};

const cRecordDataCallBack = (
  nPort,
  pData,
  nDataLen,
  nOffset,
  pRecordFrameInfo
) => {
  if (nPort == playerPort) {
    player &&
      player.setRecordData(nPort, pData, nDataLen, nOffset, pRecordFrameInfo);
  }
  if (nPort == downloadPlayerPort) {
    downloadPlayer &&
      downloadPlayer.setRecordData(
        nPort,
        pData,
        nDataLen,
        nOffset,
        pRecordFrameInfo
      );
  }
};

defineExpose({
  play,
  talk,
  record,
  screenshot,
  getScreenshot,
  close,
  setAudioVolume,
  pause,
  start,
  playFF,
  download,
  downloadPause,
  downloadStart,
  downloadClose,
  openIVS,
  closeIVS,
  cPlusVisibleDecCallBack,
  cDigitalSignCallBack,
  cExtraDrawDataCallBack,
  cExtraDrawDrawCallBack,
  cRecordDataCallBack,
});
</script>

<style scoped>
.video-player-context {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.65);
  & .video-player-canvas {
    position: absolute;
    top: 0;
  }
  canvas {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  video {
    width: 100%;
    height: 100%;
    top: 0;
    object-fit: fill;
  }
  img {
    width: 479px;
    height: 178px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
