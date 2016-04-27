/**
 * 基类，负责处理x,y,rotation 等属性
 */ 
class DisplayObject {

    x = 0;

    y = 0;

    rotation = 0;

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.rotate(this.rotation);
        context.translate(this.x, this.y);
        this.render(context);

        context.restore();
    }

    render(context: CanvasRenderingContext2D) {

    }

}

class Bitmap extends DisplayObject {


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

    height = 10;

    color = '#FF5566';

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.width, this.height);
    }
}

class TextField extends DisplayObject {
    //color='#FFFFFF';
    render(context: CanvasRenderingContext2D) {
        context.font = "17px 微软雅黑";
        context.fillStyle = '#FFFFFF';
        context.fillText('アプリバージョン[1.9.1] for student:13081216', 0, 40);
    }
}

function drawQueue(queue) {
    for (var i = 0; i < renderQueue.length; i++) {
        var displayObject: DisplayObject = renderQueue[i];
        displayObject.draw(context);
    }
}

var imagePool = {};

function loadResource(imageList, callback) {
    var count = 0;
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
        
        function onLoadError(){
            alert('资源加载失败:' + imageUrl);
        }
    })
}


var canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;
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
bitmap2.x=70;
bitmap2.y=600;

var bitmap3 = new Bitmap();
bitmap3.source = 'start.png';
bitmap3.x=270;
bitmap3.y=880;

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
rect.color = '#762626'
rect2.width = 720;
rect2.height = 15;

//渲染队列
var renderQueue = [bitmap4,bitmap2,bitmap3,text,rect,rect2];
//资源加载列表
var imageList = ['bg.png','logo.png','start.png'];

//先加载资源，加载成功之后执行渲染队列
loadResource(imageList, function() {
    drawQueue(renderQueue);
})