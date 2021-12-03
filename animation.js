var previousTimestamp;
function drawAnimated(timeStamp, mainContext) {
    // calculate time in ms since last call
    if(previousTimestamp == undefined) {
        previousTimestamp = timeStamp;
    }
    const elapsed = timeStamp - previousTimestamp;
    //console.log("Last Call: " + previousTimestamp + " Current Call: " + timeStamp + " Elapsed: " + elapsed);

    // move or change objects
    if(elapsed!==0) {
        mainContext.solidCubeRight.rotation += mainContext.solidCubeRight.rotationSpeed.rad * elapsed;
        mainContext.solidCubeLeft.rotation += mainContext.solidCubeLeft.rotationSpeed.rad * elapsed;
        mainContext.solidSphere.rotation += mainContext.solidSphere.rotationSpeed.rad * elapsed;
    }

    mainContext.draw();
    previousTimestamp = timeStamp;
    window.requestAnimationFrame((timestamp) => drawAnimated(timestamp, mainContext));
}