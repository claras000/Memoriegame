/**
 * Hier ist die Logik des Spiels
 * spiel.html ist die dazugehörige  HTML
 * Oben befindet sich die Logk für ein single Payer Spiel
 *
 * Unten die für ein Double Player Spiel
 * Double Player befindet sich noch in einem unfertigen Zustand
 * Wir wollten zeign, dass man eine erste Anrfage über die Tabelle Messages zu einer anderen Session schicken kann
 */

//Alle nötigen Konstanten für die Logik
const moves = document.getElementById("movesCount");
const timeValue = document.getElementById("time");
const starButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls.container");
var cards;
var interval;
var firstCard = false;
var secondCard = false;
var cardPair = 0;
var cardList = new Array();
var card = 0;
var inGame = false;
var timerId;
var levelStartTime = 180; //   Sekunden für Spieldauer
var startTime = levelStartTime; // startzeit am spielanfang
var spielerId; //spieler der Session
var statusAngemeldet; //angemeldet status
var currentLevel; //aktuelles Level wird gesetzt
var cardAnzahl; //Anzahl der karten je nach Level

//variablen für hochladen eines neuen Spiels
var einzeln = 1; // Beispielwert für einzeln (1 oder 0)
var Datetime = "2023-08-04 12:00"; // Beispielwert für Datetime
var dauer = 60; // Beispielwert für dauer
var verlauf = "verloren"; // Beispielwert für verlauf
var mitspieler = "NULL"; // Beispielwert für mitspieler
var gewinner = "NULL"; // Beispielwert für gewinner
var initiator = "NULL"; // Beispielwert für initiator

//die php Anfragen von Ajax werden in diesen Listen gespeichert
//Spielkarten keine Paare
var items = [];
//Spielkarten mit Paaren (doppelt so lang)
var MemoryList = [];
//Spierler für doppelspiel
var spielerList = [];
//SpielList
var spielList = [];
//Liste der Spieler des selben Levels
var spielerSameLevel = [];
//Level Liste
var levelList = [];

//Eventhandler für HTML
window.addEventListener("load", setup);
function setup() {
  var elem = document.getElementById("start");
  elem.addEventListener("click", SpielStarten);
  var elem = document.getElementById("stop");
  elem.addEventListener("click", SpielStop);
  var elem = document.getElementById("doubleGame");
  elem.addEventListener("click", startDoubleGame);
  showResult();
  checkSession();
  showSpieler();
  showSpiel();
}

//leere karten werden gezeichnet
function drawMemory() {
  const currentCards = items.slice(0, cardAnzahl); //An dieser Stelle qird die Kartenanzahl gesetzt je nach Spielerlevel passend
  MemoryList = currentCards.concat(currentCards);
  var ULlist = document.getElementById("cards"); // Aus Karten Paare machen
  displayMemoryList(); // Karten mischen

  for (var i = 0; i < MemoryList.length; i++) {
    var index = i;
    card = document.createElement("IMG");
    card.setAttribute("src", "../images/leerKarte.png");
    card.setAttribute("alt", items[0].title);
    card.setAttribute("id", index);
    card.className = "gameCard";
    card.style.width = "134px";
    card.style.height = "162px";
    card.style.borderRadius = "17px";
    card.style.border = "2px solid rgba(74, 104, 183)";
    card.style.margin = "5px";
    card.style.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.3)";

    if (window.matchMedia("(max-width: 700px)").matches) {
      // If media query matches
      card.style.width = "67px";
      card.style.height = "81px";
    } else {
      card.style.width = "16%";
    }

    cardList.push(card);
    ULlist.appendChild(cardList[i]);

    card.addEventListener("click", showCard);
  }
}

