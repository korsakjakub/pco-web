import { StorageService } from '../services/storageService';
import { getEnvVar } from './validateEnv';

const getFrontUrl = (): string => {
  const storedUrl = StorageService.getFrontUrl();
  if (storedUrl) {
    return storedUrl;
  }
  
  // Fallback to environment variable
  try {
    return getEnvVar('VITE_FRONT_URL');
  } catch {
    throw new Error('Front URL not found in storage or environment variables');
  }
};

export default getFrontUrl;
