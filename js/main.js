var gc = {

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
//INITIALIZE //

init : function() {
  gc.dealerStand = document.getElementById("dealer-stand");
  gc.dealerPoints = document.getElementById("dealer-points");
  gc.dealerHand = document.getElementById("dealer-cards");
  gc.playerStand = document.getElementById("player-stand");
  gc.playerPoints = document.getElementById("player-points");
  gc.playerHand = document.getElementById("player-cards");
  gc.playerButtons = document.getElementById("play-buttons");
  // ON-CLICK EVENTS
  document.getElementById("pb-start").addEventListener("click", gc.start);
  document.getElementById("pb-hit").addEventListener("click", gc.hit);
  document.getElementById("pb-stand").addEventListener("click", gc.stand);
},

start : function() {
  gc.deck = [];
  gc.dealerCurHand = [];
  gc.playerCurHand = [];
  gc.dealerPoints = 0;
  gc.playerPoints = 0;
  gc.dealerStay = false;
  gc.playerStay = false;
  gc.dealerCurPoints.innerHTML = 0;
  gc.playerCurPoints.innerHTML = 0;
  gc.dealerHand.innerHTML = "";
  gc.playerHand.innerHTML = "";
  gc.dealerStand.classList.remove("stood");
  gc.playerStand.classList.remove("stood");
  gc.playerButtons.classList.add("started");
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 14; j++) {
      gc.deck.push({ s: i, n: j });
    }}
  for (let i = gc.deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * 1);
    let tempDeck = gc.deck[i];
    gc.deck[i] = gc.deck[j];
    gc.deck[j] = tempDeck;
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
// /*----- constants -----*/\

decksymbols: ["&hearts;", "&diams;", "&clubs;", "&spades;"],
deckNumbers: { 1 : "A", 11 : "J", 12 : "Q", 13 : "K"},
draw : function() {
  var card = gc.deck.pop(),
    cardh = document.createElement("div"),
    cardv = (gc.deckNumbers[card.n] ? gc.deckNumbers[card.n] : card.n) + gc.decksymbols[card.s];
  cardh.className = "gc-card";
  cardh.innerHTML = cardv ;

  if (gc.turn) {
    if (gc.dealerCurHand.length==0) {
      cardh.id = "deal-first";
      cardh.innerHTML = `<div class="back"></div><div class="front">${cardv}</div>`;
    }
    gc.dealerCurHand.push(card);
    gc.dealerHand.appendChild(cardh);
  } else {
    gc.playerCurHand.push(card);
    gc.playerHand.appendChild(cardh);
  }
},

points:function() {
    var aces = 0, points = 0;
    for (let i of (gc.turn ? gc.dealerCurHand : gc.playerCurHand)) {
        if (i.n == 1) { aces++; }
        else if (i.n >= 11 && i.n <= 13) { points += 10; }
        else { points += i.n; }
    }
    if (aces!=0) {
        var minmax = [];
        for (let elevens =0 ; elevens <= aces; elevens++) {
          let calc = points + (elevens * 11) + (aces-elevens * 1);
          minmax.push(calc);
        }
        points = minmax[0];
        for (let i of minmax) {
          if (i > points && i <= 21) { points = i; }
        }
      }
      if (gc.turn) {gc.dealerCurPoints = points; }
      else {
          gc.playerCurPoints = points;
          gc.playerPoints.innerHTML = points;
      }
},

check:function() {
    var winner = null, message = "";
    if (gc.playerCurHand.length==2 && gc.dealerCurHand.length==2){
        if (gc.playerCurPoints==21 && gc.dealerCurPoints==21){
            winner = 2, message = "There's a tie with Blackjacks!!";
        }
        if (winner==null && gc.playerCurPoints==21) {
            winner = 0; message = "Player wins with blackjack!";
        }
        if (winner==null && gc.dealerCurPoints==21) {
            winner = 1; message = "Dealer wins with Blackjack!";
        }
    }
    if (winner == null) {
        if (gc.playerCurPoints > 21) {
            winner = 1; message = "You busted! Dealer wins!";
        }
        if (gc.dealerCurPoints > 21) {
            winner = 0; message = "The Dealer busted! You won!";
        }
    }
    if (winner == null && gc.dealerStay && gc.playerStay) {
        if (gc.dealerCurPoints > gc.playerCurPoints) {
            winner = 1; message =  "The Dealer won with " + gc.dealerCurPoints + " points!";
        }
        else if (gc.playerCurPoints > gc.dealerCurPoints) {
            winner = 0; message = "You won with " + gc.playerCurPoints + " points!";
        }
        else {
            winner = 2; message = "There's a tie on the board!";
        }
    }
    if (winner != null) {
        gc.dealerPoints.innerHTML = gc.dealerPoints;
        document.getElementById("deal-first").classList.add("show");
        gc.playerButtons.classList.remove("started");
        alert(message);
    }
    return winner;
},

hit:function() {
  gc.draw();
  gc.points();
  if (
    gc.turn == 0 &&
    gc.playerCurPoints == 21 &&
    !gc.playerStay
  ) {
    gc.playerStay = true;
    gc.playerStay.classList.add("stood");
  }
  if (
    gc.turn == 0 &&
    gc.dealerCurPoints == 21 &&
    !gc.dealerStay
  ) {
    gc.dealerStay = true;
    gc.dealerStay.classList.add("stood");
  }
  var winner = gc.check();
  if (winner==null) {gc.next();}
},

stand:function() {
  if (gc.turn) {
    gc.dealerStay = true;
    gc.dealerStand.classList.add("stood");
  } else {
    gc.playerstay = true;
    gc.playerStand.classList.add("stood");
  }
  var winner =
    gc.playerStay && gc.dealerStay
      ? gc.check()
      : null;
  if (winner == null) {
    gc.next();
  }
},

next:function() {
    gc.turn = gc.turn==0 ? 1 : 0;
    if (gc.turn==1) {
        if (gc.dealerStay) {gc.turn = 0; }
        else {gc.dealerAi();}
    }
    else {
        if (gc.playerstay) {gc.turn = 1; gc.dealerAi() ;}
    }
},

dealerAi:function() { if (gc.turn) {
    if (gc.dealerPoints >= gc.safety) {gc.stand();}
    else {gc.hit();}
}}
};
window.addEventListener("DOMContentLoaded", gc.init);