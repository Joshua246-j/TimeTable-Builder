/**
 * Simulated base API service.
 * In production, this would use fetch or axios to call the real backend.
 */
export class ApiService {
  protected static async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
