const BASE_PANELS_TRANSFORMS = "translate(-50%, -50%) ";
// const INITIAL_X_ROTATIONS = [180, 135, 225, 90, 270, 45, 315, 0, 360];
const INITIAL_ROTATIONS = [
    {x:0, y:0},
    {x:0, y:45},
    {x:0, y:90},
    {x:0, y:135},
    {x:0, y:225},
    {x:45, y:0},
    {x:90, y:0},
    {x:135, y:0},
];

const Z_TRANSLATE = 100;

let panels = document.querySelectorAll(".panel");
let panelsRotation = [...INITIAL_ROTATIONS]

function getZIndexes(xRota) {
    let zIndexes = [];
    for (r of xRota) {
        let rRad = {x: r.x * Math.PI / 180, y: r.y * Math.PI / 180};

        let xProj = Math.cos(rRad.x);
        let yProj = Math.cos(rRad.y) * xProj;
        let zIndex = Math.round(yProj * 100); 
        zIndexes.push(zIndex);
    }
    return zIndexes;
}





function updatePanels() {
    panels.forEach((panel, k) => {
        let xAng = panelsRotation[k].x;
        let yAng = panelsRotation[k].y;
        // panel.style.transform = `
        //     ${BASE_PANELS_TRANSFORMS} 
        //     rotateX(${xAng}deg) 
        //     rotate3d(0, ${Math.sin(xAng* Math.PI / 180)}, ${Math.cos(xAng* Math.PI / 180)}, ${yAng}deg)
        // `;
        const matrix = getRotationMatrix(xAng, yAng);
        const matrixStr = `matrix3d(${matrix.join(',')})`;

        panel.style.transform = `${BASE_PANELS_TRANSFORMS} ${matrixStr}`;
        panel.style.zIndex = getZIndexes(panelsRotation)[k];
    });
}


// Apply base transform
updatePanels();

let curInd = 0;

function process() {
    updatePanels();
    panelsRotation = panelsRotation.map((r, k) => {
        let newR = {...r, x:r.x+1, y:r.y};
        newR.x = newR.x % 360;
        newR.y = newR.y % 360;
        return newR;
    });
    requestAnimationFrame(process);
}

// requestAnimationFrame(process);

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

function getRotationMatrix(xDeg, yDeg) {
    const x = degreesToRadians(xDeg);
    const y = degreesToRadians(yDeg);

    const cx = Math.cos(x), sx = Math.sin(x);
    const cy = Math.cos(y), sy = Math.sin(y);

    // Rotation around X
    const Rx = [
        1, 0,  0, 0,
        0, cx, -sx, 0,
        0, sx, cx, 0,
        0, 0,  0, 1,
    ];

    // Rotation around Y
    const Ry = [
        cy, 0, sy, 0,
        0,  1, 0,  0,
        -sy,0, cy, 0,
        0,  0, 0,  1,
    ];

    // Multiply Ry * Rx (matrix multiplication)
    const result = new Array(16).fill(0);
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            for (let i = 0; i < 4; i++) {
                result[row * 4 + col] += Ry[row * 4 + i] * Rx[i * 4 + col];
            }
        }
    }

    return result;
}


