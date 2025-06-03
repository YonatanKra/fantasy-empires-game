import { Delaunay, Voronoi } from "d3-delaunay";

function randomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 65%)`;
}

export type GeneratedMap = {
    points: [number, number][];
    voronoi: Voronoi<[number, number]>;
    width: number;
    height: number;
    colors: string[];
};

export function generateMap(count: number, width: number, height: number): GeneratedMap {
    const points: [number, number][] = [];
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
        points.push([
            Math.random() * width,
            Math.random() * height
        ]);
        colors.push(randomColor());
    }
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    return { points, voronoi, width, height, colors };
}

export function drawViewport(
    ctx: CanvasRenderingContext2D,
    map: ReturnType<typeof generateMap>,
    viewX: number,
    viewY: number,
    viewWidth: number,
    viewHeight: number
) {
    ctx.clearRect(0, 0, viewWidth, viewHeight);
    for (let i = 0; i < map.points.length; i++) {
        const cell = map.voronoi.cellPolygon(i);
        if (!cell) continue;
        ctx.beginPath();
        ctx.moveTo(cell[0][0] - viewX, cell[0][1] - viewY);
        for (let j = 1; j < cell.length; j++) {
            ctx.lineTo(cell[j][0] - viewX, cell[j][1] - viewY);
        }
        ctx.closePath();
        ctx.fillStyle = map.colors[i];
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}