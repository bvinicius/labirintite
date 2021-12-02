import Neuron from "./neuron";

class NeuralNetwork {

    constructor(inputsAmount, inNeuronsAmount, outNeuronsAmount, weights) {
        this.inputsAmount = inputsAmount;
        this.inNeuronsAmount = inNeuronsAmount;
        this.outNeuronsAmount = outNeuronsAmount;
        this.inLayer = [];
        this.outLayer = [];
        this.mountGraph(weights);
    }

    mountGraph(weights) {
        const arrWeights = [...weights];

        const inLayer = [];
        const outLayer = [];
        for (let i = 0; i < this.inNeuronsAmount; i++) {
            inLayer.push([]);
            for (let j = 0; j < this.inputsAmount + 1; j++) {
                inLayer[i].push(arrWeights.shift());
            }
        }

        for (let i = 0; i < this.outNeuronsAmount; i++) {
            outLayer.push([]);
            for (let j = 0; j < this.inNeuronsAmount + 1; j++) {
                outLayer[i].push(arrWeights.shift());
            }
        }

        this.inLayer = inLayer.map(weights => new Neuron(weights, 0));
        this.outLayer = outLayer.map(weights => new Neuron(weights, 1));
    }

    getOutput(objInputParameters) {
        const arrInputParameters = Object.values(objInputParameters);
        const arrInNeuronsActivations = [];
        const arrOutNeuronsActivations = [];
        this.inLayer.forEach(neuron => {
            neuron.setActivations(arrInputParameters);
            arrInNeuronsActivations.push(neuron.getActivation(neuron.relu));
        });
        this.outLayer.forEach(neuron => {
            neuron.setActivations(arrInNeuronsActivations);
            arrOutNeuronsActivations.push(neuron.getActivation());
        });

        const maxActivation = arrOutNeuronsActivations.reduce((prev, curr) => Math.max(prev || -10, curr || -10));

        return arrOutNeuronsActivations.findIndex(value => value === maxActivation);
    }

}
export default NeuralNetwork;
