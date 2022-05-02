var sketch;
let isFrontControllerConnected = false;
let isBackControllerConnected = false;
let targetImage

function preload() {
    targetImage = loadImage('/asserts/target.png');
}

function setup() {
    sketch = createCanvas(windowWidth, windowHeight, WEBGL);
    sketch.class("sketch-style");
    sketch.position(0, 0, 'static');
    sketch.parent('sketch_parent');
    angleMode(DEGREES);
    /*button = createButton('Pair Controllers');
    button.position(200, 200);
    button.mousePressed(pariConntroller);*/
}

function draw() {
    background(200);
    push()
    //ground
    translate(0, 300, 0);
    rotateX(-20);
    rotateY(frameCount);
    fill(255);
    box(windowWidth*2, 3, 20);
    fill('green');
    box(windowWidth*2, 2, windowWidth*2);

    //stand
    translate(-100, -200, -80);
    rotateX(20);
    fill('#966F33');
    box(20, 400 ,20);
    translate(200, 0, 0);
    box(20, 400 ,20);
    translate(-100, 100, 0);
    box(200, 20 ,20);

    translate(-100, -30, -70);
    rotateX(-40);
    box(20, 200 ,20);
    translate(200, 0, 0);
    box(20, 200 ,20);

    //target holder
    translate(0, -70, 60);
    rotateX(40);
    box(20, 20 ,30);
    translate(-200, 0, 0);
    box(20, 20 ,30);

    //target
    translate(100, -160, 0);
    fill(255);
    texture(targetImage);
    box(300, 300, 20);
    
    pop();
}

function pariConntroller() {
    console.log(isFrontControllerConnected);
    microBitConnect();
}

function microBitReceivedMessage(message){
    console.log(message);
    if (message == undefined || message == null) {
        return;
    }
    if (!isFrontControllerConnected) {
        microBitWriteString("FA");
    }
    if (!isBackControllerConnected) {
        microBitWriteString("BA");
    }
    message.trim();
    if (message.length == 1 && message.charAt(0) == 'F') {
        isFrontControllerConnected = true;
    } 
}
  