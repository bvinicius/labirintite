import { cellValues } from "../model/cellValues";

class MazeBuilder {
  constructor() {
    this.$_agent = null;
  }

  get $agent() {
    if (!this.$_agent) {
      this.$_agent = document.createElement("div");
      this.$_agent.classList.add("agent");
    }

    return this.$_agent;
  }

  build(matrix, $table) {
    this.$rootElement = $table;
    matrix.forEach((row) => {
      const $row = document.createElement("tr");
      row.forEach((cell) => {
        const $cell = document.createElement("td");
        switch (cell) {
          case cellValues.FREE:
            $cell.classList.add("free");
            break;
          case cellValues.WALL:
            $cell.classList.add("wall");
            break;
          case cellValues.COIN:
            $cell.classList.add("coin");
            break;
          case cellValues.START:
            $cell.classList.add("start");
            break;
          case cellValues.DESTINATION:
            $cell.classList.add("end");
            break;
        }
        $cell.classList.add("point");
        $row.appendChild($cell);
      });
      $table.appendChild($row);
    });
  }

  async go(path, delay = 250) {
    this.$agent.remove();
    for (let step of path) {
      await this._setAgentPosition(step[0], step[1], delay);
    }
  }

  _setAgentPosition(row, column, delay) {
    const $row = this.$rootElement.children[row];
    if (!$row) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const $point = $row.children[column];
        $point && $point.appendChild(this.$agent);
        resolve();
      }, delay);
    });
  }
}

export default new MazeBuilder();
