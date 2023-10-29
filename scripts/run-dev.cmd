@ECHO OFF

@REM Start client dev server
CD .\client
START npm run dev

@REM Start API server
CD ..\server
START npm run dev

ECHO "Both server started"
PAUSE
