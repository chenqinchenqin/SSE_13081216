
var human = new render.DisplayObjectContainer();
human.x = -50;
human.y = -120;
var humanContainer = new render.DisplayObjectContainer();
var head = new render.Bitmap();
head.x = 10;
head.y = 0;
var trunk = new render.Bitmap();
trunk.x = 15;
trunk.y = 65;
var left_arm = new render.Bitmap();
left_arm.x = 70;
left_arm.y = 45;
var right_arm = new render.Bitmap();
right_arm.x = 0;
right_arm.y = 45;
var left_leg = new render.Bitmap();
left_leg.x = 60;
left_leg.y = 100;
var right_leg = new render.Bitmap();
right_leg.x = 40;
right_leg.y = 100;

head.source = "head.png";
trunk.source = "body.png";
left_arm.source = "L_arm.png";
right_arm.source = "R_arm.png";
left_leg.source = "L_leg.png";
right_leg.source = "R_leg.png";

humanContainer.addChild(human);
human.addChild(left_leg);
human.addChild(right_leg);
human.addChild(head);
human.addChild(trunk);
human.addChild(left_arm);
human.addChild(right_arm);

var renderCore = new render.RenderCore();

renderCore.start(humanContainer, ["L_leg.png", "R_leg.png", "head.png", "body.png","L_arm.png","R_arm.png"]);

class HumanBody extends Body {
    
    
    vx:number = 5;
    vrotation = Math.PI/2;

    onTicker(duringTime: number) {
        this.x += this.vx*duringTime;
        this.rotation += this.vrotation*duringTime;
    }
}

var ticker = new Ticker();
var body = new HumanBody(humanContainer);
body.vx = 5;
body.y = 200; 
ticker.start([body]);


var eventCore = new events.EventCore();
eventCore.init();

var isHead = 0;
var ClickedHead = false;
var isLeg = 0;
var ClickedLeg = false;

var headHitTest = (localPoint:math.Point,displayObject:render.DisplayObject) =>{
   // alert (`点击位置为${localPoint.x},${localPoint.y}`);
   console.log(localPoint);

    if(localPoint.x <= Math.abs(displayObject.x * 6) && localPoint.y <= Math.abs(displayObject.y)&&
    localPoint.x > 0 && localPoint.y > 0){
        isHead += 1;
        ClickedHead = true;
}
    return ClickedHead;
}
var LegHitTest = (localPoint:math.Point,displayObject:render.DisplayObject) =>{
   // alert (`点击位置为${localPoint.x},${localPoint.y}`);
   console.log(localPoint);

   if(localPoint.x > 0 && localPoint.x <=  Math.abs(displayObject.x * 2) && localPoint.y > 0 && localPoint.y < Math.abs(displayObject.y * 2)){
        isLeg += 1;
        ClickedLeg = true;
}
    return ClickedLeg;
}
var HeadOnClick = () => {

    if(isHead == 1){
        if(body.vx!=0){
            body.vx *= -1;
            body.vrotation *= -1;
        }
        if(body.vx == 0){
            isHead = 0;
        }        
    }

    if(isHead != 1){
        body.vx = 5;
        body.vrotation = Math.PI/2;
        isHead = 0;
    }
    ClickedHead = false;
    console.log("clickhead:"+isHead);
}

var LegOnClick = () => {
   
    if(isLeg == 1){
        body.vx = 0;
        body.vrotation = 0;
        body.rotation = 0;
    }
    if(isLeg >= 1){       
        isLeg = 0;
    }
    ClickedLeg = false;
    console.log("clickleg:"+ isLeg);
}

eventCore.register(head,headHitTest,HeadOnClick);
eventCore.register(left_leg,headHitTest,LegOnClick);
eventCore.register(right_leg,headHitTest,LegOnClick);










