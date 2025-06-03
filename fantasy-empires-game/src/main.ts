import { generateMap, drawViewport, GeneratedMap } from "./map/map-generator";
import { Territories } from "./territories/territories";

const MAP_VIEW_WIDTH = 1200;
const MAP_VIEW_HEIGHT = 800;
const MAP_WIDTH = 3000;
const MAP_HEIGHT = 2000;
const TERRITORY_COUNT = 60;
const STEP = 40;

class FantasyEmpires extends HTMLElement {
    #territories?: Territories;

    #viewPortCoordinates = {
        x: 0,
        y: 0
    }

    #map?: GeneratedMap;

    #dragging = false;

    get #canvas() {
        return this.shadowRoot?.querySelector('canvas') as HTMLCanvasElement;
    }


    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = `
            <canvas></canvas>
        `;

        this.#setupCanvas();
        this.#generateNewTerritories();
        this.#setUserInteractions();
        this.#renderMap();
    }

    #setupCanvas() {
        this.#canvas.width = MAP_VIEW_WIDTH;
        this.#canvas.height = MAP_VIEW_HEIGHT;
    }

    #generateNewMap() {
        this.#map = generateMap(TERRITORY_COUNT, MAP_WIDTH, MAP_HEIGHT);
    }

    #renderMap() {
        const ctx = this.#canvas.getContext('2d') as CanvasRenderingContext2D;
        drawViewport(ctx, this.#map as GeneratedMap, this.#viewPortCoordinates.x, this.#viewPortCoordinates.y, this.#canvas.width, this.#canvas.height);
    }

    #generateNewTerritories() {
        this.#generateNewMap();
        const territories = new Territories();
        for (let i = 0; i < this.#map!.points.length; i++) {
            const cell = this.#map!.voronoi.cellPolygon(i);
            if (!cell) continue;
            territories.addTerritory({
                name: `Territory ${i + 1}`,
                income: Math.round(Math.random() * 3000 + 1000),
                polygon: cell
            });
        }
        this.#territories = territories;
    }

    #setUserInteractions() {
        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.#viewPortCoordinates.x = Math.max(0, this.#viewPortCoordinates.x - STEP);
            if (e.key === 'ArrowRight') this.#viewPortCoordinates.x = Math.min(MAP_WIDTH - this.#canvas.width, this.#viewPortCoordinates.x + STEP);
            if (e.key === 'ArrowUp') this.#viewPortCoordinates.y = Math.max(0, this.#viewPortCoordinates.y - STEP);
            if (e.key === 'ArrowDown') this.#viewPortCoordinates.y = Math.min(MAP_HEIGHT - this.#canvas.height, this.#viewPortCoordinates.y + STEP);
            this.#renderMap();
        });

        // Mouse drag navigation
        let dragging = false;
        let lastX = 0, lastY = 0;
        let mouseDownX = 0, mouseDownY = 0;
        let dragMoved = false;
        const DRAG_THRESHOLD = 5;

        this.#canvas.addEventListener('mousedown', (e) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            dragMoved = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            if (Math.abs(e.clientX - mouseDownX) > DRAG_THRESHOLD || Math.abs(e.clientY - mouseDownY) > DRAG_THRESHOLD) {
                dragMoved = true;
            }
            this.#viewPortCoordinates.x = Math.max(0, Math.min(MAP_WIDTH - this.#canvas.width, this.#viewPortCoordinates.x - dx));
            this.#viewPortCoordinates.y = Math.max(0, Math.min(MAP_HEIGHT - this.#canvas.height, this.#viewPortCoordinates.y - dy));
            lastX = e.clientX;
            lastY = e.clientY;
            this.#renderMap();
        });

        window.addEventListener('mouseup', (e) => {
            dragging = false;
        });

        this.#canvas.addEventListener('click', (e) => {
            if (dragMoved) return; // Only open dialog if not a drag
            const rect = this.#canvas.getBoundingClientRect();
            const x = e.clientX - rect.left + this.#viewPortCoordinates.x;
            const y = e.clientY - rect.top + this.#viewPortCoordinates.y;
            const territory = this.#territories?.findTerritoryAt(x, y);
            if (territory) {
                const dialog = document.getElementById('territory-dialog') as HTMLDialogElement;
                (document.getElementById('territory-name') as HTMLElement).textContent = territory.name;
                (document.getElementById('territory-income') as HTMLElement).textContent = territory.income.toString();
                dialog.showModal();
            }
        });
    }
}

customElements.define('fantasy-empires', FantasyEmpires);
