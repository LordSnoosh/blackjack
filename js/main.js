var gameContent = {
  dealerStand: null,
  dealerPoints: null,
  dealerHand: null,
  playerStand: null,
  playerPoints: null,
  playerHand: null,
  playerButtons: null,
  deck: [],
  dealerCurHand: [],
  playerCurHand: [],
  dealerCurPoints: 0,
  playerCurPoints: 0,
  safety: 18,
  dealerStay: false,
  playerStay: false,
  turn: 0,
};

//INITIALIZE //

function init() {
  gameContent.dealerStand = document.getElementById("dealer-stand");
  gameContent.dealerPoints = document.getElementById("dealer-points");
  gameContent.dealerHand = document.getElementById("dealer-cards");
  gameContent.playerStand = document.getElementById("player-stand");
  gameContent.playerPoints = document.getElementById("player-points");
  gameContent.playerHand = document.getElementById("player-cards");
  gameContent.playerButtons = document.getElementById("play-buttons");
  // ON-CLICK EVENTS
  document
    .getElementById("pb-start")
    .addEventListener("click", gameContent.start);
  document.getElementById("pb-hit").addEventListener("click", gameContent.hit);
  document
    .getElementById("pb-stand")
    .addEventListener("click", gameContent.stand);
}

function start() {
  gameContent.deck = [];
  gameContent.dealerCurHand = [];
  gameContent.playerCurHand = [];
  gameContent.dealerPoints = 0;
  gameContent.playerPoints = 0;
  gameContent.dealerStay = false;
  gameContent.playerStay = false;
  gameContent.dealerCurPoints.innerHTML = "$";
  gameContent.playerCurPoints.innerHTML = 0;
  gameContent.dealerHand.innerHTML = "";
  gameContent.playerHand.innerHTML = "";
  gameContent.dealerStand.classList.remove("stood");
  gameContent.playerStand.classList.remove("stood");
  gameContent.playerButtons.classList.add("started");
  for (let i = 0; i < 4; i++) {
    for (let h = 1; h < 14; h++) {
      gameContent.deck.push({ s: i, n: h });
    }
  }
  for (let i = gameContent.deck.length - 1; i > 0; i--) {
    let h = Math.floor(Math.random() * 1);
    let tempDeck = gameContent.deck[i];
    gameContent.deck[i] = gameContent.deck[h];
    gameContent.deck[h] = tempDeck;
  }
  gameContent.turn = 0;
  gameContent.draw();
  gameContent.turn = 1;
  gameContent.draw();
  gameContent.turn = 0;
  gameContent.draw();
  gameContent.turn = 1;
  gameContent.draw();
  gameContent.turn = 0;
  gameContent.points();
  gameContent.turn = 1;
  gameContent.points();
  var winner = gameContent.check();
  if (winner == null) {
    gameContent.turn = 0;
  }
}
// /*----- constants -----*/\

decksymbols: ["&hearts;", "&diams;", "&clubs;", "&spades"];
deckNumbers: {
  1;
  "A", 11;
  "J", 12;
  "Q", 13;
  ("K");
}

function draw() {
  var card = gameContent.deck.pop(),
    carda = document.createElement("div"),
    cardb =
      (gameContent.deckNumbers[card.n]
        ? gameContent.deckNumbers[card.n]
        : card.n) + gameContent.decksymbols[card.s];
  carda.className = "gameContent-Card";
  carda.innerHTML = cardb;

  if (gameContent.turn) {
    if (gameContent.dealerCurHand.length == 0) {
      carda.id = "deal-first";
      carda.innerHTML = `<div class="back">?</div><div class="front">${cardb}</div>`;
    }
    gameContent.dealerCurHand.push(card);
    gameContent.dealerHand.appendChild(carda);
  } else {
    gameContent.playerCurHand.push(card);
    gameContent.playerHand.appendChild(carda);
  }
}

function points() {}
function check() {}

function hit() {
  gameContent.draw();
  gameContent.points();
  if (
    gameContent.turn == 0 &&
    gameContent.playerCurPoints == 21 &&
    !gameContent.playerStay
  ) {
    gameContent.playerStay = true;
    gameContent.playerStay.classList.add("stood");
  }
  if (
    gameContent.turn == 0 &&
    gameContent.dealerCurPoints == 21 &&
    !gameContent.dealerStay
  ) {
    gameContent.dealerStay = true;
    gameContent.dealerStay.classList.add("stood");
  }
}

function stand() {
  if (gameContent.turn) {
    gameContent.dealerStay = true;
    gameContent.dealerStand.classList.add("stood");
  } else {
    gameContent.playerstay = true;
    gameContent.playerStand.classList.add("stood");
  }
  var winner =
    gameContent.playerStay && gameContent.dealerStay
      ? gameContent.check()
      : null;
  if (winner == null) {
    gameContent.next();
  }
}
function next() {}
function dealerAI() {}

// const suits = ['s', 'c', 'd', 'h'];
// const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// // Build a 'master' deck of 'card' objects used to create shuffled decks
// const masterDeck = buildMasterDeck();
// renderDeckInContainer(masterDeck, document.getElementById('holecards'));

// /*----- app's state (variables) -----*/
// let shuffledDeck;

// /*----- cached element references -----*/
// const shuffledContainer = document.getElementById('holecards');

// /*----- event listeners -----*/
// document.querySelector('button').addEventListener('click', renderShuffledDeck);

// /*----- functions -----*/
// function renderShuffledDeck() {
//   // Create a copy of the masterDeck (leave masterDeck untouched!)
//   const tempDeck = [...masterDeck];
//   shuffledDeck = [];
//   while (tempDeck.length) {
//     // Get a random index for a card still in the tempDeck
//     const rndIdx = Math.floor(Math.random() * tempDeck.length);
//     // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
//     shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
//   }
//   renderDeckInContainer(shuffledDeck, shuffledContainer);
// }

// function renderDeckInContainer(deck, container) {
//   container.innerHTML = 'null';
//   // Let's build the cards as a string of HTML
//   // Use reduce when you want to 'reduce' the array into a single thing - in this case a string of HTML markup
//   const cardsHtml = deck.reduce(function(src, card) {
//     return src + `<div class="card ${card.face}"></div>`;
//   }, '');
//   container.innerHTML = cardsHtml;
// }

// function buildMasterDeck() {
//   const deck = [];
//   // Use nested forEach to generate card objects
//   suits.forEach(function(suit) {
//     ranks.forEach(function(rank) {
//       deck.push({
//         // The 'face' property maps to the library's CSS classes for cards
//         face: `${suit}${rank}`,
//         // Setting the 'value' property for game of blackjack, not war
//         value: Number(rank) || (rank === 'A' ? 11 : 10)
//       });
//     });
//   });
//   return deck;
// }

// renderShuffledDeck();
