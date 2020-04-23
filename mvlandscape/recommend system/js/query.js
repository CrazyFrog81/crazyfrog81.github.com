let rankList;
let jsonViewType = ["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree and Network (Graph)", "Grid/Matrix", "Line", "Map", "Point", "Table", "Text Based","SciVis","Panel",'small multiple'];
let compareViewType = ["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree", "Grid", "Line", "Map", "Point", "Table", "Text","SciVis","Panel",'sam'];
let selectRectData;
let dataImgPath = 'data/img/';
let dataImgPath1 = 'data/img2/';
let detailCloseImgPath = 'data/icon/close.png';
let detailDelOffset = 10;
let AllRankList;
// let oneVector = new Array(9).fill(0);
let ViewTypeVector = [];
// let oneVector = new Array(9).
let databasematrix = [];
let MI_database = [];
let smUser_list = [];

let MI_Algorithm = true;

defaultQuery();
function defaultQuery() {

    rankList = [];
    AllRankList = [];

    $.getJSON(jsonDataJsonPath, function (data) {
        for (let i = 0; i < data.length; i++) {
            let tmpView = [];
            for (let j = 0; j < data[i]['data'].length; j++) {
                let viewItem = {};
                viewItem.hierarchy = data[i]['data'][j]['hierarchy'];
                viewItem.type = data[i]['data'][j]['viewType'];
                viewItem.x = data[i]['data'][j]['x'];
                viewItem.y = data[i]['data'][j]['y'];
                viewItem.width = data[i]['data'][j]['width'];
                viewItem.height = data[i]['data'][j]['height'];
                viewItem.select = false;
                if (data[i]['data'][j].hasOwnProperty("sm")) {
                    viewItem.sm = true;
                }
                tmpView.push(viewItem);
            }
            let tmpItem = {};
            tmpItem.viewNum = data[i]['viewNum'];
            tmpItem.view = tmpView;
            tmpItem.tile = data[i]['tile'];
            tmpItem.name = data[i]['name'];
            AllRankList.push(tmpItem);
            rankList.push(tmpItem);
        }

        queryTemplate();
    });
}

