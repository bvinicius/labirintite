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

  let best = null;
  let iterationsCount = 0;

  while (
    iterationsCount < parameters.GENERATIONS &&
    !(best && best.isSolution())
  ) {
    geneticManager.runPopulation(population);
    const [mom, dad] = geneticManager.getBestParents(population);
    population = geneticManager.generateNewPopulation(mom, dad);

    best = geneticManager.getBestParents(population)[0];
    console.log(`ic ${iterationsCount} best score: ${best.score}; found S: ${best.reachesTarget}; valid: ${best.isSolution()}, path: ${JSON.stringify(best.path)}`);
    iterationsCount++;
  }

  if (best.reachesTarget) {
    console.log(`\nsolution found!`);
    console.log(`cromossome who found: ${JSON.stringify(best)}`);

    self.postMessage(best);
  } else {
    console.log('didnt find solution.');
  }
}
