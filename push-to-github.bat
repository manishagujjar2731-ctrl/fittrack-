@echo off
title Connect FitTrack Pro to GitHub
powershell.exe -ExecutionPolicy Bypass -File "%~dp0push-to-github.ps1"
pause
