import { drawTerritories } from "./map/map-generator";


const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = 900;
canvas.height = 400;



ctx.clearRect(0, 0, canvas.width, canvas.height);
drawTerritories(canvas, 12); // Adjust the number for more/less territories

