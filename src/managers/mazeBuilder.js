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
          case "0":
            $cell.classList.add("free");
            break;
          case "1":
            $cell.classList.add("wall");
            break;
          case "E":
            $cell.classList.add("start");
            break;
          case "S":
            $cell.classList.add("end");
            break;
        }
        $cell.classList.add("point");
        $row.appendChild($cell);
      });
      $table.appendChild($row);
    });
  }

  setAgentPosition([row, column]) {
    console.log("setAngentPosition");
    const $row = this.$rootElement.children[row];
    if (!$row) {
      return;
    }

    const $point = $row.children[column];
    $point && $point.appendChild(this.$agent);
  }
}

export default new MazeBuilder();
