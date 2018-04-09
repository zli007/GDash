<?php

//ini_set('display_errors', '1');
//ini_set('error_reporting', E_ALL);

$cmd = 'tcsh run-sessionhg19.tcsh';
//echo $cmd;
exec($cmd, $out);

//$testarray = array($out);
echo json_encode((int)$out[0]);


//print_r($out);

?>
