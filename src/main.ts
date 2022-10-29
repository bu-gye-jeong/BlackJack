import { Game } from "./class/game";
import "./style.css";

let game = new Game(100);
const startButton = document.getElementById("startButton");
const betInput = document.getElementById("betAmount") as HTMLInputElement;
betInput?.addEventListener("input", () => {
  game.gameState !== "idle" || +betInput.value > game.credit || +betInput.value <= 0
    ? startButton?.classList.add("disabled")
    : startButton?.classList.remove("disabled");
});
if (betInput)
  startButton?.addEventListener("click", () => {
    if (!startButton.classList.contains("disabled")) {
      startButton.classList.add("disabled");
      betInput.readOnly = true;
      game.start(+betInput.value);
    }
  });
const hitButton = document.getElementById("hitButton");
hitButton?.addEventListener("click", () => game.hit());
const stayButton = document.getElementById("stayButton");
stayButton?.addEventListener("click", () => game.stay());
const doubleDownButton = document.getElementById("doubleDownButton");
doubleDownButton?.addEventListener("click", () => game.doubleDown());
