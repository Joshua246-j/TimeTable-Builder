import { MOCK_SUBJECTS } from "@/lib/mockData";
import { MOCK_SUBJECTS_DETAILS, SubjectDetail } from "@/mock/subjectsDetail";
import type { SubjectCardData } from "@/types/timetable";

// Mock database simulation initialized with default subjects
let subjects: Record<string, SubjectCardData> = { ...MOCK_SUBJECTS };

export const subjectService = {
  async getSubjects(): Promise<Record<string, SubjectCardData>> {
    return new Promise((resolve) => setTimeout(() => resolve({ ...subjects }), 100));
  },

  async getSubjectById(id: string): Promise<SubjectCardData | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(subjects[id]), 50));
  },

  async getSubjectDetails(id: string): Promise<SubjectDetail | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUBJECTS_DETAILS[id] || MOCK_SUBJECTS_DETAILS["1"]), 50));
  },

  async getSubjectOverview(id: string) {
    return this.getSubjectDetails(id);
  },

  async getSubjectAttendance(id: string) {
    const details = await this.getSubjectDetails(id);
    return details?.attendanceRate || 85;
  },

  async getSubjectLectures(id: string) {
    const details = await this.getSubjectDetails(id);
    return details?.totalLectures || 30;
  },

  async getSubjectPresentations(id: string) {
    const details = await this.getSubjectDetails(id);
    return details?.presentations || 6;
  },

  async getSubjectAssignments(id: string) {
    const details = await this.getSubjectDetails(id);
    return details?.assignments || [];
  },

  async getSubjectResources(id: string) {
    const details = await this.getSubjectDetails(id);
    return details?.resources || [];
  },

  async getSubjectAnalytics(id: string) {
    const details = await this.getSubjectDetails(id);
    return details?.analytics || { gradeDistribution: [], averageScore: 0, engagementRate: 0 };
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
