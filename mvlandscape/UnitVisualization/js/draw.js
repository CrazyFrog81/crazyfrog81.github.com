let circleRows = [4,5,6,7,8,9,10];
let circleRow = 4;
let barBoxWidth;
let barWidth;
let lineContent;
let detailWidth = 700;
let barMoveTop = 40;

function drawBar(barAxisFlag) {


    delDetail();
    d3.selectAll('.legend').remove();

    let svgHeight = document.getElementsByClassName('svg')[0]['clientHeight'];
    position();

    d3.selectAll('.barGroup').remove();
    for(let i = 0; i<barAxis.length;i++){

        let barGroup = d3.select('.svg')
            .append('g')
            .attr('class','barGroup')
            .attr('id','barG'+ i);

        let bar = barGroup.selectAll('g')
            .data(barAxis[i])
            .enter()
            .append('g')
            .attr('id',function (d,i) {
                return 'g'+d.name;
            })
            .attr('class','barG');
        bar.append('rect')
            .attr('x',function (d,i) {
                return d.x;
            })
            .attr('y',function (d,i) {
                return svgHeight -barMoveTop - d.num;
            })
            .attr('width',barWidth)
            .attr('height',function (d,i) {
                return d.num;
            })
            .attr('class', 'bar')
            .attr('id',function (d,i) {
                return 'bar'+d.name;
            })
            .attr('fill','rgb(230,230,230)');

        bar.append('rect')
            .attr('x',function (d,i) {
                return d.x;
            })
            .attr('y',function (d,i) {
                return svgHeight -barMoveTop+6 ;
            })
            .attr('width',barWidth)
            .attr('height','20px')
            .attr('class', 'bar')
            .attr('fill','rgb(230,230,230)');

        if(barAxisFlag == 0){
                bar.append('text')
                    .attr('x',function (d,i) {
                        return d.x + barWidth/2;
                    })
                    .attr('y',function (d,i) {
                        return svgHeight -barMoveTop+18+3;
                    })
                    .attr('width','18px')
                    .attr('height','18px')
                    .attr('text-anchor', 'middle')
                    .text(
                        function (d,i) {
                            if(d.name === 11) return '10+';
                            else{
                                return d.name;
                            }

                        }
                    ).attr('font-size','18px');
            } else{
                bar.append('image')
                    .attr('x',function (d,i) {
                        return d.x + barWidth/2-8;
                    })
                    .attr('y',function (d,i) {
                        return svgHeight -barMoveTop+20+10-23;
                    })
                    .attr('height','18px')
                    .attr('width','18px')
                    .attr('xlink:href',function (d,i) {
                        return 'data/tile_img/'+d.name+'.png';
                    });
            }
    }
    drawLine(svgHeight);
    drawCircle(barAxisFlag);

    default_setting(default_set);

}
function drawCircle(barAxisFlag) {
    let selectBarGroup = document.getElementsByClassName('barG');
    for (let i = 0; i < selectBarGroup.length; i++) {
        let selectBarId = selectBarGroup[i]['id'];
        let bbox = document.getElementById(selectBarId).getBBox();
        let barH = bbox.height;
        let barW = bbox.width;
        let barX = bbox.x;
        let barY = bbox.y;
        let circleR = barW / (circleRow * 2);
        let selectData;
        let numBar = -1;
        let columnBar = 0;
        let j = 0;
        if (filtered_data.length == 0) {
            selectData = input_data;
        } else {
            selectData = filtered_data;
        }

        for (let i = 0; i < selectData.length; i++) {
            if(barAxisFlag === 0 && selectBarId.substring(1,selectBarId.length) === '11' && parseInt(selectData[i][attr_ids[barAxisFlag]])>10){

                numBar += 1;
                if (numBar % circleRow == 0) {
                    j = 0;
                } else {
                    j = j + 1;
                }
                columnBar = Math.floor(numBar / circleRow);

                let c_x = barX + (1 + 2 * j) * circleR;
                let c_y = barY + barH -barMoveTop+14.8- (1 + 2 * columnBar) * circleR;

                d3.select('#' + selectBarId).append('circle')
                    .attr('cx', c_x)
                    .attr('cy', c_y)
                    .attr('r', circleR)
                    .attr('id', selectData[i]['doi'] + 'r')
                    .attr('fill', '#4472c4')
                    .on('click', function (d) { detailView(selectData[i],d)});

            } else{
                if (selectData[i][attr_ids[barAxisFlag]] == selectBarId.substring(1,selectBarId.length)) {
                    numBar += 1;
                    if (numBar % circleRow == 0) {
                        j = 0;
                    } else {
                        j = j + 1;
                    }
                    columnBar = Math.floor(numBar / circleRow);

                    let c_x = barX + (1 + 2 * j) * circleR;
                    let c_y = barY + barH -barMoveTop+14.8- (1 + 2 * columnBar) * circleR;

                    d3.select('#' + selectBarId).append('circle')
                        .attr('cx', c_x)
                        .attr('cy', c_y)
                        .attr('r', circleR)
                        .attr('id', selectData[i]['doi'] + 'r')
                        .attr('fill', '#4472c4')
                        .on('click', function (d) { detailView(selectData[i],d)});
                }
            }
        }
    }
}
function drawLine(svgHeight) {
    d3.selectAll('line').remove();
    lineContent = [];
    let tmp_sum = 0;
    let tmp_item;
    for(let i = 0;i<barAxis.length - 1;i++){
        tmp_sum += barAxis[i].length;
        tmp_item = {};
        tmp_item.x1 = tmp_sum * barBoxWidth;
        tmp_item.x2 = tmp_sum * barBoxWidth;
        tmp_item.y1 = 100;
        tmp_item.y2 = svgHeight;
        lineContent.push(tmp_item);
    }
    if(barAxis.length != 1){
        d3.select('.svg').selectAll('line').data(lineContent).enter().append('line')
            .attr('x1',function (d) {
                return d.x1;
            })
            .attr('y1',function (d) {
            return d.y1;
        }).attr('x2',function (d) {
            return d.x2;
        }).attr('y2',function (d) {
            return d.y2;
        }).style('stroke','#bdbdbd')
            .style(' stroke-width','2')
            .style('stroke-dasharray','20 10');
    }
}

