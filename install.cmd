@ECHO off

@REM Install Front-end stuff
CD .\front-end
CALL npm install

@REM Install Back-end stuff
CD ..\back-end
CALL npm install
CD ..

ECHO "npm install completed for both front-end and back-end."
PAUSE