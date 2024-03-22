<?php
include "setupDB.php";

spielShow();

function spielShow(){
    global $conn;
    $tname = 'Spiel';
    $sql = "SELECT * FROM $tname";
    $result = $conn->query($sql);
    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = array(
            'einzeln' => $row['einzeln'],
            'Datetime' => $row['Datetime'],
            'dauer' => $row['dauer'],
            'verlauf' => $row['verlauf'],
            'mitspieler' => $row['mitspieler'],
            'gewinner' => $row['gewinner'],
            'initiator' => $row['initiator'],
            'level' => $row['level']
        );
    } 

    // Sort the array by the 'level' column in descending order
    usort($rows, function($a, $b) {
        return $b['level'] - $a['level'];
    });

    $ps = json_encode($rows);
    echo ($ps);
}

$conn->close();
?>
