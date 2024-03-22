/*JS Datei für die adminSpielinhalt.html die nur für den admin sichtbar ist
*Ajaxanfragen für Level, Spieler und Karten
+und das einfügen der Daten aus der Datenbank von level, spiel und karten 
*in die html Tabelle
*und die Lösch funktion für Level und karten die mit deleteCard und deleteLevel arbeiten
*/


// Beim Laden der Webseite wird die Funktion setup() aufgerufen
window.addEventListener("load", setup);

var LevelList = [];

function setup() {
  showLevel();
  showPlayer();
  //hey Tabelle Karte funktioniert jetzt komplett :) unten sind die dazugehörigen funktionen Datenbank Ajax kann komplett raus
  showCard();
}

/**
 * Spieler werden angezeigt
 */
function showPlayer() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowPlayer);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/playerShow.php");
  xmlhttp.send();
}

//Spieler anzeigen
// die Ajaxanfrage wird in eine Json-Liste umgewandelt
function ajaxShowPlayer(event) {
  var myObj = JSON.parse(event.target.responseText);

  // Tabelle-Rumpf
  var tbody = document.getElementById("resultSpieler");
  for (var i = 0; i < myObj.length; i++) {
    if (myObj[i]["spielname"] != 0) {
      var tr = document.createElement("tr");

      var id = myObj[i]["id"];

      var td1 = document.createElement("td");
      var spielname = myObj[i]["spielname"];

      var link = document.createElement("a");
      link.href =
        "../html/Spielerseite.html" + "?elem=" + encodeURIComponent(id); // Hier musst du den Pfad zu deinen Links anpassen
      link.textContent = spielname;

      td1.appendChild(link);
      tr.appendChild(td1);

      var td2 = document.createElement("td");
      var email = myObj[i]["email"];
      td2.appendChild(document.createTextNode(email));
      tr.appendChild(td2);

      var td3 = document.createElement("td");
      var level = myObj[i]["level"];
      td3.appendChild(document.createTextNode(level));
      tr.appendChild(td3);

      tbody.appendChild(tr);
    }
  }
}

/**
 * Level werden angezeigt
 */
function showLevel() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", function (event) {
        ajaxShowLevel(event); // Übergabe des Ereignisses an die Funktion
    });
    xmlhttp.addEventListener("error", ajaxFehler);

    xmlhttp.open("GET", "../php/levelShow.php");
    xmlhttp.send();
}


function ajaxShowLevel(event) {
    var myObj = JSON.parse(event.target.responseText);

    console.log("Empfangene Daten:", myObj); // Konsolenausgabe hinzufügen
    //console.log("myObj[i]['level']:", myObj[i]["level"]);

    var tbody = document.getElementById("resultLevel");
    for (var i = 0; i < myObj.length; i++) {
        var tr = document.createElement("tr");
        tr.id = "levelRow_" + i;
        tr.setAttribute("data-row-id", myObj[i]["level"]); // Speichern Sie die entsprechende ID aus den Daten

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

      var td4 = document.createElement("td");
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Löschen";

      // Hier wird ein Funktionsaufruf mithilfe einer IIFE erstellt, um den aktuellen Wert von 'tr' zu speichern
      (function (row) {
          deleteButton.addEventListener("click", function () {
              var rowId = row.getAttribute("data-row-id");
              console.log("rowId:", rowId);
              deleteLevel(rowId);
          });
      })(tr);

        td4.appendChild(deleteButton);
        tr.appendChild(td4);

        tbody.appendChild(tr);

        console.log("myObj[i]['level']:", myObj[i]["level"]);
    }
}


// JavaScript-Code zum Löschen einer Zeile und der dazugehörigen Daten aus der Datenbank
function deleteLevel(rowId) {
    console.log("Übergebene rowId:", rowId); // Ausgabe der übergebenen rowId

    var confirmation = confirm("Möchtest du dieses Level wirklich löschen?");
    if (confirmation) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", function () {
            if (xmlhttp.status === 200) {
                var row = document.querySelector('[data-row-id="' + rowId + '"]');
                if (row) {
                    console.log("Element to be deleted:", row);
                    row.parentNode.removeChild(row);
                } else {
                    console.log("Fehler: Zeile nicht gefunden.");
                }
            } else {
                console.log("Fehler: " + xmlhttp.statusText);
            }
        });
        xmlhttp.addEventListener("error", function () {
            console.log("Ajax-Fehler.");
        });

        xmlhttp.open("POST", "../php/deleteLevel.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("level=" + encodeURIComponent(rowId));
    }
}

// Registrierung Ajax-Events f�r das Anzeigen aller Karte und sende eine Anfrage
function showCard() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", function (event) {
        ajaxShowCard(event); // Übergabe des Ereignisses an die Funktion
    });
    xmlhttp.addEventListener("error", ajaxFehler);

    xmlhttp.open("GET", "../php/cardShow.php");
    xmlhttp.send();
}

// Falls die Karten erfolgreicht aus der Datenbank geholt sind ...
function ajaxShowCard(event) {
    var myObj = JSON.parse(event.target.responseText);
    console.log("Empfangene Daten:", myObj); // Konsolenausgabe hinzufügen

  // Tabelle-Rumpf
    var tbody = document.getElementById("resultCard");
    for (var i = 0; i < myObj.length; i++) {
        var tr = document.createElement("tr");
        tr.id = "cardRow_" + i;
        tr.setAttribute("data-row-id", myObj[i]["name"]); // Speichern Sie die entsprechende ID aus den Daten

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

    // Spalte für Löschen-Button
      var td4 = document.createElement("td");
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Löschen";

      // Hier wird ein Funktionsaufruf mithilfe einer IIFE erstellt, um den aktuellen Wert von 'tr' zu speichern
      (function (row) {
          deleteButton.addEventListener("click", function () {
              var rowId = row.getAttribute("data-row-id");
              console.log("rowId:", rowId);
              deleteCard(rowId);
          });
      })(tr);

      td4.appendChild(deleteButton);
      tr.appendChild(td4);

        tbody.appendChild(tr);

        console.log("myObj[i]['name']:", myObj[i]["name"]);
  }
}

// JavaScript-Code zum Löschen einer Zeile und der dazugehörigen Daten aus der Datenbank
function deleteCard(rowId) {
    console.log("Übergebene Zeilen-ID:", rowId);


    var confirmation = confirm("Möchtest du diese Karte wirklich löschen?");
    if (confirmation) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener("load", function () {
            if (xmlhttp.status === 200) {
                var row = document.querySelector('[data-row-id="' + rowId + '"]');
                console.log("Übergebene Zeilen-ID:", rowId);
                console.log("Serverantwort:", xmlhttp.responseText);

                if (row) {
                    console.log("Element to be deleted:", row);
                    row.parentNode.removeChild(row);
                } else {
                    console.log("Fehler: Zeile nicht gefunden.");
                }
            } else {
                console.log("Fehler: " + xmlhttp.statusText);
            }
        });
        xmlhttp.addEventListener("error", function () {
            console.log("Ajax-Fehler.");
        });

        xmlhttp.open("POST", "../php/deleteCard.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("name=" + encodeURIComponent(rowId)); // Änderung: Übergeben von "name" anstelle von "level"
    }
}


// Falls eine Ajax-Anfrage gescheitert ist ...
function ajaxFehler(event) {
    alert(event.target.statusText);
}
