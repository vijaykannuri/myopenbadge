<?php

$filedata=$_POST["filedata"];
$filepath=$_POST["filename"];

$fp = fopen($filepath, 'w');
fwrite($fp, json_encode($filedata));  
fclose($fp);

?>