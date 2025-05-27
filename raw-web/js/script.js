const sphereRadius = 500;
const Z_ORIGIN = -0;
const initialIndexesMatrix = [
    [-3, -2, -1, 0, 1, 2, 3],
    [-3, -2, -1, 0, 1, 2, 3],
    [-3, -2, -1, 0, 1, 2, 3],
    [-3, -2, -1, 0, 1, 2, 3],
    [-3, -2, -1, 0, 1, 2, 3],
    [-3, -2, -1, 0, 1, 2, 3],
    [-3, -2, -1, 0, 1, 2, 3],
]
const angleStep = 12;

var mouseDown = false;

let panels = document.querySelectorAll(".panel");

let panelGlobalRotation = {x:0, y:0};

let panelsBasePositions = [];
let panelsBaseRotation = [];

for (let i = 0; i < initialIndexesMatrix.length; i++) {
    for (let j = 0; j < initialIndexesMatrix[i].length; j++) {
        let initialIndex = {
            h : initialIndexesMatrix[i][j],
            v : i - (initialIndexesMatrix.length >> 1),
        }

        let angleStepRad = degreesToRadians(angleStep);
        
        let x = sphereRadius * Math.sin(angleStepRad * initialIndex.h) * Math.cos(angleStepRad * initialIndex.v);
        let y = sphereRadius * Math.sin(angleStepRad * initialIndex.v);
        let z = sphereRadius * Math.cos(angleStepRad * initialIndex.h) * Math.cos(angleStepRad * initialIndex.v) + Z_ORIGIN;

        panelsBaseRotation.push({
            x: - initialIndex.v * angleStep,
            y: initialIndex.h * angleStep
        });
        panelsBasePositions.push({x, y, z});
    }
}

panelsBaseRotation = centerOutwardReorder(panelsBaseRotation);
panelsBasePositions = centerOutwardReorder(panelsBasePositions);
// console.log(panelsBasePositions);

function updatePanels() {
    panels.forEach((panel, index) => {
        let t = rotateYThenX(panelsBasePositions[index], panelGlobalRotation.y, panelGlobalRotation.x);
        // console.log(t);
        t.x -= 50;
        t.y -= 50;
        panel.style.transform = `
        translateX(${t.x}px)
        translateY(${t.y}px)
        translateZ(${t.z}px)
        rotateX(${panelsBaseRotation[index].x+panelGlobalRotation.x}deg)
        rotateY(${panelsBaseRotation[index].y+panelGlobalRotation.y}deg)
        `
        panel.style.zIndex = Math.round(t.z);
    })
}

updatePanels();

function update() {
    updatePanels();
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

panSection.addEventListener('mousedown', (e) => {
    mouseDown = true;
    panSection.style.cursor = "grabbing";
});

panSection.addEventListener('mouseup', (e) => {
    mouseDown = false;
    panSection.style.cursor = "grab";
});

panSection.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    let deltaX = e.movementX;
    let deltaY = -e.movementY;
    panelGlobalRotation.x += deltaY * 0.1;
    panelGlobalRotation.y += deltaX * 0.1;
});