//karten können noch zweimal umgedreht werden
var uncoverCards = 0;
//Karte umdrehen
function showCard() {
  console.log(this.getAttribute("id"));

  //hier wird von der Memorylist das jeweilige Element aufgerufen
  //Bedingung das nicht die selbe Karte angewählt wird
  if (
    uncoverCards <= 2 &&
    this.getAttribute("src") != "../images/keineKarte.png"
  ) {
    this.setAttribute("src", MemoryList[this.getAttribute("id")].src);

    uncoverCards += 1;
    if (uncoverCards == 1) {
      firstCard = this;
    }
    if (uncoverCards == 2) {
      if (this != firstCard) {
        secondCard = this;
        uncoverCards += 1;

        if (firstCard.src == secondCard.src) {
          setTimeout(pairCard, 1000);
        } else {
          setTimeout(returnCard, 1000);
        }
      } else {
        uncoverCards -= 1;
      }
    }
  }
}

/**
 * Karte umdrehen
 */
function returnCard() {
  // Code, der erst nach 3 Sekunden ausgeführt wird
  firstCard.setAttribute("src", "../images/leerKarte.png");
  secondCard.setAttribute("src", "../images/leerKarte.png");
  uncoverCards = 0;
}

/**
 * Kartenpaar checken
 */
function pairCard() {
  cardPair += 1;
  document.getElementById("result").innerHTML =
    "Du hast " + cardPair + " Kartenpaare gesammelt.";
  firstCard.setAttribute("src", "../images/keineKarte.png");
  secondCard.setAttribute("src", "../images/keineKarte.png");
  uncoverCards = 0;
  if (cardPair == MemoryList.length / 2) {
    verlauf = "gewonnen";
    SpielStop();
    document.getElementById("gameEnd").innerHTML = "Du hast gewonnen!";
    calculateNewLevel();
    getCurrentDateTime();
    initiator = spielerId;
    var gewinner = spielerId;
    insertSpiel(
      einzeln,
      Datetime,
      dauer,
      verlauf,
      mitspieler,
      gewinner,
      initiator,
      currentLevel
    );
    setup();
  }
}

/**
 * Karten mischen
 */
function displayMemoryList() {
  //random sort memoryList
  for (i = MemoryList.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    k = MemoryList[i];
    MemoryList[i] = MemoryList[j];
    MemoryList[j] = k;
  }
}

/**
 * Spiel starten
 * Anzahl der Karten müssen berechnet werden und Spielzeit.. daher wird erst zur Ajaxanfrage umgeleitet
 */
function SpielStarten() {
  showLevel();
}

/**
 * Spiel wird abgebrochen
 * hier noch ein bug, wenn Spielstop muss man auch wieder Start drücken können
 */
function SpielStop() {
  if (inGame == true) {
    inGame = false;
    var elem = document.getElementById("cards");
    var elemlength = document
      .getElementById("cards")
      .getElementsByClassName("gameCard");
    while (elemlength.length > 0) {
      elem.removeChild(elem.firstElementChild);
    }
    //Variablen werden zurückgesetzt
    document.getElementById("result").innerHTML = " ";
    firstCard = false;
    secondCard = false;
    cardPair = 0;
    cardList = new Array();
    items = [];
    MemoryList = [];
    showResult();
    checkSession();
    showSpieler();
    showSpiel();
    clearInterval(timerId);
    if (startTime > 0 && verlauf !== "gewonnen") {
      document.getElementById("gameEnd").innerHTML =
        "Du hast das Spiel gestoppt. Das Spiel gilt als abgebrochen!";
      spielDauer(); // berechnet Spieldauer
      getCurrentDateTime(); // berechnet aktuelles Datum
      verlauf = "abgebrochen";
      initiator = spielerId;
      insertSpiel(
        einzeln,
        Datetime,
        dauer,
        verlauf,
        mitspieler,
        gewinner,
        initiator,
        currentLevel
      );
    }
  } else {
    document.getElementById("gameEnd").innerHTML =
      "Du musst das Spiel starten, um es zu beenden.";
  }
}
var winNumber = 0;

