// pip install eel  
// data.json--整理后生成的viewtype(类型，bbox), inputData
// data.csv -- 整理后生成的doi,year,etc
let inputData, detailData, recommendViewTypeData;
let jsonDataCsvPath = 'data/json/data.csv';
let jsonDataJsonPath = 'data/json/data.json';
let recommendCsvPath = 'data/viewTypeRecommend/conditionalPossibility.csv';
let rectPosition = new Map();
let lasso_selected = true;
let first_choosed_rect;
let choosed_rect_set = new Set();
let first_flag = false;
let cutRec_flag = 0;
let mode = ['full','partial','basic'];
let filterViews = "1";

let viewTypeFont = 17, viewTypeIcon = 30;


//在display view 出现的次数，方便命名
let viewTypeTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

//功能1：创建viewType menu 功能2：创建display view

//viewType viewTypeColor compareViewType1 对应的
//功能1：创建viewType menu 关键字
//viewType以及对应的颜色
let viewType = ["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree and Network", "Grid Matrix", "Line", "Map", "Point", "Table", "Text Based",'SciVis','Panel'];
let viewType22 = ["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree and Network", "Grid Matrix", "Line", "Map", "Point", "Table", "Text Based",'SciVis','Panel','sam'];
let viewTypeColor = ['#acd98d', '#82853a', '#ffb877', '#b85a0d', '#ffd949', '#fa9fb5', '#3bb7cc', '#31a151', '#ff7e0e', '#85b4a9', '#97d9e3', '#cd6577','#faf2ba','#3690c0'];
//由于ID,class命名不允许出现空格，所以重新定义生成新的数组
let compareViewType1 = ["Are", "Bar", "Cir", "Dia", "Dis", "Tre", "Gri", "Lin", "Map", "Poi", "Tab", "Tex","Sci",'Pan','sam'];

//未知
let deleteList = [];
//功能2：创建display view
//创建三个按钮
let iconImgPath = 'data/icon/';
//0310
let iconImg1Path = 'data/icon1/bar.png';
let iconBox = ['1', '2', 'cancel','sm','rect','left','right','top','bottom','full','start'];
let TooltipText = ['delete','clear','cancel','sm','chosed','left','right','top','bottom','full','start']
// let iconBox = ['1', '2', 'cancel','sm','lasso','left','right','top','bottom'];
let alignBox = [];
//为了方便路径
//完整的所有操作的路径
let recordPath = [''];
//一次性路径
let svgNodes;

var s = new Set();

            //添加一个key
            s.delete(5);
            //重复元素在Set中自动被过滤
            s.add(5);
            // console.log(s);//Set {1, 2, 3, 4,5}
            //删除一个key
            // s.delete(2);
            // console.log(s.get(0));//Set{1, 3, "3", 4, 5}//注意数字3和字符串'3'是不同的元素
// for(var x of s)
    // console.log(x)

//导入数据
$.getJSON(jsonDataJsonPath, function (data) {
    inputData = data;
    databaseMatrix();
    // console.log(databasematrix);
});
d3.csv(jsonDataCsvPath, function (data) {
    detailData = data;
});
d3.csv(recommendCsvPath,function (data) {
    recommendViewTypeData = data;
});
var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .text('a simple tooltip')

//创建viewType menu
d3.select('.menu').append('div').attr('class', 'menuButton')
    .append('table').attr('class', 'tableButton')
// .attr('border','1px solid black')
    .attr('width', '95%')
    .attr('height', '95%')
    .attr('align', 'center')
    .attr("cellspacing",0);

let viewTypeMenu = d3.select('.tableButton')
    .selectAll('tr')
    .data(viewType)
    .enter()
    .append('tr')
    .attr('class', 'viewType');
    // .attr("cellspacing",0);
    // .style("background-color",'black');


viewTypeMenu.append('td')
    .text(function (d, i) {
        return d;
    }).style('font-size', viewTypeFont+'px')
    .style('color', '#525252')
    .style('font-weight', 'bold')
    .attr('class', 'vTmText')
    .attr('id', function (d, i) {
        return 'viewMame' + i;
    });

