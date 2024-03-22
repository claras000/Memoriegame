/**
 * Die Anzeige verändert sich was sichtbar ist, je nach Anmeldestauts
 *
 * der Admin sieht am meisten
 *
 * Der User sieht seinen eigenen Account und playerSpielstand
 *
 * Nicht angemeldete sehen nur Spielstand
 */

var spielerList = [];
//spieler der Session
var spielerId;
var spielerMail;

//Eventhandler für HTML
window.addEventListener("load", setup);
function setup() {
  checkSession();
}

// Falls eine Ajax-Anfrage gescheitert ist ...
function ajaxFehler(event) {
  alert(event.target.statusText);
}

//die aktuelle session checken mit Ajax
function checkSession() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        var data = JSON.parse(xmlhttp.responseText);
        console.log(xmlhttp.responseText);
        if (data.isLoggedIn) {
          spielerId = data.spielerId;
          spielerMail = data.email;
          console.log("Benutzer ist angemeldet"); //angemeldet
          statusAngemeldet = true;
          console.log(statusAngemeldet);

          ///Im folgendem werden Items der Navbar ein und ausgebelndet je nach dem wer angemeldet ist
          var login = document.getElementById("Login");
          login.style.display = "none";
          if (spielerMail == "admin@memory.de") {
            console.log("Der Admin ist angemeldet");
          }

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
          console.log("Benutzer ist nicht angemeldet."); // Der User ist nicht angemeldet check
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
        //hier alles was user sehen raus
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

  var action = "check";
  var url = "../php/session.php?action=" + action;
  xmlhttp.open("GET", url, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send();
}
