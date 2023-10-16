@echo off

@REM Install Front-end stuff
cd front-end
npm install
cd ..

@REM Install Back-end stuff
cd back-end
npm install
cd ..

echo "npm install completed for both front-end and back-end."
pause