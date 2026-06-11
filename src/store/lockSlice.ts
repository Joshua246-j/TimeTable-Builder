import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LockState {
  lockedAllocations: Record<string, boolean>; // map of allocation id to lock status
}

const initialState: LockState = {
  lockedAllocations: {},
};

export const lockSlice = createSlice({
  name: 'lock',
  initialState,
  reducers: {
    lockAllocation: (state, action: PayloadAction<string>) => {
      state.lockedAllocations[action.payload] = true;
    },
    unlockAllocation: (state, action: PayloadAction<string>) => {
      delete state.lockedAllocations[action.payload];
    },
  },
});

export const {
  lockAllocation,
  unlockAllocation,
} = lockSlice.actions;

export default lockSlice.reducer;