viewTypeMenu.append('td')
    .attr('class','viewImg')
    .append('img')
    .attr('class', 'vTm')
        .attr('id', function (d, i) {
            return 'viewName' + i;
        })
    .attr('width',viewTypeIcon+'px')
    .attr('height',viewTypeIcon+'px')
        //0310
    // .style('border',function (d,i) {
    //     return '1px solid' + viewTypeColor[i];
    // })
    .style('background-color',function (d,i) {
        return viewTypeColor[i];
    })
    .attr('src', function(d,i){
        //0310
        return iconImgPath +viewType[i] + '.png'
        // return iconImg1Path;
    });


// viewTypeMenu.append('td')
//     .attr('class', 'circle_class')
//     .append('div')
//     .attr('class', 'vTm')
//     .attr('id', function (d, i) {
//         return 'viewName' + i;
//     })
//     .style('background-color', function (d, i) {
//         return viewTypeColor[i];
//     })
//     .style('margin-left','25px');

//创建display view
d3.select('.display').append('div').attr('class', 'svg_button');
d3.select('.display')
.append('div').attr('class', 'svg_outer')
.append('svg').attr('class','svg').attr('id','svg');



//创建三个按钮
// function tooltipAppear(tooltipText)
// {
//     tooltip.style('visibility', 'visible');
//     tooltip.transition().duration(200)
//           .style('opacity', 0.9);
//     tooltip.html(tooltipText)
//           .style('left', (d3.event.pageX) -10 + 'px')
//           .style('top', (d3.event.pageY) - 10 + 'px');
// }

d3.select('.svg_button').append('g').attr('class','Tools_group')
    .selectAll('div')
    .data(iconBox)
    .enter()
    .append('div')
    .attr('class', 'iconBox')
    .append('img')
    .attr('class', 'iconImg')
    .attr('src', function (d, i) {
        if(i==9) return iconImgPath + iconBox[i] + '.png';
        if(i==10) return iconImgPath + iconBox[i] + '_on.png';
        if(i>4)  return iconImgPath + iconBox[i] + '_off.png';

        return iconImgPath + iconBox[i] + '_off.png';
    })
    .attr('id', function (d, i) {
        return 'imgButton' + i;
    })
    .on('click', function (d, i) {
        //对应的index 对应的功能
        iconBoxFunction(i);
    });
// $('.iconBox:nth-of-type(3)').append('div').attr('class','text');
$('.Tools_group').prepend('<div class="iconBox" style="margin-right:15px">Tools:</div>');
$('.Tools_group div:eq(5)').after('<div class="iconBox" style="margin-right:14px;margin-left:20px">Align:</div>');
$('.Tools_group div:eq(10)').after('<div class="iconBox" style="margin-right:15px;margin-left:40px; width:30px;">Mode:</div>');
// $('.Tools_group div:eq(12)').css('margin-left','5px')
$('.Tools_group div:eq(5) .iconImg').css('margin-left','20px').css('margin-right','20px')
$('.Tools_group div:eq(12) .iconImg').css('width','30px').css('height','30px').css('margin-top','-4px')
$('.Tools_group div:eq(13)').css('margin-left','20px');
// $('.Tools_group div:eq(10)').after('<div class="iconBox" style="margin-right:0px;margin-left:0px"></div>');

//创建收起
d3.select('.displayQueryResult').append('div').append('img').attr("class",'displayOrNot').attr('id','release')
.attr('src',iconImgPath+'retract.png').attr('width',"18px").attr("height","18px").style('padding-top','5px').style('margin-left','0px');

