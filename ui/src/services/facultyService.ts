export interface FacultyData {
  id: string;
  name: string;
  shortName: string;
  department: string;
  email: string;
  isAvailable: boolean;
  isEditable?: boolean;
}

let facultyStore: Record<string, FacultyData> = {};

export const facultyService = {
  async getFaculty(): Promise<Record<string, FacultyData>> {
    return new Promise((resolve) => setTimeout(() => resolve({ ...facultyStore }), 100));
  },

  async createFaculty(faculty: FacultyData): Promise<FacultyData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        facultyStore[faculty.id] = faculty;
        resolve({ ...faculty });
      }, 200);
    });
  },

  async updateFaculty(faculty: FacultyData): Promise<FacultyData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!facultyStore[faculty.id]) {
          reject(new Error("Faculty not found"));
          return;
        }
        facultyStore[faculty.id] = faculty;
        resolve({ ...faculty });
      }, 200);
    });
  },

  async deleteFaculty(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!facultyStore[id]) {
          reject(new Error("Faculty not found"));
          return;
        }
        delete facultyStore[id];
        resolve();
      }, 200);
    });
  },
  
  _setMockData(data: Record<string, FacultyData>) {
    facultyStore = { ...data };
  }
};
