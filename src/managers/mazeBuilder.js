class MazeBuilder {
  build(matrix, $table) {
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
}

export default new MazeBuilder();
