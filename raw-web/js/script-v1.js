const BASE_PANELS_TRANSFORMS = "translate(-50%, -50%) ";
// const INITIAL_X_ROTATIONS = [180, 135, 225, 90, 270, 45, 315, 0, 360];
const INITIAL_POSITIONS = [
    {x:0, y:0, z:200},
    {x:0, y:0, z:-200},
    {x:200, y:0, z:0},
    {x:-200, y:0, z:0},
    {x:0, y:200, z:0},
    {x:0, y:-200, z:0},
];

var mouseDown = false;

var circleRadius = 200;

// function getZIndexes(xRota) {
//     let zIndexes = [];
//     for (r of xRota) {
//         let rRad = {x: r.x * Math.PI / 180, y: r.y * Math.PI / 180};

//         let xProj = Math.cos(rRad.x);
//         let yProj = Math.cos(rRad.y) * xProj;
//         let zIndex = Math.round(yProj * 100); 
//         zIndexes.push(zIndex);
//     }
//     return zIndexes;
// }

let panSection = document.querySelector("#panSection");
let panels = document.querySelectorAll(".panel");
// let panelsRotation = [...INITIAL_ROTATIONS]
let panelsRotation = INITIAL_POSITIONS.map(pos => ({x: 0, y: 0}));
// let panelsPositions = INITIAL_POSITIONS.map(pos => ({x: pos.x, y: pos.y, z: pos.z}));

function updatePanels() {
    panels.forEach((panel, index) => {
        let initialPos = INITIAL_POSITIONS[index];
        let t = rotateYThenX(initialPos, panelsRotation[index].y, panelsRotation[index].x);
        t.x -= 100;
        t.y -= 100;
        panel.style.transform = `
        translateY(${t.y}px)
        translateX(${t.x}px)
        translateZ(${t.z}px)
        rotateX(${panelsRotation[index].x}deg)
        rotateY(${panelsRotation[index].y}deg)
        `
                // translate3D(-100px, -100px, ${0}px)

        // panel.style.zIndex = getZIndexes(panelsRotation)[index];
})
}

updatePanels();

function update() {
    updatePanels();

    // for (let i = 0; i < panelsRotation.length; i++) {
    //     panelsRotation[i].x += 1;
    //     panelsRotation[i].y += 1;
    // }

    requestAnimationFrame(update);
}
requestAnimationFrame(update);


function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function rotateYThenX(point, angleYDeg, angleXDeg) {
    const [x, y, z] = [point.x, point.y, point.z];

    // Convert angles to radians
    const angleY = degreesToRadians(angleYDeg);
    const angleX = degreesToRadians(angleXDeg);

    // Rotation around Y axis
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);

    const x1 = x * cosY + z * sinY;
    const y1 = y;
    const z1 = -x * sinY + z * cosY;

    // Rotation around X axis
    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);

    const x2 = x1;
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    // return [x2, y2, z2];
    return {x: x2, y: y2, z: z2};
}

panSection.addEventListener('mousedown' , (e) => {
    mouseDown = true;
    panSection.style.cursor = "grabbing";
})

panSection.addEventListener('mouseup' , (e) => {
    mouseDown = false;
    panSection.style.cursor = "grab";
});

panSection.addEventListener('mousemove' , (e) => {
    if (!mouseDown) return;
    let deltaX = e.movementX;
    let deltaY = -e.movementY;
    panelsRotation.forEach((rotation, index) => {
        rotation.x += deltaY * 0.1; // Adjust sensitivity as needed
        rotation.y += deltaX * 0.1; // Adjust sensitivity as needed
    });
});