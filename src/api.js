const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  return response.json();
};
