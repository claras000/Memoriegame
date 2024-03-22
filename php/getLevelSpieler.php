<?php
include 'setupDB.php';

// Die Spieler-ID aus der Anfrage abrufen
$spielerId = "3";

// Eine Abfrage ausführen, um das Level des Spielers abzurufen
$query = "SELECT level FROM spieler WHERE id = $spielerId";
$result = $mysqli->query($query);

if ($result) {
    $row = $result->fetch_assoc();
    $level = $row["level"];

    // JSON-Antwort vorbereiten
    $response = array("level" => $level);
} else {
    $response = array("error" => "Fehler beim Abrufen des Levels.");
}

// JSON-Antwort senden
header("Content-Type: application/json");
echo json_encode($response);

// Verbindung zur Datenbank schließen
$mysqli->close();
?>
