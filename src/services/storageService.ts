import { STORAGE_KEYS } from '../constants/gameDefaults';
import Context from '../interfaces/Context';

export class StorageService {
  static setContext(context: Context): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.CONTEXT, JSON.stringify(context));
    } catch (error) {
      console.error('Failed to save context:', error);
    }
  }

  static getContext(): Context | null {
    try {
      const ctx = sessionStorage.getItem(STORAGE_KEYS.CONTEXT);
      if (!ctx) return null;
      
      const parsed = JSON.parse(ctx);
      return this.validateContext(parsed) ? parsed : null;
    } catch (error) {
      console.error('Failed to load context:', error);
      return null;
    }
  }

  static clearContext(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.CONTEXT);
    } catch (error) {
      console.error('Failed to clear context:', error);
    }
  }

  static setHostUrl(url: string): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.HOST_URL, url);
    } catch (error) {
      console.error('Failed to save host URL:', error);
    }
  }

  static getHostUrl(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.HOST_URL);
    } catch (error) {
      console.error('Failed to load host URL:', error);
      return null;
    }
  }

  static setFrontUrl(url: string): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.FRONT_URL, url);
    } catch (error) {
      console.error('Failed to save front URL:', error);
    }
  }

  static getFrontUrl(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.FRONT_URL);
    } catch (error) {
      console.error('Failed to load front URL:', error);
      return null;
    }
  }

  private static validateContext(ctx: unknown): ctx is Context {
    return (
      typeof ctx === 'object' &&
      ctx !== null &&
      'playerId' in ctx &&
      'playerToken' in ctx &&
      'roomId' in ctx &&
      'queueId' in ctx &&
      typeof (ctx as any).playerId === 'string' &&
      typeof (ctx as any).playerToken === 'string' &&
      typeof (ctx as any).roomId === 'string' &&
      typeof (ctx as any).queueId === 'string'
    );
  }
}