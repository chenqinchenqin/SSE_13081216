var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
var render;
(function (render) {
    /**
     * 基类，负责处理x,y,rotation 等属性
     */
    var DisplayObject = (function () {
        function DisplayObject() {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.globalMatrix = new math.Matrix();
        }
        DisplayObject.prototype.getLocalMatrix = function () {
            var localMatrix = new math.Matrix();
            localMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            return localMatrix;
        };
        DisplayObject.prototype.draw = function (context) {
            var parent = this.parent;
            var localMatrix = this.getLocalMatrix();
            if (!parent) {
                this.globalMatrix = localMatrix;
            }
            else {
                //TODO:
                // GLOBAL_MATRIX = PARENT_GLOBAL_MATRIX * LOCAL_MATRIX
                this.globalMatrix = math.matrixAppendMatrix(localMatrix, parent.globalMatrix);
            }
            context.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
            this.render(context);
        };
        DisplayObject.prototype.render = function (context) {
        };
        return DisplayObject;
    }());
    render.DisplayObject = DisplayObject;
    // Container
    //   draw
    //{  context.setTransform()  }
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            _super.call(this);
            this.children = [];
        }
        DisplayObjectContainer.prototype.addChild = function (child) {
            this.children.push(child);
            child.parent = this;
        };
        DisplayObjectContainer.prototype.render = function (context) {
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                child.draw(context);
            }
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    render.DisplayObjectContainer = DisplayObjectContainer;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            _super.apply(this, arguments);
        }
        Bitmap.prototype.render = function (context) {
            var image = imagePool[this.source];
            if (image) {
                context.drawImage(image, 0, 0);
            }
            else {
                context.font = "20px Arial";
                context.fillStyle = '#000000';
                context.fillText('错误的URL', 0, 20);
            }
        };
        return Bitmap;
    }(DisplayObject));
    render.Bitmap = Bitmap;
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect() {
            _super.apply(this, arguments);
            this.width = 100;
            this.height = 100;
            this.color = '#FF0000';
        }
        Rect.prototype.render = function (context) {
            context.fillStyle = this.color;
            context.fillRect(0, 0, this.width, this.height);
        };
        return Rect;
    }(DisplayObject));
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            _super.apply(this, arguments);
        }
        TextField.prototype.render = function (context) {
            context.font = "20px Arial";
            context.fillStyle = '#000000';
            context.fillText('HelloWorld', 0, 20);
        };
        return TextField;
    }(DisplayObject));
    var imagePool = {};
    function loadResource(imageList, callback) {
        var count = 0;
        if (imageList.length == 0) {
            callback();
            return;
        }
        imageList.forEach(function (imageUrl) {
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
        });
    }
    /**
     * 渲染核心
     */
    var RenderCore = (function () {
        function RenderCore() {
        }
        /**
         * 启动渲染核心
         * @param renderQueue 渲染队列
         * @param imageList 资源列表
         */
        RenderCore.prototype.start = function (stage, resourceList) {
            if (resourceList === void 0) { resourceList = []; }
            stage.parent = null;
            this.stage = stage;
            var self = this;
            loadResource(resourceList, function () {
                requestAnimationFrame(self.onEnterFrame.bind(self));
            });
        };
        RenderCore.prototype.onEnterFrame = function () {
            context.save();
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.drawQueue(this.stage);
            context.restore();
            requestAnimationFrame(this.onEnterFrame.bind(this));
        };
        RenderCore.prototype.drawQueue = function (stage) {
            stage.draw(context);
        };
        return RenderCore;
    }());
    render.RenderCore = RenderCore;
})(render || (render = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZW5kZXJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBc0IsQ0FBQztBQUNyRixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBR3RDLElBQU8sTUFBTSxDQTJNWjtBQTNNRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBTVg7O09BRUc7SUFDSDtRQWdCSTtZQWRBLE1BQUMsR0FBRyxDQUFDLENBQUM7WUFDTixNQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ04sV0FBTSxHQUFHLENBQUMsQ0FBQztZQUNYLFdBQU0sR0FBRyxDQUFDLENBQUM7WUFDWCxhQUFRLEdBQUcsQ0FBQyxDQUFDO1lBV1QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxQyxDQUFDO1FBRUQsc0NBQWMsR0FBZDtZQUNJLElBQUksV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RixNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZCLENBQUM7UUFFRCw0QkFBSSxHQUFKLFVBQUssT0FBaUM7WUFFbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxZQUFZLEdBQUcs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