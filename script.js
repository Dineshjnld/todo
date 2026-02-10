const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');

const shapeSelect = document.getElementById('shape');
const modeButtons = Array.from(document.querySelectorAll('.seg'));
const speedSlider = document.getElementById('speed');
const sizeSlider = document.getElementById('size');
const glowToggle = document.getElementById('glow');
const resetBtn = document.getElementById('resetBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const modeLabel = document.getElementById('modeLabel');
const fpsEl = document.getElementById('fps');
const canvasWrap = document.querySelector('.canvas-wrap');

const state = {
    rotation: { x: 0.7, y: 0.6, z: 0 },
    speed: 0.55,
    size: 150,
    zoom: 1,
    mode: 'solid',
    shape: 'cube',
    dragging: false,
    lastPointer: { x: 0, y: 0 },
    hue: 24
};

const lightDir = normalize({ x: 0.3, y: 0.7, z: 1 });
const viewDir = { x: 0, y: 0, z: 1 };
const fov = 500;

let shapeData = buildShape(state.shape);
let width = 0;
let height = 0;

let lastTime = performance.now();
let lastFpsTime = performance.now();
let frames = 0;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    width = rect.width;
    height = rect.height;
}

function normalize(v) {
    const len = Math.hypot(v.x, v.y, v.z) || 1;
    return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function rotatePoint(point, rot) {
    let { x, y, z } = point;
    const cosX = Math.cos(rot.x);
    const sinX = Math.sin(rot.x);
    let y1 = y * cosX - z * sinX;
    let z1 = y * sinX + z * cosX;

    const cosY = Math.cos(rot.y);
    const sinY = Math.sin(rot.y);
    let x2 = x * cosY + z1 * sinY;
    let z2 = -x * sinY + z1 * cosY;

    const cosZ = Math.cos(rot.z);
    const sinZ = Math.sin(rot.z);
    let x3 = x2 * cosZ - y1 * sinZ;
    let y3 = x2 * sinZ + y1 * cosZ;

    return { x: x3, y: y3, z: z2 };
}

function project(point) {
    const depth = fov / (fov + point.z);
    return {
        x: point.x * depth * state.zoom + width / 2,
        y: point.y * depth * state.zoom + height / 2,
        depth
    };
}

function buildEdges(faces) {
    const set = new Set();
    faces.forEach((face) => {
        for (let i = 0; i < face.length; i++) {
            const a = face[i];
            const b = face[(i + 1) % face.length];
            const key = a < b ? `${a}-${b}` : `${b}-${a}`;
            set.add(key);
        }
    });

    return Array.from(set).map((key) => key.split('-').map(Number));
}

function buildShape(name) {
    if (name === 'cube') {
        const v = [
            { x: -1, y: -1, z: -1 },
            { x: 1, y: -1, z: -1 },
            { x: 1, y: 1, z: -1 },
            { x: -1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 },
            { x: 1, y: -1, z: 1 },
            { x: 1, y: 1, z: 1 },
            { x: -1, y: 1, z: 1 }
        ];
        const f = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [0, 1, 5, 4],
            [2, 3, 7, 6],
            [1, 2, 6, 5],
            [0, 3, 7, 4]
        ];
        return { type: 'poly', vertices: v, faces: f, edges: buildEdges(f) };
    }

    if (name === 'pyramid') {
        const v = [
            { x: -1, y: -1, z: -1 },
            { x: 1, y: -1, z: -1 },
            { x: 1, y: -1, z: 1 },
            { x: -1, y: -1, z: 1 },
            { x: 0, y: 1.3, z: 0 }
        ];
        const f = [
            [0, 1, 2, 3],
            [0, 1, 4],
            [1, 2, 4],
            [2, 3, 4],
            [3, 0, 4]
        ];
        return { type: 'poly', vertices: v, faces: f, edges: buildEdges(f) };
    }

    if (name === 'octa') {
        const v = [
            { x: 0, y: 1.3, z: 0 },
            { x: 0, y: -1.3, z: 0 },
            { x: -1.2, y: 0, z: 0 },
            { x: 1.2, y: 0, z: 0 },
            { x: 0, y: 0, z: 1.2 },
            { x: 0, y: 0, z: -1.2 }
        ];
        const f = [
            [0, 3, 4],
            [0, 4, 2],
            [0, 2, 5],
            [0, 5, 3],
            [1, 4, 3],
            [1, 2, 4],
            [1, 5, 2],
            [1, 3, 5]
        ];
        return { type: 'poly', vertices: v, faces: f, edges: buildEdges(f) };
    }

    if (name === 'torus') {
        return { type: 'points', points: createTorusPoints(1, 0.36, 18, 26) };
    }

    return { type: 'points', points: createSpherePoints(1.05, 16, 24) };
}

