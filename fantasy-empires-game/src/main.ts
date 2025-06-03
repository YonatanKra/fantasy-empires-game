import { generateMap, drawViewport } from "./map/map-generator";
import { Territories } from "./territories/territories";

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = 900;
canvas.height = 400;

// Large map size
const MAP_WIDTH = 3000;
const MAP_HEIGHT = 2000;
const TERRITORY_COUNT = 60;

// Viewport position
let viewX = 0;
let viewY = 0;

// Generate the map once
const map = generateMap(TERRITORY_COUNT, MAP_WIDTH, MAP_HEIGHT);

const territories = new Territories();
for (let i = 0; i < map.points.length; i++) {
    const cell = map.voronoi.cellPolygon(i);
    if (!cell) continue;
    territories.addTerritory({
        name: `Territory ${i + 1}`,
        income: Math.round(Math.random() * 3000 + 1000),
        polygon: cell
    });
}
// Draw the current viewport
function render() {
    drawViewport(ctx, map, viewX, viewY, canvas.width, canvas.height);
}
render();

// Keyboard navigation
window.addEventListener('keydown', (e) => {
    const step = 40;
    if (e.key === 'ArrowLeft') viewX = Math.max(0, viewX - step);
    if (e.key === 'ArrowRight') viewX = Math.min(MAP_WIDTH - canvas.width, viewX + step);
    if (e.key === 'ArrowUp') viewY = Math.max(0, viewY - step);
    if (e.key === 'ArrowDown') viewY = Math.min(MAP_HEIGHT - canvas.height, viewY + step);
    render();
});

// Mouse drag navigation
let dragging = false;
let lastX = 0, lastY = 0;
canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});
window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    viewX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, viewX - dx));
    viewY = Math.max(0, Math.min(MAP_HEIGHT - canvas.height, viewY - dy));
    lastX = e.clientX;
    lastY = e.clientY;
    render();
});
window.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + viewX;
    const y = e.clientY - rect.top + viewY;
    const territory = territories.findTerritoryAt(x, y);
    if (territory) {
        const dialog = document.getElementById('territory-dialog') as HTMLDialogElement;
        (document.getElementById('territory-name') as HTMLElement).textContent = territory.name;
        (document.getElementById('territory-income') as HTMLElement).textContent = territory.income.toString();
        dialog.showModal();
    }
});
