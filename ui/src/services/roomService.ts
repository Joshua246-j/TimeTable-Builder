export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  building: string;
  type: "Lecture" | "Lab" | "Seminar" | "Other";
  isEditable?: boolean;
}

let roomStore: Record<string, RoomData> = {};

export const roomService = {
  async getRooms(): Promise<Record<string, RoomData>> {
    return new Promise((resolve) => setTimeout(() => resolve({ ...roomStore }), 100));
  },

  async createRoom(room: RoomData): Promise<RoomData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        roomStore[room.id] = room;
        resolve({ ...room });
      }, 200);
    });
  },

  async updateRoom(room: RoomData): Promise<RoomData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!roomStore[room.id]) {
          reject(new Error("Room not found"));
          return;
        }
        roomStore[room.id] = room;
        resolve({ ...room });
      }, 200);
    });
  },

  async deleteRoom(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!roomStore[id]) {
          reject(new Error("Room not found"));
          return;
        }
        delete roomStore[id];
        resolve();
      }, 200);
    });
  },
  
  _setMockData(data: Record<string, RoomData>) {
    roomStore = { ...data };
  }
};
