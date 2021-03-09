const player = new Audio();
const bgPlayer = document.getElementById("bg-player");
const bgCheckbox = document.querySelector('input[type="checkbox"]');
bgPlayer.volume = 0.3;
bgCheckbox.addEventListener("change", handleBgChanged);
function handleBgChanged() {
  bgCheckbox.checked ? bgPlayer.play() : bgPlayer.pause();
}

var gc = {
  hdstand: null,
  hdpoints: null,
  hdhand: null,
  hpstand: null,
  hppoints: null,
  hphand: null,
  hpcon: null,

  deck: [],
  dealer: [],
  player: [],
  dpoints: 0,
  ppoints: 0,
  safety: 17,
  dstand: false,
  pstand: false,
  turn: 0,

  init: function () {
    gc.hdstand = document.getElementById("dealer-stand");
    gc.hdpoints = document.getElementById("dealer-points");
    gc.hdhand = document.getElementById("dealer-cards");
    gc.hpstand = document.getElementById("player-stand");
    gc.hppoints = document.getElementById("player-points");
    gc.hphand = document.getElementById("player-cards");
    gc.hpcon = document.getElementById("player-buttons");

    document.getElementById("pb-start").addEventListener("click", gc.start);
    document.getElementById("pb-hit").addEventListener("click", gc.hit);
    document.getElementById("pb-stand").addEventListener("click", gc.stand);
  },

  start: function () {
    gc.deck = [];
    gc.dealer = [];
    gc.player = [];
    gc.dpoints = 0;
    gc.ppoints = 0;
    gc.dstand = false;
    gc.pstand = false;
    gc.hdpoints.innerHTML = "?";
    gc.hppoints.innerHTML = 0;
    gc.hdhand.innerHTML = "";
    gc.hphand.innerHTML = "";
    gc.hdstand.classList.remove("stood");
    gc.hpstand.classList.remove("stood");
    gc.hpcon.classList.add("started");

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
    gc.draw();
    gc.turn = 1;
    gc.draw();
    gc.turn = 0;
    gc.draw();
    gc.turn = 1;
    gc.draw();

    gc.turn = 0;
    gc.points();
    gc.turn = 1;
    gc.points();
    var winner = gc.check();
    if (winner == null) {
      gc.turn = 0;
    }
  },

  dsymbols: ["&hearts;", "&diams;", "&clubs;", "&spades;"],
  dnum: { 1: "A", 11: "J", 12: "Q", 13: "K" },
  draw: function () {
    var card = gc.deck.pop(),
      cardh = document.createElement("div"),
      cardv =
        (gc.dnum[card.n] ? gc.dnum[card.n] : card.n) + gc.dsymbols[card.s];
    cardh.className = "gc-card";
    cardh.innerHTML = cardv;
    if (gc.turn) {
      if (gc.dealer.length == 0) {
        cardh.id = "deal-first";
        cardh.innerHTML = `<div class="back">?</div><div class="front">${cardv}</div>`;
      }
      gc.dealer.push(card);
      gc.hdhand.appendChild(cardh);
    } else {
      gc.player.push(card);
      gc.hphand.appendChild(cardh);
    }
  },

  points: function () {
    var aces = 0,
      points = 0;
    for (let i of gc.turn ? gc.dealer : gc.player) {
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
      gc.dpoints = points;
    } else {
      gc.ppoints = points;
      gc.hppoints.innerHTML = points;
    }
  },

  check: function () {
    var winner = null,
      message = "";

    if (gc.player.length == 2 && gc.dealer.length == 2) {
      if (gc.ppoints == 21 && gc.dpoints == 21) {
        winner = 2;
        message = "It's a tie with Blackjacks";
      }

      if (winner == null && gc.ppoints == 21) {
        winner = 0;
        message = "Player wins with a Blackjack!";
      }

      if (winner == null && gc.dpoints == 21) {
        winner = 1;
        message = "Dealer wins with a Blackjack!";
      }
    }

    if (winner == null) {
      if (gc.ppoints > 21) {
        winner = 1;
        message = "Player has gone bust - Dealer wins!";
      }

      if (gc.dpoints > 21) {
        winner = 0;
        message = "Dealer has gone bust - Player wins!";
      }
    }

    if (winner == null && gc.dstand && gc.pstand) {
      if (gc.dpoints > gc.ppoints) {
        winner = 1;
        message = "Dealer wins with " + gc.dpoints + " points!";
      } else if (gc.dpoints < gc.ppoints) {
        winner = 0;
        message = "Player wins with " + gc.ppoints + " points!";
      } else {
        winner = 2;
        message = "It's a tie.";
      }
    }

    if (winner != null) {
      gc.hdpoints.innerHTML = gc.dpoints;
      document.getElementById("deal-first").classList.add("show");

      gc.hpcon.classList.remove("started");

      alert(message);
    }
    return winner;
  },

  hit: function () {
    gc.draw();
    gc.points();

    if (gc.turn == 0 && gc.ppoints == 21 && !gc.pstand) {
      gc.pstand = true;
      gc.hpstand.classList.add("stood");
    }
    if (gc.turn == 1 && gc.dpoints == 21 && !gc.dstand) {
      gc.dstand = true;
      gc.hdstand.classList.add("stood");
    }

    var winner = gc.check();
    if (winner == null) {
      gc.next();
    }
  },

  stand: function () {
    if (gc.turn) {
      gc.dstand = true;
      gc.hdstand.classList.add("stood");
    } else {
      gc.pstand = true;
      gc.hpstand.classList.add("stood");
    }

    var winner = gc.pstand && gc.dstand ? gc.check() : null;
    if (winner == null) {
      gc.next();
    }
  },

  next: function () {
    gc.turn = gc.turn == 0 ? 1 : 0;

    if (gc.turn == 1) {
      if (gc.dstand) {
        gc.turn = 0;
      } else {
        gc.ai();
      }
    } else {
      if (gc.pstand) {
        gc.turn = 1;
        gc.ai();
      }
    }
  },

  ai: function () {
    if (gc.turn) {
      if (gc.dpoints >= gc.safety) {
        gc.stand();
      } else {
        gc.hit();
      }
    }
  },
};
window.addEventListener("DOMContentLoaded", gc.init);


