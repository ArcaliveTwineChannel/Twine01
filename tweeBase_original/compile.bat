@echo off

:: Set working directory
pushd %~dp0
@set TWEEGO_PATH="%~dp0devTools\tweego\StoryFormats"

:: Run the appropriate compiler for the user's CPU architecture.
if %PROCESSOR_ARCHITECTURE% == AMD64 (
	CALL "%~dp0devTools\tweego\tweego_win64.exe" -o "%~dp0Paradise Lost.html" --head "%~dp0devTools\header.html" "%~dp0game"
) else (
	CALL "%~dp0devTools\tweego\tweego_win86.exe" -o "%~dp0Paradise Lost.html" --head "%~dp0devTools\header.html" "%~dp0game"
)