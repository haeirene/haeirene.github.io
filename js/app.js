// Variables - coordinates
let prevX = 0;
let prevY = 0;
let prevXBackward = 0;
let prevYBackward = 0;

// Variables - screen
let centerWidth;
let centerHeight;

// Variables - drawing orbits
let drawCount = 0; //If drawcount = 0, we don't draw anymore.
let orbitCount = 1;
let isRefreshed = 0;
let thresholdOrbit = 8;
let isPaused = false;
let isBackwardDrawn = false;

// Variables - UX
let currentPos = thresholdOrbit;
let lastPos = 0;
let isForward = true;

// Variables = celestial objects
let numCelestialObjects = 0;
let celestialObjects = [];
let currentCelestialObjectId;
let currentCelestialObject;
let sun;
let mercury;
let venus;
let moon;
let mars;
let jupiter;
let saturn;
let uranus;
let neptune;
let pluto;

let bg;

// Variables - colors of the celestial objects
let cPalette;
let cWhite100;
let cBlack255;

let listOrbits = {};

function preload(){
    bg = loadImage("../data/events/images/bg.png");
}

let currentTimestamp = "1950-January";
let currentY = 0;
let currentM = 0;

function setup(){
    // Everything about the canvas & screen
    centerWidth = windowWidth / 2;
    centerHeight = windowHeight / 2;
    createCanvas(windowWidth, windowHeight);

    //Define colors
    cWhite100 = color(255, 255, 255);
    cBlack255 = color(29, 26, 27);

    // Declare all celestial objects
    // ID - name - filename - start line - end line - divideBy
    mercury = new Body(199, "mercury", '01_mercury.txt', 51, 10070, 1000000);
    venus = new Body(299, "venus", '02_venus.txt', 51, 10070, 1000000);
    moon = new Body(301, "moon", '03_moon.txt', 52, 70181, 1500);
    mars = new Body(499, "mars", '04_mars.txt', 55, 10072, 1000000);
    jupiter = new Body(599, "jupiter", "05_jupiter.txt", 54, 10071, 10000000/2);
    saturn = new Body(699, "saturn", "06_saturn.txt", 52, 10071, 10000000/2);
    uranus = new Body(799, "uranus", "07_uranus.txt", 52, 10071, 10000000);
    neptune = new Body(899, "neptune", "08_neptune.txt", 54, 10071, 20000000);
    pluto = new Body(999, "pluto", "09_pluto.txt", 50, 10068, 20000000);

    celestialObjects.push(mercury);
    celestialObjects.push(venus);
    celestialObjects.push(moon);
    celestialObjects.push(mars);
    celestialObjects.push(jupiter);
    celestialObjects.push(saturn);
    celestialObjects.push(uranus);
    celestialObjects.push(neptune);
    celestialObjects.push(pluto);

    numCelestialObjects = celestialObjects.length - 1;

    // TODO: randomize
    currentCelestialObjectId = 0;
    currentCelestialObject = celestialObjects[currentCelestialObjectId];

    resetDesign();
}

function draw(){
    // Check if the list is not empty.
    if(thresholdOrbit != 0 && listOrbits.length != 0){
        if(isForward){
            // We go forward in time
            if(drawCount < thresholdOrbit){
                drawOrbitForward(drawCount, cWhite100);
            }
            else{
                isPaused = true;
            }
        }
        // We go backward in time
        else{
            if(drawCount > thresholdOrbit){
                drawOrbitForward(drawCount, cBlack255);

                //Redraw
                if(!isBackwardDrawn){
                    for(let i = 0; i < thresholdOrbit; i++){
                        drawOrbitForward(i, cWhite100);
                    }
                }
            }
        }

        isBackwardDrawn = true;
    }
    // List of orbit coordinates is empty. Try again to get data.
    else{
        currentCelestialObject.getOrbitData();
        listOrbits = currentCelestialObject.getOrbits();
        getCurrentTimestamp();
    }
    
    if(!isPaused && isForward){
        drawCount++;
    }
    else if(!isPaused && !isForward){
        // DrawCount can never be lower than 0.
        if(drawCount > thresholdOrbit){
            drawCount--;
        }
    }
}

function drawOrbitForward(counter, c){
    let divideBy = currentCelestialObject.divideBy;
    let cPrevX;
    let cPrevY;
    let sw; //strokeWeight

    let x = listOrbits[counter]["xyz"]["x"] / divideBy + centerWidth;
    let y = listOrbits[counter]["xyz"]["y"] / divideBy + centerHeight;

    if(isForward){
        cPrevX = prevX;
        cPrevY = prevY;
        sw = 1.5;
    }
    else if(!isForward && c === cBlack255){
        cPrevX = prevX;
        cPrevY = prevY;
        sw = 3;
    }
    else{
        cPrevX = prevXBackward;
        cPrevY = prevYBackward;
        sw = 1.5;
    }

    // Draw all coordinates (except the first as a line)
    if(cPrevX != 0){
        stroke(c);
        strokeWeight(sw);
        line(cPrevX, cPrevY, x, y);
    }
        
    if(isForward){
        prevX = x;
        prevY = y;
    }
    else if(!isForward && c === cBlack255){
        prevX = x;
        prevY = y;
    }
    else{
        prevXBackward = x;
        prevYBackward = y;
    }
}

