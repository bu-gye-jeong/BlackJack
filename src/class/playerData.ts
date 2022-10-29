import { Card, Side } from "./card";

export class PlayerData {
  score = 0;
  aCount = 0;
  cards: Card[];
  constructor(cardsId: string) {
    this.cards = new Proxy([], {
      set: (target: Card[], p, newValue) => {
        let idx = Number(p);
        if (!isNaN(idx)) {
          if (target[idx]) {
            this.score -= target[idx].score.score;
            if (target[idx].score.isA) this.aCount--;
            target[idx].element.remove();
          }
          document.getElementById(cardsId)?.appendChild(newValue.element);
          if (newValue instanceof Card) {
            this.score += newValue.score.score;
            if (newValue.score.isA) this.aCount++;
          }
        }
        Reflect.set(target, p, newValue);
        return true;
      },
    });
  }

  draw(side: Side = "front") {
    this.cards.push(Card.genRandom(side));
  }

  empty() {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      this.score -= this.cards[i].score.score;
      if (this.cards[i].score.isA) this.aCount--;
      this.cards[i].element.remove();
      this.cards.pop();
    }
  }

  get blackJack() {
    return this.maxScore === 21;
  }

  get burst() {
    return this.score > 21;
  }

  get maxScore() {
    const maxA = Math.floor((21 - this.score) / 10);
    return Math.min(maxA, this.aCount) * 10 + this.score;
  }
}
