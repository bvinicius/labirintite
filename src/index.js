import mazeBuilder from "./managers/mazeBuilder";

const strInput = `E 0 0 0 0 0 0 0 0 0 0 0\n1 1 1 1 0 0 0 0 0 1 1 1\n1 0 0 0 0 1 1 1 0 1 1 0\n1 0 1 1 1 1 1 1 0 0 0 0\n0 0 0 1 0 0 0 0 1 0 1 1\n1 1 0 0 0 1 0 1 0 0 1 1\n1 1 1 0 1 1 0 0 0 1 1 0\n0 0 1 0 0 1 0 1 0 1 1 0\n0 0 0 0 1 1 0 0 0 1 1 0\n1 1 1 0 1 0 0 1 1 1 1 0\n1 1 1 0 1 0 0 0 0 1 1 1\n1 1 1 0 0 0 0 1 0 0 0 S`;
const freeSpotsAmount = (strInput.match(/0/g) || []).length;

const parameters = {
  POPULATION_SIZE: 100,
  MAX_STEPS: freeSpotsAmount,
  GENERATIONS: 10000,
  DELAY: 1000,
};

let lastCromossome = null;
const maze = strInput.split("\n").map((line) => line.split(" "));

window.onload = () => {
  mazeBuilder.build(maze, document.querySelector(".maze-container"));

  const $runButton = document.querySelector("#startButton");
  const $simulationButton = document.querySelector("#runButton");
  const [$populationInput, $cromossomeInput, $iterationsInput] =
    document.querySelectorAll("input.parameter-input");

  $populationInput.value = parameters.POPULATION_SIZE;
  $cromossomeInput.value = parameters.MAX_STEPS;
  $iterationsInput.value = parameters.GENERATIONS;

  $runButton.addEventListener("click", onStartButtonClick);
  $simulationButton &&
    $simulationButton.addEventListener("click", () => {
      const $pathInput = document.querySelector("#path-input");
      onFinishRunning({ data: JSON.parse($pathInput.value) });
    });

  const $repeatButton = document.querySelector("#repeatButton");
  $repeatButton.addEventListener("click", onRepeatClick);
};

const worker = new Worker(new URL("./workers/core.worker.js", import.meta.url));

function onStartButtonClick() {
  const [$populationInput, $cromossomeInput, $iterationsInput] =
    document.querySelectorAll("input.parameter-input");

  parameters.POPULATION_SIZE = +$populationInput.value;
  parameters.MAX_STEPS = +$cromossomeInput.value;
  parameters.GENERATIONS = +$iterationsInput.value;

  start();
}

function start() {
  worker.postMessage({ maze, parameters });
  disableButton();
  worker.onmessage = onFinishRunning;
}

function onFinishRunning({ data }) {
  const { best, found, run, valid } = data;
  lastCromossome = best;

  const $btn = document.querySelector("#startButton");
  $btn.disabled = false;
  $btn.classList.remove("disabled");

  const [$runField, $foundField, $validField] =
    document.querySelectorAll(".result");
  $runField.innerHTML = `<b>Nº de cromossomos testados:</b> ${run}`;
  $foundField.innerHTML = `<b>Nº de cromossomos que encontram o caminho:</b> ${found}`;
  $validField.innerHTML = `<b>Nº de cromossomos válidos:</b> ${valid}`;

  mazeBuilder.go(best.path);
}

function disableButton() {
  const $btn = document.querySelector("#startButton");
  $btn.disabled = true;
  $btn.classList.add("disabled");

  const $loader = document.querySelector("#loader");
  $loader.classList.add("loader");
}

function onRepeatClick() {
  if (lastCromossome && lastCromossome.path) {
    mazeBuilder.go(lastCromossome.path);
  }
}
