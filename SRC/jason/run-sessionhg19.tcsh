#!/bin/tcsh

##cd sessions
cd ../../sessions

set filenums = `ls -l |grep "^d" |wc -l`
set filename = `expr $filenums + 1`
set filedel = `expr $filename - 500` 
mkdir -p $filename
rm -rf $filedel/*
cp -R ../OS/OShg19/* ./$filename

echo $filename


