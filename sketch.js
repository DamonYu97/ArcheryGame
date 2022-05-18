var sketch;
let isFrontControllerConnected = false;
let isBackControllerConnected = false;
let targetImage;
let arrow;
let bow;
let video;
let handpose;
let handPosition = {
    x: 0,
    y: 0
};
let distance = 0;
let targetZ = 0;
let arrowsInTarget = [];
let state = 'pair';
let loosePosition;
let textScreen;
let modeRoomScreen;
let practiceScreen;
let easyScreen;
let middleScreen;
let hardScreen;
let transitionCount = 0;
let pairButton;
let lastTime;
let textDiv;
let currentSelectedMode = 'practice';
let modeSelectIndex = 0;
let light = 255;
let footprint;
let buttonCode;
let isShooting = false;
let arrowsLeft = 2;
const arrowYOffset = -250;
let telescopeOn = false;
let hitSound;
let looseSound;
let missSound;
let YSpeed = 1;
const gravity = 9;
let strength = 0;
let isDrawing = false;
const arrowColor = '#F487A5';
const arrowShootFrom = 800;
let scoresDiv;
let score = 0;
let shootsNumDiv;
let shootsNum = 0;
let targetCenter = {
    x: 0,
    y: -70
};
let arrowPositionBuffer = [];
let avgArrowPosition;
let bufferSize = 0;

function preload() {
    soundFormats('mp3');
    hitSound = loadSound('https://damonyuxxx.github.io/files/ArcheryGame/hit');
    missSound = loadSound('https://damonyuxxx.github.io/files/ArcheryGame/miss');
    looseSound = loadSound('https://damonyuxxx.github.io/files/ArcheryGame/loose');
    targetImage = loadImage('https://damonyuxxx.github.io/files/ArcheryGame/target.png');
    footprint = loadImage('https://damonyuxxx.github.io/files/ArcheryGame/footprint.png');
    arrow = loadModel('https://damonyuxxx.github.io/files/ArcheryGame/Arrow.obj', true);
    bow = loadModel('https://damonyuxxx.github.io/files/ArcheryGame/bow.obj', true);
}

function setup() {
    sketch = createCanvas(windowWidth, windowHeight, WEBGL);
    sketch.class("sketch-style");
    sketch.position(0, 0, 'static');
    sketch.parent('sketch_parent');
    textScreen = createGraphics(700,300);
    textScreen.background(255, 149, 88, 200);


    practiceScreen = createGraphics(550,200);
    practiceScreen.background(255);
    practiceScreen.textSize(60);
    practiceScreen.text('Practice Room', 80, 120);

    easyScreen = createGraphics(550,200);
    easyScreen.background(255);
    easyScreen.textSize(60);
    easyScreen.text('Easy Mode Room', 40, 120);

    middleScreen = createGraphics(550,200);
    middleScreen.background(255);
    middleScreen.textSize(60);
    middleScreen.text('Middle Mode Room', 20, 120);

    hardScreen = createGraphics(550,200);
    hardScreen.background(255);
    hardScreen.textSize(60);
    hardScreen.text('Hard Mode Room', 40, 120);

    angleMode(DEGREES);
    pairButton = createButton('Pick up your bow and arrows');
    pairButton.class('pairBtn');
    pairButton.position(width / 2 - 200, height / 2 -50);
    pairButton.mousePressed(pariConntroller);
}

function loose() {
    isShooting = true;
    loosePosition = {
        x: avgArrowPosition.x,
        y: avgArrowPosition.y,
        z: arrowShootFrom + distance * 3
    }
    YSpeed = 1 + distance / 5;
    lastTime = millis();
}

