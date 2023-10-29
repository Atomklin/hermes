@ECHO OFF

@REM Install client stuff
CD .\client
CALL npm install

@REM Install server stuff
CD ..\server
CALL npm install

ECHO "Package installation completed for both 'client' and 'server'"
PAUSE