$('.iconBox')[4]['style'].display = 'none';
$('.iconBox')[5]['style'].display = 'none';
//按钮的效果
for (let i = 0; i < iconBox.length-2; i++) {
    $('#imgButton' + i).hover(function () {
            tooltip.style('visibility', 'visible');
            tooltip.transition()
                    .duration(200).style('opacity', 1); //.transition().duration(200)
                 
            tooltip.html(TooltipText[i])
                  .style('left', (event.x) - 10 + 'px')
                  .style('top', (event.y) + 20 + 'px');
        // if(i>4 && i<9 &&( lasso_selected==false && shift_chosed_list.size<2))
        // {
        //     // console.log('hover'+shift_chosed_list.length)
        //     $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_no.png');
        //     return;
        // }

        $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_on.png');
    }, function () {
        tooltip.transition().duration(500).style('opacity', 0.0);
        // console.log(shift_chosed_list.size)
        // if(i>4 && i<9 && (lasso_selected==false && shift_chosed_list.size<2))
        // {
        //     // console.log('Nohover'+shift_chosed_list.length)
        //     $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_no.png');
        //     return;
        // }
        // if(shift_chosed_list.length > 2)
        // {
        //     $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_off.png');  
        // }
        // if(i==4 && lasso_selected) return;
        $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_off.png');    
    })
}





//创建recommendView
d3.select('.recommendBox').append('div').attr('class', 'recommend');
$('.recommend').scroll(function () {
    scrollDel();
});

// 滑动时消除detail view
function scrollDel() {
    d3.select('.detailView').remove();
}

//display view 按钮功能
function iconBoxFunction(i) {
    if (i === 0) return deleteRect();
    if (i === 1) return restart();
    if (i === 2) return recover();
    if (i === 3) return ;
    if (i === 4) return ;//choose();
    if((lasso_rect_set.size>1  || shift_chosed_list.size>1)&&i>4 && i<9)
    {
        return align_lasso(iconBox[i]);
    }
    if (i === 9) return  cutRec();
    if (i == 10) return record(i);
}
// $('#imgButton4').click(function(){
//     if(lasso_selected){ 
//         lasso_selected = false;
//         first_flag = false;
//         $('#imgButton4').attr('src',iconImgPath + iconBox[4] + '_off.png');
//         changeRectStyle();
//         // rectPosition.forEach((value,key,self) => {
//         //     value.choose = false;
//         // })
//         $('.lasso_box').remove();
//         // d3.selectAll('rect').style('stroke', 'none');
//         for (let i = 5; i < 9; i++) {
//              $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_no.png');
//         }
//         if(choosed_rect_set.size!= 0){
//             for(var x of choosed_rect_set){
//                 // $('#'+x+'R').css('stroke','none');
//                 if(x.substring(0,3)=='sam')
//                   $('#'+x+'R').css('stroke','black').css('stroke-width','1px').css('stroke-dasharray','0');
//                 choosed_rect_set.delete(x)
//             }
//         }
//     }
//     else {
//         lasso_selected = true;
//         $('#imgButton4').attr('src',iconImgPath + iconBox[4] + '_on.png');
//         // console.log($('#imgButton4').attr('src'))
//         for (let i = 5; i < iconBox.length-2; i++) {
//              $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + '_off.png');
//         }
//     }
// });
var rectMenu = $('.currentRect');
for(var i = 0;i < rectMenu.length; i++){   
    //绑定方法每个菜单的点击
    $(rectMenu[i]).bind("click",{'bindText':i},function ChangContent(e){
        var num = e.data.bindText;
        alert(num+"你的事件");
    });
}
// function choose(){
//
// }


