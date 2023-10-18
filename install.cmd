@ECHO off

@REM Install Front-end stuff
CD .\front-end
npm install

@REM Install Back-end stuff
CD ..\back-end
npm install
CD ..

ECHO "npm install completed for both front-end and back-end."
PAUSE