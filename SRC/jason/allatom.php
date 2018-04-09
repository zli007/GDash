<?php

//ini_set('display_errors', '1');
//ini_set('error_reporting', E_ALL);


$seqdata = $_POST["seqdata"];
$nstart = $_POST["nstart"];
$addr = $_POST["addr"];

$chr = $seqdata["chr"];
$start = $seqdata["start"];
$end = $seqdata["end"];
//$seq = $seqdata["seq"];
$cmds = 'tcsh ../../SRC/jason/getseq.tcsh';
$s = ' ';
$dir="../../sessions/$addr/tmpdata";
$cmds = "{$cmds}{$s}{$chr}{$s}{$start}{$s}{$end}{$s}{$dir}";
exec($cmds,$out1);
//$file = fopen("tmpdatas/seqin.txt", "w");
//$array = str_split($seq, 1);
//foreach ($array as $value) {
//    fprintf($file, "%s", $value);
//}

$cmd = 'tcsh ../../SRC/jason/allatom.tcsh';
$s = ' ';
$dir2="../../sessions/$addr/tmpdatas";
$cmd = "{$cmd}{$s}{$nstart}{$s}{$dir2}";
echo $cmd;
exec($cmd, $out);
print_r($out);

?>