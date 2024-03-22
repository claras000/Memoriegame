// Beim Laden der Webseite wird die Funktion setup() aufgerufen
window.addEventListener("load", setup);

var LevelList = [];

function setup() {
  showPlayer();
}

/**
 * Spieler werden angezeigt
 */
function showPlayer() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.addEventListener("load", ajaxShowLevel);
  xmlhttp.addEventListener("error", ajaxFehler);

  xmlhttp.open("GET", "../php/playerShow.php");
  xmlhttp.send();
}

//Spieler anzeigen
// die Ajaxanfrage wird in eine Json-Liste umgewandelt
function ajaxShowLevel(event) {
  var myObj = JSON.parse(event.target.responseText);

  // Tabelle-Rumpf
  var tbody = document.getElementById("resultSpieler");

  for (var i = 0; i < myObj.length; i++) {
    if (myObj[i]["spielname"] != 0) {
      var tr = document.createElement("tr");

      var td1 = document.createElement("td");
      var spielname = myObj[i]["spielname"];
      td1.appendChild(document.createTextNode(spielname));
      tr.appendChild(td1);

      var td2 = document.createElement("td");
      var level = myObj[i]["level"];
      td2.appendChild(document.createTextNode(level));
      tr.appendChild(td2);

      tbody.appendChild(tr);
    }
  }
}

// Falls eine Ajax-Anfrage gescheitert ist ...
function ajaxFehler(event) {
  alert(event.target.statusText);
}
