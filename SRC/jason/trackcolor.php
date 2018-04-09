<?php

ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);


$trackurl = $_POST["bwurl"];
$start = $_POST["seqstart"];
$end = $_POST["seqend"];
$chr = $_POST["seqchr"];
$addr = $_POST["addr"];


$cmds = 'tcsh ../../SRC/jason/trackcolor.tcsh';
$s = ' ';
$dir="../../sessions/$addr/tmpdata";
$cmds = "{$cmds}{$s}{$chr}{$s}{$start}{$s}{$end}{$s}{$trackurl}{$s}{$dir}";
exec($cmds,$out1);

?>
