import mazeBuilder from "./managers/mazeBuilder";

const strInput = `0 0 0 1 0 2 0 0 2 1\n0 1 0 2 0 1 0 1 0 2\n0 0 2 0 1 1 2 0 1 1\n2 1 1 0 2 1 1 2 0 1\n2 0 0 0 0 1 1 0 1 1\n1 1 1 1 0 1 1 0 1 1\n1 0 1 1 0 1 1 2 0 2\n2 0 2 2 0 1 1 1 1 1\n1 2 1 2 0 0 2 2 1 1\n1 2 1 2 1 2 0 0 0 3`;

const parameters = {
  POPULATION_SIZE: 100,
  MAX_STEPS: 100,
  GENERATIONS: 1000,
  DELAY: 1000,
  WEIGHTS_AMOUNT: 44,
};

let lastPath = null;
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
  lastPath = data;
  const $btn = document.querySelector("#startButton");
  $btn.disabled = false;
  $btn.classList.remove("disabled");

  mazeBuilder.go(data);
}

function disableButton() {
  const $btn = document.querySelector("#startButton");
  $btn.disabled = true;
  $btn.classList.add("disabled");

  const $loader = document.querySelector("#loader");
  $loader.classList.add("loader");
}

function onRepeatClick() {
  if (lastPath) {
    mazeBuilder.go(lastPath);
  }
}
