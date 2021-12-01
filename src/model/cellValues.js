export const cellValues = Object.freeze({
    OUT: "-1",
    FREE: "0",
    WALL: "1",
    COIN: "2",
    DESTINATION: "3",
    START: "4"
});

export const normalizedCellValues = Object.freeze({
    [cellValues.OUT]: 0.1,
    [cellValues.FREE]: 0.2,
    [cellValues.WALL]: 0.3,
    [cellValues.COIN]: 0.4,
    [cellValues.DESTINATION]: 0.5,
    [cellValues.START]: 0.6
});