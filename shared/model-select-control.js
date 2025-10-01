export const initializeModelSelectControls = (gui, models, onSelected) => {
  const modelControlFolder = gui.addFolder("Models");
  const modelNames = Object.keys(models);

  const data = {
    model: modelNames[0],
  };

  modelControlFolder
    .add(data, "model", modelNames)
    .onChange((s) => onSelected(models[s]));
};
