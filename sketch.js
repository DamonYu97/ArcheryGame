var sketch;
let isConnected = false;

function setup() {
    sketch = createCanvas(windowWidth, windowHeight, WEBGL);
    sketch.class("sketch-style");
    sketch.position(0, 0, 'static');
    sketch.parent('sketch_parent');
    button = createButton('Pair Controllers');
    button.position(200, 200);
    button.mousePressed(pariConntroller);
}

function draw() {
    background(100);

}

function pariConntroller() {
    microBitConnect();
}

function microBitReceivedMessage(message){
    console.log(message);

}
  