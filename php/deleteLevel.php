<?php
// Diese Php-Datei wird �ber XMLHttpRequest aufgerufen, um eine Karte aus der Datenbank zu l�schen.

include 'setupDB.php';
global $conn;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['id'])) {
        $rowId = $_POST['id'];

        // Sicherstellen, dass die �bergebene ID g�ltig ist
        if (is_numeric($rowId)) {
            // SQL-Befehl zum L�schen des Levels mit der angegebenen ID
            $sql = "DELETE FROM level WHERE level = $rowId";

            if ($conn->query($sql)) {
                echo "Das Level wurde erfolgreich gel�scht.";
            } else {
                echo "Fehler beim L�schen des Levels: " . $conn->error;
            }
        } else {
            echo "Ung�ltige Zeilen-ID.";
        }
    } else {
        echo "Zeilen-ID nicht erhalten.";
    }
} else {
    echo "Ung�ltige Anfrage.";
}

// Verbindung zur Datenbank schlie�en
$conn->close();
?>
