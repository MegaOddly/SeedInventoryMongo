@echo off
cd "E:\mongodb\bin"
start mongod.exe 
timeout 3
start mongo.exe
exit
