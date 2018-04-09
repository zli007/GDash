<?php

ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);

//$seqdata = $_POST["seqdata"];
//$chr = $seqdata["chr"];
//$start = $seqdata["start"];
//$end = $seqdata["end"];
//$seq = $seqdata["seq"];
//$nudata = $nucdata["nucdata"];
$temp = $_POST["tempn"];
$addr = $_POST["addr"];

$cmd = "tcsh ../../SRC/jason/run-lammps.tcsh";
$dir="../../sessions/$addr/tmpdata";
$s = ' ';
$cmd = "{$cmd}{$s}{$dir}";
echo $cmd;
exec($cmd, $out1);
print_r($out1);
?>
