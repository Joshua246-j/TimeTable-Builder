export interface AllocationData {
  cellId: string;      // ID of the TimetableCell (e.g. "mon-1")
  subjectId: string;   // ID of the assigned Subject
  isLocked?: boolean;
  customStartTime?: string;
  customEndTime?: string;
}

let allocationStore: Record<string, AllocationData> = {};

export const allocationService = {
  async getAllocations(): Promise<Record<string, AllocationData>> {
    return new Promise((resolve) => setTimeout(() => resolve({ ...allocationStore }), 100));
  },

  async updateAllocation(cellId: string, subjectId: string, isLocked: boolean = false): Promise<AllocationData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alloc = { cellId, subjectId, isLocked };
        allocationStore[cellId] = alloc;
        resolve(alloc);
      }, 150);
    });
  },

  async removeAllocation(cellId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        delete allocationStore[cellId];
        resolve();
      }, 150);
    });
  },
  
  async clearAll(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        allocationStore = {};
        resolve();
      }, 150);
    });
  },

  _setMockData(data: Record<string, AllocationData>) {
    allocationStore = { ...data };
  }
};
