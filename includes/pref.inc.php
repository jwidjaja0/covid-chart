<?php

session_start();

require 'selectdbh.inc.php';

if(!isset($_SESSION['userId'])){
    echo '<script>alert("Please log in to save preference!");</script>';
}
else{

    if(isset($_POST['selCountries'])){
        $listC = $_POST['selCountries'];
        $sPref = $_POST['statPref'];
        $userID = $_SESSION['userId'];

        //insert to database
        //delete all preference from this user data
        $sql = "DELETE FROM preference WHERE userID = ?";
        $stmt = mysqli_stmt_init($conn);

        if(!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location:../index.php?error=prefDelError");
            exit();
        } else{
            mysqli_stmt_bind_param($stmt, "i", $userID);
            mysqli_stmt_execute($stmt);
            //previous preference deleted
        }
        //TODO:implement mysql so that we can revert back if update pref fail after deletion

        for($i = 0; $i < sizeof($listC); $i++){
            $sql = "INSERT INTO preference (userID, country) VALUES (?,?)";
            $stmt = mysqli_stmt_init($conn);
            if(!mysqli_stmt_prepare($stmt, $sql)) {
                header("Location:../index.php?error=prefInsError");
                exit();
            } else {
                mysqli_stmt_bind_param($stmt, 'is', $userID, $listC[$i]);
                mysqli_stmt_execute($stmt);
            }
        }

        //delete previous preference
        $sql = "DELETE FROM statPref WHERE userID = ?";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt, $sql)) {
            header("Location:../index.php?error=prefDel2Error");
            exit();
        } else{
            mysqli_stmt_bind_param($stmt, 'i', $userID);
            mysqli_stmt_execute($stmt);
        }

        //insert stat preference
        $sql = "INSERT INTO statPref (userID, stat) VALUES (?,?)";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt,$sql)) {
            header("Location:../index.php?error=sprefInsError");
            exit();
        } else {
            mysqli_stmt_bind_param($stmt, 'is', $userID, $sPref);
            mysqli_stmt_execute($stmt);
        }

        echo 'Preference updated';

    }
}