function calculateNewLevel() {
  let winNumber = 0; // Initialisierung der Gewinnanzahl
  for (let i = 0; i < spielList.length; i++) {
    console.log("alle levels" + spielList[i].level);
    if (spielList[i].level == currentLevel) {
      winNumber += 1;
    }
  }

  console.log("aktuelles level" + currentLevel);
  console.log(" Levellist Länge " + levelList.length);

  console.log("winnumber" + winNumber);
  if (winNumber > 2) {
    console.log("Du hast gewonnen und steigst ein Level auf!");
    document.getElementById("gameEnd").innerHTML =
      "Du hast gewonnen und steigst ein Level auf!";

    // AJAX-Aufruf, um das Spieler-Level in der Datenbank zu erhöhen
    currentLevel = parseInt(currentLevel, 10) + 1;
    console.log("du steigst auf level " + typeof currentLevel + " auf.");

    levelAufsteigen(spielerId);
  }
  //checken ob es noch ein höheres Level gibt
  if (currentLevel > levelList.length) {
    document.getElementById("gameEnd").innerHTML =
      "Du hast gewonnen und steigst ein Level auf! Allerdings gibt es kein höheres Level. Du hast das Spiel durchgespielt.";
  }
}

/**
 * Funktion um ein Level aufzusteigen
 */
function levelAufsteigen(playerId) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText); // Antwort von PHP
      } else {
        console.error("Fehler bei der Anfrage: " + xhr.status);
      }
    }
  };

  xhr.open(
    "GET",
    `../php/increaseLevel.php?playerId=${playerId}&currentLevel=${currentLevel}`,
    true
  );
  xhr.send();
}

/**
 * Countdown wird umgerechnet
 * @param {} seconds
 * @returns
 */
function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * der Countown wird abgedatet
 */
function updateCountdown() {
  var countdownElement = document.getElementById("countdown");
  countdownElement.textContent = formatTime(startTime);

  if (startTime <= 0) {
    clearInterval(timerId);
    SpielStop();
    document.getElementById("gameEnd").innerHTML =
      "Du hast verloren! Du hast das Spiel nicht in angegebener Zeit geschafft.";
    //TO DO Daten einsetzen insert Spiel
    spielDauer(); // berechnet Spieldauer
    getCurrentDateTime(); // berechnet aktuelles Datum
    dauer = levelStartTime; //Startzeit in Sekunden
    verlauf = "verloren";
    initiator = spielerId;
    insertSpiel(
      einzeln,
      Datetime,
      dauer,
      verlauf,
      mitspieler,
      gewinner,
      initiator,
      currentLevel
    );
  }

  startTime--;
}

/**
 * aktuell verbliebene Zeit wird berechnet
 */
function spielDauer() {
  console.log(
    "mein Countdown" + document.getElementById("countdown").innerHTML
  );
  var leftTime = document.getElementById("countdown").innerHTML;
  const [mins, sec] = leftTime.split(":").map(Number);
  var totalSeconds = mins * 60 + sec;
  console.log(totalSeconds);
  console.log(levelStartTime);
  dauer = levelStartTime - totalSeconds;
}

/**
 * Der Countwodn wird gestartet
 */
function startCountdown() {
  startTime = levelStartTime;
  clearInterval(timerId);
  updateCountdown();
  timerId = setInterval(updateCountdown, 1000);
}

/**
 * Countdown wird gestoppt
 */
function stopCountdown() {
  clearInterval(timerId);
}

/**
 * aktuelles datum wird berechnet
 */
function getCurrentDateTime() {
  const now = new Date();

  // Datum
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Uhrzeit
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  Datetime = formattedDateTime;
}

/**
 * Spiel wird gerladen
 */
function showSpiel() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowSpiel);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/spielShow.php");
  xmlhttp.send();
}

/**
 * Spiel wird aus DB ausgegeben und in spielList gespeichert
 * @param {*} event
 */