function deleteRect() {

    recordPathUpdate();
    if(shift_chosed_list.size>1)
    {
        shift_chosed_list.forEach((value,key,self) => {
            let index = compareViewType1.indexOf(key.substring(0, 3));
            d3.select('.warn').remove();
            // d3.selectAll('circle').remove();
            d3.select('#' + key).remove();
            d3.select('#'+key+'R').remove();
            d3.select('#' +key+'G').remove();
            d3.selectAll('.recommendView').remove();
            d3.selectAll('#RecLink').remove();
            rectPosition.delete(key);

            viewTypeTime[index] -= 1;
        });
        shift_chosed_list.clear();
        deleteList = [];
    }else{
        let index = compareViewType1.indexOf(deleteList[0].substring(0, 3));
        d3.select('.warn').remove();
        // d3.selectAll('circle').remove();
        d3.select('#' + deleteList[0]).remove();
        d3.select('#'+deleteList[0]+'R').remove();
        d3.select('#' +deleteList[0]+'G').remove();
        d3.selectAll('.recommendView').remove();
        d3.selectAll('#RecLink').remove();
        rectPosition.delete(deleteList[0]);

        viewTypeTime[index] -= 1;
        deleteList = [];
    }

    d3.select('.warn').remove();

    initPosition = [];
    for(let m = 0;m<d3.selectAll('rect')[0].length;m++){
        let p = [];
        p.push(d3.selectAll('rect')[0][m]['id']);
        p.push(d3.selectAll('rect')[0][m]['x']['baseVal'].value);
        p.push(d3.selectAll('rect')[0][m]['y']['baseVal'].value);
        p.push(d3.selectAll('rect')[0][m]['width']['baseVal'].value);
        p.push(d3.selectAll('rect')[0][m]['height']['baseVal'].value);
        initPosition.push(p);
    }
    // query();
    let flag = 0;
    for(let i =0;i<viewTypeTime.length;i++){
        if(viewTypeTime[i] !== 0){
            flag=1;
        }
    }
    if(flag === 1){
        d3.select('.recommendContent').remove();
        resetfilterByViews();
        query();
    }
    // if (flag === 1 && cutRec_flag){
    //     d3.select('.recommendContent').remove();
    //     resetfilterByViews();
    //     query();
    // }
    // if(cutRec_flag === false){
    //     cutRecProject();
    // }
    if(flag ===0 ){

        d3.select('.recommendContent').remove();
        defaultQuery();
    }

    // if(cutRec_flag===false){
    //     cutRecProject();
    //     queryTemplate();
    // }
    d3.selectAll('circle').remove();
    
}

function restart() {
    recordPathUpdate();
    d3.selectAll('.recommendView').remove();
    d3.selectAll('.tileRect').remove();
    d3.selectAll('line').remove();
    d3.selectAll('.currentG').remove();
    d3.select('table');
    d3.selectAll('circle').remove();
    d3.select('.warn').remove();
    d3.selectAll('.recommendBox').remove();
    flagApplyQuery = true;
    viewTypeTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
    defaultQuery();
    rectPosition.clear();
    resetfilterByViews();
}

