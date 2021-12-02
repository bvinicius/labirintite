class Neuron {
    constructor(weights, layer) {
        this.weights = weights;
        this.layer = layer;
        this.activations = [];
        this.fnDefaultActivationFunction = (x) => x;
    }

    get bias() {
        return this.weights[0];
    }

    /**
     * Recebe uma lista com os números de "ativação" da camada anterior.
     * Número de ativação é o número calculado do neurônio. 
     * @param {Array<number>} arrActivations
     * Se este neurônio fizer parte da camada de entrada, o `arrActivations` será a lista dos estados das células vizinhas e da posição do agente.
     * Se este neurônio fizer parte da camada de saída, o `arrActivations` será a lista do `Y` de cada neurônio da camada anterior.
     */
    setActivations(arrActivations) {
        this.activations = [...arrActivations];
    }

    /**
     * Calcula o valor "final" do neurônio de acordo com os pesos e os valores da camada anterior.
     * @param {Function} normalizationFuncion a função de normalização do resultado calculado, ex: Sigmoide. Caso não informado, não é feita nenhuma normalização sobre o valor.
     * @returns 
     */
    getActivation(fnActivation = this.fnDefaultActivationFunction) {
        const productSum = this.weights
            .slice(1)
            .map((weight, index) => weight * this.activations[index])
            .reduce((prev, curr) => prev + curr);

        return fnActivation(productSum + this.bias);
    }

    flush() {
        this.activations = [];
    }

    relu(x) {
        return Math.max(0, x);
    }
}
export default Neuron;
