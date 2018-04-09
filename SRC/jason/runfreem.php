<?php

//ini_set('display_errors', '1');
//ini_set('error_reporting', E_ALL);


$seqdata = $_POST["seqdata"];
$temp = $_POST["tempn"];
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
//$file = fopen("tmpdata/seqin.txt", "w");
//$array = str_split($seq, 1);
//foreach ($array as $value) {
//    fprintf($file, "%s\r\n", $value);
//}

$filet = fopen("../../sessions/$addr/tmpdata/Temp.txt", "w");
fprintf($filet, "%.1f\r", $temp);

$cmd = 'tcsh ../../SRC/jason/run-freem.tcsh';
echo $cmd;
$cmd = "{$cmd}{$s}{$dir}";
exec($cmd, $out);
print_r($out);

?>