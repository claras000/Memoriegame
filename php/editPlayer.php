<?php


include 'setupDB.php';

global $conn;




// Überprüfen, ob das Formular abgeschickt wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
// Überprüfen, ob alle erforderlichen Felder ausgefüllt wurden
if (!empty($_POST["spielname"]) && !empty($_POST["email"]) && !empty($_POST["level"]) && !empty($_POST["passwort"])) {
// SQL-Abfrage zum Aktualisieren des Profils
$sql = "UPDATE profiles SET spielname = ?, email = ?, level = ?, passwort = ? WHERE id = ?";


// Vorbereiten der SQL-Abfrage
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssii", $_POST["spielname"], $_POST["email"], $_POST["level"], $_POST["passwort"]);

// Ausführen der SQL-Abfrage
if ($stmt->execute()) {
    echo "Profil erfolgreich aktualisiert.";
} else {
    echo "Fehler beim Aktualisieren des Profils: " . $stmt->error;
}

// Schließen des vorbereiteten Statements
$stmt->close();
} else {
echo "Bitte füllen Sie alle erforderlichen Felder aus.";
}




// Verbindung zur Datenbank schließen
$conn->close();
?>
