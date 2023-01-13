import { PlayerData } from "./playerData";

interface GameData {
  bet: number;
  dealer: PlayerData;
  player: PlayerData;
}

type GameState = "idle" | "playing" | "ended";
const dealerOpenDelay = 700;

export class Game {
  _credit: number = 0;
  gameState: GameState = "idle";
  gameData: GameData | undefined;

  constructor(credit: number) {
    this.credit = credit;
  }

  get credit(): number {
    return this._credit;
  }

  set credit(value: number) {
    const creditButton = document.getElementById("credit");
    if (creditButton) creditButton.innerHTML = "Credit\n" + value;
    this._credit = value;
  }

  start(bet: number) {
    if (this.gameState !== "idle") return;
    this.gameState = "playing";
    this.credit -= bet;
    this.gameData?.player.empty();
    this.gameData?.dealer.empty();
    this.gameData = {
      bet,
      dealer: new PlayerData("dealerCards"),
      player: new PlayerData("playerCards"),
    };

    document.getElementById("bustMessage")?.classList.add("hidden");
    document.getElementById("message")?.classList.add("hidden");
    this.gameData.dealer.draw("back");
    this.gameData.dealer.draw();
    this.gameData.player.draw();
    this.gameData.player.draw();
    if (this.gameData.player.blackJack) {
      if (this.gameData.dealer.blackJack) this.dealerTurn();
      else this.end("player", 1.5);
    }
  }

  hit() {
    if (this.gameState !== "playing" || !this.gameData) return;
    this.gameData.player.draw();
    if (this.gameData.player.bust) this.bust();
  }

  bust() {
    if (this.gameState !== "playing" || !this.gameData) return;
    this.gameState = "ended";
    setTimeout(() => {
      this.bustMessage("You busted!");
      this.end("dealer");
    }, 500);
  }

  stay() {
    if (this.gameState !== "playing" || !this.gameData) return;
    this.gameState = "ended";
    this.dealerTurn();
  }

  doubleDown() {
    if (this.gameState !== "playing" || !this.gameData) return;
    this.credit += this.gameData.bet;
    this.gameData.bet += Math.min(this.credit - this.gameData.bet, this.gameData.bet);
    const betInput = document.getElementById("betAmount") as HTMLInputElement;
    if (betInput) betInput.value = this.gameData.bet + "";
    this.credit -= this.gameData.bet;
    this.hit();
    this.gameState = "ended";
    setTimeout(() => this.dealerTurn(), dealerOpenDelay);
  }

  dealerTurn() {
    if (this.gameState !== "ended" || !this.gameData) return;
    this.gameData.dealer.cards[0].setSide("front");
    setTimeout(() => this.openDealer(), dealerOpenDelay);
  }

  openDealer() {
    if (this.gameState !== "ended" || !this.gameData) return;
    if (this.gameData.dealer.bust) {
      this.bustMessage("Dealer busted!");
      this.end("player");
    } else if (this.gameData.dealer.maxScore <= 16) {
      this.gameData.dealer.draw();
      setTimeout(() => this.openDealer(), dealerOpenDelay);
    } else {
      if (this.gameData.dealer.maxScore === this.gameData.player.maxScore) this.end("draw");
      else if (this.gameData.dealer.maxScore < this.gameData.player.maxScore) this.end("player");
      else this.end("dealer");
    }
  }

  end(winner: "dealer" | "player" | "draw", mul: number = 1) {
    if (this.gameState === "idle" || !this.gameData) return;
    this.message(
      { dealer: "You lost!", player: "You won!", draw: "Draw" }[winner],
      { dealer: "lose", player: "win", draw: "normal" }[winner] as "win" | "lose" | "normal"
    );
    if (winner === "player") this.credit += (1 + mul) * this.gameData.bet;
    if (winner === "draw") this.credit += this.gameData.bet;
    this.gameState = "idle";
    const betInput = document.getElementById("betAmount") as HTMLInputElement;
    if (betInput) {
      betInput.value = "";
      betInput.readOnly = false;
    }
  }

  message(msg: string, color: "bust" | "win" | "lose" | "normal") {
    const messageDiv = document.getElementById("message");
    if (!messageDiv) return;
    messageDiv.innerText = msg;
    messageDiv.classList.remove("hidden", "bust", "win", "lose", "normal");
    messageDiv.classList.add(color);
  }

  bustMessage(msg: string) {
    const bustMessage = document.getElementById("bustMessage");
    if (bustMessage) bustMessage.innerText = msg;
    bustMessage?.classList.remove("hidden");
  }
}
