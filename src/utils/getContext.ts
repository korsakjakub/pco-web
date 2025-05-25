import Context from '../interfaces/Context';
import { StorageService } from '../services/storageService';

const getContext = (): Context => {
  const ctx = StorageService.getContext();
  if (ctx === null) {
    throw new Error("Context not found in session storage");
  }
  return ctx;
};

export default getContext;
