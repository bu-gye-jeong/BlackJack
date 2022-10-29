export const cardShapes = ["diamond", "clover", "spade", "heart"] as const;
type CardShapes = typeof cardShapes[number];
type CardColor = "red" | "black";
const toStr: { [key in CardShapes]: string } = {
  diamond: "♦️",
  clover: "♣️",
  spade: "♠",
  heart: "♥",
};
const toColor: { [key in CardShapes]: CardColor } = {
  diamond: "red",
  clover: "black",
  spade: "black",
  heart: "red",
};

export class CardShape {
  readonly shape: CardShapes;
  constructor(shape: CardShapes) {
    this.shape = shape;
  }
  toString() {
    return toStr[this.shape];
  }
  color(): CardColor {
    return toColor[this.shape];
  }
}
