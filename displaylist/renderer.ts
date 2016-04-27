var canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
var context = canvas.getContext("2d");


module render {


    /**
     * 基类，负责处理x,y,rotation 等属性
     */
    export class DisplayObject {

        x = 0;
        y = 0;
        scaleX = 1;
        scaleY = 1;
        rotation = 0;

        /**
         * 全局矩阵
         */
        globalMatrix: render.Matrix;

        parent: DisplayObject;

        constructor() {
            this.globalMatrix = new render.Matrix();
        }

        draw(context: CanvasRenderingContext2D) {

            var parent = this.parent;
            var angle = this.rotation / 180 * Math.PI;
            var skewX = angle;
            var skewY = angle;

            var localMatrix = new render.Matrix();
            localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);

            if (!parent) {
                this.globalMatrix = localMatrix;
            }
            else {
                //13081105
                //TODO:
                // GLOBAL_MATRIX = PARENT_GLOBAL_MATRIX * LOCAL_MATRIX
                this.globalMatrix = setglobalMatrix(localMatrix,parent.globalMatrix);
            }


            context.setTransform(
                this.globalMatrix.a,
                this.globalMatrix.b,
                this.globalMatrix.c,
                this.globalMatrix.d,
                this.globalMatrix.tx,
                this.globalMatrix.ty
            );
            this.render(context);
        }

        render(context: CanvasRenderingContext2D) {

        }
    }
    
function setglobalMatrix(i:Matrix,j:Matrix):Matrix{
        
     
        
        var result = new Matrix();
        result.a = i.a*j.a + i.b*j.c;
        result.b = i.a*j.b + i.b*j.d;
        result.c = i.a*j.c + i.c*j.d;
        result.d = j.b*i.c + j.d*i.d;
        result.tx = j.a*i.tx + j.c*i.ty + j.tx;
        result.ty = j.b*i.tx + j.d*i.ty + j.ty; 
        return result;
        
        
    }
    
    export class DisplayObjectContainer extends DisplayObject {


        children: Array<DisplayObject>

        constructor() {
            super();
            this.children = [];
        }

        addChild(child: DisplayObject) {
            this.children.push(child);
            child.parent = this;
        }

        render(context) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                child.draw(context);
            }
        }
    }

    export class Bitmap extends DisplayObject {


        source;

        render(context: CanvasRenderingContext2D) {

            var image = imagePool[this.source];
            if (image) {
                context.drawImage(image, 0, 0);
            }
            else {
                context.font = "20px Arial";
                context.fillStyle = '#000000';
                context.fillText('错误的URL', 0, 20);
            }
        }

    }

    class Rect extends DisplayObject {

        width = 100

        height = 100;

        color = '#FF0000';

        render(context: CanvasRenderingContext2D) {
            context.fillStyle = this.color;
            context.fillRect(0, 0, this.width, this.height);
        }
    }

    class TextField extends DisplayObject {

        render(context: CanvasRenderingContext2D) {
            context.font = "20px Arial";
            context.fillStyle = '#000000';
            context.fillText('HelloWorld', 0, 20);
        }
    }



    var imagePool = {};

    function loadResource(imageList, callback) {
        var count = 0;
        if (imageList.length == 0) {
            callback();
            return;
        }
        imageList.forEach(function(imageUrl) {
            var image = new Image();
            image.src = imageUrl;
            image.onload = onLoadComplete;
            image.onerror = onLoadError;

            function onLoadComplete() {
                imagePool[imageUrl] = image;
                count++;
                if (count == imageList.length) {
                    callback();
                }
            }

            function onLoadError() {
                alert('资源加载失败:' + imageUrl);
            }
        })
    }



    /**
     * 渲染核心
     */
    export class RenderCore {

        stage;
        /**
         * 启动渲染核心
         * @param renderQueue 渲染队列
         * @param imageList 资源列表
         */
        start(stage: DisplayObject, resourceList = []) {
            stage.parent = null;
            this.stage = stage;
            var self = this;
            loadResource(resourceList, function() {
                requestAnimationFrame(self.onEnterFrame.bind(self));
            })

        }

        onEnterFrame() {
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawQueue(this.stage);
            context.restore();
            requestAnimationFrame(this.onEnterFrame.bind(this));
        }

        drawQueue(stage: DisplayObject) {
            stage.draw(context);
        }

    }
}