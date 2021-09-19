import geneticManager from "../managers/geneticManager";

addEventListener("message", ({ data }) => {
  const { maze, parameters } = data;
  start(maze, parameters);
});

function start(maze, parameters) {
  geneticManager.maze = maze;
  geneticManager.parameters = parameters;

  let population = geneticManager.populate(
    parameters.POPULATION_SIZE,
    parameters.MAX_STEPS,
    maze
  );

  let iterationsCount = 0;
  while (iterationsCount < parameters.ITERATIONS) {
    geneticManager.runPopulation(population);
    const [mom, dad] = geneticManager.getBestParents(population);
    population = geneticManager.generateNewPopulation(mom, dad);
    console.log(
      "best score in this round",
      geneticManager.getBestParents(population)[0].score
    );
    iterationsCount++;
  }

  self.postMessage({ message: "ready" });
}
