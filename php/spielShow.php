<?php
// Das PHP-Programm, um die vorhandenen Spiele aus der Tabelle zu laden. Die Spiele werden als eine JSON-Datei an Spielstand.js und spielerSeiten.js zurückgescheckt.
//funktioniert

include "setupDB.php";

spielShow();

function spielShow(){
global $conn;
$tname = 'Spiel';
$sql = "SELECT * FROM $tname";
$result = $conn->query($sql);
$rows = array();
while ($row = $result->fetch_assoc()) {
    
    $rows[] = array('einzeln'=>$row['einzeln'], 'Datetime'=>$row['Datetime'], 'dauer'=>$row['dauer'],'verlauf'=>$row['verlauf'],'mitspieler'=>$row['mitspieler'],'gewinner'=>$row['gewinner'],'initiator'=>$row['initiator'],'level'=>$row['level']);
} 

$ps = json_encode($rows);
echo ($ps);
}

$conn->close();
?> 

