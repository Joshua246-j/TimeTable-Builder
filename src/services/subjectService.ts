import type { SubjectCardData } from "@/types/timetable";

// Mock database simulation
let subjects: Record<string, SubjectCardData> = {};

export const subjectService = {
  async getSubjects(): Promise<Record<string, SubjectCardData>> {
    return new Promise((resolve) => setTimeout(() => resolve({ ...subjects }), 100));
  },

  async createSubject(subject: SubjectCardData): Promise<SubjectCardData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        subjects[subject.id] = subject;
        resolve({ ...subject });
      }, 200);
    });
  },

  async updateSubject(subject: SubjectCardData): Promise<SubjectCardData> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!subjects[subject.id]) {
          reject(new Error("Subject not found"));
          return;
        }
        subjects[subject.id] = subject;
        resolve({ ...subject });
      }, 200);
    });
  },

  async deleteSubject(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!subjects[id]) {
          reject(new Error("Subject not found"));
          return;
        }
        delete subjects[id];
        resolve();
      }, 200);
    });
  },
  
  // For setting initial mock data if needed
  _setMockData(data: Record<string, SubjectCardData>) {
    subjects = { ...data };
  }
};
