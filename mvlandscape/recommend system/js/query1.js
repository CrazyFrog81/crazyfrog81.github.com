let rankList;
let jsonViewType = ["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree and Network (Graph)", "Grid/Matrix", "Line", "Map", "Point", "Table", "Text Based","SciVis","Panel",'small multiple'];
let compareViewType = ["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree", "Grid", "Line", "Map", "Point", "Table", "Text","SciVis","Panel",'sam'];
let selectRectData;
let dataImgPath = 'data/img/';
let dataImgPath1 = 'data/img2/';
let detailCloseImgPath = 'data/icon/close.png';
let detailDelOffset = 10;
let AllRankList;

defaultQuery();
function defaultQuery() {
    rankList = [];
    AllRankList = [];
    d3.csv(jsonDataCsvPath, function (data) {
        // console.log(data);
        for(let i = 0;i<data.length;i++){
            let temRank= [];
            temRank['view'] = data[i]['view_num'];
            temRank['tile'] = data[i]['tile'];
            temRank['name'] = data[i]['json'];
            rankList.push(temRank);
            AllRankList.push(temRank);
        }
        queryTemplate();
    });

}

//推荐产生
function query() {




    let imgRect = d3.selectAll('.currentRect');
    d3.select('.recommendContent').remove();
    d3.select('.warn').remove();
    rankList = [];
    AllRankList = [];



    let lastLink = caViewType(imgRect[0]);

    // 只排列 Top 20

    for (let i = 0; i < lastLink.length; i++) {
        rankList.push(lastLink[i]);
        // rankList.push(lastLink[i]['name'].substring(0, lastLink[i]['name'].length - 5));
        if (rankList.length == 20) break;
    }
    //0312
    // queryTemplate();

    for (let i = 0; i < lastLink.length; i++) {
        AllRankList.push(lastLink[i]);
        // rankList.push(lastLink[i]['name'].substring(0, lastLink[i]['name'].length - 5));

    }
    //0312
    queryTemplate();

}

// 更具rankList 渲染界面
function queryTemplate() {

    d3.select('.queryResult').append('div').attr('class','recommendContent');
    let reDiv = d3.select('.recommendContent')
        .selectAll('div')
        .data(rankList)
        .enter()
        .append('div')
        .attr('class','recommendBox');

    let tile = reDiv.append('div')
        .attr('class','tile')
        .attr('id',function (d,i) {
            return 'tile'+i;
        });
    let tileTable = tile.append('table').attr('class','tileTable');
    let tr1 = tileTable.append('tr').style('background-color','white').style('border','0');
    let td1 = tr1.append('td').attr('colspan','2').attr('align','center');
    td1.append('img')
        .attr('class','tileImg')
        .attr('src', function (d) {
            return 'data/tile_img/' + d['tile'] + '.png';
        });
    let tr2 = tileTable.append('tr').style('background-color','white').style('border','0').style('padding','0px');
    let td2 = tr2.append('td').attr('text-align','center').style('width','50%').attr('align','center').style('padding','0');
    td2.append('div')
        .attr('class','tB')
        .text('apply')
        .attr('id',function (d,i) {
            return 'apply' + i;
        })
        .on('click',function (d,i) {
            apply(d,i);
        });
    let td3 = tr2.append('td').attr('text-align','center').style('width','50%').attr('align','center');;
    td3.append('div')
        .attr('class','tB')
        .text('cancel')
        .attr('id',function (d,i) {
            return 'cancel' + i;
        })
        .on('click',function (d,i) {
            cancel(d,i);
        });

    let dataImg = reDiv.append('div')
        .attr('class','dataImg')
        .attr('id',function (d,i) {
            return 'dataImg'+i;
        });

    dataImg.append('img')
        .attr('src', function (d) {
            return dataImgPath1 + d['name'].substring(0, d['name'].length - 5) + '.jpg';
        }).attr('class','imgData').attr('id', function (d,i) {
            return d['name'].split('@').join('y');

    });

}