function createSpherePoints(radius, latSteps, lonSteps) {
    const points = [];
    for (let i = 0; i <= latSteps; i++) {
        const theta = (i / latSteps) * Math.PI;
        for (let j = 0; j <= lonSteps; j++) {
            const phi = (j / lonSteps) * Math.PI * 2;
            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.cos(theta);
            const z = radius * Math.sin(theta) * Math.sin(phi);
            points.push({ x, y, z });
        }
    }
    return points;
}

function createTorusPoints(radius, tube, radialSteps, tubularSteps) {
    const points = [];
    for (let i = 0; i < radialSteps; i++) {
        const theta = (i / radialSteps) * Math.PI * 2;
        for (let j = 0; j < tubularSteps; j++) {
            const phi = (j / tubularSteps) * Math.PI * 2;
            const x = (radius + tube * Math.cos(phi)) * Math.cos(theta);
            const y = tube * Math.sin(phi);
            const z = (radius + tube * Math.cos(phi)) * Math.sin(theta);
            points.push({ x, y, z });
        }
    }
    return points;
}

function updateModeLabel(effectiveMode) {
    const label = effectiveMode.charAt(0).toUpperCase() + effectiveMode.slice(1);
    modeLabel.textContent = label;
}

function drawGrid() {
    const gridSize = state.size * 1.4;
    const step = state.size / 3.2;
    const y = -state.size * 0.9;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = -gridSize; i <= gridSize; i += step) {
        const start = rotatePoint({ x: i, y, z: -gridSize }, state.rotation);
        const end = rotatePoint({ x: i, y, z: gridSize }, state.rotation);
        const p1 = project(start);
        const p2 = project(end);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const start2 = rotatePoint({ x: -gridSize, y, z: i }, state.rotation);
        const end2 = rotatePoint({ x: gridSize, y, z: i }, state.rotation);
        const p3 = project(start2);
        const p4 = project(end2);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
    }
}

function renderPoints(points) {
    points.forEach((point) => {
        const scaled = {
            x: point.x * state.size,
            y: point.y * state.size,
            z: point.z * state.size
        };
        const rotated = rotatePoint(scaled, state.rotation);
        const projected = project(rotated);
        const alpha = Math.min(1, Math.max(0.2, projected.depth));
        const size = 1.5 + projected.depth * 2.2;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${state.hue}, 85%, 65%, ${alpha})`;
        ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function renderPoly() {
    const vertices = shapeData.vertices.map((v) => ({
        x: v.x * state.size,
        y: v.y * state.size,
        z: v.z * state.size
    }));

    const rotated = vertices.map((v) => rotatePoint(v, state.rotation));
    const projected = rotated.map((v) => project(v));

    const facesWithDepth = shapeData.faces.map((face) => {
        const a = rotated[face[0]];
        const b = rotated[face[1]];
        const c = rotated[face[2]];
        const normal = normalize(cross(subtract(b, a), subtract(c, a)));
        const brightness = Math.max(0.12, dot(normal, lightDir));
        const depth = face.reduce((sum, idx) => sum + rotated[idx].z, 0) / face.length;
        return { face, brightness, depth, facing: dot(normal, viewDir) };
    });

    facesWithDepth.sort((a, b) => a.depth - b.depth);

    facesWithDepth.forEach(({ face, brightness, facing }) => {
        if (state.mode === 'solid' && facing <= 0) {
            return;
        }

        ctx.beginPath();
        face.forEach((index, idx) => {
            const p = projected[index];
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        if (state.mode === 'solid') {
            ctx.fillStyle = `hsl(${state.hue}, 80%, ${22 + brightness * 38}%)`;
            ctx.fill();
            ctx.strokeStyle = `hsla(${state.hue}, 90%, 70%, 0.35)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        } else if (state.mode === 'wire') {
            ctx.strokeStyle = `hsla(${state.hue}, 90%, 60%, 0.8)`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
    });

    if (state.mode === 'wire') {
        ctx.strokeStyle = `hsla(${state.hue}, 100%, 70%, 0.5)`;
        ctx.lineWidth = 0.8;
        shapeData.edges.forEach(([a, b]) => {
            const p1 = projected[a];
            const p2 = projected[b];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });
    }
}

