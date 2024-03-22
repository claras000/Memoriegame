<?php

include 'setupDB.php';

$tname = 'spiel';
$einzeln = $_POST['einzeln'];
$Datetime = $_POST['Datetime'];
$dauer = $_POST['dauer'];
$verlauf = $_POST['verlauf'];
$mitspieler = $_POST['mitspieler'];
$gewinner = $_POST['gewinner'];
$initiator = $_POST['initiator'];
$level = $_POST['level'];

// SQL query for adding data
$sql = "INSERT INTO $tname (einzeln, Datetime, dauer, verlauf, mitspieler, gewinner, initiator,level) VALUES ('$einzeln', 'Datetime','$dauer','$verlauf', '$mitspieler', '$gewinner','$initiator','$level')";

if (!mysqli_query($conn, $sql)) {
    die("Insert fehlgeschlagen: " . mysqli_error());
} else {
    echo "Das Spiel $Datetime wurde erfolgreich hinzugefügt!";
}


//aus spielername wird id bestimmt, um in der Tabelle Spiele suchen zu können
function searchPlayer($name) {
    global $conn;

    // SQL-Abfrage erstellen
    $sql = "SELECT id FROM spieler WHERE name = '$name'";

    // Abfrage ausführen
    $result = $conn->query($sql);

    // Überprüfen, ob die Abfrage erfolgreich war
    if ($result && $result->num_rows > 0) {
        // Das erste gefundene Ergebnis abrufen und die ID in einer Variable speichern
        $row = $result->fetch_assoc();
        $id = $row["id"];

        echo "Spieler mit dem Namen '$name' wurde gefunden. ID: $id";
    } else {
        echo "Spieler mit dem Namen '$name' wurde nicht gefunden.";
    }
}

//die tabelle Spiele muss durchsucht werden nach Initiator und Mitspieler
//dafür muss aus dem Namen zunächst die ID gemacht werden
//diese tabellen werden dann ausgegeben
function getPlayerPlays($conn, $playerName) {
  //aus namen wird id bestimmt
 // SQL-Abfrage erstellen
    $sql = "SELECT id FROM spieler WHERE spielname = '$playerName'";

    // Abfrage ausführen
    $result = $conn->query($sql);

    // Überprüfen, ob die Abfrage erfolgreich war
    if ($result && $result->num_rows > 0) {
        // Das erste gefundene Ergebnis abrufen und die ID in einer Variable speichern
        $row = $result->fetch_assoc();
        $id = $row["id"];

        echo "Spieler mit dem Namen '$playerName' wurde gefunden. ID: $id";
    } else {
        echo "Spieler mit dem Namen '$playerName' wurde nicht gefunden.";
    }



    // SQL-Abfrage ob die spieler id initiator oder mitspieler in den tupeln der tabelle spiel ist
    $sql1 = "SELECT * FROM spiel WHERE initiator = '$id' OR mitspieler = '$id'";

    // Abfrage ausführen
    $result = $conn->query($sql1);

    // Überprüfen der Abfrage
    if ($result && $result->num_rows > 0) {
        // Datensätze ausgeben
        while ($row = $result->fetch_assoc()) {
            $resultArray[] = $row;
        }
            echo json_encode($resultArray);
       
    } else {
        // JSON-Array wird erstellt
        $jsonArray = array("error" => "Keine Spiele gefunden.");

      
        echo json_encode($jsonArray);
    }
}

// Beispielaufruf der Funktion
//funktioniert nur wenn vorher genau einmal player.php aufgrufen wurde -> da spieler vorhanden sein müssen
$searchPlayer = "Susanne Tester"; // Der Name des Spielers, nach dem gesucht werden soll
getPlayerPlays($conn, $searchPlayer);

 //Funktion wird in fetchdata.js auf gerufen, um die Daten zur html zu übergeben
function fetchData(){
    global $conn;
    // Daten aus der Datenbank abrufen
    $action = $_GET['action'];
    if ($action === 'fetchSpiel') {
        $result = $conn->query("SELECT * FROM spiel");
        if (!$result) {
            die("Ungültige Abfrage: " . $conn->error);
        }

        // Ein Array erstellen, um die abgerufenen Daten zu speichern
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        // Die Daten als JSON zurückgeben
        header("Content-type: application/json");
        echo json_encode($data);
    } elseif ($action === 'fetchSomethingElse') {
        // Code for fetching data for something else goes here
    } else {
        die("Ungültige Aktion.");
    }
}


// Verbindung zur Datenbank schließen
$conn->close();

?>
