function calculerPointIntersection(xRotationDegres, yRotationDegres) {
    // Paramètres de la sphère
    const cc = { x: 0, y: 0, z: -200 };
    const cr = 200;
    
    // Conversion des degrés en radians
    const xr = xRotationDegres * Math.PI / 180;
    const yr = yRotationDegres * Math.PI / 180;
    
    // Calcul du vecteur directeur après les rotations GLOBALES
    // Vecteur initial: (0, 0, 1)
    // Rotations globales: X puis Y par rapport aux axes fixes
    // Résultat de Ry × Rx × (0,0,1):
    const vecteurDirecteur = {
        x: Math.cos(xr) * Math.sin(yr),
        y: -Math.sin(xr),
        z: Math.cos(xr) * Math.cos(yr)
    };
    
    // Point d'intersection pour t = +cr (côté positif)
    const pointIntersection = {
        x: cc.x + cr * vecteurDirecteur.x,
        y: cc.y + cr * vecteurDirecteur.y,
        z: cc.z + cr * vecteurDirecteur.z
    };
    
    return pointIntersection;
}

function calculerRotationsPlan(xa, ya, za) {
    // Centre de la sphère
    const cc = { x: 0, y: 0, z: -200 };
    
    // Étape 1: Calculer le vecteur normal à la sphère au point A
    const vecteurNormal = {
        x: xa - cc.x,        // xa - 0 = xa
        y: ya - cc.y,        // ya - 0 = ya
        z: za - cc.z         // za - (-200) = za + 200
    };
    
    // Étape 2: Calculer la norme du vecteur pour normalisation
    const norme = Math.sqrt(
        vecteurNormal.x * vecteurNormal.x +
        vecteurNormal.y * vecteurNormal.y +
        vecteurNormal.z * vecteurNormal.z
    );
    
    // Vérification pour éviter division par zéro
    if (norme === 0) {
        return { rx: 0, ry: 0, rxDegres: 0, ryDegres: 0 };
    }
    
    // Étape 3: Normaliser le vecteur
    const nx = vecteurNormal.x / norme;
    const ny = vecteurNormal.y / norme;
    const nz = vecteurNormal.z / norme;
    
    return {
        y :  Math.atan2(nx, nz) * (180 / Math.PI),
        x : -Math.asin(ny) * (180 / Math.PI),
    }
    // const rotationY = Math.atan2(nx, nz) * (180 / Math.PI);
    // const rotationX = -Math.asin(ny) * (180 / Math.PI);
}

function rotationPointSurSphere(x, y, z, rsxDegres, rsyDegres) {
    // Centre de la sphère
    const cc = { x: 0, y: 0, z: -200 };
    
    // Conversion des degrés en radians
    const rsx = rsxDegres * Math.PI / 180;
    const rsy = rsyDegres * Math.PI / 180;
    
    // Étape 1: Translater le point vers l'origine (relatif au centre de la sphère)
    const pointRelatif = {
        x: x - cc.x,  // x - 0 = x
        y: y - cc.y,  // y - 0 = y
        z: z - cc.z   // z - (-200) = z + 200
    };
    
    // Étape 2: Appliquer les rotations (Ry × Rx)
    // Rotation combinée X puis Y dans le système global
    const pointTransforme = {
        x: pointRelatif.x * Math.cos(rsy) + pointRelatif.z * Math.sin(rsy),
        y: pointRelatif.y * Math.cos(rsx) - pointRelatif.z * Math.sin(rsx) * Math.cos(rsy) + pointRelatif.x * Math.sin(rsx) * Math.sin(rsy),
        z: -pointRelatif.x * Math.sin(rsy) + pointRelatif.y * Math.sin(rsx) * Math.cos(rsy) + pointRelatif.z * Math.cos(rsx) * Math.cos(rsy)
    };
    
    // Étape 3: Translater le point transformé vers sa position finale
    const pointFinal = {
        x: pointTransforme.x + cc.x,  // + 0
        y: pointTransforme.y + cc.y,  // + 0
        z: pointTransforme.z + cc.z   // + (-200)
    };
    
    return pointFinal;
}


// const INITIAL_X_ROTATIONS = [180, 135, 225, 90, 270, 45, 315, 0, 360];
const INITIAL_ROTATIONS = [
    {x:0, y:0, z:0},
    {x:45, y:10, z:-10},
    {x:90, y:0, z:0},
    // {x:0, y:135, z:0},
    // {x:0, y:225, z:0},
    // {x:45, y:0, z:0},
    // {x:90, y:0, z:0},
    {x:0, y:90, z:0},
];


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

initial_positions = panelsRotation.map((r, k) => {
    let t = calculerPointIntersection(r.x, r.y);
    return {
        x: t.x,
        y: t.y,
        z: t.z,
    };
});

sphereRotation = {
    x: 0,
    y: 0,
}



function updatePanels() {
    panels.forEach((panel, k) => {
        let ix = initial_positions[k].x;
        let iy = initial_positions[k].y;
        let iz = initial_positions[k].z;
        let t = rotationPointSurSphere(ix, iy, iz, sphereRotation.x, sphereRotation.y);
        let r = calculerRotationsPlan(t.x, t.y, t.z);
        t.x -= 50;
        t.y -= 50;
        panel.style.transform = `
            translateX(${t.x}px)
            translateY(${t.y}px)
            translateZ(${t.z}px)
            rotateX(${r.x}deg)
            rotateY(${r.y}deg)
            `
        panel.style.zIndex = Math.round(t.z * 10);
    });
}


// Apply base transform
updatePanels();

let curInd = 0;

function process() {
    updatePanels();
    sphereRotation = {
        x: sphereRotation.x + 0,
        y: sphereRotation.y + 1,
    };
    requestAnimationFrame(process);
}

requestAnimationFrame(process);

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}