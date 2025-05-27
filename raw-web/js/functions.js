function centerOutwardReorder(arr) {
    const result = [];
    const mid = Math.floor(arr.length / 2);

    result.push(arr[mid]);

    for (let offset = 1; mid - offset >= 0 || mid + offset < arr.length; offset++) {
        if (mid - offset >= 0) result.push(arr[mid - offset]);
        if (mid + offset < arr.length) result.push(arr[mid + offset]);
    }

    return result;
}

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