/*JS Datei für die adminSpielEinstellungen.html die nur für den admin sichtbar ist
*Ajaxanfragen für das hinzufügen von Karten und Level
*dabei werden die card.php und level.php benutzt
*/


// Beim Laden der Webseite wird die Funktion setup() aufgerufen
window.addEventListener("load", setup);

function setup() {
  const submitCard = document.getElementById("insertCard");
  const submitLevel = document.getElementById("insertLevel");

  submitCard.addEventListener("click", function (event) {
    event.preventDefault();
    insertCard();
  });
  submitLevel.addEventListener("click", function (event) {
    event.preventDefault();
    insertLevel();
  });
}

// Registrierung Ajax-Events f�r das Hinzuf�gen einer Karte und sende eine Anfrage
function insertCard() {
  var bildSelect = document.getElementById("bild");
  var artistSelect = document.getElementById("artist");
  var name = document.getElementById("name").value;
  var formData = new FormData();
  var bild = bildSelect.files[0];
  var artist = artistSelect.files[0];

  formData.append("name", name);
  formData.append("artist", artist, artist.name);
  formData.append("bild", bild, bild.name);

  var ajaxRequest = new XMLHttpRequest();
  ajaxRequest.addEventListener("load", ajaxInsertCard); // Corrected the event listener function name
  ajaxRequest.addEventListener("error", ajaxFehler);
  ajaxRequest.open("POST", "../php/card.php");
  ajaxRequest.send(formData);
}

// Registrierung Ajax-Events für das Hinzufügen eines Levels und sende eine Anfrage
function insertLevel() {
    console.log("Test");
    var level = document.getElementById("level").value;
    var anzahl_karten = document.getElementById("anzahl_karten").value;
    var spielZeit = document.getElementById("spielZeit").value;
    var formData = new FormData();

    formData.append("level", level);
    formData.append("anzahl_karten", anzahl_karten);
    formData.append("spielZeit", spielZeit);

    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.addEventListener("load", ajaxInsertLevel);
    ajaxRequest.addEventListener("error", ajaxFehler);
    ajaxRequest.open("POST", "../php/level.php");
    ajaxRequest.send(formData);
}

// Falls die Karte erfolgreich eingef�gt wurde ...
function ajaxInsertCard(event) {
  document.getElementById("infoInsertCard").innerHTML = this.responseText;
}

// Falls die Karte erfolgreich eingef�gt wurde ...
function ajaxInsertLevel(event) {
  document.getElementById("infoInsertLevel").innerHTML = this.responseText;
}

// Falls eine Ajax-Anfrage gescheitert ist ...
function ajaxFehler(event) {
  alert(event.target.statusText);
}
