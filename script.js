let deck = [];
let dealerHand = [];
let playerHand = [];

let hiddenCard = null;
let dealerSum = 0;
let dealerAceCount = 0;

let playerSum = 0;
let playerAceCount = 0;

const dealerDiv = document.getElementById("dealer-cards");
const playerDiv = document.getElementById("player-cards");
const messageDiv = document.getElementById("message");

const dealBtn = document.getElementById("deal");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");

dealBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);

function buildDeck() {
  const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
  const suits = ["C","D","H","S"];
  deck = [];

  for (let s of suits) {
    for (let v of values) {
      deck.push({ value: v, suit: s });
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function cardValue(card) {
  if ("AJQK".includes(card.value)) {
    if (card.value === "A") return 11;
    return 10;
  }
  return parseInt(card.value);
}

function isAce(card) {
  return card.value === "A";
}

function reducePlayerAce() {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount--;
  }
}

function reduceDealerAce() {
  while (dealerSum > 21 && dealerAceCount > 0) {
    dealerSum -= 10;
    dealerAceCount--;
  }
}

function startGame() {
  buildDeck();
  shuffleDeck();

  dealerHand = [];
  playerHand = [];

  dealerSum = 0;
  dealerAceCount = 0;

  hiddenCard = deck.pop();
  dealerSum += cardValue(hiddenCard);
  dealerAceCount += isAce(hiddenCard) ? 1 : 0;

  let card = deck.pop();
  dealerSum += cardValue(card);
  dealerAceCount += isAce(card) ? 1 : 0;
  dealerHand.push(card);

  playerSum = 0;
  playerAceCount = 0;

  for (let i = 0; i < 2; i++) {
    card = deck.pop();
    playerSum += cardValue(card);
    playerAceCount += isAce(card) ? 1 : 0;
    playerHand.push(card);
  }

  hitBtn.disabled = false;
  standBtn.disabled = false;

  messageDiv.textContent = "";
  render(false);
}

function hit() {
  const card = deck.pop();
  playerSum += cardValue(card);
  playerAceCount += isAce(card) ? 1 : 0;
  playerHand.push(card);

  reducePlayerAce();

  if (playerSum > 21) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    endGame();
  }

  render(false);
}

function stand() {
  hitBtn.disabled = true;
  standBtn.disabled = true;

  while (dealerSum < 17) {
    const card = deck.pop();
    dealerSum += cardValue(card);
    dealerAceCount += isAce(card) ? 1 : 0;
    dealerHand.push(card);
  }

  endGame();
}

function endGame() {
  reduceDealerAce();
  reducePlayerAce();

  let msg = "";

  if (playerSum > 21) msg = "You Lose!";
  else if (dealerSum > 21) msg = "You Win!";
  else if (playerSum === dealerSum) msg = "It's a tie!";
  else if (playerSum > dealerSum) msg = "You Win!";
  else msg = "You Lose!";

  messageDiv.textContent = msg;

  render(true);
}

function render(revealHidden) {
  dealerDiv.innerHTML = "";
  playerDiv.innerHTML = "";

  const hiddenImg = document.createElement("img");
  hiddenImg.className = "card";
  hiddenImg.src = revealHidden ? `cards/${hiddenCard.value}-${hiddenCard.suit}.png`
                               : "cards/BACK.png";
  dealerDiv.appendChild(hiddenImg);

  for (let c of dealerHand) {
    const img = document.createElement("img");
    img.className = "card";
    img.src = `cards/${c.value}-${c.suit}.png`;
    dealerDiv.appendChild(img);
  }

  for (let c of playerHand) {
    const img = document.createElement("img");
    img.className = "card";
    img.src = `cards/${c.value}-${c.suit}.png`;
    playerDiv.appendChild(img);
  }
}