// 计算视图中得相似度值 = viewType + layout change
function caViewType(rect) {
    // 计算已经布局好的界面


    selectRectData = selectRectBbox(rect);



    let initialRect = initArr(compareViewType.length);
//
//     // for (let i = 0; i < selectRectData.length; i++) {
//     //     for (let j = 0; j < selectRectData[i].length; j++) {
//     //         initialRect[i] += selectRectData[i][j]['width'] * selectRectData[i][j]['height'];
//     //     }
//     // }
    //频率

    let selectRectDataSum = 0;
    for (let i = 0; i < selectRectData.length; i++) {
        for (let j = 0; j < selectRectData[i].length; j++) {
            if(i===14){
                initialRect[compareViewType1.indexOf(selectRectData[i][j]['viewType'])] += parseInt(selectRectData[i][j]['viewNum']);
                selectRectDataSum += parseInt(selectRectData[i][j]['viewNum']);
            } else{
                initialRect[i] += 1;
                selectRectDataSum +=1;
            }

        }
    }

    for (let i = 0;i<initialRect.length;i++){
        initialRect[i] = initialRect[i]/selectRectDataSum;
    }



//
//
//
    let cosView = [];
    for (let i = 0; i < inputData.length; i++) {
        let tmpView = [];
        let temp = {};
        let newRect = initArr(compareViewType.length);
        for (let j = 0; j < inputData[i]['data'].length; j++) {
            let viewItem = {};
            viewItem.hierarchy = inputData[i]['data'][j]['hierarchy'];
            viewItem.type = inputData[i]['data'][j]['viewType'];
            viewItem.x = inputData[i]['data'][j]['x'];
            viewItem.y = inputData[i]['data'][j]['y'];
            viewItem.width = inputData[i]['data'][j]['width'];
            viewItem.height = inputData[i]['data'][j]['height'];
            viewItem.select = false;
            viewItem.cosNum = -2;
            if(inputData[i]['data'][j].hasOwnProperty("sm")){
                viewItem.sm = true;
            }
            // newRect[jsonViewType.indexOf(inputData[i]['data'][j]['viewType'])] += viewItem.width * viewItem.height;
            newRect[jsonViewType.indexOf(inputData[i]['data'][j]['viewType'])] += 1/inputData[i]['viewNum'];
            tmpView.push(viewItem);

        }
        temp.view = tmpView;
        temp.num = caCos(initialRect, newRect);
        // console.log(temp.num);
        temp.tile = inputData[i]['tile'];
        temp.name = inputData[i]['name'];
        cosView.push(temp);


    }

    // console.log('cosView');
    // console.log(cosView);
//    0304
// || selectRectDataSum!==cosView[index]['view'].length
    // 剔除为0的
    let index = 0;
    let cosViewLen = cosView.length;
    for (let i = 0; i < cosViewLen; i++) {
        //0304
        if (cosView[index]['num'] == 0 || isNaN(cosView[index]['num']) ) {
            cosView.splice(index, 1);
        } else {
            index += 1;
        }
    }
//
//     // //计算change layout

    for (let i = 0; i < cosView.length; i++) {
        let smList = [];
        let sum = 0;
        //sm 存在


        if(selectRectData[14].length !== 0){

            let q = 14;
            for (let m = 0; m < selectRectData[q].length; m++) {
                let max = -2;
                let maxIndex = -2;
                let x = [selectRectData[q][m]['x'], selectRectData[q][m]['y'], selectRectData[q][m]['width'], selectRectData[q][m]['height']];

                for (let n = 0; n < cosView[i]['view'].length; n++) {
                    if(cosView[i]['view'][n].hasOwnProperty("sm")){

                        if (jsonViewType.indexOf(cosView[i]['view'][n]['type']) === compareViewType1.indexOf(selectRectData[q][m]['viewType'])) {
                            let y = [cosView[i]['view'][n]['x'], cosView[i]['view'][n]['y'], cosView[i]['view'][n]['width'], cosView[i]['view'][n]['height']];
                            if(cosView[i]['view'][n]['select']){
                                continue;
                            }
                            if (caCos(x, y) > max) {
                                max = caCos(x, y);
                                maxIndex = n;

                            }
                        }
                    }
                }
                if(max != -2){
                    smList.push(cosView[i]['view'][maxIndex]['hierarchy']);
                    cosView[i]['view'][maxIndex]['cosNum'] = max;
                    cosView[i]['view'][maxIndex]['select']= true;
                    sum += max;
                }
            }
        }
        for (let j = 0; j < selectRectData.length-1; j++) {

            if (selectRectData[j].length != 0) {

                for (let m = 0; m < selectRectData[j].length; m++) {
                    let max = -2;
                    let maxIndex = -2;
                    let x = [selectRectData[j][m]['x'], selectRectData[j][m]['y'], selectRectData[j][m]['width'], selectRectData[j][m]['height']];

                    for (let n = 0; n < cosView[i]['view'].length; n++) {
                        let trueHier;
                        if (jsonViewType.indexOf(cosView[i]['view'][n]['type']) == j) {

                            let selectTileHie= cosView[i]['view'][n]['hierarchy'].indexOf('.');
                            if(selectTileHie !== -1) { trueHier = cosView[i]['view'][n]['hierarchy'].slice(0,selectTileHie)}
                            else {trueHier = cosView[i]['view'][n]['hierarchy'];}
                            let y = [cosView[i]['view'][n]['x'], cosView[i]['view'][n]['y'], cosView[i]['view'][n]['width'], cosView[i]['view'][n]['height']];

                            if(cosView[i]['view'][n]['select'] || smList.indexOf(trueHier) !== -1 || cosView[i]['view'][n].hasOwnProperty("sm")){

                                continue;
                            }

                            if (caCos(x, y) > max) {
                                max = caCos(x, y);
                                maxIndex = n;

                            }
                        }
                    }
                    if(max != -2){
                        cosView[i]['view'][maxIndex]['cosNum'] = max;
                        cosView[i]['view'][maxIndex]['select']= true;
                        sum += max;
                    }
                }
            }
        }
        // cosView[i]['num'] = sum;
        cosView[i]['num'] = sum + cosView[i]['num'];
    }
    cosView.sort(function (a, b) {
        return b['num'] - a['num'];
    });


    return cosView;
}


