/**
 * hier wird das Profil angezeigt
 */

var spielerList = [];
//spieler der Session
var spielerId;
var spielerMail;
var spielname;
var passwort;
var level;

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
          //hier werden die spielerinfos aus php in die Variablen geschrieben
          spielerId = data.spielerId;
          spielerMail = data.email;
          spielname = data.spielname;
          passwort = data.passwort;
          level = data.level;

          //hier wird der Code in HTML gesetzt
          document.getElementById("spielerMail").textContent = spielerMail;
          document.getElementById("spielname").textContent = spielname;
          document.getElementById("passwort").textContent = passwort;
          document.getElementById("level").textContent = level;

          // Annahme: spielerID ist eine Variable mit der gewünschten Spieler-ID

          // Den Button setzen mit dem Link zur Unterseite
          var buttonElement = document.getElementById("profildetail");

          // Den Link um "?elem=spielerID" ergänzen
          var neuerLink = "../html/Spielerseite.html" + "?elem=" + spielerId;

          // Den aktualisierten Link dem Button zuweisen
          buttonElement.setAttribute(
            "onclick",
            `window.location.href='${neuerLink}'`
          );

          console.log("Benutzer ist angemeldet"); //angemeldet

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

/*// Eventlistener für den Button zum Löschen des Spielkontos
document.getElementById("profilLoeschen").addEventListener("click", function () {
    var spielerId = this.getAttribute("id");

    // Daten für die Ajax-Anfrage vorbereiten
    var data = {
        id: spielerId
    };

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                var response = xmlhttp.responseText;
                console.log(response); // Oder führen Sie hier weitere Aktionen aus, z.B. eine Bestätigung anzeigen
            } else {
                alert("Fehler beim Kommunizieren mit dem Server.");
            }
        }
    };

    xmlhttp.open("POST", "../php/deletePlayer.php", true); // Aktualisieren Sie den Pfad zur PHP-Datei
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id=" + encodeURIComponent(data.id));
});*/