function recordPathUpdate() {

    svgNodes = [];
    let item;

    for(let i = 0;i<$('.svg')[0].childNodes.length;i++){
        item = {};
        if($('.svg')[0].childNodes[i].tagName == 'g'){
            // console.log($('.svg')[0].childNodes[i]);
            item['id'] = $('.svg')[0].childNodes[i]['id'];
            item['tagName'] = $('.svg')[0].childNodes[i].tagName;
            item['className'] = $('.svg')[0].childNodes[i]['className']['baseVal'];
            item['childNode'] = [];


            for (let j = 0;j< $("#" + item['id']).children().length;j++){
                let item1 = {};
                let nodes = $('.svg')[0].childNodes[i].childNodes;


                if(nodes[j].tagName == 'rect'){

                    item1['id'] = nodes[j]['id'];
                    item1['tagName'] = nodes[j].tagName;
                    item1['width'] = nodes[j]['width']['baseVal'].value;
                    item1['height'] = nodes[j]['height']['baseVal'].value;
                    item1['className'] = nodes[j]['className']['baseVal'];
                    item1['x'] = nodes[j]['x']['baseVal'].value;
                    item1['y'] = nodes[j]['y']['baseVal'].value;
                    item1['fill'] = nodes[j]['style']['fill'];
                    item1['stroke'] = nodes[j]['style']['stroke'];
                    item1['stroke-dasharray'] = nodes[j]['style']['stroke-dasharray'];
                    item1['stroke-width'] = nodes[j]['style']['stroke-width'];


                }
                if(nodes[j].tagName == 'image'){
                    item1['id'] = nodes[j]['id'];
                    item1['tagName'] = nodes[j].tagName;
                    item1['className'] = nodes[j]['className']['baseVal'];
                    item1['width'] = nodes[j]['width']['baseVal'].value;
                    item1['height'] = nodes[j]['height']['baseVal'].value;
                    item1['x'] = nodes[j]['x']['baseVal'].value;
                    item1['y'] = nodes[j]['y']['baseVal'].value;
                    item1['href'] = nodes[j]['href']['baseVal'];
                }
                if(nodes[j].tagName == 'line'){
                    item1['id'] = nodes[j]['id'];
                    item1['class'] = nodes[j]['className']['baseVal'];
                    item1['tagName'] = nodes[j].tagName;
                    item1['x1'] = nodes[j]['x1']['baseVal'].value;
                    item1['x2'] = nodes[j]['x2']['baseVal'].value;
                    item1['y1'] = nodes[j]['y1']['baseVal'].value;
                    item1['y2'] = nodes[j]['y2']['baseVal'].value;
                }


                item['childNode'].push(item1);
            }

            // if(item['id'].substring(0,3) == 'sam'){
            //     for(let j = 2; j <  $("#" + item['id']).children().length; j++)
            //     {

            //     }
            // }

        }

        if($('.svg')[0].childNodes[i].tagName == 'line'){
            item['id'] = $('.svg')[0].childNodes[i]['id'];
            if ($('.svg')[0].childNodes[i]['id'] === 'lineHint'){
                continue;
            } else {
                item['tagName'] = $('.svg')[0].childNodes[i].tagName;
                item['x1'] = $('.svg')[0].childNodes[i]['x1']['baseVal'].value;
                item['x2'] = $('.svg')[0].childNodes[i]['x2']['baseVal'].value;
                item['y1'] = $('.svg')[0].childNodes[i]['y1']['baseVal'].value;
                item['y2'] = $('.svg')[0].childNodes[i]['y2']['baseVal'].value;
                item['strokeDasharray'] = $('.svg')[0].childNodes[i]['style']['strokeDasharray'];
            }

        }

        if($('.svg')[0].childNodes[i]['className']['baseVal'] === 'tileRect'){
            item['tagName'] = $('.svg')[0].childNodes[i].tagName;
            item['width'] = $('.svg')[0].childNodes[i]['width']['baseVal'].value;
            item['height'] = $('.svg')[0].childNodes[i]['height']['baseVal'].value;

            item['x'] = $('.svg')[0].childNodes[i]['x']['baseVal'].value;
            item['y'] = $('.svg')[0].childNodes[i]['y']['baseVal'].value;
            item['fill'] = $('.svg')[0].childNodes[i]['style']['fill'];
        }
        if(JSON.stringify(item) !== "{}"){
            svgNodes.push(item);
        }

    }

    recordPath.push(svgNodes);

}

