
const player = new Audio();
const bgPlayer = document.getElementById("bg-player");
const bgCheckbox = document.querySelector('input[type="checkbox"]');
bgPlayer.volume = 0.2;
bgCheckbox.addEventListener("change", handleBgChanged);
function handleBgChanged() {
  bgCheckbox.checked ? bgPlayer.play() : bgPlayer.pause();
}

//this feels like a terrible idea...//
var gc = {
  dealerstand: null,
  dealerpoints: null,
  dealerhand: null,
  playerstand: null,
  playerpoints: null,
  playerhand: null,
  playerbtns: null,

  deck: [],
  dealercards: [],
  playercards: [],
  dealerpoint: 0,
  playerpoint: 0,
  safety: 18,
  dealerstanding: false,
  playerstanding: false,
  turn: 0,

  init: function () {
    gc.dealerstand = document.getElementById("dealer-stand");
    gc.dealerpoints = document.getElementById("dealer-points");
    gc.dealerhand = document.getElementById("dealer-cards");
    gc.playerstand = document.getElementById("player-stand");
    gc.playerpoints = document.getElementById("player-points");
    gc.playerhand = document.getElementById("player-cards");
    gc.playerbtns = document.getElementById("player-buttons");

    document.getElementById("pb-start").addEventListener("click", gc.startGame);
    document.getElementById("pb-hit").addEventListener("click", gc.hitting);
    document.getElementById("pb-stand").addEventListener("click", gc.standing);
  },

  startGame: function () {
    gc.deck = [];
    gc.dealercards = [];
    gc.playercards = [];
    gc.dealerpoint = 0;
    gc.playerpoint = 0;
    gc.dealerstanding = false;
    gc.playerstanding = false;
    gc.dealerpoints.innerHTML = "?";
    gc.playerpoints.innerHTML = 0;
    gc.dealerhand.innerHTML = "";
    gc.playerhand.innerHTML = "";
    gc.dealerstand.classList.remove("stood");
    gc.playerstand.classList.remove("stood");
    gc.playerbtns.classList.add("started");

    for (let i = 0; i < 4; i++) {
      for (let j = 1; j < 14; j++) {
        gc.deck.push({ s: i, n: j });
      }
    }

    for (let i = gc.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i);
      let temp = gc.deck[i];
      gc.deck[i] = gc.deck[j];
      gc.deck[j] = temp;
    }

    gc.turn = 0;
    gc.dealCards();
    gc.turn = 1;
    gc.dealCards();
    gc.turn = 0;
    gc.dealCards();
    gc.turn = 1;
    gc.dealCards();

    gc.turn = 0;
    gc.points();
    gc.turn = 1;
    gc.points();
    var winner = gc.checkWinner();
    if (winner == null) {
      gc.turn = 0;
    }
  },

  dsymbols: ["&hearts;", "&diams;", "&clubs;", "&spades;"],
  dnum: { 1: "A", 11: "J", 12: "Q", 13: "K" },

  dealCards: function () {
    var card = gc.deck.pop(),
      cardh = document.createElement("div"),
      cardv =
        (gc.dnum[card.n] ? gc.dnum[card.n] : card.n) + gc.dsymbols[card.s];
    cardh.className = "gc-card";
    cardh.innerHTML = cardv;
    if (gc.turn) {
      if (gc.dealercards.length == 0) {
        cardh.id = "deal-first";
        cardh.innerHTML = `<div class="back">?</div><div class="front">${cardv}</div>`;
      }
      gc.dealercards.push(card);
      gc.dealerhand.appendChild(cardh);
    } else {
      gc.playercards.push(card);
      gc.playerhand.appendChild(cardh);
    }
  },

  points: function () {
    var aces = 0,
      points = 0;
    for (let i of gc.turn ? gc.dealercards : gc.playercards) {
      if (i.n == 1) {
        aces++;
      } else if (i.n >= 11 && i.n <= 13) {
        points += 10;
      } else {
        points += i.n;
      }
    }

    if (aces != 0) {
      var minmax = [];
      for (let elevens = 0; elevens <= aces; elevens++) {
        let calc = points + elevens * 11 + (aces - elevens * 1);
        minmax.push(calc);
      }
      points = minmax[0];
      for (let i of minmax) {
        if (i > points && i <= 21) {
          points = i;
        }
      }
    }

    if (gc.turn) {
      gc.dealerpoint = points;
    } else {
      gc.playerpoint = points;
      gc.playerpoints.innerHTML = points;
    }
  },

  checkWinner: function () {
    var winner = null,
      message = "";

    if (gc.playercards.length == 2 && gc.dealercards.length == 2) {
      if (gc.playerpoint == 21 && gc.dealerpoint == 21) {
        winner = 2;
        message = "It's a tie with Blackjacks";
      }

      if (winner == null && gc.playerpoint == 21) {
        winner = 0;
        message = "Player wins with Blackjack!";
      }

      if (winner == null && gc.dealerpoint == 21) {
        winner = 1;
        message = "Dealer wins with Blackjack!";
      }
    }

    if (winner == null) {
      if (gc.playerpoint > 21) {
        winner = 1;
        message = "Player has busted! Dealer wins!";
      }

      if (gc.dealerpoint > 21) {
        winner = 0;
        message = "Dealer has busted! - Player wins!";
      }
    }

    if (winner == null && gc.dealerstanding && gc.playerstanding) {
      if (gc.dealerpoint > gc.playerpoint) {
        winner = 1;
        message = "Dealer wins with " + gc.dealerpoint + " points!";
      } else if (gc.dealerpoint < gc.playerpoint) {
        winner = 0;
        message = "Player wins with " + gc.playerpoint + " points!";
      } else {
        winner = 2;
        message = "It's a tie!";
      }
    }

    if (winner != null) {
      gc.dealerpoints.innerHTML = gc.dealerpoint;
      document.getElementById("deal-first").classList.add("show");

      gc.playerbtns.classList.remove("started");

      alert(message);
    }
    return winner;
  },

  hitting: function () {
    gc.dealCards();
    gc.points();

    if (gc.turn == 0 && gc.playerpoint == 21 && !gc.playerstanding) {
      gc.playerstanding = true;
      gc.playerstand.classList.add("stood");
    }
    if (gc.turn == 1 && gc.dealerpoint == 21 && !gc.dealerstanding) {
      gc.dealerstanding = true;
      gc.dealerstand.classList.add("stood");
    }

    var winner = gc.checkWinner();
    if (winner == null) {
      gc.nextTurn();
    }
  },

  standing: function () {
    if (gc.turn) {
      gc.dealerstanding = true;
      gc.dealerstand.classList.add("stood");
    } else {
      gc.playerstanding = true;
      gc.playerstand.classList.add("stood");
    }

    var winner =
      gc.playerstanding && gc.dealerstanding ? gc.checkWinner() : null;
    if (winner == null) {
      gc.nextTurn();
    }
  },

  nextTurn: function () {
    gc.turn = gc.turn == 0 ? 1 : 0;

    if (gc.turn == 1) {
      if (gc.dealerstanding) {
        gc.turn = 0;
      } else {
        gc.ai();
      }
    } else {
      if (gc.playerstanding) {
        gc.turn = 1;
        gc.ai();
      }
    }
  },

  ai: function () {
    if (gc.turn) {
      if (gc.dealerpoint >= gc.safety) {
        gc.standing();
      } else {
        gc.hitting();
      }
    }
  },
};
window.addEventListener("DOMContentLoaded", gc.init);
//I've made a terrible mistake...//
