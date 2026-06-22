import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RoomData } from '@/services/roomService';

export interface RoomState {
  rooms: Record<string, RoomData>;
}

const initialState: RoomState = {
  rooms: {},
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Record<string, RoomData>>) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action: PayloadAction<RoomData>) => {
      state.rooms[action.payload.id] = action.payload;
    },
    updateRoom: (state, action: PayloadAction<RoomData>) => {
      if (state.rooms[action.payload.id]?.isEditable === false) return;
      state.rooms[action.payload.id] = action.payload;
    },
    deleteRoom: (state, action: PayloadAction<string>) => {
      if (state.rooms[action.payload]?.isEditable === false) return;
      delete state.rooms[action.payload];
    },
  },
});

export const { setRooms, addRoom, updateRoom, deleteRoom } = roomSlice.actions;
export default roomSlice.reducer;
