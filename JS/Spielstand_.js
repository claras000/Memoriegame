/*JS Datei für die Spielstand.html die immer sichtbar ist
*Datenbank Daten von Level, Spiele und Karten werden in die html Tabelle hinzugefügt
*dabei werden die levelShow.php, spielShow.php und die cardShow.php benutzt
*/


var playerName; //konstante für Hover und weiterleiten auf Playerseite
var spielerList = [];

var playerData = []; //Eventhandler für HTML

// Beim Laden der Webseite wird die Funktion setup() aufgerufen
window.addEventListener("load", setup);
function setup() {
  showLevel();
  showCard();
  showSpieler();
  setTimeout(function () {
    showSpiel();
  }, 500);
}

/**
 * Level werden angezeigt
 */
function showLevel() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowLevel);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/levelShow.php");
  xmlhttp.send();
}

//Level anzeigen
// die Ajaxanfrage wird in eine Json-Liste umgewandelt
function ajaxShowLevel(event) {
  var myObj = JSON.parse(event.target.responseText);

  // Tabelle-Rumpf
  var tbody = document.getElementById("resultLevel");
  for (var i = 0; i < myObj.length; i++) {
    var tr = document.createElement("tr");

    var td1 = document.createElement("td");
    var level = myObj[i]["level"];
    td1.appendChild(document.createTextNode(level));
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    var anzahl_karten = myObj[i]["anzahl_karten"];
    td2.appendChild(document.createTextNode(anzahl_karten));
    tr.appendChild(td2);

    var td3 = document.createElement("td");
    var spielZeit = myObj[i]["spielZeit"];
    td3.appendChild(document.createTextNode(spielZeit));
    tr.appendChild(td3);

    tbody.appendChild(tr);
  }
}

// Registrierung Ajax-Events f�r das Anzeigen aller Karte und sende eine Anfrage
function showCard() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowCard);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/cardShow.php");
  xmlhttp.send();
}

// Falls die Karten erfolgreicht aus der Datenbank geholt sind ...
function ajaxShowCard(event) {
  var myObj = JSON.parse(event.target.responseText);

  // Tabelle-Rumpf
  var tbody = document.getElementById("resultCard");
  for (var i = 0; i < myObj.length; i++) {
    var tr = document.createElement("tr");

    var td1 = document.createElement("td");
    var name = myObj[i]["name"];
    td1.appendChild(document.createTextNode(name));
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    var bild = myObj[i]["bild"];
    var img = document.createElement("IMG");
    img.height = 90;
    img.width = 90;
    img.src = bild;
    td2.appendChild(img);
    tr.appendChild(td2);

    var td3 = document.createElement("td");
    var artist = myObj[i]["artist"];
    var img = document.createElement("IMG");
    img.height = 90;
    img.width = 90;
    img.src = artist;
    td3.appendChild(img);
    tr.appendChild(td3);

    tbody.appendChild(tr);
  }
}

// Falls eine Ajax-Anfrage gescheitert ist ...
function ajaxFehler(event) {
  alert(event.target.statusText);
}

//clara
// Funktion zum Anzeigen der Spielerseite und Aktualisierung der Spielerinformationen
function showPlayerPage(playerName) {
  // Spielerseite anzeigen

  document.getElementById("player-page").style.display = "block";

  // Spielername in der Überschrift anzeigen

  document.getElementById("player-name").innerHTML =
    "<b>" + playerName + "</b>";

  // Spielerinformationen aktualisieren
  const playerInfo = playerData[playerName];
  const gameListBody = document.getElementById("game-list-body");
  //gameListBody.innerHTML = ""; // Vorherige Einträge löschen

  playerInfo.forEach((game) => {
    const row = document.createElement("tr");
    const dateCell = createTableCell(game.date);
    const levelCell = createTableCell(game.level);
    const durationCell = createTableCell(game.duration);
    const playerCountCell = createTableCell(game.playerCount);
    const winnerNameCell = createTableCell(game.winnerName);
    const statusCell = createTableCell(game.status);

    row.appendChild(dateCell);
    row.appendChild(levelCell);
    row.appendChild(durationCell);
    row.appendChild(playerCountCell);
    row.appendChild(winnerNameCell);
    row.appendChild(statusCell);

    gameListBody.appendChild(row);
  });
}

