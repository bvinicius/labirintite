import geneticManager from "../managers/geneticManager";

addEventListener("message", ({ data }) => {
  const { maze, parameters } = data;
  start(maze, parameters);
});

function start(maze, parameters) {
  geneticManager.maze = maze;
  geneticManager.parameters = parameters;

  let population = geneticManager.populate(
    parameters.POPULATION_SIZE, //tamanho
    parameters.WEIGHTS_AMOUNT, //nº de pesos por cromossomo
    parameters.MAX_STEPS, //max steps
    maze
  );

  let best = null;
  let iterationsCount = 0;
  let found = 0;
  let valid = 0;
  let run = 0;

  const firstPopulation = population;
  let lastPopulation = null;
  let bContinue = true;

  while (bContinue) {
    geneticManager.runPopulation(population);
    const [mom, dad] = geneticManager.getBestParents(population);
    population = geneticManager.generateNewPopulation(mom, dad);

    // best = mom;
    // console.log(
    //   `ic ${iterationsCount} best score: ${best.score}; found S: ${best.reachesTarget
    //   }; valid: ${best.isSolution()}`
    // );

    // population.forEach((cromossome) => {
    //   if (cromossome.reachesTarget) {
    //     found++;
    //   }
    // });
    // run += population.length;

    // iterationsCount++;
    // lastPopulation = population;
    bContinue = false;
  }

  // if (best.isSolution()) {
  //   valid++;
  //   console.log(`\nsolution found!`);
  //   console.log(`cromossome who found: ${JSON.stringify(best)}`);
  // } else {
  //   console.log("didnt find solution.");
  // }

  // console.log("first population", firstPopulation);
  // console.log("last population", lastPopulation);

  // const data = {
  //   best,
  //   found,
  //   valid,
  //   run,
  // };

  // self.postMessage(data);
}