//推荐产生
function query() {
        // console.log('query');
        let imgRect = d3.selectAll('.currentRect');

        d3.select('.recommendContent').remove();
        d3.select('.warn').remove();
        rankList = [];
        AllRankList = [];

        let lastLink = caViewType(imgRect[0]);
        // 只排列 Top 20

        for (let i = 0; i < lastLink.length; i++) {
            if(lastLink[i]['num'] === 200) continue;
            rankList.push(lastLink[i]);
            // rankList.push(lastLink[i]['name'].substring(0, lastLink[i]['name'].length - 5));
            // if (rankList.length == 20) break;
        }
        for (let i = 0; i < lastLink.length; i++) {
            if(lastLink[i]['num'] === 200) continue;
            AllRankList.push(lastLink[i]);
            // rankList.push(lastLink[i]['name'].substring(0, lastLink[i]['name'].length - 5));

        }
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
    let rankNum = reDiv.append('div')
        .attr('class','rankNum')
        .text(function (d,i) {
            return i+1;
        });

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
    // 计算已经布局好的界面A

    selectRectData = selectRectBbox(rect);

    let userInputMatrix = [];
    let areaRatio = initArr(14);
    let areaSum = 0;

    for(let i = 0; i< selectRectData.length-1;i++)
    {

        let tmp_viewTypeVector = [];
        for(let j = 0; j< selectRectData[i].length; j++){

            let sectionVector = GetAreaForUserInput(selectRectData[i][j]['x'],selectRectData[i][j]['y'],selectRectData[i][j]['width'],selectRectData[i][j]['height'])
            tmp_viewTypeVector.push(sectionVector)
            areaRatio[i] += selectRectData[i][j]['width'] * selectRectData[i][j]['height'];
            areaSum += selectRectData[i][j]['width'] * selectRectData[i][j]['height'];
        }
        userInputMatrix[i] = tmp_viewTypeVector;
    }
    for(let i = 0; i<14; i++){
        areaRatio[i] = areaRatio[i] / areaSum;
        if(areaRatio[i] != 0)
            areaRatio[i] = 1;
    }
    let user_9_14 = [];

    if(MI_Algorithm)
        user_9_14 =  userInput_MI(userInputMatrix);

    let similarity = [];

    for(let i = 0; i <databasematrix.length; i++){//i == 0 --> 360

        let tmpView = [];
        let newRect = initArr(compareViewType.length); 
        
        //store the view to project when apply
        for (let j = 0; j < inputData[i]['data'].length; j++) {
            let viewItem = {};
            viewItem.hierarchy = inputData[i]['data'][j]['hierarchy'];
            viewItem.type = inputData[i]['data'][j]['viewType'];
            viewItem.x = inputData[i]['data'][j]['x'];
            viewItem.y = inputData[i]['data'][j]['y'];
            viewItem.width = inputData[i]['data'][j]['width'];
            viewItem.height = inputData[i]['data'][j]['height'];
            viewItem.select = false;
            if(inputData[i]['data'][j].hasOwnProperty("sm")){
                viewItem.sm = true;
            }
            tmpView.push(viewItem);
        }

        let tmpItem ={};
        tmpItem.viewNum = inputData[i]['viewNum'];
        tmpItem.view = tmpView;
        tmpItem.tile = inputData[i]['tile'];
        tmpItem.name = inputData[i]['name'];

        //calculate the similarity
        let distanceAll = 0;
        if(MI_Algorithm){
            // console.log('MI_database')
            // console.log(MI_database[i])
            distanceAll = calMI(user_9_14,MI_database[i])
        }
        else
            distanceAll = calEuler(i,userInputMatrix);
        // console.log(distanceAll)

        tmpItem.num = distanceAll;
        similarity.push(tmpItem)
    }

    similarity.sort(function (a, b) {
        return a['num'] - b['num'];
    });
    // console.log(similarity)
    // console.log(similarity)
    let similarity1=layoutChange(similarity);
    return similarity1;

}
function calEuler(i,userInputMatrix){
    let distanceAll = 0
    let noSameViewType = true;
    // console.log(noSameViewType)
    for(let j = 0; j< 14 ;j++){
        let user = userInputMatrix[j];
        let database = databasematrix[i][j];
        
        if(user.length == 0)
            continue;
        if(database === undefined)
        {
            for(let row = 0; row < user.length; row++)
                distanceAll += calFnorm(user[row],initArr(9),1)
            continue;
        }
        let flag_col = initArr(database.length)

        noSameViewType = false;
        // find the closest one
        for(let row = 0; row < user.length; row++)
        {
            let min = 100;
            let index = -1;
            for (let col = 0; col < database.length; col++)
            { 
                if(flag_col[col]) continue;
                let distance = calFnorm(user[row],database[col],1)
                if(min > distance){
                    min = distance
                    index = col;
                }
            }
            if(index != -1)
                flag_col[index] = 1;
            if(min!=100)
                distanceAll += min;
        }
        for(let row = database.length; row < user.length; row++){
             distanceAll += calFnorm(user[row],initArr(9),1)
        }
    }
    if(noSameViewType)
        distanceAll = 200;
    return distanceAll;
}
let splice =5
function calMI(X,Y,i){
    let x = toOneDimension(X)
    let y = toOneDimension(Y)
    let cnt_x = initArr(splice);
    let cnt_y = initArr(splice)
    let cnt_xy = []
    for(let i =0;i<splice;i++)
        cnt_xy[i] = initArr(splice)
    // x = [1,2,0,0]
    // y = [1,2,0,0]
    // console.log(Math.log(2))
    for(let i = 0;i<x.length;i++){
        if(x[i]<0.2) x[i] = 0
        else if(x[i]<0.4) x[i] = 1
        else if(x[i]<0.8) x[i] = 2
        else if(x[i]<0.8) x[i] = 3
        else  x[i] = 4
        if(y[i]<0.2) y[i] = 0
        else if(y[i]<0.4) y[i] = 1
        else if(y[i]<0.8) y[i] = 2
        else if(y[i]<0.8) y[i] = 3
        else  y[i] = 4
        // x[i] = parseInt(x[i]*10)
        // y[i] = parseInt(y[i]*10)
        // if(x[i] == 10) x[i]=9;
        // if(y[i] == 10) y[i]=9;

        cnt_x[x[i]]+=1
        cnt_y[y[i]]+=1
        cnt_xy[x[i]][y[i]]+=1
    }
    let p_x = initArr(splice);
    let p_y = initArr(splice)
    let p_xy = []
    for(let i =0;i<splice;i++){
        p_x[i] = cnt_x[i]/x.length;
        p_y[i] = cnt_y[i]/x.length;
        p_xy[i] = initArr(splice)
    }
    for(let i =0;i<splice;i++)
        for(let j = 0; j<splice;j++)
            p_xy[i][j] = cnt_xy[i][j]/x.length
        
    let MI = 0;
    // console.log(p_x,p_y,p_xy)
    for(let i = 0;i<splice;i++) //x
        for(let j=0;j<splice;j++){ //y
            let tmp = p_x[i]*p_y[j]
            if(tmp == 0 || p_xy[i][j] == 0) continue;
            tmp =  p_xy[i][j] / tmp
            MI += p_xy[i][j] * Math.log(tmp)
        }
    // console.log('calMI')
    // console.log(MI)
    return -MI;
}
function userInput_MI(userInputMatrix){
    let user_9_14 = [];
    for(let j = 0; j<9; j++){
        let tmp = initArr(14)
        user_9_14[j] = tmp;
    }

    let user_14_9 =[];
    for(let j = 0; j<14; j++){
        let user = userInputMatrix[j];
        let tmp_mm = initArr(9);
        for(let k = 0; k< user.length;k++){
            for(s = 0; s<9;s++)
                tmp_mm[s] += user[k][s];
        }
        user_14_9[j] = tmp_mm;
    }
    for(let j = 0;j<14;j++){
        for(let k =0 ;k<9 ;k++)
            user_9_14[k][j] = user_14_9[j][k]
    }

    return user_9_14;
}