function recover() {

    //RPL-2--第一个初始为空，倒数第一个是现在的动作，倒数第二个才是返回的动作

    rectPosition.clear();
    d3.selectAll('.recommendView').remove();
    d3.selectAll('.tileRect').remove();
    d3.selectAll('.currentG').remove();
    d3.selectAll('line').remove();
    d3.select('table');
    d3.selectAll('circle').remove();
    d3.select('.warn').remove();
    let RPL = recordPath.length;
    for(let i = 0;i<viewTypeTime.length;i++){
        viewTypeTime[i] = 0;
    }
    if(recordPath[RPL-2] == ''){
        recordPath.pop();
    } else{
        for(let i = 0;i<recordPath[RPL-2].length;i++){
            if(recordPath[RPL-2][i].tagName == 'g'){

                viewTypeTime[compareViewType1.indexOf(recordPath[RPL-2][i]['id'].substring(0, 3))] += 1;
                let g = d3.select('.svg')
                    .append('g')
                    .attr('class', recordPath[RPL-2][i]['className'])
                    .attr('id', recordPath[RPL-2][i]['id']);

                for(let p = 0;p<2;p++){
                    if(recordPath[RPL-2][i]['childNode'][p].tagName == 'rect'){
                        let newRect = g.append('rect')
                                        .attr('width', recordPath[RPL-2][i]['childNode'][p].width)
                                        .attr('height', recordPath[RPL-2][i]['childNode'][p].height)
                                        .attr('x', recordPath[RPL-2][i]['childNode'][p].x)
                                        .attr('y', recordPath[RPL-2][i]['childNode'][p].y)
                                        .attr('class',recordPath[RPL-2][i]['childNode'][p].className)
                                        // .style('fill', '#ffffff')
                                        .style('fill',recordPath[RPL-2][i]['childNode'][p].fill)
                                        .style('stroke',recordPath[RPL-2][i]['childNode'][p].stroke)
                                        .style('stroke-dasharray',recordPath[RPL-2][i]['childNode'][p]['stroke-dasharray'])
                                        .style('stroke-width',recordPath[RPL-2][i]['childNode'][p]['stroke-width'])
                                        .attr('id', recordPath[RPL-2][i]['childNode'][p].id);
                        if((recordPath[RPL-2][i]['childNode'][p].id).substring(0,3)=='sam')
                            newRect.style('stroke', 'black').style('stroke-width', '1px');

                    }
                }
                for(let p = 0;p<2;p++){
                    if(recordPath[RPL-2][i]['childNode'][p].tagName == 'image'){
                        g.append('image')
                            // .attr("preserveAspectRatio","none")
                            .attr('xlink:href', recordPath[RPL-2][i]['childNode'][p].href)
                            .attr('width', recordPath[RPL-2][i]['childNode'][p].width)
                            .attr('height', recordPath[RPL-2][i]['childNode'][p].height)
                            .attr('x', recordPath[RPL-2][i]['childNode'][p].x)
                            .attr('y', recordPath[RPL-2][i]['childNode'][p].y)
                            .attr('id', recordPath[RPL-2][i]['childNode'][p].id)
                            .attr('class',recordPath[RPL-2][i]['childNode'][p].className);
                        updateRectPosition(recordPath[RPL-2][i]['childNode'][p].id);
                    }
                }
                for(let p =0; p< recordPath[RPL-2][i]['childNode'].length; p++){
                    if(recordPath[RPL-2][i]['childNode'][p].tagName == 'line'){
                            g.append('line')
                                .attr('id','sm_line')
                                .attr('class',recordPath[RPL-2][i]['childNode'][p].class)
                                .attr('x1',recordPath[RPL-2][i]['childNode'][p]['x1'])
                                .attr('y1',recordPath[RPL-2][i]['childNode'][p]['y1'])
                                .attr('x2',recordPath[RPL-2][i]['childNode'][p]['x2'])
                                .attr('y2',recordPath[RPL-2][i]['childNode'][p]['y2'])
                                .style('stroke','black')
                                .style('stroke-width','1px')
                                .style('stroke-dasharray','3,3');
                    }
                }

            }
            if(recordPath[RPL-2][i].tagName == 'rect'){
                d3.select('.svg')
                    .append('rect')
                    .attr('class','tileRect')
                    .attr('x',recordPath[RPL-2][i]['x'])
                    .attr('y',recordPath[RPL-2][i]['y'])
                    .attr('width',recordPath[RPL-2][i]['width'])
                    .attr('height',recordPath[RPL-2][i]['height'])
                    .style('fill',recordPath[RPL-2][i]['fill'])
                    .style('fill-opacity','0.3');
            }

            if(recordPath[RPL-2][i].tagName == 'line'){
                if(recordPath[RPL-2][i]['id'] ==='RecLink'){
                    d3.select('.svg')
                        .append('line')
                        .attr('id',recordPath[RPL-2][i]['id'])
                        .attr('x1',recordPath[RPL-2][i]['x1'])
                        .attr('y1',recordPath[RPL-2][i]['y1'])
                        .attr('x2',recordPath[RPL-2][i]['x2'])
                        .attr('y2',recordPath[RPL-2][i]['y2'])
                        .style('stroke','black')
                        .style('stroke-dasharray',"3,3")
                        .style('stroke-width','2px');
                } else{
                    d3.select('.svg')
                        .append('line')
                        .attr('id',recordPath[RPL-2][i]['id'])
                        .attr('x1',recordPath[RPL-2][i]['x1'])
                        .attr('y1',recordPath[RPL-2][i]['y1'])
                        .attr('x2',recordPath[RPL-2][i]['x2'])
                        .attr('y2',recordPath[RPL-2][i]['y2'])
                        .style('stroke','black')
                        .style('stroke-dasharray',recordPath[RPL-2][i]['strokeDasharray'])
                        .style('stroke-width','1px');
                }

            }
        }
        recordPath.splice(recordPath.length-1,1);
    }
    resetfilterByViews();
    query();
    // if(cutRec_flag){
    //     resetfilterByViews();
    //     query();
    // }
    // if(cutRec_flag === false){
    //     cutRecProject();
    // }
    // query();
    // query();

    if(recordPath.length == 1){

        defaultQuery();
    }


}

