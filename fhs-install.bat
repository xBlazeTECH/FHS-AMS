@echo off
echo Installing Dependencies...
echo npm install
echo bower install
echo Dependencies Installed...
echo Starting Mongodb...
start startmongo.bat
echo Mongodb Started...
echo Serving Signin Pages...
grunt serve
pause