function position() {
    let svgWidth = document.getElementsByClassName('svg')[0]['clientWidth'];
    let svgHeight = document.getElementsByClassName('svg')[0]['clientHeight'];
    let barNum = 0;
    for (let i = 0; i < barAxis.length; i++) {
        barNum += barAxis[i].length;
    }

    barBoxWidth = svgWidth / barNum;
    barWidth = barBoxWidth * 0.92;
    // let barMargin = (barBoxWidth - barWidth) / 2;
    let barSum = 0;
    let tmp,tmp1;
    //确定circleRow 的数量


    for(let i = 0;i< circleRows.length;i++){
        let tmpTest = 0;
        for(let j = 0;j<barAxis.length;j++){
            for(let m = 0;m<barAxis[j].length;m++){
                tmp1=barAxis[j][m].num;
                if (tmp1 % circleRows[i]== 0) {
                    tmp = Math.floor(tmp1 / circleRows[i]) * (barWidth / circleRows[i]);
                } else {
                    tmp = (Math.floor(tmp1 / circleRows[i]) + 1) * (barWidth / circleRows[i]);

                }
                if(tmp>tmpTest){tmpTest=tmp;}

            }
        }
        if(tmpTest<svgHeight-100){
            circleRow = circleRows[i];

            break;
        }
        //单独修改只有数字4的情况
        if(barAxis.length === 10){
            circleRow = 3;
        }
        if(barAxis[0][0].name == '4' || barAxis[0][0].name == '3' || barAxis[0][0].name == '5'){
            circleRow = 9;
        }
        // if(barAxis.length === 1 && barAxis[0].length === 1 && barAxis[0][0].name == '4'){
        //     circleRow = 12;
        // }


    }

    if(barWidth / circleRow >50){
        barWidth = circleRow * 50;
    }
    let barMargin = (barBoxWidth - barWidth) / 2;

    for (let i = 0; i < barAxis.length; i++) {
        for (let j = 0; j < barAxis[i].length; j++) {
            if (barAxis[i][j].num % circleRow == 0) {
                barAxis[i][j].num = Math.floor(barAxis[i][j].num / circleRow) * (barWidth / circleRow);
            } else {
                barAxis[i][j].num = (Math.floor(barAxis[i][j].num / circleRow) + 1) * (barWidth / circleRow);
            }
            barAxis[i][j].x = barSum + barMargin;
            barSum += barBoxWidth;
        }
    }
}