//初始化数组
function initArr(num) {
    let selectRect = new Array(num);
    for (let i = 0; i < selectRect.length; i++) {
        selectRect[i] = 0;
    }
    return selectRect;
}

//计算余弦相似度  余弦距离
function caCos(x, y) {

    let sum1 = 0, sum2 = 0, sum3 = 0;
    for (let i = 0; i < x.length; i++) {

        sum1 += x[i] * y[i];
        sum2 += x[i] * x[i];
        sum3 += y[i] * y[i];
    }

    let lastCos = sum1 / (Math.sqrt(sum2) * Math.sqrt(sum3));
    // let tmp = [lastCos, flag];
    return lastCos;
}

// function layoutCos(x,y){
//     let s1 = 0;
//     let s2 = 0;
//     let s3 = 0;
//     for(let i = 0;i< 4;i++){
//         s1 += x[i] *y[i];
//         s2 += x[i] *x[i];
//         s3 += y[i] *y[i];
//     }
//     let lastCos = s1 / (Math.sqrt(s2) * Math.sqrt(s3));
//
//     return lastCos;
// }

//计算欧几里得距离
// function caEuclidean(x, y) {
//     let sum = 0;
//     for (let i = 0; i < x.length; i++) {
//         sum += Math.pow((x[i] - y[i]), 2);
//     }
//     return Math.sqrt(sum);
// }

//定位视图得矩形  视图向量归一化
function selectRectBbox(rect) {



    let selectRectVector = initialPosition(jsonViewType.length);


    let allX = [];
    let allY = [];
    for (let i = 0; i < rect.length; i++) {
        allX.push(rect[i]['x']['baseVal'].value);
        allY.push(rect[i]['y']['baseVal'].value);
    }
    allX.sort(function (a, b) {
        return a - b;
    });
    allY.sort(function (a, b) {
        return a - b;
    });
    let xMin = allX[0];
    let xMax = allX[rect.length - 1];
    let yMin = allY[0];
    let yMax = allY[rect.length - 1];
    let width, height;
    for (let i = 0; i < rect.length; i++) {
        if (rect[i]['x']['baseVal'].value == xMax) {
            width = xMax - xMin + rect[i]['width']['baseVal'].value;
        }
        if (rect[i]['y']['baseVal'].value == yMax) {
            height = yMax - yMin + rect[i]['height']['baseVal'].value;
        }
    }


    for (let i = 0; i < rect.length; i++) {
        let itemTemp = {};
        itemTemp['x'] = (rect[i]['x']['baseVal'].value - xMin + rect[i]['width']['baseVal'].value / 2) / width;
        itemTemp['y'] = (rect[i]['y']['baseVal'].value - yMin + rect[i]['height']['baseVal'].value / 2) / height;
        itemTemp['height'] = rect[i]['height']['baseVal'].value / height;
        itemTemp['width'] = rect[i]['width']['baseVal'].value / width;
        if(compareViewType1.indexOf(rect[i]['id'].substring(0, 3)) === 14){

            let smNum = viewTypeTime[14].toString().length;
            let smName = d3.select('#'+rect[i]['id']+'R')[0][0]['className']['baseVal'];
            itemTemp['viewType'] = smName.substring(3+smNum,6+smNum);
            itemTemp['viewNum'] = smName.substring(6+smNum,smName.length);
        }

        selectRectVector[compareViewType1.indexOf(rect[i]['id'].substring(0, 3))].push(itemTemp);
    }


    return selectRectVector;

}

