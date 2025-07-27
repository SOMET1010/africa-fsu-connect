export interface UserPreferences {
  experience: 'beginner' | 'intermediate' | 'expert';
  primaryGoals: string[];
  workStyle: 'individual' | 'collaborative' | 'management';
  challenges: string;
}

export class UserPreferencesService {
  private static readonly STORAGE_KEY = 'userOnboardingPreferences';

  static savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  static loadPreferences(): UserPreferences | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return null;
    }
  }

  static clearPreferences(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user preferences:', error);
    }
  }

  static updatePreferences(updates: Partial<UserPreferences>): void {
    const current = this.loadPreferences();
    if (current) {
      const updated = { ...current, ...updates };
      this.savePreferences(updated);
    }
  }
}