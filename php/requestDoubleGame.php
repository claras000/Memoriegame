<?php
include 'setupDB.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
     $sender = $_POST["sender"];
    $mitspieler = $_POST["mitspieler"];
    $message = $_POST["message"];
   

global $conn;

   
    if ($conn->connect_error) {
        die("Verbindung fehlgeschlagen: " . $conn->connect_error);
    }

    // Nachricht in die Datenbank einfügen
    $sql = "INSERT INTO messages (sender, mitspieler, message,spielzusage) VALUES ('$sender', '$mitspieler', '$message', '0')";

    if ($conn->query($sql) === TRUE) {
        echo "Die Nachricht wurde erfolgreich gesendet.";
    } else {
        echo "Fehler beim Senden der Nachricht: " . $conn->error;
    }

    $conn->close();
}

//Anfrage
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $mitspieler = $_GET["mitspieler"];
    global $conn;

    if ($conn->connect_error) {
        die("Verbindung fehlgeschlagen: " . $conn->connect_error);
    }

    // Daten aus der Datenbank abrufen (Anfragetext hinzugefügt)
    $sql = "SELECT id, sender, spielzusage, message FROM messages WHERE mitspieler = $mitspieler";
    $result = $conn->query($sql);

    $receivedRequests = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $receivedRequests[] = $row;
        }
    }

    echo json_encode(array("receivedRequests" => $receivedRequests));

    $conn->close();
}


?>