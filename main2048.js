/*
 * @作者: YaSo
 * @说明: 
 * @Date: 2019-07-28 18:08:44
 * @LastEditors: YaSo
 * @LastEditTime: 2019-07-29 10:01:26
 */

var board = new Array();
var score = 0;
var hasConflicted = new Array();

// 四个坐标--用于移动端触控
var startx = 0, //手指按下的x坐标
    starty = 0, //按下y坐标
    endx = 0, //手指松开x坐标
    endy = 0; //手指松开的y坐标


$(document).ready(function() {
    // 初始化界面
    prepareForMoble();
    // 开始游戏
    newgame();
});
// 初始化界面函数--根据文档宽度自适应游戏界面大小
function prepareForMoble() {
    if (documentWidth > 500) {
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100; //变量见support2048.js
    }
    // 初始化宫格棋盘容器尺寸
    $("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("height", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-radius", 0.02 * gridContainerWidth);
    // 初始化十二宫格尺寸
    $(".grid-cell").css("width", cellSideLength);
    $(".grid-cell").css("height", cellSideLength);
    $(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}

function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            // 对十二宫格进行定位布局
            var gridCell = $('#grid-cell-' + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }

    for (var i = 0; i < 4; i++) {
        // 转二维数组
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0; //初始化棋盘数字，4*4二维数组
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
    $('#score').text(score);
}

function updateBoardView() {

    $(".number-cell").remove();
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            //添加数字到棋盘上
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);
            // 如果该位置数字为0，则代表没有数字，不显示；若不为0 ，则显示数字
            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css('left', getPosLeft(i, j) + cellSideLength / 2);
                theNumberCell.css('font-size', "20px");
            } else {
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(getNumberText(board[i][j]));
                theNumberCell.css('font-size', "20px");
            }

            hasConflicted[i][j] = false;
        }
    $(".number-cell").css("line-height", cellSideLength + 'px');
    if (parseInt($(".number-cell").text()) > 1000) {
        $(".number-cell").css("font-size", 0.3 * cellSideLength + 'px');
    } else {
        $(".number-cell").css("font-size", 0.6 * cellSideLength + 'px');
    }

}
// 生成随机数
function generateOneNumber() {
    // 如果没有空间，返回
    if (nospace(board)) {
        return false;
    }

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) {
            break;
        }

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                }
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}
// 监听键盘按键
$(document).keydown(function(event) {
    // 清除默认事件
    event.preventDefault();
    switch (event.keyCode) {
        case 37: //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default: //default
            break;
    }
});
document.getElementsByTagName("body")[0].addEventListener("touchmove", function(event) {
    event.preventDefault();
});
// 监听移动端手指触控
document.addEventListener("touchstart", function(event) {
    event.preventDefault();
    // 获取按下坐标
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});
// 手指松开
document.addEventListener("touchend", function(event) {
    event.preventDefault();
    // 获取松开坐标
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;
    // 根据两个位置坐标--判断手势动作为--上滑-下滑-左滑-右滑
    var deltX = endx - startx,
        deltY = endy - starty;
    if (Math.abs(deltX) < 0.25 * documentWidth && Math.abs(deltY) < 0.25 * documentWidth) {
        return;
    }

    if (Math.abs(deltX) >= Math.abs(deltY)) {
        if (deltX > 0) {
            //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        } else {
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    } else {
        if (deltY > 0) {
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        } else {
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
        }
    }
});

// 判断结束游戏函数
function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('输了吧！！！');
}
// 移动数字块
function moveLeft() {
    // 判断能否移动
    if (!canMoveLeft(board))
        return false;

    //moveLeft
    for (var i = 0; i < 4; i++)
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {

                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board))
        return false;

    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {

                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveUp() {

    if (!canMoveUp(board))
        return false;

    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {

                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board))
        return false;

    //moveDown
    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {

                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()", 200);
    return true;
}