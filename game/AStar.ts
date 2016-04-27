module astar {                           //      class:    Node\Grid\Astar


    export class Node {

        x: number;
        y: number;
        f: number;
        g: number;
        h: number;
        walkable: Boolean = true;
        parent: Node;
        costMultiplier: number = 1.0;
        visited: Boolean = false;
        inPath: Boolean = false;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

/*
        toString() {
            if (this.inPath) {
                return "田"
            }
            else{
                return "口"
            }
        }*/
        
        
        toString(){
            if(!this.walkable){
                return "田";
            }
            if(this.inPath){
                return "★"
            }
            else{
                return "口"
            }
            
        }
    }


    export class Grid {

        private _startNode: Node;
        private _endNode: Node;
        private _nodes: Array<Array<Node>>;
        private _numCols: number;
        private _numRows: number;

        constructor(numCols, numRows) {
            this._numCols = numCols;
            this._numRows = numRows;
            this._nodes = [];
            for (var i: number = 0; i < this._numCols; i++) {    //一列一列的初始化
                this._nodes[i] = [];
                for (var j: number = 0; j < this._numRows; j++) {
                    this._nodes[i][j] = new Node(i, j);
                }
            }
        }

        public getNode(x: number, y: number): Node {
            return this._nodes[x][y];
        }

        public setStartNode(x: number, y: number): void {
            this._startNode = this._nodes[x][y];
        }

        public setEndNode(x: number, y: number): void {
            this._endNode = this._nodes[x][y];
        }

        public setWalkable(x, y, value): void {
            this._nodes[x][y].walkable = value;
        }


        //get?

        public get startNode(): Node {
            return this._startNode;
        }

        public get endNode(): Node {
            return this._endNode;
        }

        public get numCols(): number {
            return this._numCols;
        }

        public get numRows(): number {
            return this._numRows;
        }




        public getNeighbors(node: Node): Array<Node> {
            var result = [];
            var startX: number = Math.max(0, node.x - 1);
            var endX: number = Math.min(this.numCols - 1, node.x + 1);
            var startY: number = Math.max(0, node.y - 1);
            var endY: number = Math.min(this.numRows - 1, node.y + 1);
            for (var i: number = startX; i <= endX; i++) {
                for (var j: number = startY; j <= endY; j++) {
                    result.push(this.getNode(i, j));   //将邻居结点依次放入result数组中（包括node结点自身）
                }
            }
            return result;
        }

        public toString() {

            var result = "";
                      
            for (var y = 0; y < this._numRows; y++) {
                for (var x = 0; x < this._numCols; x++) {
                    result += this._nodes[x][y].toString();
                }
                result += "\n"   //一行结果输出完后换行
            }

            return result;
          
        }

    }


    const STRAIGHT_COST = 1;

    const DIAG_COST = Math.SQRT2;

    export class AStar {

        private _open: Array<Node>;   //openList
        private _closed: Array<Node>;   //closedList
        private _grid: Grid;
        private _endNode: Node;
        private _startNode: Node;
        public _path: Array<Node>;
        private _heuristic: Function;   //选定的某种启发函数

        manhattan(node: Node): number {  
            var _endNode = this._endNode;
            var cost = Math.abs(node.x - _endNode.x) * STRAIGHT_COST
                + Math.abs(node.y + _endNode.y) * STRAIGHT_COST;
            return cost;
        }

        euclidian(node: Node): number {   
            var _endNode = this._endNode;
            var dx: number = node.x - _endNode.x;
            var dy: number = node.y - _endNode.y;
            return Math.sqrt(dx * dx + dy * dy) * STRAIGHT_COST;
        }


        diagonal(node: Node): number {  
            var _endNode = this._endNode;
            var dx: number = Math.abs(node.x - _endNode.x);
            var dy: number = Math.abs(node.y - _endNode.y);
            var diag: number = Math.min(dx, dy);
            var straight: number = dx + dy;
            return DIAG_COST * diag + STRAIGHT_COST * (straight - 2 * diag);   //先走对角线再走直线
        }

        constructor() {
           
        }
        
        public setHeurisitic(heuristic){
            this._heuristic = heuristic;
        }


        public findPath(grid: Grid): Boolean {
            this._grid = grid;
            this._open = new Array();
            this._closed = new Array();
            this._startNode = this._grid.startNode;
            this._endNode = this._grid.endNode;
            this._startNode.g = 0;
            this._startNode.h = this._heuristic(this._startNode);
            this._startNode.f = this._startNode.g + this._startNode.h;
            return this.search();
        }


        private isOpen(node: Node): Boolean {
            return this._open.indexOf(node) >= 0;
        }

        private isClosed(node: Node): Boolean {
            return this._closed.indexOf(node) >= 0;
        }




        public search(): Boolean {
            var grid = this._grid;
            var openList = this._open;
            var closedList = this._closed;
            var node: Node = this._startNode;
            while (node != this._endNode) {
                var neighbors = grid.getNeighbors(node);
                for (var i = 0; i < neighbors.length; i++) {
                    var test: Node = neighbors[i];
                    if (test == node ||
                        !test.walkable ||
                        !grid.getNode(node.x, test.y).walkable ||
                        !grid.getNode(test.x, node.y).walkable) {
                        continue;
                    }
                    var cost: number = STRAIGHT_COST;
                    if (!((node.x == test.x) || (node.y == test.y))) {
                        cost = DIAG_COST;
                    }
                    var g: number = node.g + cost * test.costMultiplier;
                    var h: number = this._heuristic(test);
                    test.visited = true;
                    var f: number = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = node;   //记下使该结点（test）的f值最小的父结点node
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                        openList.push(test);
                    }
                }
                closedList.push(node);

                if (openList.length == 0) {
                    console.log("no path found");
                    return false;
                }
                openList.sort((a, b) => a.f - b.f);
                node = openList.shift() as Node;
            }
            this.buildPath();
            return true;
        }


        buildPath(): void {   //从endNode开始往前追索parent
            this._path = new Array();
            var node: Node = this._endNode;
            node.inPath = true;
            this._path.push(node);
            while (node != this._startNode) {
                node = node.parent;
                this._path.unshift(node);
                node.inPath = true;
            }
        }
    }
}

