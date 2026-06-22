import { ApiService } from './api.service';
import { mockStudents, mockAttendanceRecords, mockAttendanceInsights } from '../mock';

export class AttendanceService extends ApiService {
  static async getStudents() {
    await this.delay(500);
    return mockStudents;
  }

  static async getAttendanceRecords() {
    await this.delay(400);
    return mockAttendanceRecords;
  }

  static async getInsights() {
    await this.delay(600);
    return mockAttendanceInsights;
  }

  static async submitAttendance(records: unknown[]) {
    await this.delay(1000);
    console.log("Submitted records to backend:", records);
    return { success: true, timestamp: new Date().toISOString() };
  }
}
