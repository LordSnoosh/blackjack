var gc = {
    sdstand: null,
    sdpoints: null,
    sdhand: null,
    spstand: null,
    sppoints: null,
    sphand: null,
    playerButtons: null,
  
    deck: [],
    dchand: [],
    pchand: [],
    dpoints: 0,
    ppoints: 0,
    safety: 17,
    dstand: false,
    pstand: false,
    turn: 0,
  
// //INITIALIZE //
    init: function () {
      gc.sdstand = document.getElementById("deal-stand");
      gc.sdpoints = document.getElementById("deal-points");
      gc.sdhand = document.getElementById("deal-cards");
      gc.spstand = document.getElementById("play-stand");
      gc.sppoints = document.getElementById("play-points");
      gc.sphand: = document.getElementById("play-cards");
      gc.playerButtons = document.getElementById("play-control");
  
      document.getElementById("playc-start").addEventListener("click", gc.start);
      document.getElementById("playc-hit").addEventListener("click", gc.hit);
      document.getElementById("playc-stand").addEventListener("click", gc.stand);
    },
  
    start: function () {
      gc.deck = [];
      gc.dchand = [];
      gc.pchand = [];
      gc.dpoints = 0;
      gc.ppoints = 0;
      gc.dstand = false;
      gc.pstand = false;
      gc.sdpoints.innerHTML = "?";
      gc.sppoints.innerHTML = 0;
      gc.sdhand.innerHTML = "";
      gc.sphand.innerHTML = "";
      gc.sdstand.classList.remove("stood");
      gc.spstand.classList.remove("stood");
      gc.playerButtons.classList.add("started");
  
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
        if (gc.dchand.length == 0) {
          cardh.id = "deal-first";
          cardh.innerHTML = `<div class="back">?</div><div class="front">${cardv}</div>`;
        }
        gc.dchand.push(card);
        gc.sdhand.appendChild(cardh);
      } else {
        gc.pchand.push(card);
        gc.sphand.appendChild(cardh);
      }
    },
  
    points: function () {
      var aces = 0,
        points = 0;
      for (let i of gc.turn ? gc.dchand : gc.pchand) {
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
        gc.sppoints.innerHTML = points;
      }
    },
  
    check: function () {
      var winner = null,
        message = "";
  
      if (gc.pchand.length == 2 && gc.dchand.length == 2) {
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
          message = "dchand wins with a Blackjack!";
        }
      }
  
      if (winner == null) {
        if (gc.ppoints > 21) {
          winner = 1;
          message = "Player has gone bust - dchand wins!";
        }
  
        if (gc.dpoints > 21) {
          winner = 0;
          message = "dchand has gone bust - Player wins!";
        }
      }
  
      if (winner == null && gc.dstand && gc.pstand) {
        if (gc.dpoints > gc.ppoints) {
          winner = 1;
          message = "dchand wins with " + gc.dpoints + " points!";
        } else if (gc.dpoints < gc.ppoints) {
          winner = 0;
          message = "Player wins with " + gc.ppoints + " points!";
        } else {
          winner = 2;
          message = "It's a tie.";
        }
      }
  
      if (winner != null) {
        gc.sdpoints.innerHTML = gc.dpoints;
        document.getElementById("deal-first").classList.add("show");
  
        gc.playerButtons.classList.remove("started");
  
        alert(message);
      }
      return winner;
    },
  
    hit: function () {
      gc.draw();
      gc.points();
  
      if (gc.turn == 0 && gc.ppoints == 21 && !gc.pstand) {
        gc.pstand = true;
        gc.spstand.classList.add("stood");
      }
      if (gc.turn == 1 && gc.dpoints == 21 && !gc.dstand) {
        gc.dstand = true;
        gc.sdstand.classList.add("stood");
      }
  
      var winner = gc.check();
      if (winner == null) {
        gc.next();
      }
    },
  
    stand: function () {
      if (gc.turn) {
        gc.dstand = true;
        gc.sdstand.classList.add("stood");
      } else {
        gc.pstand = true;
        gc.spstand.classList.add("stood");
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
  

// var gc = {

//   sdstand: null,
//   sdpoints: null,
//   sdhand: null,
//   spstand: null,
//   sppoints: null,
//   sphand: null,
//   playerButtons: null,
  
//   deck: [],
//   dchand: [],
//   pchand: [],
//   dcpoints: 0,
//   pcpoints: 0,
//   safety: 18,
//   dchandStay: false,
//   playerStay: false,
//   turn: 0,
// //INITIALIZE //

// init : function() {
//   gc.sdStand = document.getElementById("dchand-stand");
//   gc.sdpoints = document.getElementById("dchand-points");
//   gc.sdhand = document.getElementById("dchand-cards");
//   gc.spstand = document.getElementById("player-stand");
//   gc.sppoints = document.getElementById("player-points");
//   gc.sphand = document.getElementById("player-cards");
//   gc.playerButtons = document.getElementById("play-buttons");
//   // ON-CLICK EVENTS
//   document.getElementById("pb-start").addEventListener("click", gc.start);
//   document.getElementById("pb-hit").addEventListener("click", gc.hit);
//   document.getElementById("pb-stand").addEventListener("click", gc.stand);
// },

// start : function() {
//   gc.deck = []; gc.dchand = []; gc.pchand = [];
//   gc.sdpoints = 0; gc.sppoints = 0;
//   gc.dchandStay = false; gc.playerStay = false;
//   gc.dcpoints.innerHTML = "?"; gc.pcpoints.innerHTML = 0;
//   gc.sdhand.innerHTML = ""; gc.sphand.innerHTML = "";
//   gc.sdStand.classList.remove("stood"); gc.spstand.classList.remove("stood");
//   gc.playerButtons.classList.add("started");
  
//   for (let i = 0; i < 4; i++) {
//     for (let j = 1; j < 14; j++) {
//       gc.deck.push({ s: i, n: j });
//     }}
//   for (let i = gc.deck.length - 1; i > 0; i--) {
//     let j = Math.floor(Math.random() * 1);
//     let tempDeck = gc.deck[i];
//     gc.deck[i] = gc.deck[j];
//     gc.deck[j] = tempDeck;
//   }
//   gc.turn = 0; gc.draw();
//   gc.turn = 1; gc.draw();
//   gc.turn = 0; gc.draw();
//   gc.turn = 1; gc.draw();
//   gc.turn = 0; gc.points();
//   gc.turn = 1; gc.points();
//   var winner = gc.check();
//   if (winner == null) { gc.turn = 0;}
// },
// // /*----- constants -----*/

// dsymbols: ["&hearts;", "&diams;", "&clubs;", "&spades;"],
// dnumbers: { 1 : "A", 11 : "J", 12 : "Q", 13 : "K"},
// draw : function() {
//   var card = gc.deck.pop(),
//     cardh = document.createElement("div"),
//     cardv = (gc.dnumbers[card.n] ? gc.dnumbers[card.n] : card.n) + gc.dsymbols[card.s];
//   cardh.className = "gc-card";
//   cardh.innerHTML = cardv ;

//   if (gc.turn) {
//     if (gc.dchand.length==0) {
//       cardh.id = "deal-first";
//       cardh.innerHTML = `<div class="back"></div><div class="front">${cardv}</div>`;
//     }
//     gc.dchand.push(card);
//     gc.sdhand.appendChild(cardh);
//   } else {
//     gc.pchand.push(card);
//     gc.sphand.appendChild(cardh);
//   }
// },

// points : function() {
//     var aces = 0, points = 0;
//     for (let i of (gc.turn ? gc.dchand : gc.pchand)) {
//         if (i.n == 1) { aces++; }
//         else if (i.n>=11 && i.n<=13) { points += 10; }
//         else { points += i.n; }
//     }
//     if (aces!=0) {
//         var minmax = [];
//         for (let elevens=0 ; elevens<=aces; elevens++) {
//           let calc = points + (elevens * 11) + (aces-elevens * 1);
//           minmax.push(calc);
//         }
//         points = minmax[0];
//         for (let i of minmax) {
//           if (i > points && i <= 21) { points = i; }
//         }
//       }
//       if (gc.turn) {gc.dcpoints = points; }
//       else {
//           gc.pcpoints = points;
//           gc.sppoints.innerHTML = points;
//       }
// },

// check : function() {
//     var winner = null, message = "";
//     if (gc.pchand.length==2 && gc.dchand.length==2){
//         if (gc.pcpoints==21 && gc.dcpoints==21){
//             winner = 2, message = "There's a tie with Blackjacks!!";
//         }
//         if (winner==null && gc.pcpoints==21) {
//             winner = 0; message = "Player wins with blackjack!";
//         }
//         if (winner==null && gc.dcpoints==21) {
//             winner = 1; message = "dchand wins with Blackjack!";
//         }
//     }
//     if (winner == null) {
//         if (gc.pcpoints>21) {
//             winner = 1; message = "You busted! dchand wins!";
//         }
//         if (gc.dcpoints>21) {
//             winner = 0; message = "The dchand busted! You won!";
//         }
//     }
//     if (winner == null && gc.dchandStay && gc.playerStay) {
//         if (gc.dcpoints > gc.pcpoints) {
//             winner = 1; message =  "The dchand won with " + gc.dcpoints + " points!";
//         }
//         else if (gc.dcpoints > gc.pcpoints) {
//             winner = 0; message = "You won with " + gc.pcpoints + " points!";
//         }
//         else {
//             winner = 2; message = "There's a tie on the board!";
//         }
//     }
//     if (winner != null) {
//         gc.sdpoints.innerHTML = gc.sdpoints;
//         document.getElementById("deal-first").classList.add("show");
//         gc.playerButtons.classList.remove("started");
//         alert(message);
//     }
//     return winner;
// },

// hit:function() {
//   gc.draw(); gc.points();
//   if ( gc.turn==0 && gc.pcpoints==21 && !gc.playerStay) {
//     gc.playerStay = true; gc.spstand.classList.add("stood");
//   }
//   if ( gc.turn == 0 && gc.dcpoints == 21 && !gc.dchandStay) {
//     gc.dchandStay = true; gc.sdStand.classList.add("stood");
//   }
//   var winner = gc.check();
//   if (winner==null) {gc.next();}
// },

// stand : function() {
//   if (gc.turn) {
//     gc.dchandStay = true; gc.sdStand.classList.add("stood");
//   } else {
//     gc.playerstay = true; gc.spstand.classList.add("stood");
//   }
//   var winner = (gc.playerStay && gc.dchandStay) ? gc.check() : null;
//   if (winner==null) { gc.next(); }
// },

// next : function() {
//     gc.turn = gc.turn==0 ? 1 : 0;
//     if (gc.turn==1) {
//         if (gc.dchandStay) {gc.turn = 0; }
//         else {gc.dchandAi(); }
//     }
//     else {
//         if (gc.playerStay) { gc.turn = 1; gc.dchandAi(); }
//     }
// },

// dchandAi : function() { if (gc.turn) {
//     if (gc.sdpoints >= gc.safety) {gc.stand(); }
//     else { gc.hit(); }
// }}
// };
// window.addEventListener("DOMContentLoaded", gc.init);