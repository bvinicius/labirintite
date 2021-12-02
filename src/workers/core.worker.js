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
  let generationsCount = 0;
  // let found = 0;
  // let valid = 0;
  // let run = 0;

  // const firstPopulation = population;
  // let lastPopulation = null;
  // let bContinue = true;

  while (generationsCount < parameters.GENERATIONS) {
    geneticManager.runPopulation(population);
    const [bestCromossome] = geneticManager.getBestParents(population);
    const [mom, dad] = geneticManager.tournament(population);
    population = geneticManager.generateNewPopulation(mom, dad, bestCromossome, population);

    best = mom;

    console.log(
      `ic ${generationsCount} best score: ${best.score};`
    );

    generationsCount++;
  }

  console.log(best.path);

  // if (best.isSolution()) {
  //   valid++;
  //   console.log(`\nsolution found!`);
  //   console.log(`cromossome who found: ${JSON.stringify(best)}`);
  // } else {
  //   console.log("didnt find solution.");
  // }

  // console.log("first population", firstPopulation);
  // console.log("last population", lastPopulation);

  const data = {
    best,
    // found,
    // valid,
    // run,
  };

  self.postMessage(data);
}
