<?php
// CORS-Header setzen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


    // Verbindung zur Datenbank herstellen
    $servername = "localhost";    // Hostname (normalerweise "localhost")
    $username = "root";           // Benutzername für die Datenbank
    $password = "";               // Passwort für die Datenbank
    $database = "omemory";        // Name der Datenbank



    //kreiere eine Verbindung
    $conn = new mysqli($servername, $username, $password, $database);

    // Überprüfen der Verbindung
    if ($conn->connect_error) {
        die("keine Verbindung (Fehler): " . $conn->connect_error);
    }

      // Name und Attribute für eine karte
    //wir haben in unserem Spiel noch einen Titel und ein zweites bild vom Künstler. Diese werden hier hinzugefügt
$tname = 'karte';
$name1 = 'id';
$name2 = 'bild';
$name3 = 'artist';
$name4 = 'name';
$type1 = 'INT(11) AUTO_INCREMENT PRIMARY KEY';
$type2 = 'MEDIUMBLOB NOT NULL';
$type3 = 'MEDIUMBLOB NOT NULL';
$type4 = 'varchar(30)';


// Tabelle Karte erzeugen, falls noch nicht vorhanden sind
$sql1 = "CREATE TABLE If NOT EXISTS $tname ($name1 $type1, $name2 $type2, $name3 $type3, $name4 $type4)";
if (!$conn -> query($sql1)) {
    die('Tabelle-Erzeugen fehlgeschlagen: ' . $conn -> error);
}



    // Name und Attribute für DB level
    //wir haben in unserem Spiel noch einen Titel und ein zweites bild vom Künstler. Diese werden hier hinzugefügt
    //
$lname = 'Level';
$lname1 = 'level';
$lname2 = 'anzahl_karten';
$lname3 = 'spielZeit';

$ltype1 = 'INT(11) AUTO_INCREMENT PRIMARY KEY';
$ltype2 = 'INT';
$ltype3 = 'INT';

// Tabelle Level erzeugen, falls noch nicht vorhanden sind
$sql2 = "CREATE TABLE If NOT EXISTS $lname ($lname1 $ltype1, $lname2 $ltype2, $lname3 $ltype3)";
if (!$conn -> query($sql2)) {
    die('Tabelle-Erzeugen fehlgeschlagen: ' . $conn -> error);
}



//Name und Attribute für DB Spieler
$spname = 'spieler';
$spname1 = 'id';
$spname2 = 'spielname';
$spname3 = 'email';
$spname4 = 'passwort';
$spname5 = 'level';
$sptype1 = 'INT(11) AUTO_INCREMENT PRIMARY KEY';
$sptype2 = 'VARCHAR(20)';
$sptype3 = 'VARCHAR(20)';
$sptype4 = 'VARCHAR(20)';
$sptype5 = 'INT';
$sptype6 = 'FOREIGN KEY (level) REFERENCES Level(level)';



// Tabelle Spieler erzeugen, falls noch nicht vorhanden sind
$sql4 = "CREATE TABLE If NOT EXISTS $spname ($spname1 $sptype1, $spname2 $sptype2, $spname3 $sptype3, $spname4 $sptype4, $spname5 $sptype5, $sptype6)";
if (!$conn -> query($sql4)) {
    die('Tabelle-Erzeugen fehlgeschlagen: ' . $conn -> error);
}



//Name und Attribute für DB Spiel
// verlauf mitspieler und initiator sind verlinkungen auf die tabelle spieler
$sname = 'Spiel';
$sname1 = 'einzeln';
$sname2 = 'Datetime';
$sname3 = 'dauer';
$sname4 = 'verlauf';
//die verbindung zur den Spielern über die SpielerID
$sname5 = 'mitspieler';
$sname6 = 'gewinner';
$sname7 = 'initiator';

//wir hatten erst die Uhrzeit als Primary key, dies wollten wir für diese aufgabe einmal ändern, 
//da man sonst beim zweiten aurufen wegen der funktion insert() eine Fehlermeldung bekommt
//zur Abhilfe dient uns jetzt eine ID mit Auto_Increment
$sname8 = 'id';
$sname9 = 'level';

$stype1 = 'BOOLEAN ';
$stype2 = 'VARCHAR(20)';
$stype3 = 'INT';
$stype4 = 'VARCHAR(20)';
$stype5 = 'INT(11)';
$stype6 = 'INT(11)';
$stype7 = 'INT(11)';
$stype8 = 'INT(11) AUTO_INCREMENT PRIMARY KEY';
$stype9 = 'FOREIGN KEY (mitspieler) REFERENCES spieler(id)';
$stype10 = 'FOREIGN KEY (gewinner) REFERENCES spieler(id)';
$stype11 = 'FOREIGN KEY (initiator) REFERENCES spieler(id)';
$stype12 = 'FOREIGN KEY (level) REFERENCES level(level)';

// Tabelle Spiel erzeugen, falls noch nicht vorhanden sind
$sql3 = "CREATE TABLE If NOT EXISTS $sname ($sname1 $stype1, $sname2 $stype2, $sname3 $stype3, $sname4 $stype4,$sname5 $stype5,$sname6 $stype6,$sname7 $stype7, $sname8 $stype8,$sname9 $stype3, $stype9, $stype10,$stype11,$stype11 )";
if (!$conn -> query($sql3)) {
    die('Tabelle-Erzeugen fehlgeschlagen: ' . $conn -> error);
}


//Kommunikation zwischen sessions 
$tblName = 'messages';
$colID = 'id';
$colSender = 'sender';
$colmitspieler = 'mitspieler';
$colMessage = 'message';
$colTimestamp = 'timestamp';
$colspielzusage = 'spielzusage';

$colType1 = 'INT AUTO_INCREMENT PRIMARY KEY';
$colType2 = 'VARCHAR(50)';
$colType3 = 'VARCHAR(50)';
$colType4 = 'TEXT';
$colType5 = 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
$colType6 = 'BOOLEAN ';

// Tabelle Messages erzeugen, falls noch nicht vorhanden
$sql = "CREATE TABLE IF NOT EXISTS $tblName (
    $colID $colType1,
    $colSender $colType2,
    $colmitspieler $colType3,
    $colMessage $colType4,
    $colTimestamp $colType5,
    $colspielzusage $colType6
)";
if (!$conn->query($sql)) {
    die('Tabelle-Erzeugen fehlgeschlagen: ' . $conn->error);
}