function ajaxShowSpiel(event) {
  var myObj = JSON.parse(event.target.responseText);

  for (var i = 0; i < myObj.length; i++) {
    var einzeln = myObj[i]["einzeln"];
    var Datetime = myObj[i]["Datetime"];
    var dauer = myObj[i]["dauer"];
    var verlauf = myObj[i]["verlauf"];
    var mitspieler = myObj[i]["mitspieler"];
    var gewinner = myObj[i]["gewinner"];
    var initiator = myObj[i]["initiator"];
    var level = myObj[i]["level"];

    // Ein Objekt mit title und src erstellen
    var item = {
      einzeln: einzeln,
      Datetime: Datetime,
      dauer: dauer,
      verlauf: verlauf,
      mitspieler: mitspieler,
      gewinner: gewinner,
      initiator: initiator,
      level: level,
    };

    // Das erstellte Objekt der Liste hinzufügen

    spielList.push(item);
  }
}

/**
 *  Registrierung Ajax-Events für das Hinzufügen eines Buchs
 * und send eine Anfrage
 *
 * @param {*} einzeln
 * @param {*} Datetime
 * @param {*} dauer
 * @param {*} verlauf
 * @param {*} mitspieler
 * @param {*} gewinner
 * @param {*} initiator
 */
function insertSpiel(
  einzeln,
  Datetime,
  dauer,
  verlauf,
  mitspieler,
  gewinner,
  initiator,
  level
) {
  // var insertButton = document.getElementById("insert");
  // Annahme: Du hast die Spielinformationen in JavaScript-Variablen gespeichert
  var formData = new FormData();

  formData.append("einzeln", einzeln);
  formData.append("Datetime", Datetime);
  formData.append("dauer", dauer);
  formData.append("verlauf", verlauf);
  formData.append("mitspieler", mitspieler);
  formData.append("gewinner", gewinner);
  formData.append("initiator", initiator);
  formData.append("level", level);

  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.addEventListener("load", ajaxInsertSpiel);
  ajaxRequest.addEventListener("error", ajaxFehler);
  ajaxRequest.open("POST", "../php/spielInsert.php");
  ajaxRequest.send(formData);
}

/**
 * falls über Ajax Spiel erfolgreich in DB geladen
 * @param {*} event
 */
function ajaxInsertSpiel(event) {
  document.getElementById("response").innerHTML = this.responseText;
}

/**
 * Falls eine Ajax-Anfrage gescheitert ist ...
 * @param {*} event
 */
function ajaxFehler(event) {
  alert(event.target.statusText);
}

/**
 * Karten werden angezeigt
 */
function showResult() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowCards);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/cardShow.php");
  xmlhttp.send();
}

/**
 * karten anzeigen
 * die Ajaxanfrage wird in eine Json-Liste umgewandelt
 * @param {*} event
 */
function ajaxShowCards(event) {
  var myObj = JSON.parse(event.target.responseText);

  for (var i = 0; i < myObj.length; i++) {
    var title = myObj[i]["name"];
    var bild = myObj[i]["bild"];

    // Ein Objekt mit title und src erstellen
    var item = {
      title: title,
      src: bild,
    };

    // Das erstellte Objekt der Liste hinzufügen
    items.push(item);
  }
  console.log(MemoryList);
}

/**
 * aktuelle Session ausgeben
 * ID und Level werden hier benannt
 */
