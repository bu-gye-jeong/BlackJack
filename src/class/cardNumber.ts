export const cardNumbers = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
type CardNumbers = typeof cardNumbers[number];

export class CardNumber {
  readonly cardNum: CardNumbers;
  constructor(cardNum: CardNumbers) {
    this.cardNum = cardNum;
  }
  score() {
    if (this.cardNum === "A") return { score: 1, isA: true };
    let num = +this.cardNum;
    return { score: isNaN(num) ? 10 : num, isA: false };
  }
  toString() {
    return this.cardNum as string;
  }
}
