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
  let found = 0;
  let valid = 0;
  let run = 0;

  while (
    iterationsCount < parameters.GENERATIONS &&
    !(best && best.isSolution())
  ) {
    geneticManager.runPopulation(population);
    const [mom, dad] = geneticManager.getBestParents(population);
    population = geneticManager.generateNewPopulation(mom, dad);

    best = mom;
    console.log(
      `ic ${iterationsCount} best score: ${best.score}; found S: ${
        best.reachesTarget
      }; valid: ${best.isSolution()}, path: ${JSON.stringify(best.path)}`
    );

    population.forEach((cromossome) => {
      if (cromossome.reachesTarget) {
        found++;
      }
    });
    run += population.length;

    iterationsCount++;
  }

  if (best.isSolution()) {
    valid++;
    console.log(`\nsolution found!`);
    console.log(`cromossome who found: ${JSON.stringify(best)}`);
  } else {
    console.log("didnt find solution.");
  }

  const data = {
    best,
    found,
    valid,
    run,
  };

  self.postMessage(data);
}