function checkSession() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        var data = JSON.parse(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        ///Im folgendem werden Items der Navbar ein und ausgebelndet je nach dem wer angemeldet ist
        var login = document.getElementById("Login");
        if (data.isLoggedIn) {
          // Der Benutzer ist angemeldet, und Sie können auf die 'spielerId' zugreifen
          spielerId = data.spielerId; // spielerID speichern
          currentLevel = data.level; //aktuelles Level speichert
          var spielerMail = data.email;

          console.log(
            "Benutzer ist angemeldet. Spieler-ID: " +
              spielerId +
              ". Das ist das aktuelle Level " +
              currentLevel
          );
          statusAngemeldet = true;
          console.log(statusAngemeldet);

          login.style.display = "none";
          if (spielerMail == "admin@memory.de") {
            console.log("Der Admin ist angemeldet");
          }

          //hier wird die navbar gesetzt
          if (spielerMail != "admin@memory.de") {
            console.log("admin ist nicht angemeldet"); // Der admin ist nicht angemeldet check
            //hier alles was speziell für admin raus
            var spieleinstellung = document.getElementById(
              "adminSpielEinstellungen"
            );
            spieleinstellung.style.display = "none";
            var adminSpielinhalt = document.getElementById("adminSpielinhalt");
            adminSpielinhalt.style.display = "none";
          }
        } else {
          console.log("Benutzer ist nicht angemeldet.");
          statusAngemeldet = false;
          //hier alles was User sehen raus

          console.log("Fehler beim Abrufen der Session-Daten.");
          var spieleinstellung = document.getElementById(
            "adminSpielEinstellungen"
          );
          spieleinstellung.style.display = "none";

          var profil = document.getElementById("Profil");
          profil.style.display = "none";

          var playerSpielinhalt = document.getElementById("playerSpielinhalt");
          playerSpielinhalt.style.display = "none";

          var adminSpielinhalt = document.getElementById("adminSpielinhalt");
          adminSpielinhalt.style.display = "none";
        }
      } else {
        //hier alles was user sehen raus muss aus der Nav
        console.log("Fehler beim Abrufen der Session-Daten.");
        var spieleinstellung = document.getElementById(
          "adminSpielEinstellungen"
        );
        spieleinstellung.style.display = "none";

        var profil = document.getElementById("Profil");
        profil.style.display = "none";

        var playerSpielinhalt = document.getElementById("playerSpielinhalt");
        playerSpielinhalt.style.display = "none";

        var adminSpielinhalt = document.getElementById("adminSpielinhalt");
        adminSpielinhalt.style.display = "none";
      }
    }
  };

  var action = "check"; // Die Aktion, die du übergeben möchtest
  var url = "../php/session.php?action=" + action; // Füge die Aktion zur URL hinzu
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send();
}

// Spieler laden für Double Spiel
/**
 * Spieler werden angezeigt geladen
 */
function showSpieler() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowSpieler);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/playerShow.php");

  xmlhttp.send();
}

/**
 * Spieler werden in SpielerList gespeichert
 * @param {*} event
 */
function ajaxShowSpieler(event) {
  var myObj = JSON.parse(event.target.responseText);

  for (var i = 0; i < myObj.length; i++) {
    var id = myObj[i]["id"];
    var spielname = myObj[i]["spielname"];
    var email = myObj[i]["email"];
    var passwort = myObj[i]["passwort"];
    var level = myObj[i]["level"];

    // Ein Objekt mit title und src erstellen
    var item = {
      id: id,
      spielname: spielname,
      email: email,
      passwort: passwort,
      level: level,
    };

    // Das erstellte Objekt der Liste hinzufügen

    spielerList.push(item);
  }
  console.log(spielerList);
}

/**
 * Level werden angezeigt und spiel wird gestartet
 * Man braucht Die Leveldaten , um dass spiel zu setzen nach Karten und Timer
 */
function showLevel() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowLevel);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/levelShow.php");

  xmlhttp.send();
}

/**
 * Level wird in LevelList gespeichert
 * Die Kartenanzahl und die Spielzeit werden berechnet mithilfe der aktuellen SpielerID
 * @param {*} event
 */