function detailView(selectData, circle_x, circle_y) {
    delDetail();
    //判断 tooltip 位置
    let tip1 = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
            return "<table><tbody><tr>"+
                "<td>"+
                    "<img class='detail_image' src='data/img/" + selectData['json'].substr(0, selectData['json'].length - 5) + ".jpg' alt=''>" +
                "</td>"+
                "<td class='detail_text'>"+
                    "<b>" + selectData['title'] + "</b><br>" +
                    authorName(selectData['author']) + "<br> <br>" +
                    "Doi: <a style='text-decoration:none' href='" +selectData['url'] + "'> " + selectData['doi'].slice(0,selectData['doi'].length) + "</a> <br>"+
                    "Venue: "+ selectData['venue'] +
                "</td>"
            + "</tr></tbody></table>";
        });
    let tip2 = d3.tip()
        .attr('class','detailDel')
        .html(function (d) {
            return "<img class='closeButton' onclick='delDetail()' src='data/icon/close.png' style='width: 30px;height: 30px; '></img>"
        });
    let svg = d3.select('svg');
    svg.call(tip1);
    tip1.show();
    let tooltipLeft = circle_x + 0;
    let tooltipTop = circle_y - 200;
    let tooltipWidth = $('.d3-tip')[0].clientWidth;
    let tooltipHeight = $('.d3-tip')[0].clientHeight;

    if(tooltipLeft - tooltipWidth / 2 < $(window)[0].innerWidth * 0.22){
        tooltipLeft = Math.max(tooltipLeft, $(window)[0].innerWidth * 0.22);
    } else if(tooltipLeft + tooltipWidth > $(window)[0].innerWidth){
        tooltipLeft = $(window)[0].innerWidth - tooltipWidth - 10;
    }

    console.log('detailView');
    console.log(tooltipTop);
    console.log($(window)[0].innerHeight*0.2);
    if(tooltipTop <$(window)[0].innerHeight*0.1){
        tooltipTop = $(window)[0].innerHeight*0.1;
    }
    // tooltipTop = 250;
    // tooltipLeft = 900;
    d3.select('.d3-tip').style('left',tooltipLeft +'px').style('top',tooltipTop+'px');
    svg.call(tip2);
    tip2.show();
    d3.select('.detailDel').style('left',tooltipLeft +'px').style('top',tooltipTop+'px');

    d3.selectAll('.detail_line').remove();
    d3.select('.svg').append('line').attr('class', 'detail_line')
        .attr('x1', circle_x)
        .attr('y1', circle_y).attr('x2', tooltipLeft).attr('y2', tooltipTop).style('stroke','#888888')
        .style(' stroke-width','4')
        .style('stroke-dasharray','12 6');
}

function authorName(name) {
    let aName = name.split(";");
    let RaName = '';
    for(let i = 0;i<aName.length;i++){
        if(i==0){
            RaName = aName[i];
        } else {
            RaName = RaName + ', ' +aName[i];
        }
    }
    return RaName;
}

function delDetail() {
    d3.select('.d3-tip').remove();
    d3.select('.detailDel').remove();
    d3.selectAll('.detail_line').remove();
}







