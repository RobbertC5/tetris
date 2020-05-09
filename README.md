# Tetris in Typescript
This version of Tetris was made as a coding challenge in an hour.

## Demo
Online demo: <https://robbertc5.github.io/tetris/>

## Installing
You need to have npm installed on your machine.  
- Run `npm install` to install necessary npm packages (including typescript.)  
- Run `./node_modules/.bin/tsc.cmd -p ./tsconfig.json` to build the typescript from `src` to `dist`.  
This task should be detected in Visual Studio Code automatically after the previous step (press `ctrl+shift+b` and choose `tsc: build`).

Your browser might give a CORS error if you just open the webpage as local file. Running it on a local server will resolve this issue.