function newRectShape(name,_left,design_screen_height,allRectHeight,numofRect){
    var width  = $("#"+key).width();
    var height = $("#"+key).height();
    var left = _left
    var right = left + width
    var top = design_screen_height/2.0 - allRectHeight/(numofRect*2.0)
    var bottom = top + height
    aRectShape = new RectShape(left,top,right,bottom)
}

$("#filterByViews").change(function(){
    filterViews=$("#filterByViews").val();
    d3.select('.recommendContent').remove();
    d3.select('.warn').remove();
    filterByviewsfunction();

    queryTemplate();

});

function filterByviewsfunction() {
    rankList = [];


    // if(AllRankList)
    if(AllRankList.length === 360){
        if (filterViews === '1'){
            for(let i = 0;i<AllRankList.length;i++){
                rankList.push(AllRankList[i]);
            }
        } else if(filterViews === '11'){
            for(let i = 0;i<AllRankList.length;i++){
                if(parseInt(AllRankList[i]['viewNum']) > 10){

                    rankList.push(AllRankList[i]);

                }
            }
        } else {
            for (let i = 0; i < AllRankList.length; i++) {
                if (parseInt(AllRankList[i]['viewNum']) === parseInt(filterViews)) {

                    rankList.push(AllRankList[i]);

                }
            }

        }
    }
    else {
        if (filterViews === '1') {
            for (let i = 0; i < AllRankList.length; i++) {
                rankList.push(AllRankList[i]);
            }
        } else if (filterViews === '11') {
            for (let i = 0; i < AllRankList.length; i++) {
                if (parseInt(AllRankList[i]['viewNum']) > 10) {

                    rankList.push(AllRankList[i]);

                }
            }
        } else {
            for (let i = 0; i < AllRankList.length; i++) {
                if (parseInt(AllRankList[i]['viewNum']) === parseInt(filterViews)) {

                    rankList.push(AllRankList[i]);

                }
            }
        }
    }



}


function resetfilterByViews() {
    filterViews = "1";
    document.getElementById('filterByViews').options.selectedIndex = 0;
}

