var sketch;
let isFrontControllerConnected = false;
let isBackControllerConnected = false;
let targetImage
let arrow;

function preload() {
    targetImage = loadImage('https://raw.githubusercontent.com/DamonYuXXX/ArcheryGame/main/asserts/target.png');
    arrow = loadModel('https://raw.githubusercontent.com/DamonYuXXX/ArcheryGame/main/asserts/Arrow.obj', true);
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
    scale(3);
    push()
    //ground
    translate(0, 300, -200);
    rotateY(frameCount);
    fill(255);
    box(3000, 3, 20);
    fill('green');
    box(3000, 2, 3000);

    //stand
    translate(-100, -200, -33);
    rotateX(10);
    fill('#966F33');
    box(20, 600 ,20);
    translate(200, 0, 0);
    box(20, 600 ,20);
    translate(-100, 100, 0);
    box(200, 20 ,20);

    translate(-100, -30, -80);
    rotateX(-30);
    box(20, 300 ,20);
    translate(200, 0, 0);
    box(20, 300 ,20);

    //target holder
    translate(0, -70, 60);
    rotateX(30);
    box(20, 20 ,30);
    translate(-200, 0, 0);
    box(20, 20 ,30);

    //target
    translate(100, -210, 0);
    fill(255);
    texture(targetImage);
    box(400, 400, 20);
    translate(0, 0, 75);
    drawArrow();
    translate(10, 0, 0);
    drawArrow();
    translate(-20, 0, 0);
    drawArrow();
    pop();
}

function drawArrow() {
    push();
    //rotateX(-10);
    rotateY(90);
    fill('red');
    scale(0.8);
    model(arrow);
    pop();
    /*
    push();
    fill(255);
    cylinder(0.5,40);
    translate(0, 20.5, 0)
    cone(0.5, 1);
    pop();*/
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
  