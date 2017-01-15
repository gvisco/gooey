var canvas;
var ctx;

var borderSlider;

var entities = [];
var mX = 0;
var mY = 0;

var borderThreshold = 150;

function setup() {
    canvas = createCanvas(640, 480);
    canvas.parent('myCanvas');
    ctx = canvas.drawingContext;

    textSize(15);

    borderSlider = createSlider(101, 255, 120, 1);
    borderSlider.position(20, 20);
    borderSlider.input(onBorderSliderMoved);

    frameRate(30);

    noStroke();
    //noLoop();

    pixelDensity(1);
}

function draw() {
    background(255);

    tmp = [];
    for (var i = 0; i < entities.length; i++) {
        e = entities[i]
        if (e.update()) {
            e.draw();

            tmp.push(e);
        }
    }

    entities = tmp;

    loadPixels();

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            var r = (i + j * width) * 4;
            var g = r + 1;
            var b = g + 1;
            if (pixels[r] < 100) { // bubble
                pixels[r] = 135;
                pixels[g] = 199;
                pixels[b] = 191;
            } else if (pixels[r] < borderThreshold) { // border
                pixels[r] = 22;
                pixels[g] = 147;
                pixels[b] = 165;
            } else { // background
                pixels[r] = 98;
                pixels[g] = 182;
                pixels[b] = 182;
            }
        }
    }

    updatePixels();

    text("Border", 165, 35);

    //print(entities.length);
}

function onBorderSliderMoved() {
    borderThreshold = borderSlider.value();
}

function mouseClicked() {
    e = new Entity(mouseX, mouseY, random(20, 75), [0, 0]);
    entities.push(e);
    //redraw();

    return false;
}

function mouseMoved() {
    s = 10 + Math.min(magnitude(mouseX - mX, mouseY - mY), 50);
    mov = normalize(mouseX - mX, mouseY - mY);
    e = new Entity(mouseX, mouseY, s, mov);
    entities.push(e);

    mX = mouseX;
    mY = mouseY;

    return false;
}

function magnitude(x, y) {
    return sqrt(x * x + y * y);
}

function normalize(x, y) {
    m = magnitude(x, y);
    return [x / m, y / m];
}

function Entity(_x, _y, _size, _mov) {
    this.x = _x;
    this.y = _y;
    this.size = _size;

    k = random(0.1, 2.0);
    this.vel_x = _mov[0] * k;
    this.vel_y = _mov[1] * k;
}



Entity.prototype.update = function() {
    this.x = this.x + this.vel_x
    this.y = this.y + this.vel_y

    this.size = this.size - 0.2;

    size_condition = this.size > 0;
    x_condition = this.x > -this.size && this.x <= (width + this.size);
    y_condition = this.y > -this.size && this.y <= (height + this.size);
    return  size_condition && x_condition && y_condition;
}

Entity.prototype.draw = function() {
    var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,255)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;

    ellipse(this.x, this.y, this.size, this.size);
}