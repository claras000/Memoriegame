//hier kommt der code für logout rein

<?php
    require 'session.php';
    session_start();
    $_SESSION = [];
    session_unset();
    session_destroy();
    header("Location: ../html/login.html");
?>