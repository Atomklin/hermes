@ECHO OFF

@REM Build client into a modularized & minified JS code
CD .\client
CALL npm run Build

@REM Run server
CD ..\server
CALL npm run prod

ECHO "Server terminated"
PAUSE
