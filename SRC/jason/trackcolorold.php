<?php

ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);


$trackstart = $_POST["trackstart"];
$trackend = $_POST["trackend"];
$trackscore = $_POST["trackscore"];
$addr = $_POST["addr"];

$start = $_POST["seqstart"];
$end = $_POST["seqend"];

$file1 = fopen("../../sessions/$addr/tmpdata/trackstart.txt","w");
foreach ($trackstart as $value1){
	fprintf($file1, "%s\r\n", $value1);
}
$file2 = fopen("../../sessions/$addr/tmpdata/trackend.txt","w");
foreach ($trackend as $value2){
	fprintf($file2, "%s\r\n", $value2);
}
$file3 = fopen("../../sessions/$addr/tmpdata/trackscore.txt","w");
foreach ($trackscore as $value3){
	fprintf($file3, "%s\r\n", $value3);
}


$cmds = 'tcsh ../../SRC/jason/trackcolorold.tcsh';
$s = ' ';
$dir="../../sessions/$addr/tmpdata";
$cmds = "{$cmds}{$s}{$start}{$s}{$end}{$s}{$dir}";
exec($cmds,$out1);

?>
