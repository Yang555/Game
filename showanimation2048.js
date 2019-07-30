/*
 * @作者: YaSo
 * @说明: 
 * @Date: 2019-07-28 18:19:48
 * @LastEditors: YaSo
 * @LastEditTime: 2019-07-29 10:14:19
 */
// 数字块样式设置-&&-添加数字
function showNumberWithAnimation(i, j, randNumber) {

    var numberCell = $('#number-cell-' + i + "-" + j);

    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(getNumberText(randNumber));

    numberCell.animate({
        width: cellSideLength,
        height: cellSideLength,
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}
// 移动数字块动画效果
function showMoveAnimation(fromx, fromy, tox, toy) {

    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}
// 更新分数
function updateScore(score) {
    $('#score').text(score);
}