function ajaxShowLevel(event) {
  var myObj = JSON.parse(event.target.responseText);

  for (var i = 0; i < myObj.length; i++) {
    var level = myObj[i]["level"];
    var anzahl_karten = myObj[i]["anzahl_karten"];
    var spielZeit = myObj[i]["spielZeit"];
    var level = myObj[i]["level"];

    // Ein Objekt mit title und src erstellen
    var item = {
      level: level,
      anzahl_karten: anzahl_karten,
      spielZeit: spielZeit, //in minuten
      level: level, //in minuten
    };

    // Das erstellte Objekt der Liste hinzufügen

    levelList.push(item);
    if (level == currentLevel) {
      cardAnzahl = anzahl_karten;
      spielZeit = spielZeit * 60; // Minuten aus der DB werden in Sekunden umgewandelt
      levelStartTime = spielZeit;
      console.log(
        "meine kartenanzahl" + cardAnzahl + "meine Spielzeit " + levelStartTime
      );
    } else {
      console.log("kein Paar gefunden, da aktuelle ID noch nicht geladen");
    }
  }
  console.log(levelList);

  //Spiel wird gestartet
  if (statusAngemeldet == true) {
    if (item.length != 0) {
      if (inGame == false) {
        drawMemory();

        startCountdown();
        document.getElementById("result").innerHTML = " ";
        document.getElementById("gameEnd").innerHTML = "";
        document.getElementById("response").innerHTML = " ";
        inGame = true;
      }
    } else {
      document.getElementById("result").innerHTML =
        "Warte einen Moment bis die Spielkarten aus der Datenbank";
    }
  } else {
    document.getElementById("gameEnd").innerHTML =
      "Du musst dich erst Anmelden, damit du Spielen kannst.";
  }
}

/**
 *Spieler laden für Double Spiel
 * Abstatz für Doppelspiel -----------------------------------------------------------------------------------------------
 */
function startDoubleGame() {
  SpielerAnfrage();
  spielerAntwort();
}

/**
 * Spieleranfrage für DoubleGame
 */
function SpielerAnfrage() {
  var currentPlayer = getPlayerByID(spielerList, spielerId);
  var currentPlayers = getPlayersByLevel(spielerList, currentPlayer.level);
  createButtonsFromPlayers(currentPlayers);
}

/**
 * Gibt den angemeldeten Player zurück der über ID gesucht wird
 *
 * @param {*} data
 * @param {*} id
 * @returns
 */
function getPlayerByID(data, id) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return data[i];
    }
  }
  return null; // Wenn keine Übereinstimmung gefunden wurde
}

/**
 *
 * Gibt zurück wechle Spieler das selbe Level haben
 *
 * @param {Liste der Spieler} data
 * @param {Das Level, was der angemeldete Spieler hat
 * } level
 * @returns
 */
function getPlayersByLevel(data, level) {
  var spielerSameLevel = [];

  for (var i = 0; i < data.length; i++) {
    if (data[i].level === level) {
      spielerSameLevel.push(data[i]);
    }
  }

  return spielerSameLevel;
}

var gegner = [];

/**
 * Buttons werden erstellt um request zu senden
 * @param {*} players
 */
function createButtonsFromPlayers(players) {
  var buttonsContainer = document.getElementById("buttonAnfrage"); // Annahme: Hier ist ein HTML-Element für die Buttons
  console.log(players);

  var h2Element = document.createElement("h3");
  h2Element.textContent =
    "Suche dir einen Mitspieler aus und schicke eine Nachricht";
  buttonsContainer.appendChild(h2Element);

  for (var i = 0; i < players.length; i++) {
    if (players[i].spielname != 0) {
      var player = players[i];
      var button = document.createElement("button");
      button.classList.add("button-start");
      button.textContent = player.spielname;
      console.log("test");

      // Verwende eine Hilfsfunktion, um den aktuellen Wert von 'player' in die Klosure einzuschließen
      button.addEventListener("click", createClickListener(player));

      buttonsContainer.appendChild(button);
    }
  }
}