function toOneDimension(x){
    let oneDimensionVector=[];
    for(let i = 0;i<x.length;i++){
        // oneDimensionVector.push(x[i]);
        oneDimensionVector = oneDimensionVector.concat(x[i])
    }
    return oneDimensionVector;
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
function calCos(x, y) {
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
function calSD(x,y){
    let sum = 0;
    for (let i = 0; i < x.length; i++) {
        sum += (x[i] - y[i]) * (x[i] - y[i]);
    }
    return sum;
}
function calFnorm(x,y,weight){
    let sum = 0;
     for (let i = 0; i < x.length; i++) {
        let index = Math.floor(i/9);
        sum += Math.abs(x[i] - y[i]) //*weight[index]//;* (x[i] - y[i]);
    }
    // sum = Math.sqrt(sum);
    return sum;
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
        let typeName; // = rect[i]['id'].substring(0, 3);
        if(compareViewType1.indexOf(rect[i]['id'].substring(0, 3)) === 14){
            let itemTemp_sm ={};
            itemTemp_sm['x'] = (rect[i]['x']['baseVal'].value - xMin + rect[i]['width']['baseVal'].value / 2) / width;
            itemTemp_sm['y'] = (rect[i]['y']['baseVal'].value - yMin + rect[i]['height']['baseVal'].value / 2) / height;
            itemTemp_sm['height'] = rect[i]['height']['baseVal'].value / height;
            itemTemp_sm['width'] = rect[i]['width']['baseVal'].value / width;

            let smNum = viewTypeTime[14].toString().length;
            let smName = d3.select('#'+rect[i]['id']+'R')[0][0]['className']['baseVal'];
            itemTemp['viewType'] = smName.substring(3+smNum,6+smNum);
            itemTemp_sm['viewType'] = smName.substring(3+smNum,6+smNum);
            typeName = itemTemp['viewType'];
            itemTemp['viewNum'] = smName.substring(6+smNum,smName.length);
            itemTemp_sm['sm_index'] = selectRectVector[14].length;
            itemTemp['sm_index'] = selectRectVector[14].length;
            selectRectVector[14].push(itemTemp_sm);

        }
        else 
            typeName = rect[i]['id'];

        selectRectVector[compareViewType1.indexOf(typeName.substring(0, 3))].push(itemTemp);
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
        // tr1.append('th').attr('rowspan','2').attr('class','detailImage')
        // .append('img').attr('width','100px').attr('src',dataImgPath+name.substring(0, name.length - 5) + '.jpg');
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
tmppp = true;
function GetArea(x, y, w, h, index, num){
    let p1_x = x - w/2.0;
    let p2_x = x + w/2.0;
    let p1_y = y - h/2.0;
    let p2_y = y + h/2.0;
    let view_vector = initArr(9);
    for(let i = 0 ; i< 3 ; i++){
        for(let j = 0; j<3; j++){
            let p3_x = i/3.0;
            let p3_y = j/3.0;
            let p4_x = (i+1)/3.0;
            let p4_y = (j+1)/3.0;
            if(p1_x > p4_x || p2_x < p3_x || p1_y > p4_y || p2_y < p3_y)
                continue;
            else{
                let cover_w = Math.min(p2_x,p4_x) - Math.max(p1_x,p3_x)
                let cover_h = Math.min(p2_y,p4_y) - Math.max(p1_y, p3_y)
                view_vector[i + j*3] = cover_w * cover_h*9/// (w*h);
            }
        }
    }

    if(num == 0){
        let tmp_vector = []
        tmp_vector.push(view_vector)
        ViewTypeVector[index] = tmp_vector;
    }
    else
        ViewTypeVector[index].push(view_vector)
        // for(let i = 0; i<9; i++)
        //     ViewTypeVector[index][i] += view_vector[i];
}
function GetAreaForUserInput(x, y, w, h){
    let p1_x = x - w/2.0;
    let p2_x = x + w/2.0;
    let p1_y = y - h/2.0;
    let p2_y = y + h/2.0;
    let view_vector = initArr(9);
    // console.log(view_vector)
    // console.log(p1_x+' '+p2_x)
    for(let i = 0 ; i< 3 ; i++){
        for(let j = 0; j<3; j++){
            let p3_x = i/3.0;
            let p3_y = j/3.0;
            let p4_x = (i+1)/3.0;
            let p4_y = (j+1)/3.0;
            if(p1_x > p4_x || p2_x < p3_x || p1_y > p4_y || p2_y < p3_y)
                continue;
            else{
                let cover_w = Math.min(p2_x,p4_x) - Math.max(p1_x,p3_x)
                let cover_h = Math.min(p2_y,p4_y) - Math.max(p1_y, p3_y)
                view_vector[i + j*3] = cover_w * cover_h*9/// (w*h);
            }
        }
    }
    return view_vector;

}
window.onscroll=function(){
    d3.select('.detailView').remove();
};


function layoutChange(cosView) {


    for (let i = 0; i < cosView.length; i++) {
        let smList = [];
        let sum = 0;
        //sm 存在


        if(selectRectData[14].length !== 0){

            let q = 14;
            for (let m = 0; m < selectRectData[q].length; m++) {
                let max = 100;
                let maxIndex = -2;
                let x = GetAreaForUserInput(selectRectData[q][m]['x'], selectRectData[q][m]['y'], selectRectData[q][m]['width'], selectRectData[q][m]['height']);

                for (let n = 0; n < cosView[i]['view'].length; n++) {
                    if(cosView[i]['view'][n].hasOwnProperty("sm")){

                        if (jsonViewType.indexOf(cosView[i]['view'][n]['type']) === compareViewType1.indexOf(selectRectData[q][m]['viewType'])) {
                            let y = GetAreaForUserInput(cosView[i]['view'][n]['x'], cosView[i]['view'][n]['y'], cosView[i]['view'][n]['width'], cosView[i]['view'][n]['height']);
                            if(cosView[i]['view'][n]['select']){
                                continue;
                            }
                            if (calSD(x, y) < max) {
                                max = calSD(x, y);
                                maxIndex = n;

                            }
                        }
                    }
                }
                if(max != 100){
                    smList.push(cosView[i]['view'][maxIndex]['hierarchy']);
                    cosView[i]['view'][maxIndex]['select']= true;
                    smUser_list.push(selectRectData[q][m]['sm_index']);

                }
            }
        }
        for (let j = 0; j < selectRectData.length-1; j++) {

            if (selectRectData[j].length != 0) {

                for (let m = 0; m < selectRectData[j].length; m++) {
                    let smUser_flag = -1;
                    if(selectRectData[j][m].hasOwnProperty("sm_index")){
                        smUser_flag = smUser_list.indexOf(selectRectData[j][m]['sm_index']);
                    }
                    if(smUser_flag !== -1){
                        continue;
                    }
                    let max = 100;
                    let maxIndex = -2;
                    let x = GetAreaForUserInput(selectRectData[j][m]['x'], selectRectData[j][m]['y'], selectRectData[j][m]['width'], selectRectData[j][m]['height']);

                    for (let n = 0; n < cosView[i]['view'].length; n++) {
                        let trueHier;
                        if (jsonViewType.indexOf(cosView[i]['view'][n]['type']) == j) {

                            let selectTileHie = cosView[i]['view'][n]['hierarchy'].indexOf('.');
                            if (selectTileHie !== -1) {
                                trueHier = cosView[i]['view'][n]['hierarchy'].slice(0, selectTileHie)
                            } else {
                                trueHier = cosView[i]['view'][n]['hierarchy'];
                            }
                            let y = GetAreaForUserInput(cosView[i]['view'][n]['x'], cosView[i]['view'][n]['y'], cosView[i]['view'][n]['width'], cosView[i]['view'][n]['height']);

                            if (cosView[i]['view'][n]['select'] || smList.indexOf(trueHier) !== -1 || cosView[i]['view'][n].hasOwnProperty("sm")) {

                                continue;
                            }

                            if (calSD(x, y) < max) {
                                max = calSD(x, y);
                                maxIndex = n;

                            }
                        }
                    }
                    if (max != 100) {
                        cosView[i]['view'][maxIndex]['select'] = true;
                    }
                }
            }
        }


    }

    return cosView;
}



