const btn = document.querySelector('#main-btn')
const AudioContext = window.AudioContext || window.webkitAudioContext;

let audio = new AudioContext();
let osc = audio.createOscillator();
let lvl = audio.createGain();
let muted = true;
let started = false;
let disabled = false;

// methods
// init Audiocontext
const init = () => {
  lvl.gain.value = 0;
  osc.connect(lvl);
  lvl.connect(audio.destination);
}

const handler = () => {
  const { beta } = event;
  const ratio = (87 - beta) / 86
  const fv = (55 + (1705 * ratio)); // 5 octaves between C1 and C6
  osc.frequency.value = fv;
}

if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
  disabled = true;
  DeviceOrientationEvent.requestPermission().then(response => {
    if (response == 'granted') {
      window.addEventListener('deviceorientation', handler);
      init();
      osc.start(0);
      started = true;
      disabled = false;
    }
  }).catch(console.error)
}

const toggleSound = () => {
  if (disabled) {

  } else {
    if (muted) {
      if (!started) {
          window.addEventListener('deviceorientation', handler);
          init();
          osc.start(0);
          started = true;
      }
      lvl.gain.value = 1;
      muted = false;
      btn.classList.add('active');
      btn.innerHTML = 'Turn that shit off!';

    } else {
      lvl.gain.value = 0;
      muted = true;
      btn.classList.remove('active');
      btn.innerHTML = 'Start';
    }
  }
}

window.toggleSound = toggleSound;