var playerName; //konstante für Hover und weiterleiten auf Playerseite
var spielerList = [];

var playerData = []; //Eventhandler für HTML
var currentID;
//Tabelle in HTML
var ctx = document.getElementById("myChart").getContext("2d");

//Counter für Diagramm

var gewonnenCounter = 0;
var verlorenCounter = 0;
var abgebrochenCounter = 0;

window.addEventListener("load", setup);
function setup() {
  //Tabelle "registrierte SpielerInnnen" setzen
  // hier wird die übergebene Variable aus dem Link aufgerufen
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get("elem");
  currentID = product;

  document
    .querySelector("#theadGame th:nth-child(8)")
    .addEventListener("click", function () {
      sortTable(7); // Assuming "Level" is the 8th column (0-based index)
    });
  showSpieler();

  setTimeout(function () {
    showSpiel();
  }, 500);
  // Canvas-Element auswählen
  // showPlayerPage(product);
}

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
  var table = document.getElementById("spieler-tabelle");
  var tbody = table.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");
  var sortedRows = Array.from(rows);

  sortedRows.sort(function (a, b) {
    var aValue = a.getElementsByTagName("td")[columnIndex].textContent;
    var bValue = b.getElementsByTagName("td")[columnIndex].textContent;
    if (columnIndex === 7) {
      // If sorting the "Level" column
      return parseInt(bValue) - parseInt(aValue); // Compare as numbers
    } else {
      return aValue.localeCompare(bValue);
    }
  });

  for (var i = 0; i < sortedRows.length; i++) {
    tbody.appendChild(sortedRows[i]);
  }
}

/**
 * Spiel werden angezeigt
 */
function showSpiel() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowSpiel);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/spielShowSortieren.php");
  xmlhttp.send();
}

//Spiel anzeigen
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
    var tbody = document.getElementById("resultCard");
    for (var i = 0; i < myObj.length; i++) {
      if (
        myObj[i]["initiator"] == currentID ||
        myObj[i]["mitspieler"] == currentID
      ) {
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

        //testen ob Inititiator currentID ist ist also der gerade gewünschte Spieler
        var td1 = document.createElement("td");
        var initiator = getPlayerByID(spielerList, myObj[i]["initiator"]);

        td1.appendChild(document.createTextNode(initiator.spielname));
        tr.appendChild(td1);

        var td1 = document.createElement("td");
        var level = myObj[i]["level"];
        td1.appendChild(document.createTextNode(level));
        tr.appendChild(td1);

        tbody.appendChild(tr);
      }

      console.log(verlauf);
      //Vorbereitung des Diagramms Zahlen setzen
      if (verlauf == "gewonnen") gewonnenCounter += 1;
      if (verlauf == "verloren") verlorenCounter += 1;
      if (verlauf == "abgebrochen") abgebrochenCounter += 1;
    }

    var labels = ["Gewonnen", "Verloren", "abgebrochen"];
    var data = [gewonnenCounter, verlorenCounter, abgebrochenCounter];
    console.log(labels + data);

    // Diagramm wird erstellen
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Meine Spiele",
            data: data,
            backgroundColor: "rgba(75, 190, 190, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Ganzzahlige Schrittweite
            },
          },
        },
      },
    });
  }
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
