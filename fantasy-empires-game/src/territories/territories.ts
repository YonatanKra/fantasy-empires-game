export type TerritoryConfig = {
    name: string;
    income: number;
    polygon: [number, number][];
};

class Territory {
    income: number;
    name: string;
    polygon: [number, number][];

    constructor(config: TerritoryConfig) {
        this.income = config.income;
        this.name = config.name;
        this.polygon = config.polygon;
    }

    contains(x: number, y: number): boolean {
        // Ray-casting algorithm for point-in-polygon
        let inside = false;
        const poly = this.polygon;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1];
            const xj = poly[j][0], yj = poly[j][1];
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
}

export class Territories {
    #territories: Territory[] = [];

    addTerritory(territoryConfig: TerritoryConfig) {
        this.#territories.push(new Territory(territoryConfig));
    }

    findTerritoryAt(x: number, y: number): Territory | undefined {
        return this.#territories.find(t => t.contains(x, y));
    }

    getAll() {
        return this.#territories;
    }
}
