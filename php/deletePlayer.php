<?php
// Verbindung zur MySQL-Datenbank herstellen
include 'setupDB.php';
global $conn;

// Überprüfen, ob ein POST-Request gesendet wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Überprüfen, ob die Spieler-ID übergeben wurde
    if (isset($_POST["id"])) {
        $id = $_POST["id"];

        // SQL-Abfrage zum Löschen des Spielerkontos
        $sql = "DELETE FROM spieler WHERE id = $id";

        if ($conn->query($sql) === TRUE) {
            echo "Spielerkonto erfolgreich gelöscht.";
        } else {
            echo "Fehler beim Löschen des Spielerkontos: " . $conn->error;
        }
    } else {
        echo "Spieler-ID nicht übergeben.";
    }
}

// Verbindung zur Datenbank schließen
$conn->close();
?>
