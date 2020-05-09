const pieces = [
  // I piece
  [
    // Rotation 1
    [[0,0,0,0],
     [0,0,0,0],
     [1,1,1,1],
     [0,0,0,0,]],
    // Rotation 2
     [[0,0,1,0],
      [0,0,1,0],
      [0,0,1,0],
      [0,0,1,0,]]
  ],
  // J piece
  [
    // Rotation 1
    [[1,0,0],
     [1,1,1],
     [0,0,0]],
    // Rotation 2
     [[0,1,1],
      [0,1,0],
      [0,1,0]],
    // Rotation 3
    [[0,0,0],
     [1,1,1],
     [0,0,1]],
    // Rotation 2
    [[0,1,0],
     [0,1,0],
     [1,1,0]],
  ],
  // L piece
  [
    // Rotation 1
    [[0,0,0],
     [1,1,1],
     [1,0,0]],
    // Rotation 2
     [[1,1,0],
      [0,1,0],
      [0,1,0]],
    // Rotation 3
    [[0,0,1],
     [1,1,1],
     [0,0,0]],
    // Rotation 2
    [[0,1,0],
     [0,1,0],
     [0,1,1]],
  ],
  // O piece
  [
    [[1,1],
     [1,1]],
  ],
  // S piece
  [
    // Rotation 1
    [[0,1,1],
     [1,1,0],
     [0,0,0]],
    // Rotation 2
     [[0,1,0],
      [0,1,1],
      [0,0,1]],
  ],
  // Z piece
  [
    // Rotation 1
    [[1,1,0],
     [0,1,1],
     [0,0,0]],
    // Rotation 2
     [[0,0,1],
      [0,1,1],
      [0,1,0]],
  ],
  // T piece
  [
    // Rotation 1
    [[0,1,0],
     [1,1,1],
     [0,0,0]],
     // Rotation 2
     [[0,1,0],
      [0,1,1],
      [0,1,0]],
      // Rotation 3
      [[0,0,0],
       [1,1,1],
       [0,1,0]],
       // Rotation 4
       [[0,1,0],
        [1,1,0],
        [0,1,0]],
  ],
]

const colors = [
  '#42e0f5',
  '#4242f5',
  '#f5b942',
  '#f5e942',
  '#57f542',
  '#f54242',
  '#bf42f5'
]

export class Game {

  canvas: HTMLCanvasElement;
  grid: number[][];
  currentPiece: number;
  currentRotation: number;
  pieceLocation: {x: number, y:number};
  nextPiece: number;
  time: number;
  keyDownHeld: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initGrid();
    this.currentPiece = Math.floor(Math.random()*pieces.length);
    this.nextPiece = Math.floor(Math.random()*pieces.length);
    this.spawnPiece();
    this.draw();
    setInterval(this.step.bind(this),1000/60);
    this.time = 0;
    this.keyDownHeld = false;


