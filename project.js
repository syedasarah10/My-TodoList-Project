function createProject(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}
