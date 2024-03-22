<?php
// Das PHP-Programm, um die vorhandenen Playerinofs aus der Tabelle zu laden. Die Playerinfos werden als eine JSON-Datei an player-Spielerinhalt.js und admin-Spielinhalt.js zurückgescheckt.
//funktioniert

include "setupDB.php";

playerShow();

function playerShow(){
global $conn;

$tname = 'spieler';
$sql = "SELECT * FROM $tname";
$result = $conn->query($sql);
$rows = array();
while ($row = $result->fetch_assoc()) {
    $rows[] = array('id'=>$row['id'], 'spielname'=>$row['spielname'], 'email'=>$row['email'], 'level'=>$row['level']);
} 

$ps = json_encode($rows);
echo ($ps);
}

$conn->close();
?> 

