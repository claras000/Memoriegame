document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value;
    const password = passwordInput.value;

    console.log("E-Mail:", email);
    console.log("Passwort:", password);

    var data = {
      spielname: $("#vorname").val() + " " + $("#nachname").val(),

      email: $("#email").val(),
      password: $("#password").val(),
      action: "login",
    };
    console.log(data);

    if (email != 0) insertLogin();
    // Registrierung Ajax-Events für das Hinzufügen eines Buchs
    // und send eine Anfrage
    function insertLogin() {
      // var insertButton = document.getElementById("insert");
      // Annahme: Du hast die Spielinformationen in JavaScript-Variablen gespeichert
      var formData = new FormData();

      formData.append("email", $("#email").val());
      formData.append("password", $("#password").val());
      formData.append("action", "login");

      var ajaxRequest = new XMLHttpRequest();
      ajaxRequest.addEventListener("load", ajaxInsertLogin);
      ajaxRequest.addEventListener("error", ajaxFehler);
      ajaxRequest.open("POST", "../php/session.php");
      ajaxRequest.send(formData);
    }

    // Falls das erfolgreich angemeldet erfolgreicht inzugefügt ist ...
    function ajaxInsertLogin(event) {
      console.log("das ist die Antwort");
      document.getElementById("response").innerHTML = this.responseText;
      // Wechsele zur Profilseite
      window.location.replace("profil.html");
      console.log(window.location.href);
    }

    // Falls eine Ajax-Anfrage gescheitert ist ...
    function ajaxFehler(event) {
      alert(event.target.statusText);
    }

    // Jetzt kannst du die Werte weiterverarbeiten, z.B. an den Server senden
  });
});
