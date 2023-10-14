const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const getCanvasFingerprint = () => {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var txt = 'BroPrint.65@345876';
  ctx.textBaseline = "top";
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f60";
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = "#069";
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
  ctx.fillText(txt, 4, 17);
  return canvas.toDataURL();
};

const generateTheAudioFingerPrint = (function () {
  var context = null;
  var currentTime = null;
  var oscillator = null;
  var compressor = null;
  var fingerprint = null;
  var callback = null;
  function run(cb, debug = false) {
    callback = cb;
    try {
      setup();
      oscillator.connect(compressor);
      compressor.connect(context.destination);
      oscillator.start(0);
      context.startRendering();
      context.oncomplete = onComplete;
    }
    catch (e) {
      if (debug) {
        throw e;
      }
    }
  }
  function setup() {
    setContext();
    currentTime = context.currentTime;
    setOscillator();
    setCompressor();
  }
  function setContext() {
    var audioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    context = new audioContext(1, 44100, 44100);
  }
  function setOscillator() {
    oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(10000, currentTime);
  }
  function setCompressor() {
    compressor = context.createDynamicsCompressor();
    setCompressorValueIfDefined('threshold', -50);
    setCompressorValueIfDefined('knee', 40);
    setCompressorValueIfDefined('ratio', 12);
    setCompressorValueIfDefined('reduction', -20);
    setCompressorValueIfDefined('attack', 0);
    setCompressorValueIfDefined('release', .25);
  }
  function setCompressorValueIfDefined(item, value) {
    if (compressor[item] !== undefined && typeof compressor[item].setValueAtTime === 'function') {
      compressor[item].setValueAtTime(value, context.currentTime);
    }
  }
  function onComplete(event) {
    generateFingerprints(event);
    compressor.disconnect();
  }
  function generateFingerprints(event) {
    var output = null;
    for (var i = 4500; 5e3 > i; i++) {
      var channelData = event.renderedBuffer.getChannelData(0)[i];
      output += Math.abs(channelData);
    }
    fingerprint = output.toString();
    if (typeof callback === 'function') {
      return callback(fingerprint);
    }
  }
  return {
    run: run
  };
})();

const getCurrentBrowserFingerPrint = () => {
  const getTheAudioPrints = new Promise((resolve, reject) => {
    generateTheAudioFingerPrint.run(function (fingerprint) {
      resolve(fingerprint);
    });
  });

  const DevicePrints = new Promise((resolve, reject) => {
    getTheAudioPrints.then((audioChannelResult) => {
      let fingerprint = window.btoa(audioChannelResult) + (0, getCanvasFingerprint)();
      resolve((0, cyrb53)(fingerprint, 0));
    }).catch(() => {
      try {
        resolve((0, cyrb53)((0, getCanvasFingerprint)()).toString());
      }
      catch (error) {
        reject("Failed to generate the finger print of this browser");
      }
    });
  });

  return DevicePrints;
};
