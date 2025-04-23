const CANVAS_ID = '95fcbb75e6f34d94b05fcb1a8415d578';

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

// Authentication helpers
export const logout = async () => {
  const { ApperUI } = window.ApperSDK;
  await ApperUI.logout();
  return true;
};

// Category API functions
export const fetchCategories = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('category', {
      fields: ['Id', 'Name', 'color'],
      pagingInfo: { limit: 100, offset: 0 },
      orderBy: [{ field: 'Name', direction: 'asc' }],
    });
    
    // Map to a more friendly format
    return response.data.map(category => ({
      id: category.Id.toString(),
      name: category.Name,
      color: category.color || '#6366f1', // Default color if not set
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Task API functions
export const fetchTasks = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('task2', {
      fields: ['Id', 'title', 'description', 'priority', 'categoryId', 'dueDate', 'completed', 'createdAt'],
      pagingInfo: { limit: 100, offset: 0 },
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
    
    // Map to a more friendly format
    return response.data.map(task => ({
      id: task.Id.toString(),
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      categoryId: task.categoryId ? task.categoryId.toString() : null,
      dueDate: task.dueDate || null,
      completed: task.completed || false,
      createdAt: task.createdAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const addNewTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.createRecord('task2', {
      record: {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        categoryId: taskData.categoryId,
        dueDate: taskData.dueDate || null,
        completed: taskData.completed || false,
        createdAt: new Date().toISOString(),
      }
    });
    
    // Return the created task with a standardized format
    return {
      id: response.data.Id.toString(),
      title: response.data.title,
      description: response.data.description || '',
      priority: response.data.priority || 'medium',
      categoryId: response.data.categoryId ? response.data.categoryId.toString() : null,
      dueDate: response.data.dueDate || null,
      completed: response.data.completed || false,
      createdAt: response.data.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTaskById = async (id, taskData) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.updateRecord('task2', id, {
      record: taskData
    });
    
    // Return the updated task with a standardized format
    return {
      id: response.data.Id.toString(),
      title: response.data.title,
      description: response.data.description || '',
      priority: response.data.priority || 'medium',
      categoryId: response.data.categoryId ? response.data.categoryId.toString() : null,
      dueDate: response.data.dueDate || null,
      completed: response.data.completed || false,
      createdAt: response.data.createdAt,
    };
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

export const deleteTaskById = async (id) => {
  try {
    const apperClient = getApperClient();
    await apperClient.deleteRecord('task2', id);
    return true;
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};