//Anfrage schreiben
function createClickListener(player) {
  return function () {
    console.log(player.spielname);
    mitspieler = player.id;

    var anfrageDiv = document.getElementById("anfrage");

    // Eingabefeld erstellen
    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "messageInput";
    inputField.placeholder = "Nachricht eingeben";
    anfrageDiv.appendChild(inputField);

    // Button erstellen
    var sendButton = document.createElement("button");

    sendButton.classList.add("button-start");

    sendButton.innerText = "Nachricht senden";
    sendButton.addEventListener("click", function () {
      var message = inputField.value;

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "../php/requestDoubleGame.php", true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            anfrageDiv.textContent = xhr.responseText;
          } else {
            alert("Fehler beim Senden der Nachricht.");
          }
        }
      };
      xhr.send(
        "&mitspieler=" +
          encodeURIComponent(mitspieler) +
          "&message=" +
          encodeURIComponent(message) +
          "&sender=" +
          encodeURIComponent(spielerId)
      );
    });

    anfrageDiv.appendChild(sendButton);
  };
}

function spielerAntwort() {
  var anfrageEingehendDiv = document.getElementById("anfrageEingehend");

  var h2Element = document.createElement("h3");
  h2Element.textContent = "Eingegangene Anfragen";
  anfrageEingehendDiv.appendChild(h2Element);

  var receivedRequests = getReceivedRequestsFromDB();

  for (var i = 0; i < receivedRequests.length; i++) {
    var request = receivedRequests[i];
    var requestno = receivedRequests[i];
    var requestDiv = document.createElement("div");

    var requestText = document.createElement("p");
    requestText.textContent = "Anfrage von: " + request.sender;
    requestDiv.appendChild(requestText);

    var requestFrage = document.createElement("p");
    requestFrage.textContent = request.message;
    requestDiv.appendChild(requestFrage);

    var acceptButton = document.createElement("button");
    acceptButton.innerText = "Annehmen";
    acceptButton.classList.add("button-color3");

    acceptButton.addEventListener("click", createAcceptClickListener(request));

    var declinetButton = document.createElement("button");
    declinetButton.innerText = "nicht annehmen";
    declinetButton.classList.add("button-color3");

    declinetButton.addEventListener(
      "click",
      createAcceptClickListener(requestno)
    );

    requestDiv.appendChild(declinetButton);
    anfrageEingehendDiv.appendChild(requestDiv);
  }
}

function getReceivedRequestsFromDB() {
  var mitspieler = spielerId;

  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "../php/requestDoubleGame.php?mitspieler=" + mitspieler,
    false
  ); // Synchroner Request (nicht empfohlen in der Praxis)
  xhr.send();

  if (xhr.status === 200) {
    var response = JSON.parse(xhr.responseText);
    console.log(response);
    return response.receivedRequests;
  } else {
    console.error("Fehler beim Abrufen der empfangenen Anfragen.");
    return [];
  }
}

function updateRequestInDB(requestId, newValue) {
  // Hier die Logik einfügen, um die Anfrage in der DB zu aktualisieren
  // Zum Beispiel durch eine AJAX-Anfrage an den Server
}

function createAcceptClickListener(request) {
  return function () {
    // Hier den Code einfügen, um den Spielzusage-Wert in der DB zu aktualisieren (z.B. per AJAX)
    // und dann das angeklickte Anfrage-Div entfernen oder aktualisieren

    // Beispiel: Annahme der Anfrage durch Aktualisierung des 'spielzusage' auf 1
    updateRequestInDB(request.id, 1); // Annahme: Funktion, um die Anfrage in der DB zu aktualisieren
    alert("Anfrage angenommen!");
  };
}

function createAcceptClickListener(requestno) {
  return function () {
    // Hier den Code einfügen, um den Spielzusage-Wert in der DB zu aktualisieren (z.B. per AJAX)
    // und dann das angeklickte Anfrage-Div entfernen oder aktualisieren

    // Beispiel: Annahme der Anfrage durch Aktualisierung des 'spielzusage' auf 1
    // Annahme: Funktion, um die Anfrage in der DB zu aktualisieren
    alert("Anfrage nicht angenommen!");
  };
}
