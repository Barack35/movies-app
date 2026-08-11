@echo off
schtasks /Create /TN "StreamflixDev" /TR "wscript.exe \"C:\Users\USER\Documents\project barack\movies-app\streamflix-launcher.vbs\"" /SC ONLOGON /RL LIMITED /F