function databaseMatrix(){
    for (let i = 0; i < inputData.length; i++) {
        let viewTypeNum = initArr(14);
        for (let j = 0; j < inputData[i]['data'].length; j++) {
            let viewItem = {};
            // viewItem.hierarchy = inputData[i]['data'][j]['hierarchy'];
            // viewItem.type = inputData[i]['data'][j]['viewType'];
            viewItem.x = inputData[i]['data'][j]['x'];
            viewItem.y = inputData[i]['data'][j]['y'];
            viewItem.width = inputData[i]['data'][j]['width'];
            viewItem.height = inputData[i]['data'][j]['height'];

            if(inputData[i]['data'][j].hasOwnProperty("sm")){
                continue;
            }
            else{
                let index = jsonViewType.indexOf(inputData[i]['data'][j]['viewType']);
                GetArea(viewItem.x, viewItem.y,viewItem.width, viewItem.height,index,viewTypeNum[index])
                viewTypeNum[index] += 1;
            }

        }

        databasematrix[i] = ViewTypeVector;

        ViewTypeVector = [];
    }
     for (let i = 0; i < 360; i++) 
     {
        MI_view = [];
        for (let j = 0; j < 14; j++){
            let tmp = databasematrix[i][j];
            // console.log(databasematrix[i])
            if(tmp === undefined) continue;
            let tmp_sections = initArr(9);
            for(let k =0 ; k< tmp.length ; k++){
                for(let s= 0; s<9;s++)
                    tmp_sections[s] += databasematrix[i][j][k][s];
            }
            MI_view[j] = tmp_sections;
        }
        MI_view_T = [];
        for(let cnt = 0; cnt <9 ; cnt ++)
        {
            let tmp = initArr(14);
            MI_view_T[cnt] = tmp;
        }
        for(let row = 0; row<14; row++){
            if(MI_view[row] === undefined) 
                continue;
            for(let col = 0; col<9; col++){

                MI_view_T[col][row] = MI_view[row][col];
            }
        }
        MI_database[i] = MI_view_T;
     }
     // console.log('MI_database')
     // console.log(MI_database)
}

function cutRec() {
    if(cutRec_flag !== 2 ) cutRec_flag +=1;
    else{
        cutRec_flag =0;
    }
    $("#imgButton9").attr('src',iconImgPath + mode[cutRec_flag] + '.png');
    if(cutRec_flag === 0){

        for(let i = 6;i<11;i++){
            $('.iconBox')[i]['style'].display = '';
        }
        $('.displayQueryResult')[0]['style'].display = '';
        $('.queryResult')[0]['style'].display = '';
    }
    if(cutRec_flag === 1){

        $('.displayQueryResult')[0]['style'].display = 'none';
        $('.queryResult')[0]['style'].display = 'none';
    }
    if(cutRec_flag === 2){
        // console.log($('.iconBox'));
        for(let i = 6;i<11;i++){
            $('.iconBox')[i]['style'].display = 'none';
        }
    }
    restart();
    // cutRec_flag = cutRec_flag?false:true;
    // if(cutRec_flag){
    //     // alert("Switch to recommendation mode");
    //     $("#imgButton9").attr('src',iconImgPath + iconBox[9] + '_on.png');
    //     d3.selectAll('.recommendView').remove();
    //     d3.selectAll('.tileRect').remove();
    //     d3.selectAll('line').remove();
    //     d3.selectAll('.recommendBox').remove();
    //     resetfilterByViews();
    //     if(typeof initPosition !== 'undefined'){
    //         cancel(1,1);
    //         query();
    //     } else{
    //         defaultQuery();
    //     }
    //
    //
    // } else{
    //     // alert("Switch to no recommendation mode");
    //     $("#imgButton9").attr('src',iconImgPath + iconBox[9] + '_off.png');
    //
    //     d3.selectAll('.recommendView').remove();
    //     d3.selectAll('.tileRect').remove();
    //     d3.selectAll('line').remove();
    //     d3.selectAll('.recommendBox').remove();
    //     defaultQuery();
    //     resetfilterByViews();
    //     if(typeof initPosition !== 'undefined'){
    //         cancel(1,1);
    //     }
    //     cutRecProject();
    // }
}

function cutRecProject() {
    rankList = [];
    AllRankList = [];
    let imgRect = d3.selectAll('.currentRect');
    selectRectData = selectRectBbox(imgRect[0]);

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
        AllRankList = layoutChange(AllRankList);
        filterByviewsfunction();
    });


}
