import { RoomPlanMemory } from "./room_planner_memory";

export class RoomPlanner {
  private room: Room;
  private game: Game;
  private memory: RoomPlanMemory;

  public constructor(roomName: string, game: Game) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.room = game.rooms[roomName];
    this.game = game;
    const roomMem: RoomMemory = this.room.memory;
    this.memory = new RoomPlanMemory(roomMem);
  }

  public run(): void {
    if (!this.memory.planned) {
      // Plan roads to and from controlpoints
      const controller: StructureController | undefined = this.room.controller;
      if (controller instanceof StructureController) {
        const sources = this.room.find(FIND_SOURCES_ACTIVE);
        if (sources.length) {
          sources.forEach(function (source: Source) {
            const room: Room = source.room;
            const pathSteps: PathStep[] = room.findPath(source.pos, controller.pos, {
              ignoreCreeps: true,
              swampCost: 1
            });
            pathSteps.forEach(step => {
              room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
            });
          });
        }
      }
    }
    this.memory.commit(this.room.memory);
  }
}
