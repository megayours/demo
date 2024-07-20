const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const localStorageApi = {
  getItem: async (key: string): Promise<string | null> => {
    await delay(100); // Simulate network delay
    return localStorage.getItem(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    await delay(100); // Simulate network delay
    localStorage.setItem(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    await delay(100); // Simulate network delay
    localStorage.removeItem(key);
  },
};