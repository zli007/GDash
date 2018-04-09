<?php

ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);

//if($_POST["nucdata"])
//{


$seqdata = $_POST["seqdata"];
$phi = $_POST["Phise"];
$Lk = $_POST["Lk"];
$temp = $_POST["tempn"];
$diff = $_POST["diff"];
$addr = $_POST["addr"];
//print_r $position;

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

$cmd = "tcsh ../../SRC/jason/run-sliders.tcsh";
$s = ' ';
$cmd = "{$cmd}{$s}{$phi}{$s}{$Lk}{$s}{$dir}";
exec($cmd, $out1);
print_r($out1);


$cmd = 'tcsh ../../SRC/jason/mkBigWigs.NEW.tcsh';
//$rderr = '2>&1';
$s = ' ';
$par = 'icm.par';
$cmd = "{$cmd}{$s}{$chr}{$s}{$start}{$s}{$end}{$s}{$par}{$s}{$diff}{$s}{$dir}";
//$cmd = "{$cmd}{$chr}{$start}{$end}{$rderr}";
//echo $cmd;
exec($cmd, $out2);
print_r($out2);

$cmd = 'tcsh ../../SRC/jason/run-free.tcsh';
$cmd = "{$cmd}{$s}{$dir}";
exec($cmd, $out);
print_r($out);

//}

?>

