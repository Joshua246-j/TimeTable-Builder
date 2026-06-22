import { ApiService } from './api.service';
import { mockOverview } from '../mock';

export class DashboardService extends ApiService {
  static async getOverview() {
    await this.delay(500);
    return mockOverview;
  }
}