function draw() {
    background(255);
    //scale(1);
    if (state == 'pair') {
        light = 220;
        //draw pair scene
        drawPairScene();
        //pair succeed
        if (isFrontControllerConnected && isBackControllerConnected && lastTime === undefined) {
            pairButton.remove();
            transitionCount = 0;
            lastTime = millis();
            console.log(lastTime);
            textDiv = createDiv('Your equipments are ready!<br>Now enter a room');
            textDiv.class('infoText')
            textDiv.position(width / 2 - 230, height / 2 + 0);
        }
        if (lastTime != undefined) {
            if (millis() - lastTime < 4000) {
            } else {
                textDiv.remove();
                textScreen.remove();
                state = 'pair-modeSelect';
            }
        }
    } else if (state == 'pair-modeSelect') {
        transitionCount++;
        const degree = -90 + transitionCount;
        if (degree != 0) {
            rotateX(degree);
        } else {
            modeSelectIndex = 0;
            state = 'modeSelect';
            transitionCount = 0;
        }
    } else if (state == 'modeSelect') {
        arrowsLeft = 2;
        arrowsInTarget = [];
        if (shootsNumDiv != undefined) {
            shootsNum = 0;
            shootsNumDiv.remove();
        }
        if (scoresDiv != undefined) {
            score = 0;
            scoresDiv.remove();
        }
        const offset = transitionCount - 300;
        if (buttonCode === 'L' && offset === 0) {
            transitionCount = 0;
            state = 'select-start';
            buttonCode = '';
        }
        if (modeSelectIndex == 0) {
            modeRoomScreen = practiceScreen;
            currentSelectedMode = 'practice';
        } else if (modeSelectIndex == 1) {
            modeRoomScreen = easyScreen;
            currentSelectedMode = 'easy';
        } else if (modeSelectIndex == 2) {
            modeRoomScreen = middleScreen;
            currentSelectedMode = 'middle';
        } else if (modeSelectIndex == 3) {
            modeRoomScreen = hardScreen;
            currentSelectedMode = 'hard';
        }
        if (buttonCode === 'A') {
            modeSelectIndex++;
            if (modeSelectIndex > 3) {
                modeSelectIndex = 3;
            }
            buttonCode = '';
        } else if (buttonCode === 'B') {
            modeSelectIndex--;
            if (modeSelectIndex < 0) {
                modeSelectIndex = 0;
            }
            buttonCode = '';
        }

        if (offset < 0) {
            transitionCount += 4;
        }
        push();
        translate(0, -200 + offset, 0);
        //rotateY(frameCount);
        push();
        translate(-100, -200, 0);
        box(20, 200, 20);
        pop();
        push();
        translate(100, -200, 0);
        box(20, 200, 20);
        pop();
        push();
        translate(0, 0, 0);
        texture(modeRoomScreen);
        box(500, 200, 20);
        pop();
        pop();
        //footprint button
        push()
        translate(0, 300, - offset);
        texture(footprint);
        noStroke();
        box(100, 5, 100);
        pop();
    } else if (state == 'select-start') {
        //console.log(buttonCode);
        light = 255;
        if (transitionCount < 300) {
            transitionCount += 4;
            translate(0, 0, transitionCount);
        } else {
            transitionCount = 0;
            state = 'start';

            if (video === undefined || video === null) {
                video = createCapture(VIDEO);
                translate(0, 0, 300);
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

            score = 0;
            shootsNum = 0;
            shootsNumDiv = createDiv('<span class="name">Shoots</span><span class="value">0</span>');
            shootsNumDiv.class('record');
            shootsNumDiv.position(width - 200, 50);
            scoresDiv = createDiv('<span class="name">Score</span><span class="value">0</span>');
            scoresDiv.class('record');
            scoresDiv.position(width - 200, 130);
        }
    } else if (state === 'start') {
        if (buttonCode === 'B') {
            buttonCode = '';
            telescopeOn = !telescopeOn;
        }
        if (buttonCode === 'C') {
            buttonCode = '';
            state = 'modeSelect';

        }
        if (telescopeOn) {
            if (currentSelectedMode === 'practice') {
                translate(0, 0, targetZ + 150);
            } else if (currentSelectedMode === 'easy') {
                translate(0, 0, targetZ + 600);
            } else if (currentSelectedMode === 'middle') {
                translate(0, 0, targetZ + 1000);
            } else if (currentSelectedMode === 'hard') {
                translate(0, 0, targetZ + 1500);
            }
        }
        if (isDrawing) {
            drawStrength();
        }
        drawRemainingArrows();

        //rotateY(90);
        translate(0, 0, 300);
    }
    translate(0, 300, -900);
    drawRoom(light, currentSelectedMode);
}

function drawStrength() {
    push();
    noStroke();
    translate(-500, -100);
    fill(255);
    plane(30, 320);
    if (distance <= 60) {
        strength = distance * 5;
    }
    translate(0, (320 - strength) / 2 - 10 );
    fill('red');
    plane(20, strength);
    pop();
}


function  drawRemainingArrows() {
    push();
    translate(-550, 200 );
    rotateZ(-90);
    scale(0.7);
    for (let i = 0; i < arrowsLeft - 1; i++) {
        fill(arrowColor);
        model(arrow);
        translate(0, 20, 0);
    }
    pop();
}

function drawPairScene() {
    rotateX(-90);
    push();
    translate(0, 0, -250);
    fill(200);
    textScreen.textSize(100);
    textScreen.fill(255);
    textScreen.text('Archery Game', 30, 170);
    texture(textScreen);
    noStroke();
    box(700, 10, 200);
    //bow
    stroke(0);
    push();
    translate(-300, -200, 350);
    rotateX(90);
    if (isFrontControllerConnected) {
        fill('blue');
    } else {
        rotateY(frameCount * 2);
        fill('gray');
        noStroke();
    }
    scale(1.3);
    model(bow);
    pop();
    //arrows
    push();
    translate(300, -200, 350);
    rotateX(90);
    rotateZ(-90);
    scale(1.2);
    if (isBackControllerConnected) {
        fill(arrowColor);
    } else {
        rotateX(-frameCount * 2);
        fill('gray');
        noStroke();
    }
    model(arrow);
    translate(0, 10, 0);
    model(arrow);
    translate(0, 10, 0);
    model(arrow);
    pop();
    pop();
}

function drawRoom(light, mode) {
    push();
    ambientLight(light);
    //room
    //ground
    fill(255);
    box(3000, 3, 20);
    fill(97, 178 ,216);
    box(3000, 2, 3000);
    //roof
    fill(255);
    translate(0, -1500, 0);
    box(3000, 20, 3000);
    translate(0, 1500, 0);
    //walls
    fill(255, 149, 88);
    translate(-1500, 0, 0);
    box(20, 3000, 3000);
    fill(255, 149, 88);
    translate(3000, 0, 0);
    box(20, 3000, 3000);
    fill(200,200,200, 200);
    translate(-1500, 0, -1500);
    box(3000, 3000, 20);
    //move to center
    translate(0, 0, 1500);
    push();
    if (mode === 'practice') {
        targetZ = 300;
    } else if (mode === 'easy') {
        targetZ = 0;
    } else if (mode === 'middle') {
        targetZ = -300;
    } else if (mode === 'hard') {
        targetZ = -600;
    }
    translate(0, 0, targetZ);
    drawTarget();
    pop();
    //draw all arrows in target
    for (let i = 0; i < arrowsInTarget.length; i++){
        const arrow = arrowsInTarget[i];
        //console.log(arrow);
        drawArrow(arrow.x, arrow.y, arrow.z);
    }

    if (state === "start") {
        stabiliseArrowPosition();
        if (arrowsLeft > 0) {
            if (buttonCode === 'dw') {
                //console.log(distance);
                if (!isDrawing) {
                    isDrawing = true;
                }

                drawArrow(avgArrowPosition.x, avgArrowPosition.y, arrowShootFrom + distance * 3);
                //drawArrow(width/2 - handPosition.x, handPosition.y - height/2 + arrowYOffset, arrowShootFrom + distance * 3);
            } else if (buttonCode === 'ls') {
                shootsNum++;
                shootsNumDiv.html('<span class="name">Shoots</span><span class="value">' + shootsNum + '</span>');
                console.log('loose!');
                isDrawing = false;
                looseSound.play();
                loose();
                buttonCode = '';
            }
        }
        /*if (arrowsLeft > 0 && buttonCode === 'dw') {
            //console.log(distance);
            drawArrow(width/2 - handPosition.x, handPosition.y - height/2 + arrowYOffset, 900 + distance * 3);
        } else if (buttonCode === 'ls') {
            looseSound.play();
            loose();
            buttonCode = '';
        }*/
        if (isShooting) {
            let currentArrowZ, offsetY;
            if (currentSelectedMode === 'practice') {
                currentArrowZ = loosePosition.z - (millis() - lastTime) / 50  * YSpeed;
                offsetY = gravity * Math.pow((millis() - lastTime) / 800, 2) / 2 ;
            } else {
                currentArrowZ = loosePosition.z - (millis() - lastTime) / 10 * YSpeed * 3;
                offsetY = gravity * Math.pow((millis() - lastTime) / 80, 2) / 2 ;
            }

            const currentArrowY = loosePosition.y + offsetY;
            const inTarget = isInTarget(loosePosition.x, currentArrowY);
            if (currentArrowZ < targetZ + 40) {
                if (inTarget || (!inTarget && currentArrowY > 200)) {
                    let arrow = {
                        x: loosePosition.x,
                        y: currentArrowY,
                        z: currentArrowZ
                    }
                    if (inTarget) {
                        if (arrow.z < targetZ - 50);
                        arrow.z = targetZ + 40;
                        hitSound.play();
                        //compute the score
                        let singleScore = 0;
                        const offset = Math.pow((arrow.x - targetCenter.x), 2) + Math.pow((arrow.y - targetCenter.y), 2);
                        if (offset < 20 * 20) {
                            singleScore = 10;
                        } else if (offset < 40 * 40) {
                            singleScore = 9;
                        } else if (offset < 60 * 60) {
                            singleScore = 8;
                        } else if (offset < 80 * 80) {
                            singleScore = 7;
                        } else if (offset < 100 * 100) {
                            singleScore = 6;
                        } else if (offset < 120 * 120) {
                            singleScore = 5;
                        } else if (offset < 140 * 140) {
                            singleScore = 4;
                        } else if (offset < 160 * 160) {
                            singleScore = 3;
                        } else if (offset < 180 * 180) {
                            singleScore = 2;
                        } else if (offset < 200 * 200) {
                            singleScore = 1;
                        }
                        score += singleScore;
                        scoresDiv.html('<span class="name">Score</span><span class="value">' + score + '</span>');
                    } else {
                        missSound.play();
                    }
                    arrowsInTarget.push(arrow);
                    console.log(arrowsInTarget);
                    arrowsLeft--;
                    isShooting = false;
                } else {
                    drawArrow(loosePosition.x, currentArrowY, currentArrowZ);
                }
            } else {
                if (currentArrowY > 200) {
                    missSound.play();
                    const arrow = {
                        x: loosePosition.x,
                        y: currentArrowY,
                        z: currentArrowZ
                    }
                    arrowsInTarget.push(arrow);
                    console.log(arrowsInTarget);
                    arrowsLeft--;
                    isShooting = false;
                } else {
                    drawArrow(loosePosition.x, currentArrowY, currentArrowZ);
                }
            }
        } else {
            if (buttonCode != 'dw' && arrowsLeft > 0) {
                drawArrow(avgArrowPosition.x, avgArrowPosition.y, arrowShootFrom + distance * 3);
                //drawArrow(width/2 - handPosition.x, handPosition.y - height/2 + arrowYOffset, arrowShootFrom);
            }
            if (arrowsLeft === 0 && buttonCode === 'A') {
                buttonCode = '';
                arrowsLeft = 2;
                arrowsInTarget = [];
            }
        }
    }
    pop();
}

function stabiliseArrowPosition() {
    //TODO stable
    const currentX = width/2 - handPosition.x;
    const currentY = handPosition.y - height/2 + arrowYOffset;
    console.log(currentY);
    arrowPositionBuffer[bufferSize % 10] = {
        x: currentX,
        y: currentY
    };
    bufferSize++;
    let total = {
        x: 0,
        y: 0
    }
    for (let i = 0; i < arrowPositionBuffer.length; i++) {
        total.x += arrowPositionBuffer[i].x;
        total.y += arrowPositionBuffer[i].y;
    }
    avgArrowPosition = {
        x: total.x / arrowPositionBuffer.length,
        y: total.y / arrowPositionBuffer.length
    }
    console.log('avgX: ' + avgArrowPosition.x + 'avgY: ' + avgArrowPosition.y);
}

function isInTarget(x, y) {
    return Math.abs(x - targetCenter.x) < 200 && Math.abs(y - targetCenter.y) < 200;
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
    fill(arrowColor);
    stroke('black');
    strokeWeight(0.2);
    scale(1.2);
    model(arrow);
    pop();
}

function pariConntroller() {
    console.log(isFrontControllerConnected);
    microBitConnect();
    //isFrontControllerConnected = true;
    //isBackControllerConnected = true;
}

function microBitReceivedMessage(message){
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
        //console.log(distance);
    }

    if (message.length == 2 ) {
        if (message.charAt(0) == 'b') {
            buttonCode = message.charAt(1);
        }
        if (message === 'dw' || message === 'ls') {
            buttonCode = message;
        }
    }
}
  