<?php

ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);

$seqdata = $_POST["seqdata"];
$chr = $seqdata["chr"];
$start = $seqdata["start"];
$end = $seqdata["end"];
$addr = $_POST["addr"];
//$seq = $seqdata["seq"];
$temp = $_POST["tempn"];
$diff = $_POST["diff"];
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
fprintf($filet, "%.1f\r\n", $temp);

$cmd = "tcsh ../../SRC/jason/run-icm.tcsh";
$cmd = "{$cmd}{$s}{$dir}";
exec($cmd, $out1);
print_r($out1);


$cmd2 = 'tcsh ../../SRC/jason/mkBigWigs.NEW.tcsh';
$s = ' ';
$par = 'icm.par';
$cmd2 = "{$cmd2}{$s}{$chr}{$s}{$start}{$s}{$end}{$s}{$par}{$s}{$diff}{$s}{$dir}";
echo $cmd2;
exec($cmd2, $out2);
print_r($out2);

$cmd = 'tcsh ../../SRC/jason/run-free.tcsh';
$cmd = "{$cmd}{$s}{$dir}";
exec($cmd, $out);
print_r($out);

?>
