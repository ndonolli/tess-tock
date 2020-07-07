class Toggler  {
  constructor() {
    this.btn = document.querySelector('#main-btn');
    this._muted = true;
  }

  toggle() {
    if (this._muted) {
      this._muted = false;
      this.btn.classList.add('active');
      this.btn.innerHTML = 'Turn that shit off!';

    } else {
      this._muted = true;
      this.btn.classList.remove('active');
      this.btn.innerHTML = 'Start';
    }
  }

  get muted () {
    return this._muted;
  }

}

class Theremin {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audio = new AudioContext();
    this.osc = this.audio.createOscillator();
    this.lvl = this.audio.createGain();
  }


  _handler() {
    const { beta } = event;
    const ratio = (87 - beta) / 86
    const fv = (55 + (1705 * ratio)); // 5 octaves between C1 and C6
    this.osc.frequency.value = fv;
  }

  init() {
    this.lvl.gain.value = 1;
    this.osc.connect(this.lvl);
    this.osc.start(0);
  }

  start() {
    this.lvl.connect(this.audio.destination);
  }

  stop() {
    this.lvl.disconnect(this.audio.destination);
  }

  register() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response == 'granted') {
          window.addEventListener('deviceorientation', this._handler.bind(this));
        }
      }).catch(console.error)
    } else {
      window.addEventListener('deviceorientation', this._handler.bind(this));
    }
  }
}

let theremin;
let toggler = new Toggler();

const clickHandler = () => {
  if (!theremin) {
    theremin = new Theremin();
    theremin.init();
    theremin.register();
  }
  toggler.muted ? theremin.start() : theremin.stop();
  toggler.toggle();
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.prompt();
  e.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('Thank you!')
    }
  })
});

window.app = {
  clickHandler
};