<?php

require 'includes/dbh.inc.php';

//if logged in, check if user has preference saved;
$sql = "SELECT COUNT(*) AS total FROM preference WHERE userID = ?";
$stmt = mysqli_stmt_init($conn);

if(!mysqli_stmt_prepare($stmt, $sql)){
    header("Location:index.php/?error=sqlCountError");
    exit();
}
else{
    mysqli_stmt_bind_param($stmt, "i", $_SESSION['userId']);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $result);
    mysqli_stmt_fetch($stmt); //get count of rows of countries for this id

    if($result > 0){
        $sql = "SELECT * FROM preference WHERE userID = ?";
        $stmt = mysqli_stmt_init($conn);

        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location:index.php/?error=sqlSelectError");
        } else{
            mysqli_stmt_bind_param($stmt, "i", $_SESSION['userId']);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_bind_result($stmt, $id, $country);

            $defCountries = [];
            while(mysqli_stmt_fetch($stmt)){
                $defCountries[] = $country;
            }
            //preferences country now saved in $defCountries

        }

    }

}
