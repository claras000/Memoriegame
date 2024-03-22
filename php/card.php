<?php
//diese Php-seite überprüft die größe der Karte und ob es den Namen bereits gibt und beinhaltet den SQL-Befehl zum hinzufügen der Karte


include 'setupDB.php';

uploadCard();

function uploadCard(){
    global $conn;
// Werte aus dem Formular abrufen
$cardTable = 'karte';   //Update consistent Wert
$name = $_POST['name']; //Frage nach Title
$blob1 = file_get_contents($_FILES['bild']['tmp_name']);    //frage nach Bild
$imageSize1 = $_FILES['bild']['size'];
$blob2 = file_get_contents($_FILES['artist']['tmp_name']);
$imageSize2 = $_FILES['artist']['size'];


   // der SQL-Befehl für das Hinzufügen
    // Abfragen, ob das Bild kleiner als kib ist.
if ($imageSize1 <= 100 * 1024 && $imageSize2 <= 100 * 1024) {
    // Überprüfen, ob der Kartenname bereits existiert
    $checkQuery = "SELECT * FROM $cardTable WHERE name = '$name'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        echo'<h2 style="color: red; font-size: 20px;"> Die Karte existiert bereits. Wähle einen anderen Namen.</h2>';
    } else {
        // Der SQL-Befehl für das Hinzufügen
        $sql = "INSERT INTO $cardTable(name, bild, artist) VALUES('$name', 0x" . bin2hex($blob1) . ", 0x" . bin2hex($blob2) . ")";

        if (!$conn->query($sql)) {
            echo '<h2 style="color: red; font-size: 20px;"> Einfügen fehlgeschlagen: ' . $conn->error . '</h2>';
        } else {
            echo '<h2 style="color: green; font-size: 20px;">Die Karte ' . $name . ' wurde erfolgreich hinzugefügt!</h2>';
        }
    }
} else {
        echo'<h2 style="color: red; font-size: 20px;">Das Bild darf maximal 100 KiB groß sein.</h2>';
    }
}



// Verbindung zur Datenbank schließen
$conn->close();
?>