    document.addEventListener('keydown',this.handleKeyDown.bind(this));
    document.addEventListener('keyup',this.handleKeyUp.bind(this));
  }

  initGrid(){
    this.grid = [];
    for (let x = 0; x < 12; x++) {
      this.grid[x] = [];
      for (let y = 0; y < 22; y++) {
        if (x == 0 || x == 11 || y == 0 || y == 21){
          this.grid[x][y] = 1;
        }else{
          this.grid[x][y] = 0;
        }
      }
    }
  }

  spawnPiece(){
    this.currentPiece = this.nextPiece;
    this.nextPiece = Math.floor(Math.random()*pieces.length);
    this.currentRotation = 0;
    this.pieceLocation = {x: 4, y: 1};
  }

  savePiece(){
    const piece = pieces[this.currentPiece][this.currentRotation];
    for (let i = 0; i < piece.length; i++){
      for (let j = 0; j < piece[0].length; j++){
        if (piece[i][j]==1){
          this.grid[this.pieceLocation.x+i][this.pieceLocation.y+j] = 2+this.currentPiece;
        }
      }
    }
  }

  clearLines(){
    for(let y = 1; y < 21; y++){
      let lineFull = true;
      for(let x = 1; x < 11; x++){
        if(this.grid[x][y]==0){
          lineFull = false;
          break;
        }
      }
      if(lineFull){
        for(let i = y; i > 2; i--){
          for(let x = 1; x < 11; x++){
            this.grid[x][i] = this.grid[x][i-1];
          }
        }
        for(let x = 1; x < 11; x++){
          this.grid[x][1] = 0;
        }
      }
    }
  }

  step(){
    if(this.time%40==0 || (this.keyDownHeld && this.time%2==0)){
      if (this.checkFree(0,1,0)){
        this.pieceLocation.y++;
      }else{
        this.savePiece();
        this.clearLines();
        this.spawnPiece();
      }
    }
    this.time++;
  }

  handleKeyDown(e: KeyboardEvent){
    switch (e.key) {
      case "ArrowLeft":
        if(this.checkFree(-1,0,0)){
          this.pieceLocation.x--;
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowRight":
        if(this.checkFree(1,0,0)){
          this.pieceLocation.x++;
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowDown":
        this.keyDownHeld = true;
        e.preventDefault();
        e.stopPropagation();
        break;
      case "ArrowUp":
        const rotations = pieces[this.currentPiece].length;
        if(this.checkFree(0,0,1)){
          this.currentRotation = (this.currentRotation+1)%rotations; // TODO: checkfree
        }
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        break;
    }
    console.log(e.key);
  }
  
  handleKeyUp(e: KeyboardEvent){
    switch (e.key) {
      case "ArrowDown":
        this.keyDownHeld = false;
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        break;
    }
  }

  checkFree(x: number, y: number, rot: number){
    const rotations = pieces[this.currentPiece].length;
    const checkRot = (this.currentRotation+rot+rotations)%rotations;
    const piece = pieces[this.currentPiece][checkRot];
    const checkLoc = {x: this.pieceLocation.x+x, y: this.pieceLocation.y+y};
    for (let i = 0; i < piece.length; i++){
      for (let j = 0; j < piece[0].length; j++){
        if (piece[i][j]==1){
          if (this.grid[checkLoc.x+i][checkLoc.y+j]>0){
            return false;
          }
        }
      }
    }
    return true;
  }

  draw(){
    const ctx = this.canvas.getContext('2d');
    const g = 20;

    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    // draw grid
    for (let x = 0; x < 12; x++) {
      for (let y = 0; y < 22; y++) {
        ctx.strokeRect(x*g,y*g,g,g);
        if(this.grid[x][y]==1){
          ctx.fillStyle = "#555555";
          ctx.strokeStyle = "#000000";
          ctx.fillRect(x*g,y*g,g,g);
        }else if(this.grid[x][y]==0){
          ctx.fillStyle = "#999999";
          ctx.strokeStyle = "#000000";
          ctx.fillRect(x*g,y*g,g,g);
        }else{
          ctx.fillStyle = colors[this.grid[x][y]-2];
          ctx.strokeStyle = "#333333";
          ctx.fillRect(x*g,y*g,g,g);
          ctx.strokeRect(x*g,y*g,g,g);
        }
      }
    }
    
    // draw current piece
    const piece = pieces[this.currentPiece][this.currentRotation];
    for (let i = 0; i < piece.length; i++){
      for (let j = 0; j < piece[0].length; j++){
        if (piece[i][j]==1){
          ctx.fillStyle = colors[this.currentPiece];
          ctx.strokeStyle = "#333333";
          ctx.fillRect((this.pieceLocation.x+i)*g,(this.pieceLocation.y+j)*g,g,g);
          ctx.strokeRect((this.pieceLocation.x+i)*g,(this.pieceLocation.y+j)*g,g,g);
        }
      }
    }


    // draw grid for next piece
    for (let x = 14; x < 20; x++) {
      for (let y = 4; y < 10; y++) {
        ctx.strokeRect(x*g,y*g,g,g);
        if(x == 14 || x == 19 || y == 4 || y == 9){
          ctx.fillStyle = "#555555";
          ctx.strokeStyle = "#000000";
          ctx.fillRect(x*g,y*g,g,g);
        }else{
          ctx.fillStyle = "#999999";
          ctx.strokeStyle = "#000000";
          ctx.fillRect(x*g,y*g,g,g);
        }
      }
    }

    // draw the next piece
    const nextPiece = pieces[this.nextPiece][0];
    const nextLoc = {x: 15, y: 5};
    for (let i = 0; i < nextPiece.length; i++){
      for (let j = 0; j < nextPiece[0].length; j++){
        if (nextPiece[i][j]==1){
          ctx.fillStyle = colors[this.nextPiece];
          ctx.strokeStyle = "#333333";
          ctx.fillRect((nextLoc.x+i)*g,(nextLoc.y+j)*g,g,g);
          ctx.strokeRect((nextLoc.x+i)*g,(nextLoc.y+j)*g,g,g);
        }
      }
    }

    window.requestAnimationFrame(this.draw.bind(this));
  }
}