function initialPosition(num) {
    let rectVector = [];
    for (let i = 0; i < num; i++) {
        rectVector.push([]);
    }
    return rectVector;
}

//创建detail view

function createDetail(name,e) {
    d3.select('#delDetailView').remove();
    d3.select('.detailView').remove();
    if(name.indexOf('y') != -1){
        name = name.split("y").join("@");
    }
    let temp = [];
    for (let j = 0; j < detailData.length; j++) {
        if (name == detailData[j]['json']) {
            temp['title'] = detailData[j]['title'];
            temp['author'] = detailData[j]['author'];
            temp['doi'] = detailData[j]['doi'];
            temp['url'] = detailData[j]['url'];
            temp['year'] = detailData[j]['year'];
            temp['venue'] = detailData[j]['venue'];

            continue;
        }
    }

    let table = d3.select('body').append('table').attr('class','detailView')
        .attr('width','450px');
    let tr1 = table.append('tr').attr('valign','top')
        tr1.append('th').attr('rowspan','2').attr('class','detailImage')
        .append('img').attr('width','100px').attr('src',dataImgPath+name.substring(0, name.length - 5) + '.jpg');
        tr1.append('td').style('align','left').append('p').style('font-size','13px').style('margin-top','5px').style('font-weight',' bold').text(temp['title'])
        .append('p').style('font-weight',' normal').style('font-size','13px').text(authorName(temp['author']));
    let tr2 = table.append('tr').attr('valign','top').append('th').attr('colspan','2').attr('align','left');
        tr2.append('p').style('margin-top','0px').style('margin-bottom','0px').style('font-weight',' normal').style('font-size','13px').text('Doi:').append('a').style('text-decoration','none').attr('target','_blank').attr('href',temp['url']).text(temp['doi'].slice(0, temp['doi'].length));
        tr2.append('p').style('margin-top','0px').style('font-weight',' normal').style('font-size','13px').text('Venue:' + temp['venue']);
    d3.select('body').append('img')
        .attr('width','28px')
        .attr('id','delDetailView')
        .attr('src',detailCloseImgPath)
        .on('click',function () {
            d3.select('.detailView').remove();
            d3.select('#delDetailView').remove();

        });
    //计算移动距离

    let moveX = e.clientX-$('.detailView')[0].offsetWidth/2;
    let moveY = e.clientY -$(document.body).height()-$('.detailView')[0].offsetHeight;


    if(-moveY>$(document.body).height()*0.7){
        moveY +=$('.detailView')[0].offsetHeight;
        moveX -= $('.detailView')[0].offsetWidth*0.2;
    }



    while((moveX+$('.detailView')[0].offsetWidth)>$(document.body).width()){
        moveX -= $('.detailView')[0].offsetWidth*0.1;


    }

    d3.select('.detailView').style("transform","translate("+moveX+"px,"+moveY+"px)");

    let delMoveX = $('.detailView').offset().left - detailDelOffset;
    let delMoveY = moveY-$('.detailView')[0].offsetHeight;

    d3.select('#delDetailView').style("transform","translate("+delMoveX+"px,"+delMoveY+"px)");


}

function authorName(name) {
    let aName = name.split(";");
    let RaName = '';
    for (let i = 0; i < aName.length; i++) {
        if (i == 0) {
            RaName = aName[i];
        } else {
            RaName = RaName + ', ' + aName[i];
        }
    }
    return RaName;

}

window.onscroll=function(){
    d3.select('.detailView').remove();
};



