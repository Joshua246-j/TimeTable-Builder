import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AllocationData } from '@/services/allocationService';

export interface AllocationState {
  allocations: Record<string, AllocationData>; // key is cellId
}

const initialState: AllocationState = {
  allocations: {},
};

export const allocationSlice = createSlice({
  name: 'allocation',
  initialState,
  reducers: {
    setAllocations: (state, action: PayloadAction<Record<string, AllocationData>>) => {
      state.allocations = action.payload;
    },
    addAllocation: (state, action: PayloadAction<AllocationData>) => {
      state.allocations[action.payload.cellId] = action.payload;
    },
    updateAllocation: (state, action: PayloadAction<AllocationData>) => {
      if (state.allocations[action.payload.cellId]?.isLocked) return;
      state.allocations[action.payload.cellId] = action.payload;
    },
    removeAllocation: (state, action: PayloadAction<string>) => {
      if (state.allocations[action.payload]?.isLocked) return;
      delete state.allocations[action.payload];
    },
    clearAllocations: (state) => {
      Object.keys(state.allocations).forEach(key => {
        if (!state.allocations[key].isLocked) {
          delete state.allocations[key];
        }
      });
    },
  },
});

export const {
  setAllocations,
  addAllocation,
  updateAllocation,
  removeAllocation,
  clearAllocations,
} = allocationSlice.actions;

export default allocationSlice.reducer;