// Change the planet by correct mouseclick
function mouseClicked(event) {
    console.log(event);

    if(event.target){
        //Mozilla
        // let selectedElement = event.explicitOriginalTarget;
        // let parentElement = selectedElement.parentElement;
        // let selectedCelestialObject = selectedElement.className;

        // Google chrome
        //let selectedElement = event.target.className;
        let parentElement = event.srcElement.parentElement;
        let selectedCelestialObject = event.target.className;

        switch(selectedCelestialObject) {
            case 'mercury':
                currentCelestialObjectId = 0;
                break;
            case 'venus':
                currentCelestialObjectId = 1;
                break;
            case 'moon':
                currentCelestialObjectId = 2;
                break;
            case 'mars':
                currentCelestialObjectId = 3;
                break;
            case 'jupiter':
                currentCelestialObjectId = 4;
                break;
            case 'saturn':
                currentCelestialObjectId = 5;
                break;
            case 'uranus':
                currentCelestialObjectId = 6;
                break;
            case 'neptune':
                currentCelestialObjectId = 7;
                break;
            case 'pluto':
                currentCelestialObjectId = 8;
                break;
            default:
                currentCelestialObjectId = 0;
                break;
            }
        
            currentCelestialObject = celestialObjects[currentCelestialObjectId];
            
            //Change appearance in menu
            let currentCelestialBody = document.querySelector(".celestial_body---selected");

            if(currentCelestialBody){
                currentCelestialBody.classList.remove("celestial_body---selected");
            }

            parentElement.classList.add("celestial_body---selected");

            resetDesign();
    }
}

// Basic setup when changing screens or layout
function resetDesign(){
    // Reset all the variables
    drawCount = 0;
    centerWidth = windowWidth / 2;
    centerHeight = windowHeight / 2;
    orbitCount = 0;
    prevX = 0;
    prevY = 0;
    prevXBackward = 0;
    prevYBackward = 0;

    background(bg);

    fill(0, 177, 255);
    noStroke();
    circle(centerWidth, centerHeight, 25);

    // Orbit data
    currentCelestialObject.getOrbitData();
    listOrbits = currentCelestialObject.getOrbits();
}

// Resize the window
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

    if(isRefreshed === 0){
        resetDesign();
        isRefreshed = 255;
    }
    else{
        currentCelestialObject = currentCelestialObject;
        currentCelestialObject.getOrbitData();
        listOrbits = currentCelestialObject.getOrbits();
        isRefreshed = 0;
    }
}

// mouseWheel() = triggers when a scroll through mousewheel or touchpad is detected
function mouseWheel() {
    getCurrentTimestamp();
}

function getCurrentTimestamp(){
    let newTimestampElement;
    let date;
    let currentTM;

    //Different threshold for the moon
    try{
        newTimestampElement = document.querySelector(".timeline___month---current").getAttribute('id');
        date = newTimestampElement.split("-");
        currentTM = parseInt(date[2]);

        if(currentCelestialObject.name === "moon"){
            thresholdOrbit = currentTM * 30;
        }
        else{
            // 1 month = 4 section of orbits. Each section consists of 2 lines so 8.
            thresholdOrbit = currentTM * 8;
        }
    }
    catch(error){
        newTimestampElement = document.querySelector(".timeline___month---current").getAttribute('id');
        date = newTimestampElement.split("-");
        currentTM = parseInt(date[2]);

        if(currentCelestialObject === undefined){
            currentCelestialObject = celestialObjects[0];
            console.log(newTimestampElement);
            //thresholdOrbit = currenTM;
        }
        else{
            // 1 month = 4 section of orbits. Each section consists of 2 lines so 8.
            thresholdOrbit = currentTM * 8;
        }
    }

    // Detect forward or backward scroll
    if(currentPos < thresholdOrbit){
        isForward = true;
    }
    // As the scroll is a bit too sensitive, check if the scroll has actually changed something. If not, be the same.
    else if(currentPos === thresholdOrbit){
        isForward = isForward;
    }
    else{
        isForward = false;
        isBackwardDrawn = false;
    }

    isPaused = false;
    currentPos = thresholdOrbit;
    prevXBackward = 0;
    prevYBackward = 0;
}