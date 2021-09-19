var loading = true;
var brush;
function preload() {
  AnthaAudio.initialize(function() { loading = false; });
  lightBrush = loadImage('images/brush_light.png');
  darkBrush = loadImage('images/brush_dark.png');
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('veil');
  background(71, 31, 27);
}

var power = {
  p: 0,
  y: 0,
  n: 0,
  k: 0
};
direction = 1;
deltaPower = 3;

var stimulate = function(x, y) {
  var channel = [['p', 'y'],
                 ['n', 'k']][
                   Math.floor(mouseY * 2 / height)
                 ][
                   Math.floor(mouseX *2 / width)
                 ];

  // ignore the corners of each channel
  var relX = (mouseX % (width / 2)) * 5 / (width / 2);
  var relY = (mouseY % (height / 2)) * 5 / (height / 2);
  if ((relX === 0 || relX === 4) && (relY === 0 || relY === 4)) return;

  // adjust volume
  power[channel] += deltaPower;
  power[channel] = Math.max(0, power[channel]);
  AnthaAudio.p.volume(power.p / 1000);
  AnthaAudio.y.volume(power.y / 1000);
  AnthaAudio.n.volume(power.n / 1000);
  AnthaAudio.k.volume(power.k / 1000);

  // adjust velocity
  var magnitude = Math.max(power.p, power.y, power.n, power.k);
  if (magnitude > 900) direction = -1;
  if (magnitude < 150) direction = 1;
  deltaPower = direction * (Math.floor(magnitude / 100) + 3);
};

var paint = _.debounce(function() {
  stimulate(mouseX, mouseY);

  var brush = (direction === 1 ? lightBrush : darkBrush);
  image(brush,
        mouseX - brush.width / 2,
        mouseY - brush.height / 2);
}, 10);

function mouseMoved() {
  if (!loading) paint();
}
