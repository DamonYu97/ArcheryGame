var sketch;
let isFrontControllerConnected = false;
let isBackControllerConnected = false;
let targetImage;
let arrow;
let video;
let handpose;
let handPosition = {
    x: 0,
    y: 0
};
let distance = 0;

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
    button = createButton('Pair Controllers');
    button.position(200, 200);
    button.mousePressed(pariConntroller);
    video = createCapture(VIDEO);
    video.size(width, height);
    handpose = ml5.handpose(video, () => {
        console.log("model loaded");
    });
    handpose.on("predict", results => {
        if (results.length > 0) {
            handPosition = {
                x: results[0].annotations.thumb[0][0] / 640 * width,
                y: results[0].annotations.thumb[0][1] / 480 * height
            }
            //console.log(handPosition);
        }
    })
    video.hide();
}

function draw() {

    ambientLight(255);
    background(200);
    //scale(1);
    push()
    //ground
    translate(0, 300, -500);
    //rotateY(90);
    fill(255);
    box(3000, 3, 20);
    fill('green');
    box(3000, 2, 3000);
    drawTarget();

    drawArrow(width/2 - handPosition.x, handPosition.y - height/2, 1000 + distance);
    pop();
    fill(0, 255, 0);
    push();
    translate(width/2 - handPosition.x, handPosition.y - height/2, 0);
    plane(10, 10);
    pop();

}

function drawTarget() {
    //stand
    push();
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
    pop();

}

function drawArrow(x, y, z) {
    push();
    translate(x, -300 + y, z);
    rotateX(-3);
    rotateY(90);
    fill('red');
    stroke('black');
    strokeWeight(0.2);
    scale(0.8);
    model(arrow);
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
    message = message.trim();
    if (!isFrontControllerConnected) {
        microBitWriteString("FA");
        if (message.length == 1 && message.charAt(0) == 'F') {
            isFrontControllerConnected = true;
        }
    }
    if (!isBackControllerConnected) {
        microBitWriteString("BA");
        if (message.length == 1 && message.charAt(0) == 'B') {
            isBackControllerConnected = true;
        }
    }

    if (message.length > 0 && message.charAt(0) == 'D') {
        distance = Number(message.substr(1));
        console.log(distance);
    }
}
  