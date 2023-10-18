@ECHO off

@REM Build Front-end first
CD .\front-end
npm run build

@REM Then Build Back-end
ECHO "Succefully built front-end, running express-js back-end."
CD ..\back-end
npm run prod

ECHO "Program stopped."
PAUSE

