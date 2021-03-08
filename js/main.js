var bj = {
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
      bj.hdstand = document.getElementById("dealer-stand");
      bj.hdpoints = document.getElementById("dealer-points");
      bj.hdhand = document.getElementById("dealer-cards");
      bj.hpstand = document.getElementById("player-stand");
      bj.hppoints = document.getElementById("player-points");
      bj.hphand = document.getElementById("player-cards");
      bj.hpcon = document.getElementById("player-control");
  
      document.getElementById("pb-start").addEventListener("click", bj.start);
      document.getElementById("pb-hit").addEventListener("click", bj.hit);
      document.getElementById("pb-stand").addEventListener("click", bj.stand);
    },
  
    start: function () {
      bj.deck = [];
      bj.dealer = [];
      bj.player = [];
      bj.dpoints = 0;
      bj.ppoints = 0;
      bj.dstand = false;
      bj.pstand = false;
      bj.hdpoints.innerHTML = "?";
      bj.hppoints.innerHTML = 0;
      bj.hdhand.innerHTML = "";
      bj.hphand.innerHTML = "";
      bj.hdstand.classList.remove("stood");
      bj.hpstand.classList.remove("stood");
      bj.hpcon.classList.add("started");
  
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 14; j++) {
          bj.deck.push({ s: i, n: j });
        }
      }
  
      for (let i = bj.deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = bj.deck[i];
        bj.deck[i] = bj.deck[j];
        bj.deck[j] = temp;
      }
  
      bj.turn = 0;
      bj.draw();
      bj.turn = 1;
      bj.draw();
      bj.turn = 0;
      bj.draw();
      bj.turn = 1;
      bj.draw();
  
      bj.turn = 0;
      bj.points();
      bj.turn = 1;
      bj.points();
      var winner = bj.check();
      if (winner == null) {
        bj.turn = 0;
      }
    },
  
    dsymbols: ["&hearts;", "&diams;", "&clubs;", "&spades;"],
    dnum: { 1: "A", 11: "J", 12: "Q", 13: "K" },
    draw: function () {
      var card = bj.deck.pop(),
        cardh = document.createElement("div"),
        cardv =
          (bj.dnum[card.n] ? bj.dnum[card.n] : card.n) + bj.dsymbols[card.s];
      cardh.className = "bj-card";
      cardh.innerHTML = cardv;
      if (bj.turn) {
        if (bj.dealer.length == 0) {
          cardh.id = "deal-first";
          cardh.innerHTML = `<div class="back">?</div><div class="front">${cardv}</div>`;
        }
        bj.dealer.push(card);
        bj.hdhand.appendChild(cardh);
      } else {
        bj.player.push(card);
        bj.hphand.appendChild(cardh);
      }
    },
  
    points: function () {
      var aces = 0,
        points = 0;
      for (let i of bj.turn ? bj.dealer : bj.player) {
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
  
      if (bj.turn) {
        bj.dpoints = points;
      } else {
        bj.ppoints = points;
        bj.hppoints.innerHTML = points;
      }
    },
  
    check: function () {
      var winner = null,
        message = "";
  
      if (bj.player.length == 2 && bj.dealer.length == 2) {
        if (bj.ppoints == 21 && bj.dpoints == 21) {
          winner = 2;
          message = "It's a tie with Blackjacks";
        }
  
        if (winner == null && bj.ppoints == 21) {
          winner = 0;
          message = "Player wins with a Blackjack!";
        }
  
        if (winner == null && bj.dpoints == 21) {
          winner = 1;
          message = "Dealer wins with a Blackjack!";
        }
      }
  
      if (winner == null) {
        if (bj.ppoints > 21) {
          winner = 1;
          message = "Player has gone bust - Dealer wins!";
        }
  
        if (bj.dpoints > 21) {
          winner = 0;
          message = "Dealer has gone bust - Player wins!";
        }
      }
  
      if (winner == null && bj.dstand && bj.pstand) {
        if (bj.dpoints > bj.ppoints) {
          winner = 1;
          message = "Dealer wins with " + bj.dpoints + " points!";
        } else if (bj.dpoints < bj.ppoints) {
          winner = 0;
          message = "Player wins with " + bj.ppoints + " points!";
        } else {
          winner = 2;
          message = "It's a tie.";
        }
      }
  
      if (winner != null) {
        bj.hdpoints.innerHTML = bj.dpoints;
        document.getElementById("deal-first").classList.add("show");
  
        bj.hpcon.classList.remove("started");
  
        alert(message);
      }
      return winner;
    },
  
    hit: function () {
      bj.draw();
      bj.points();
  
      if (bj.turn == 0 && bj.ppoints == 21 && !bj.pstand) {
        bj.pstand = true;
        bj.hpstand.classList.add("stood");
      }
      if (bj.turn == 1 && bj.dpoints == 21 && !bj.dstand) {
        bj.dstand = true;
        bj.hdstand.classList.add("stood");
      }
  
      var winner = bj.check();
      if (winner == null) {
        bj.next();
      }
    },
  
    stand: function () {
      if (bj.turn) {
        bj.dstand = true;
        bj.hdstand.classList.add("stood");
      } else {
        bj.pstand = true;
        bj.hpstand.classList.add("stood");
      }
  
      var winner = bj.pstand && bj.dstand ? bj.check() : null;
      if (winner == null) {
        bj.next();
      }
    },
  
    next: function () {
      bj.turn = bj.turn == 0 ? 1 : 0;
  
      if (bj.turn == 1) {
        if (bj.dstand) {
          bj.turn = 0;
        } else {
          bj.ai();
        }
      } else {
        if (bj.pstand) {
          bj.turn = 1;
          bj.ai();
        }
      }
    },
  
    ai: function () {
      if (bj.turn) {
        if (bj.dpoints >= bj.safety) {
          bj.stand();
        } else {
          bj.hit();
        }
      }
    },
  };
  window.addEventListener("DOMContentLoaded", bj.init);
  