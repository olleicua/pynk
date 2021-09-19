var tracks = 'pynk'.split('');

function AnthaLoop(label, callback) {
  // init
  var gain = AnthaAudio.context.createGain();
  var source = AnthaAudio.context.createBufferSource();
  var request = new XMLHttpRequest();
  source.loop = true;
  source.connect(gain);
  gain.gain.value = 0;
  gain.connect(AnthaAudio.context.destination);

  // load file
  request.open('GET', 'audio/' + label + '.wav', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    AnthaAudio.context.decodeAudioData(request.response, function(buffer) {
      source.buffer = buffer;
      console.log(label);
      callback();
    });
  };
  request.send();

  // expose controls
  this.start = function() { source.start(0); };
  this.stop = function() { source.stop(); };
  this.volume = function(value) { gain.gain.value = value; };
};

var AnthaAudio = {

  // Setup the looping audio tracks (initially silent)
  initialize: function(callback) {
    var that = this;

    if (!window.AudioContext && !window.webkitAudioContext) {
      console.error('this web browser will not work for this, try Firefox');
    } else {
      // create audio container with webkit fallback
      this.context = new (window.AudioContext || window.webkitAudioContext)();

      var allTracksLoaded = _.after(tracks.length, function() {
        for (var i = 0; i < tracks.length; i++) { that[tracks[i]].start(); }
        setTimeout(callback, 40);
      });

      // load loops
      for (var i = 0; i < tracks.length; i++) {
        var trackName = tracks[i];
        this[trackName] = new AnthaLoop(trackName, function() {
          allTracksLoaded();
        });
      }
    }
  },
};
