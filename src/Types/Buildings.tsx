export interface IBuilding {
    id: string,
    name: string,
    status: string,
    owner: string,
}

export interface IBuildings {
    count: number,
    buildings: IBuilding[]
}

export interface IBuildingProps {
    name: string
    buildings: IBuilding[]
}

export class Blueprint {
    name: string

    constructor(name: string) {
        this.name = name
    }
}

export class BuildingRegistry {
    blueprints: Record<string, Blueprint>

    constructor() {
        this.blueprints = {}
    }
}

export type BuildingInventory = Record<string, IBuilding[]>