// setup canvas
const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const btn = document.querySelector('button');
btn.addEventListener('click',loop)

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape{
    constructor(x,y,velX,velY){
        this.x=x;
        this.y=y;
        this.velX=velX;
        this.velY=velY;
    }
}

class Ball extends Shape{
    constructor(x,y,velX,velY,color,size){
        super(x,y,velX,velY)
        this.color=color;
        this.size=size;
        this.exists = true;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.fill();
    }
    update(){
        if((this.x+this.size)>=width){
            this.velX= -(this.velX);
        }

        if((this.x-this.size)<=0){
            this.velX= -(this.velX);
        }

        if((this.y+this.size)>=height){
            this.velY= -(this.velY);
        }

        if((this.y-this.size)<=0){
            this.velY= -(this.velY);
        }
        this.x+=this.velX;
        this.y+=this.velY;
    }
    collisionDetect(){
        for(const b of balls){
            if(!(this === b)&&b.exists){
                const dx = this.x-b.x;
                const dy = this.y-b.y;
                const distance = Math.sqrt(dx*dx+dy*dy);

                if(distance<this.size+b.size){
                    b.color=this.color=randomRGB();
                }
            }
        }
    }
}

class EvilCircle extends Shape{
    constructor(x,y){
        super(x,y,20,20);

        this.color='white';
        this.size=10;

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.x -= (this.velX+10);
                    break;
                case 'ArrowRight':
                    this.x += (this.velX+10);
                    break;
                case 'ArrowUp':
                    this.y -= (this.velY+10);
                    break;
                case 'ArrowDown':
                    this.y += (this.velY+10);
                    break;
            }
        });
    }
    draw(){
        ctx.beginPath();
        ctx.lineWidth=3;
        ctx.strokeStyle=this.color;
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.stroke();
    }
    checkBounds(){
        if((this.x+this.size)>=width){
            this.x-=this.size
        }

        if((this.x-this.size)<=0){
            this.x+=this.size
            
        }

        if((this.y+this.size)>=height){
            this.y-=this.size;
        }

        if((this.y-this.size)<=0){
            this.y+=this.size;
        }
    }
    collisionDetect(){
        for(const b of balls){
            if(b.exists){
                const dx = this.x-b.x;
                const dy = this.y-b.y;
                const distance = Math.sqrt(dx*dx+dy*dy);

                if(distance<this.size+b.size){
                    b.exists=false;
                    count--;
                    para.textContent = 'Ball count: '+count;
                }
            }
        }
    }
}


const balls = [];

for(let x = 0 ; x<50;x++){
    const size = random(10,20)
    const newBall = new Ball(
        random(0+size,width-size),
        random(0+size,height-size),
        random(-7,7),
        random(-7,7),
        randomRGB(),
        size
    );

    balls.push(newBall);
    count++;
    para.textContent='Ball count: '+count;
}

const evil = new EvilCircle(
    random(0,width),
    random(0,height))

function loop(){

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);


    for(const ball of balls){
        if(ball.exists){
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }
    evil.draw()
    evil.checkBounds()
    evil.collisionDetect()
    
    requestAnimationFrame(loop);
}

