@echo off
npm install
bower install
start startmongo.bat
grunt serve
echo Backing up files...
echo Grunt has stopped serving... Please press any key to stop Mongodb...