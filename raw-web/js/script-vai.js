const BASE_PANELS_TRANSFORMS = "translate(-50%, -50%) ";

// Fonction pour générer les positions sur une sphère avec la méthode Fibonacci
function generateFibonacciSpherePositions(count, radius = 200) {
    const positions = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < count; i++) {
        // Angle vertical (latitude)
        const theta = Math.acos(1 - 2 * i / count);
        
        // Angle horizontal (longitude) basé sur le ratio d'or
        const phi = 2 * Math.PI * i / goldenRatio;
        
        // Conversion en coordonnées cartésiennes
        const x = radius * Math.sin(theta) * Math.cos(phi);
        const y = radius * Math.cos(theta);
        const z = radius * Math.sin(theta) * Math.sin(phi);
        
        positions.push({x, y, z});
    }
    
    return positions;
}

var mouseDown = false;
var circleRadius = 200;

let panSection = document.querySelector("#panSection");
let panels = document.querySelectorAll(".panel");

// Générer les positions initiales basées sur le nombre réel de panneaux
const INITIAL_POSITIONS = generateFibonacciSpherePositions(panels.length, circleRadius);

let panelsRotation = INITIAL_POSITIONS.map(pos => ({x: 0, y: 0}));

function updatePanels() {
    panels.forEach((panel, index) => {
        // Vérifier que la position existe (sécurité supplémentaire)
        if (!INITIAL_POSITIONS[index] || !panelsRotation[index]) {
            console.warn(`Position manquante pour le panneau ${index}`);
            return;
        }
        
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
        `;
    });
}

updatePanels();

function update() {
    updatePanels();
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

    return {x: x2, y: y2, z: z2};
}

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
    panelsRotation.forEach((rotation, index) => {
        rotation.x += deltaY * 0.1;
        rotation.y += deltaX * 0.1;
    });
});

console.log('Positions générées:', INITIAL_POSITIONS);
console.log('Nombre de panneaux:', panels.length);