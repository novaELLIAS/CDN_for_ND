var TETRIS_ROWS = 20;
var TETRIS_COLS = 14;
var CELL_SIZE = 24;
var NO_BLOCK = 0;
var HAVE_BLOCK = 1;
var blockArr = [
    [{
            x: TETRIS_COLS / 2 - 1,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 1
        },
        {
            x: TETRIS_COLS / 2 + 1,
            y: 1
        }
    ],

    [{
            x: TETRIS_COLS / 2 + 1,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 1
        },
        {
            x: TETRIS_COLS / 2 - 1,
            y: 1
        }
    ],

    [{
            x: TETRIS_COLS / 2 - 1,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 0
        },
        {
            x: TETRIS_COLS / 2 - 1,
            y: 1
        },
        {
            x: TETRIS_COLS / 2,
            y: 1
        }
    ],
    
    [{
            x: TETRIS_COLS / 2 - 1,
            y: 0
        },
        {
            x: TETRIS_COLS / 2 - 1,
            y: 1
        },
        {
            x: TETRIS_COLS / 2 - 1,
            y: 2
        },
        {
            x: TETRIS_COLS / 2,
            y: 2
        }
    ],
    
    [{
            x: TETRIS_COLS / 2,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 1
        },
        {
            x: TETRIS_COLS / 2,
            y: 2
        },
        {
            x: TETRIS_COLS / 2 - 1,
            y: 2
        }
    ],
    
    [{
            x: TETRIS_COLS / 2,
            y: 0
        },
        {
            x: TETRIS_COLS / 2,
            y: 1
        },
        {
            x: TETRIS_COLS / 2,
            y: 2
        },
        {
            x: TETRIS_COLS / 2,
            y: 3
        }
    ],
    
    [{
            x: TETRIS_COLS / 2,
            y: 0
        },
        {
            x: TETRIS_COLS / 2 - 1,
            y: 1
        },
        {
            x: TETRIS_COLS / 2,
            y: 1
        },
        {
            x: TETRIS_COLS / 2 + 1,
            y: 1
        }
    ]
];

var curScore = 0;

var maxScore = 1;
var curSpeed = 1;

var curSpeedEle = document.getElementById("cur_speed");
var curScoreEle = document.getElementById("cur_points");
var maxScoreEle = document.getElementById("max_points");

var timer;

var myCanvas;
var canvasCtx;
var tetris_status;
var currentFall;

//create canvas
function createCanvas(){
    myCanvas=document.createElement("canvas");
    myCanvas.width=TETRIS_COLS*CELL_SIZE;
    myCanvas.height=TETRIS_ROWS*CELL_SIZE;
    //绘制背景
    canvasCtx=myCanvas.getContext("2d");
    canvasCtx.beginPath();
    //TETRIS_COS
    for(let i=1; i<TETRIS_COLS; i++){
        canvasCtx.moveTo(i*CELL_SIZE, 0);
        canvasCtx.lineTo(i*CELL_SIZE, myCanvas.height);
    }
    for(let i=1; i<TETRIS_ROWS; i++){
        canvasCtx.moveTo(0, i*CELL_SIZE);
        canvasCtx.lineTo(myCanvas.width, i*CELL_SIZE);
    }
    canvasCtx.closePath();
    canvasCtx.strokeStyle="#b4a79d";
    canvasCtx.lineWidth=0.6;
    canvasCtx.stroke();
    //第一行,最后一行,第一列，最后一列粗一点。
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    canvasCtx.lineTo(myCanvas.width, 0);
    canvasCtx.moveTo(0, myCanvas.height);
    canvasCtx.lineTo(myCanvas.width, myCanvas.height);
    canvasCtx.moveTo(0, 0);
    canvasCtx.lineTo(0, myCanvas.height);
    canvasCtx.moveTo(myCanvas.width, 0);
    canvasCtx.lineTo(myCanvas.width, myCanvas.height);
    canvasCtx.closePath();
    canvasCtx.strokeStyle="#b4a79d";
    canvasCtx.lineWidth=4;
    canvasCtx.stroke();
    //设置绘制block时的style
    canvasCtx.fillStyle="#201a14";
}

