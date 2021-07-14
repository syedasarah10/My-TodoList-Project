function createNewTask(name, description, priority, isCompleted) {
  return {
    id: Date.now().toString(),
    name: name,
    description: description,
    priority: priority,
    completed: isCompleted || false,
  };
}
