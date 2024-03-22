<?php
include 'setupDB.php';



// Überprüfen, ob die Verbindung erfolgreich war
if ($conn->connect_error) {
    die("Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error);
}

if (isset($_GET['playerId'])) {
    $playerId = $_GET['playerId'];
       $currentLevel = $_GET['currentLevel'];
    
    global $conn;

    // Den Level des Spielers um eins erhöhen
    $sql = "UPDATE spieler SET level = $currentLevel WHERE id = " . mysqli_real_escape_string($conn, $playerId);

    // Den Level des Spielers um eins erhöhen
    //$sql = "UPDATE spieler SET level = level + 1 WHERE id = $playerId";

    if ($conn->query($sql) === TRUE) {
        echo "Level des Spielers mit ID $playerId wurde erfolgreich erhöht.";
    } else {
        echo "Fehler beim Erhöhen des Spieler-Levels: " . $conn->error;
    }
} else {
    echo "Spieler-ID nicht angegeben.";
}


$conn->close();
?>
