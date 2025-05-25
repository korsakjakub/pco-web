import { StorageService } from '../services/storageService';
import { getEnvVar } from './validateEnv';

const getHostUrl = (): string => {
  const storedUrl = StorageService.getHostUrl();
  if (storedUrl) {
    return storedUrl;
  }
  
  // Fallback to environment variable
  try {
    return getEnvVar('VITE_HOST_URL');
  } catch {
    throw new Error('Host URL not found in storage or environment variables');
  }
};

export default getHostUrl;