// Funktion zum Erstellen einer Tabellenzelle mit dem gegebenen Inhalt
function createTableCell(content) {
  const cell = document.createElement("td");
  const span = document.createElement("span");
  span.innerHTML = content;
  cell.appendChild(span);
  return cell;
}

// Funktion zum Sortieren der Tabelle nach Spieldatum oder Level
function sortTable(columnIndex) {
  var table = document.getElementById("game-list");
  var tbody = table.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");
  var sortedRows = Array.from(rows);

  sortedRows.sort(function (a, b) {
    var aValue = a.getElementsByTagName("td")[columnIndex].textContent;
    var bValue = b.getElementsByTagName("td")[columnIndex].textContent;
    return aValue.localeCompare(bValue);
  });

  for (var i = 0; i < sortedRows.length; i++) {
    tbody.appendChild(sortedRows[i]);
  }
}

/**
 * level werden angezeigt
 */
function showSpiel() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowSpiel);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/spielShow.php");
  xmlhttp.send();
}

//Level anzeigen
// die Ajaxanfrage wird in eine Json-Liste umgewandelt

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

    // Tabelle-Rumpf
    var tbody = document.getElementById("resultGame");
    for (var i = 0; i < myObj.length; i++) {
      var tr = document.createElement("tr");

        var td1 = document.createElement("td");
        var einzeln = myObj[i]["einzeln"];
        if (einzeln == 1) einzeln = "ja";
        td1.appendChild(document.createTextNode(einzeln));
        tr.appendChild(td1);

      var td1 = document.createElement("td");
      var Datetime = myObj[i]["Datetime"];
      td1.appendChild(document.createTextNode(Datetime));
      tr.appendChild(td1);

      var td1 = document.createElement("td");
      var dauer = myObj[i]["dauer"];
      td1.appendChild(document.createTextNode(dauer));
      tr.appendChild(td1);

      var td1 = document.createElement("td");
      var verlauf = myObj[i]["verlauf"];
      td1.appendChild(document.createTextNode(verlauf));
      tr.appendChild(td1);

      var td1 = document.createElement("td");
      var mitspieler = getPlayerByID(spielerList, myObj[i]["mitspieler"]);

      if (mitspieler.spielname == 0) {
        mitspieler.spielname = "-";
      }
      td1.appendChild(document.createTextNode(mitspieler.spielname));
      tr.appendChild(td1);

      var td2 = document.createElement("td");
      var gewinner = getPlayerByID(spielerList, myObj[i]["gewinner"]);

      td2.appendChild(document.createTextNode(gewinner.spielname));
      tr.appendChild(td2);

      var td1 = document.createElement("td");
      var initiator = getPlayerByID(spielerList, myObj[i]["initiator"]);
      td1.appendChild(document.createTextNode(initiator.spielname));
      tr.appendChild(td1);

        var td1 = document.createElement("td");
        var level = myObj[i]["level"];
        td1.appendChild(document.createTextNode(level));
        tr.appendChild(td1);;

      tbody.appendChild(tr);
    }
  }
}

// Spieler laden für Double Spiel
/**
 * Karten werden angezeigt
 */
function showSpieler() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowSpieler);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/playerShow.php");
  xmlhttp.send();
}
/**
 * Ajax schlägt fehl
 * @param {} event
 */
function ajaxFehler(event) {
  alert(event.target.statusText);
}

/**
 * Gibt den angemeldeten Player zurück der über ID gesucht wird
 *
 *
 * @param {*} data
 * @param {*} id
 * @returns
 */
function getPlayerByID(data, id) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      return data[i];
    }
  }
  return null; // Wenn keine Übereinstimmung gefunden wurde
}

//karten anzeigen
// die Ajaxanfrage wird in eine Json-Liste umgewandelt
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