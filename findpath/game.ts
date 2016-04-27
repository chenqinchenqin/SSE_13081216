module game {


    const GRID_PIXEL_WIDTH = 50;

    const GRID_PIXEL_HEIGHT = 50;

    const NUM_ROWS = 12;

    const NUM_COLS = 12;

    export class WorldMap extends DisplayObject {


        public grid: astar.Grid;
        constructor() {
            super();
            var grid = new astar.Grid(NUM_COLS, NUM_ROWS);
            this.grid = grid;
            grid.setWalkable(5, 0, false);
            grid.setWalkable(5, 1, false);
            grid.setWalkable(5, 2, false);
            grid.setWalkable(5, 3, false);
            grid.setWalkable(5, 4, false);
            grid.setWalkable(5, 5, false);

        }

        render(context: CanvasRenderingContext2D) {
            //context.fillStyle = '#0000FF';
            context.strokeStyle = '#FF0000';
            context.beginPath();
            for (var i = 0; i < NUM_COLS; i++) {
                for (var j = 0; j < NUM_ROWS; j++) {
                    if(!this.grid.getNode(i,j).walkable){ 
                        context.fillRect(i * GRID_PIXEL_WIDTH, (j-1) * GRID_PIXEL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT);
                        context.fillRect(i * GRID_PIXEL_WIDTH, j * GRID_PIXEL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT);
                        context.fillStyle = '#000000';
                    }
                    else{
                        context.rect(i * GRID_PIXEL_WIDTH, j * GRID_PIXEL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT);
                        context.fillStyle = '#0000FF';
                    }
                    context.fill();
                    context.stroke();
                }
            }
            context.closePath();

        }

    }

    export class BoyShape extends DisplayObject {
        render(context: CanvasRenderingContext2D) {
            context.beginPath()
            context.fillStyle = '#00FFFF';
            context.arc(GRID_PIXEL_WIDTH / 2, GRID_PIXEL_HEIGHT / 2, Math.min(GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT) / 2 - 5, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    }

    export class BoyBody extends Body {
        
        public _Position = new Array(2);
        public _Step = 1;
        public Path : astar.AStar;

        public run(grid) {
            for(var i =0; i < 2 ; i++){
                this._Position[i] = new Array;
            }
            grid.setStartNode(0, 0);
            grid.setEndNode(10, 8);
            this.Path = new astar.AStar();
            this.Path.setHeurisitic(this.Path.diagonal);
            var result = this.Path.findPath(grid);
            var path = this.Path._path;
            for(var i = 1; i < this.Path._path.length;i++){
                this._Position[0][i] = this.Path._path[i].x - this.Path._path[i-1].x;
                this._Position[1][i] = this.Path._path[i].y - this.Path._path[i-1].y;
            }
            console.log(path);
            console.log(grid.toString());
        }

        public onTicker(duringTime) {
            if(this.x < NUM_ROWS *GRID_PIXEL_WIDTH &&this.y < NUM_COLS*GRID_PIXEL_HEIGHT){
                if(this._Step <= this.Path._path.length){
                    this.x += this._Position[0][this._Step]*GRID_PIXEL_WIDTH;
                    this.y += this._Position[1][this._Step]*GRID_PIXEL_HEIGHT;
                    this._Step++; 
                }
            }
        }
    }
}




var boyShape = new game.BoyShape();
var world = new game.WorldMap();
var body = new game.BoyBody(boyShape);
body.run(world.grid);

body.vx = 15;
body.vy = 15;

var renderCore = new RenderCore();
renderCore.start([world, boyShape]);

var ticker = new Ticker();
ticker.start([body]);