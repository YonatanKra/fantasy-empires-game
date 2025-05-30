import { Delaunay } from "d3-delaunay";

function randomColor() {
    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 65%)`;
}

// Generate random points as territory centers
function generatePoints(count: number, width: number, height: number): [number, number][] {
    const points: [number, number][] = [];
    for (let i = 0; i < count; i++) {
        points.push([
            Math.random() * width,
            Math.random() * height
        ]);
    }
    return points;
}

function drawVoronoiTerritories(canvas: HTMLCanvasElement, count: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw 'No Context on Canvas';
    const points = generatePoints(count, canvas.width, canvas.height);
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);

    for (let i = 0; i < points.length; i++) {
        const cell = voronoi.cellPolygon(i);
        if (!cell) continue;
        ctx.beginPath();
        ctx.moveTo(cell[0][0], cell[0][1]);
        for (let j = 1; j < cell.length; j++) {
            ctx.lineTo(cell[j][0], cell[j][1]);
        }
        ctx.closePath();
        ctx.fillStyle = randomColor();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

export function drawTerritories(canvas: HTMLCanvasElement, count: number) {
    return drawVoronoiTerritories(canvas, count);
}