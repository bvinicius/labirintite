const fs = require('fs');

const maze = fs.readFileSync('maze.txt')
    .toString()
    .split('\r\n')
    .map(line => line.split(' '));

