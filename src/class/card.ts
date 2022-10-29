import { CardNumber, cardNumbers } from "./cardNumber";
import { CardShape, cardShapes } from "./cardShape";

export type Side = "back" | "front";

export class Card {
  readonly shape: CardShape;
  readonly num: CardNumber;
  side: Side;
  element: HTMLElement;
  constructor(shape: CardShape, num: CardNumber, side: Side = "front") {
    this.num = num;
    this.shape = shape;
    this.side = side;
    this.element = document.createElement("div");
    this.element.classList.add("card");
    this.element.classList.add(this.shape.color() as string);
    this.element.classList.add("backAnimation");
    this.element.innerText = "";
    this.element.classList.add("back");
    setTimeout(() => this.setSide(side), 1);
  }

  setSide(side: Side) {
    this.side = side;
    if (side === "back") {
      this.element.classList.add("backAnimation");
      setTimeout(() => {
        this.element.innerText = "";
        this.element.classList.add("back");
      }, 150);
    } else {
      this.element.classList.remove("backAnimation");
      setTimeout(() => {
        this.element.classList.remove("back");
        this.element.innerText = `${this.shape}\n${this.num}`;
      }, 150);
    }
  }

  static genRandom(side: Side = "front"): Card {
    const shape = cardShapes[Math.floor(Math.random() * cardShapes.length)];
    const num = cardNumbers[Math.floor(Math.random() * cardNumbers.length)];
    return new Card(new CardShape(shape), new CardNumber(num), side);
  }

  get score() {
    return this.num.score();
  }
}
