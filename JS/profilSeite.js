/**
 * hier wird das Profil angezeigt
 */

var spielList = [];
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
  // Den Button setzen mit dem Link zur Unterseite
  var löschenButton = document.getElementById("löschen");
  löschenButton.addEventListener("click", löschenButtonClick);
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
          document.getElementById("willkommen").textContent =
            "Hallo " + spielname + ". Willkommen auf deinem Profil";

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

/**
 * die Spiele muss zunächst gelöscht werden, dann der User
 */
function löschenButtonClick() {
  console.log("löschen wird vorbereitet");
  showSpiel();
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
    var id = myObj[i]["id"];

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
      id: id,
    };

    // Das erstellte Objekt der Liste hinzufügen
    spielList.push(item);

    //Spiele löschen die den Spieler enthalten
    if (
      gewinner == spielerId ||
      initiator == initiator ||
      mitspieler == mitspieler
    )
      spielöschen(level);
  }
  console.log(spielList);
  // hier wird nun anschließend der Spieler gelöscht
  spielerlöschen();
}

/**
 * Spiel löschen
 * @param {*} level
 */
function spielöschen(level) {
  var xmlhttp = new XMLHttpRequest(); // Initialisieren Sie xmlhttp

  xmlhttp.addEventListener("load", function () {
    if (xmlhttp.status === 200) {
      console.log("Spiel erfolgreich gelöscht:", xmlhttp.responseText);
    } else {
      console.error("Fehler beim Löschen des Spiels. Status:", xmlhttp.status);
    }
  });

  xmlhttp.addEventListener("error", function () {
    console.log("Ajax-Fehler.");
  });

  xmlhttp.open("POST", "../php/deleteGame.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("id=" + encodeURIComponent(level));
}

/**
 * Spieler wird gelöscht
 */
function spielerlöschen() {
  var xmlhttp = new XMLHttpRequest(); // Initialisieren Sie xmlhttp

  xmlhttp.addEventListener("load", function () {
    if (xmlhttp.status === 200) {
      console.log("Spieler erfolgreich gelöscht:", xmlhttp.responseText);
      // hier wird nun anschließend der Spieler gelöscht
      window.location.replace("../php/logout.php");
      console.log(window.location.href);
    } else {
      console.error(
        "Fehler beim Löschen des Spielers. Status:",
        xmlhttp.status
      );
    }
  });

  xmlhttp.addEventListener("error", function () {
    console.log("Ajax-Fehler.");
  });

  xmlhttp.open("POST", "../php/deletePlayer.php", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("id=" + encodeURIComponent(spielerId));
}
