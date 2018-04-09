<?php

//ini_set('display_errors', '1');
//ini_set('error_reporting', E_ALL);


//$seqdata = $_POST["seqdata"];
$nucid = $_POST["nucid"];
$addr = $_POST["addr"];
$cols = $_POST["col"];

//$chr = $seqdata["chr"];
//$start = $seqdata["start"];
//$end = $seqdata["end"];


$cmd = 'tcsh ../../SRC/jason/color.tcsh';
$s = ' ';
$dir="../../sessions/$addr/tmpdata";
$cmd = "{$cmd}{$s}{$nucid}{$s}{$dir}{$s}{$cols}";
echo $cmd;
exec($cmd, $out);
print_r($out);

?>