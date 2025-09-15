// User management service for the Crop Prediction System
// Handles user identification and session management

export interface User {
  id: string;
  displayName: string;
  createdAt: string;
  lastActive: string;
}

class UserService {
  private static instance: UserService;
  private currentUser: User | null = null;
  private readonly USER_STORAGE_KEY = 'cropPrediction_currentUser';

  private constructor() {
    this.initializeUser();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private initializeUser(): void {
    try {
      // Try to load existing user from localStorage
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        // Update last active timestamp
        if (this.currentUser) {
          this.currentUser.lastActive = new Date().toISOString();
          this.saveUser();
        }
      } else {
        // Create new user
        this.createNewUser();
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      this.createNewUser();
    }
  }

  private createNewUser(): void {
    const userId = this.generateUniqueId();
    const now = new Date().toISOString();
    
    this.currentUser = {
      id: userId,
      displayName: `Farmer ${userId.slice(-4).toUpperCase()}`,
      createdAt: now,
      lastActive: now
    };

    this.saveUser();
  }

  private generateUniqueId(): string {
    // Generate a unique ID based on timestamp and random string
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 6);
    return `farmer_${timestamp}_${randomStr}`;
  }

  private saveUser(): void {
    if (this.currentUser) {
      try {
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(this.currentUser));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    }
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getCurrentUserId(): string {
    return this.currentUser?.id || 'farmer_unknown';
  }

  public getCurrentUserDisplayName(): string {
    return this.currentUser?.displayName || 'Unknown Farmer';
  }

  public updateLastActive(): void {
    if (this.currentUser) {
      this.currentUser.lastActive = new Date().toISOString();
      this.saveUser();
    }
  }

  public resetUser(): void {
    try {
      localStorage.removeItem(this.USER_STORAGE_KEY);
      this.createNewUser();
    } catch (error) {
      console.error('Error resetting user:', error);
    }
  }

  // Allow manual user ID setting (for testing or migration)
  public setUserId(newUserId: string): void {
    if (this.currentUser) {
      this.currentUser.id = newUserId;
      this.currentUser.displayName = `Farmer ${newUserId.slice(-4).toUpperCase()}`;
      this.currentUser.lastActive = new Date().toISOString();
      this.saveUser();
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();

// Convenience functions
export const getCurrentUserId = () => userService.getCurrentUserId();
export const getCurrentUser = () => userService.getCurrentUser();
export const getCurrentUserDisplayName = () => userService.getCurrentUserDisplayName();