declare global {
  interface RoomMemory {
    [key: string]: any;
  }
}

export class RoomPlanMemory {
  public planned: boolean;

  public constructor(roomMem: RoomMemory) {
    let state: RoomMemory = {};
    if (roomMem !== undefined) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        state = JSON.parse(roomMem.state);
      } catch (e) {
        state = {};
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.planned = state.planned;
  }

  public commit(roomMem: RoomMemory): void {
    roomMem.state = JSON.stringify(this);
  }
}