function changeWidthAndHeight(w, h){
    //通过jquery设置css
    h+=$("ui_bg").css("height")+$("ui_bg").css("margin-rop")+$("ui_bg").css("margin-bottom")+$("ui_bg").css("padding-top")+$("ui_bg").css("padding-bottom");
    $(".bg").css({
        "width":w,
        "height":h,
        "top":0, "bottom":0, "right":0, "left":0,
        "margin":"auto"
    });
}

//draw blocks
function drawBlocks(){
    //清空地图
    for(let i=0; i<TETRIS_ROWS;i++){
        for(let j=0;j<TETRIS_COLS;j++)
            canvasCtx.clearRect(j*CELL_SIZE+1, i*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
    }
    //绘制地图
    for(let i=0; i<TETRIS_ROWS;i++){
        for(let j=0;j<TETRIS_COLS;j++){
            if(tetris_status[i][j]!=NO_BLOCK)
                canvasCtx.fillRect(j*CELL_SIZE+1, i*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);//中间留点缝隙
        }
    }
    //绘制currentFall
    for(let i=0;i<currentFall.length;i++)
        canvasCtx.fillRect(currentFall[i].x*CELL_SIZE+1, currentFall[i].y*CELL_SIZE+1, CELL_SIZE-2,CELL_SIZE-2);
}

function rotate(){
    // 定义记录能否旋转的旗标
    var canRotate = true;
    for (var i = 0 ; i < currentFall.length ; i++)
    {
        var preX = currentFall[i].x;
        var preY = currentFall[i].y;
        // 始终以第三个方块作为旋转的中心,
        // i == 2时，说明是旋转的中心
        if(i != 2)
        {
            // 计算方块旋转后的x、y坐标
            var afterRotateX = currentFall[2].x + preY - currentFall[2].y;
            var afterRotateY = currentFall[2].y + currentFall[2].x - preX;
            // 如果旋转后所在位置已有方块，表明不能旋转
            if(tetris_status[afterRotateY][afterRotateX + 1] != NO_BLOCK)
            {
                canRotate = false;
                break;
            }
            // 如果旋转后的坐标已经超出了最左边边界
            if(afterRotateX < 0 || tetris_status[afterRotateY - 1][afterRotateX] != NO_BLOCK)
            {
                moveRight();
                afterRotateX = currentFall[2].x + preY - currentFall[2].y;
                afterRotateY = currentFall[2].y + currentFall[2].x - preX;
                break;
            }
            if(afterRotateX < 0 || tetris_status[afterRotateY-1][afterRotateX] != NO_BLOCK)
            {
                moveRight();
                break;
            }
            // 如果旋转后的坐标已经超出了最右边边界
            if(afterRotateX >= TETRIS_COLS - 1 || 
                tetris_status[afterRotateY][afterRotateX+1] != NO_BLOCK)
            {
                moveLeft();
                afterRotateX = currentFall[2].x + preY - currentFall[2].y;
                afterRotateY = currentFall[2].y + currentFall[2].x - preX;
                break;
            }
            if(afterRotateX >= TETRIS_COLS - 1 || 
                tetris_status[afterRotateY][afterRotateX+1] != NO_BLOCK)
            {
                moveLeft();
                break;
            }
        }
    }
    if(canRotate){
        for (var i = 0 ; i < currentFall.length ; i++){
            var preX = currentFall[i].x;
            var preY = currentFall[i].y;
            if(i != 2){
                currentFall[i].x = currentFall[2].x + 
                    preY - currentFall[2].y;
                currentFall[i].y = currentFall[2].y + 
                    currentFall[2].x - preX;
            }
        }
        localStorage.setItem("currentFall", JSON.stringify(currentFall));
    }
}


//按下 下 或 interval到了
function next(){
    if(moveDown()){
        //记录block
        for(let i=0;i<currentFall.length;i++)
            tetris_status[currentFall[i].y][currentFall[i].x]=HAVE_BLOCK;
        //判断有没有满行的
        for(let j=0;j<currentFall.length;j++){
            for(let i=0;i<TETRIS_COLS; i++){
                if(tetris_status[currentFall[j].y][i]==NO_BLOCK)
                    break;
                //最后一行满了
                if(i==TETRIS_COLS-1){
                    //消除最后一行
                    for(let i=currentFall[j].y; i>0;i--){
                        for(let j=0;j<TETRIS_COLS;j++)
                            tetris_status[i][j]=tetris_status[i-1][j];
                    }
                    //分数增加
                    curScore+=5;
                    localStorage.setItem("curScore", curScore);
                    if(curScore>maxScore){
                        //超越最高分
                        maxScore=curScore;
                        localStorage.setItem("maxScore", maxScore);
                    }
                    //加速
                    curSpeed+=0.1;
                    localStorage.setItem("curSpeed", curSpeed);
                    //ui输出
                    curScoreEle.innerHTML=""+curScore;
                    maxScoreEle.innerHTML=""+maxScore;
                    curSpeedEle.innerHTML=curSpeed.toFixed(1);//保留两位小数
                    clearInterval(timer);
                    timer=setInterval(function(){
                        next();
                    }, 500/curSpeed);
                }
            }
        }
        //判断是否触顶
        for(let i=0;i<currentFall.length;i++){
            if(currentFall[i].y==0){
                gameEnd();
                return;
            }
        }
        localStorage.setItem("tetris_status", JSON.stringify(tetris_status));
        //新的block
        createBlock();
        localStorage.setItem("currentFall", JSON.stringify(currentFall));
    }
    drawBlocks();
}

//右移
function moveRight(){
    for(let i=0;i<currentFall.length;i++){
        if(currentFall[i].x+1>=TETRIS_ROWS || tetris_status[currentFall[i].y][currentFall[i].x+1]!=NO_BLOCK)
            return;
    }
    for(let i=0;i<currentFall.length;i++)
        currentFall[i].x++;
    localStorage.setItem("currentFall", JSON.stringify(currentFall));
    return;
}
//左移
function moveLeft(){
    for(let i=0;i<currentFall.length;i++){
        if(currentFall[i].x-1<0 || tetris_status[currentFall[i].y][currentFall[i].x-1]!=NO_BLOCK)
            return;
    }
    for(let i=0;i<currentFall.length;i++)
        currentFall[i].x--;
    localStorage.setItem("currentFall", JSON.stringify(currentFall));
    return;
}
//judge can move down and if arrive at end return 1, if touch other blocks return 2, else, return 0
function moveDown(){
    for(let i=0;i<currentFall.length;i++){
        if(currentFall[i].y>=TETRIS_ROWS-1 || tetris_status[currentFall[i].y+1][currentFall[i].x]!=NO_BLOCK)
            return true;
    }

    for(let i=0;i<currentFall.length;i++)
        currentFall[i].y+=1;
    return false;
}


function gameKeyEvent(evt){
    switch(evt.keyCode){
        //向下
        case 40://↓
        case 83://S
            next();
            drawBlocks();
            break;
        //向左
        case 37://←
        case 65://A
            moveLeft();
            drawBlocks();
            break;
        //向右
        case 39://→
        case 68://D
            moveRight();
            drawBlocks();
            break;
        //旋转
        case 38://↑
        case 87://W
            rotate();
            drawBlocks();
            break;
    }
}


//game end
function gameEnd(){
    clearInterval(timer);
    //键盘输入监听结束
    window.onkeydown=function(){
        //按任意键重新开始游戏
        window.onkeydown=gameKeyEvent;
        //初始化游戏数据
        initData();
        createBlock();
        localStorage.setItem("currentFall", JSON.stringify(currentFall));
        localStorage.setItem("tetris_status", JSON.stringify(tetris_status));
        localStorage.setItem("curScore", curScore);
        localStorage.setItem("curSpeed", curSpeed);
        //绘制
        curScoreEle.innerHTML=""+curScore;
        curSpeedEle.innerHTML=curSpeed.toFixed(1);//保留两位小数
        drawBlocks();
        timer=setInterval(function(){
            next();
        }, 500/curSpeed);
        //清除特效
        this.stage.removeAllChildren();
        this.textStage.removeAllChildren();
    };
    //特效，游戏结束
    setTimeout(function(){
        initAnim();
        //擦除黑色方块
        for(let i=0; i<TETRIS_ROWS;i++){
            for(let j=0;j<TETRIS_COLS;j++)
                canvasCtx.clearRect(j*CELL_SIZE+1, i*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
        }
    }, 200);
    //推迟显示Failed
    setTimeout(function(){
        if(textFormed) {
            explode();
            setTimeout(function() {
                createText("FAILED");
            }, 810);
        } else {
            createText("FAILED");
        }
    }, 800);
}

