<?php
// Das PHP-Programm, um die vorhandenen level aus der Tabelle zu laden. Die Level werden als eine JSON-Datei an Spielstand.js und admin-Spielinhalt.js zurückgescheckt.
//funktioniert


include "setupDB.php";

levelShow();

function levelShow(){
global $conn;
$tname = 'level';
$sql = "SELECT * FROM $tname";
$result = $conn->query($sql);
$rows = array();
while ($row = $result->fetch_assoc()) {
    
    $rows[] = array('level'=>$row['level'], 'anzahl_karten'=>$row['anzahl_karten'], 'spielZeit'=>$row['spielZeit']);
} 

$ps = json_encode($rows);
echo ($ps);
}

$conn->close();
?> 

