<?php

$dbconfig = "JAWSDB_MARIA_URL";
$conf = getenv($dbconfig);

$dbinfo = substr($conf, 8);

$sub = explode(":", $dbinfo);
//print_r($sub);

$sub1 = explode("@", $sub[1]); //separate pw and dbhost
$sub2 = explode("/", $sub[2]);


$dbusername = $sub[0];
$dbpw = $sub1[0];
$serv = $sub1[1];
$dbnm = $sub2[1];

//echo 'username: ' . $dbusername . "\n";
//echo 'pw: ' . $dbpw . "\n";
//echo 'serv: ' . $serv . "\n";
//echo 'db name: ' . $dbnm . "\n";

$conn = mysqli_connect($serv, $dbusername, $dbpw, $dbnm);

if(!$conn){
    die("Connection failed: " . mysqli_connect_error());

}