function cross(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function subtract(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function updateSpin(delta) {
    const baseSpeed = state.speed * 0.012;
    state.rotation.x += baseSpeed * delta * 0.6;
    state.rotation.y += baseSpeed * delta * 0.9;
    state.rotation.z += baseSpeed * delta * 0.3;
}

function clearCanvas() {
    if (glowToggle.checked) {
        ctx.fillStyle = 'rgba(8, 10, 18, 0.25)';
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.clearRect(0, 0, width, height);
    }
}

function animate(now) {
    const delta = Math.min(1.5, (now - lastTime) / 16.67);
    lastTime = now;

    updateSpin(delta);

    clearCanvas();
    drawGrid();

    const isPointShape = shapeData.type === 'points';
    const effectiveMode = isPointShape ? 'points' : state.mode;
    updateModeLabel(effectiveMode);

    if (effectiveMode === 'points') {
        const points = isPointShape ? shapeData.points : shapeData.vertices;
        renderPoints(points);
    } else {
        renderPoly();
    }

    frames += 1;
    if (now - lastFpsTime > 1000) {
        fpsEl.textContent = String(frames);
        frames = 0;
        lastFpsTime = now;
    }

    requestAnimationFrame(animate);
}

function setMode(mode) {
    state.mode = mode;
    modeButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

function pickHue() {
    const useWarm = Math.random() > 0.35;
    if (useWarm) {
        return 14 + Math.floor(Math.random() * 36);
    }
    return 180 + Math.floor(Math.random() * 45);
}

function applyHue() {
    document.documentElement.style.setProperty('--hue', state.hue);
}

function resetView() {
    state.rotation = { x: 0.7, y: 0.6, z: 0 };
    state.zoom = 1;
}

shapeSelect.addEventListener('change', (event) => {
    state.shape = event.target.value;
    shapeData = buildShape(state.shape);
});

modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

speedSlider.addEventListener('input', (event) => {
    state.speed = Number(event.target.value) / 100;
});

sizeSlider.addEventListener('input', (event) => {
    state.size = Number(event.target.value);
});

glowToggle.addEventListener('change', () => {
    canvasWrap.classList.toggle('glow-on', glowToggle.checked);
});

resetBtn.addEventListener('click', resetView);

randomizeBtn.addEventListener('click', () => {
    state.hue = pickHue();
    applyHue();
});

canvas.addEventListener('pointerdown', (event) => {
    state.dragging = true;
    state.lastPointer = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointermove', (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.lastPointer.x;
    const dy = event.clientY - state.lastPointer.y;
    state.rotation.y += dx * 0.005;
    state.rotation.x += dy * 0.005;
    state.lastPointer = { x: event.clientX, y: event.clientY };
});

canvas.addEventListener('pointerup', () => {
    state.dragging = false;
});

canvas.addEventListener('pointerleave', () => {
    state.dragging = false;
});

canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY) * 0.08;
    state.zoom = Math.min(1.6, Math.max(0.6, state.zoom - delta));
}, { passive: false });

window.addEventListener('resize', resizeCanvas);

applyHue();
resizeCanvas();
setMode(state.mode);
requestAnimationFrame(animate);
