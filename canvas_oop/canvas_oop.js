var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 基类，负责处理x,y,rotation 等属性
 */
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
    }
    DisplayObject.prototype.draw = function (context) {
        context.save();
        context.rotate(this.rotation);
        context.translate(this.x, this.y);
        this.render(context);
        context.restore();
    };
    DisplayObject.prototype.render = function (context) {
    };
    return DisplayObject;
}());
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
var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect() {
        _super.apply(this, arguments);
        this.width = 100;
        this.height = 10;
        this.color = '#FF5566';
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
    //color='#FFFFFF';
    TextField.prototype.render = function (context) {
        context.font = "17px 微软雅黑";
        context.fillStyle = '#FFFFFF';
        context.fillText('アプリバージョン[1.9.1] for student:13081216', 0, 40);
    };
    return TextField;
}(DisplayObject));
function drawQueue(queue) {
    for (var i = 0; i < renderQueue.length; i++) {
        var displayObject = renderQueue[i];
        displayObject.draw(context);
    }
}
var imagePool = {};
function loadResource(imageList, callback) {
    var count = 0;
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
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
// var rect = new Rect();
// rect.width = 400;
// rect.height = 100;
// rect.color = '#00FF00'
//var text = new TextField();
//text.x = 10;
var text = new TextField();
text.x = 180;
text.y = 820;
var bitmap2 = new Bitmap();
bitmap2.source = 'logo.png';
bitmap2.x = 70;
bitmap2.y = 600;
var bitmap3 = new Bitmap();
bitmap3.source = 'start.png';
bitmap3.x = 270;
bitmap3.y = 880;
var bitmap4 = new Bitmap();
bitmap4.source = 'bg.png';
//button
var rect = new Rect();
rect.x = 0;
rect.y = 1000;
rect.width = 720;
rect.height = 20;
var rect2 = new Rect();
rect2.x = 0;
rect2.y = 1200;
rect.color = '#762626';
rect2.width = 720;
rect2.height = 15;
//渲染队列
var renderQueue = [bitmap4, bitmap2, bitmap3, text, rect, rect2];
//资源加载列表
var imageList = ['bg.png', 'logo.png', 'start.png'];
//先加载资源，加载成功之后执行渲染队列
loadResource(imageList, function () {
    drawQueue(renderQueue);
});
