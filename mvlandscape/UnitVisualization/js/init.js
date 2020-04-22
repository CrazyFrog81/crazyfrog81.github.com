let metrics = ['Year','Venue'];

let options = ['Group by','Color by'];
let optionsX = [15,230];
let optionY = 34;

let filterBy = 0;
let colorBy = 0;
let filterByNum =8;
let rowNum_type = 4;
let rowNum = 5;

let selectIndex_i = [2,0,1];

let select_color = '#3E9CF2', select_color_light = '#a6cee3', unselect_color = '#888';
let select_ids = [['type_all', 'type_none'], ['num_all', 'num_none'], ['layout_all', 'layout_none']];


// 版本2
function getVal(select_i) {
    let selectOptions = $('#options').val();

    filtered_data = [];
    if (select_i === 0){
        filter_list[2] = ["Area", "Bar", "Circle", "Diag.", "Distri.", "Net.", "Grid", "Line", "Map", "Point", "Table", "Text",'SciVis','Panel'];
    }
    if (select_i === 1){
        filter_list[0] = [2, 3, 4, 5, 6, 7, 8, 9, 10,11];
    }
    if(select_i ===2){
        filter_list[1] = [1 , 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,21, 22, 33, 60,  62,  63,
            24,25,   27,  28,  29, 30,  31,  32,  34,  35,  37,  39, 40,  41,  42,  43,  44,  47,  64,  65,  66,  67,  68, 70,  72, 204, 207, 210,211, 212,
            49,50,  51,  52,  54,  55,  57,  58,  59, 74,  75,  77,  78,   80,  81, 203, 208,
            100,101, 103, 104,109, 110, 111, 113, 114, 115, 116, 118, 119, 120, 206, 213,
            121,122, 124, 125, 126, 127,
            128,129,
            130,132];
    }

    Tile_Num_logic();

    let filtered_data1 = [[],[],[]];
    for(let j = 0;j<attr_ids.length;j++){
        for (let index = 0; index < input_data.length; index++) {
            for (let i = 0; i < filter_list[j].length; i++) {
                if(j===2){
                    if (input_data[index][attr_ids[j]].indexOf(filter_list[j][i]) !== -1){
                        filtered_data1[j].push(input_data[index]);
                    }

                }else if(filter_list[j][i] === 11 && j === 0){
                    if(parseInt(input_data[index][attr_ids[j]])>10){
                        filtered_data1[j].push(input_data[index]);
                    }
                } else{

                    if (parseInt(input_data[index][attr_ids[j]]) === parseInt(filter_list[j][i])) {
                        filtered_data1[j].push(input_data[index]);
                    }
                }
            }
        }
    }
    for(let i = 0;i<attr_ids.length;i++){
        if(filtered_data1[i].length === 0) filtered_data1[i] = input_data;
    }

    let filtered_data2_1 = filtered_data1[0].filter(v => filtered_data1[1].includes(v));
    let filtered_data2_2 = filtered_data1[0].filter(v => filtered_data1[2].includes(v));
    filtered_data = filtered_data2_1.filter(v => filtered_data2_2.includes(v));
    // if(filtered_data.length!==0){
    //     selectData = input_data.filter(v => filtered_data.includes(v));
    // } else{
    //     selectData = input_data;
    // }


    group(filtered_data,filterBy);
}

function removeVal(select_i) {
    let selectOptions = $('#options').val();
    if (select_i === 0){filter_list[2] = [];}
    if (select_i===1){filter_list[0] = [];}
    if(select_i === 2){filter_list[1] = [];}
    Tile_Num_logic();
    filter("view_num","2",1);
}


function initDisplay(){
    $('body').css('background-color','#e6e6e6');

    // select all/none

    //metric button

    for(let i = 0;i<options.length;i++){
        d3.select('.svg')
            .append('text')
            .attr('class','option')
            .attr('x',optionsX[i])
            .attr('y',optionY)
            .text(options[i])
            .style('font-weight','bold')
            .style('font-size','16px');
    }

    let groupLeft = $('.option')[0].getBoundingClientRect()['left']+70;
    let groupTop =  $('.option')[0].getBoundingClientRect()['top'];
    d3.select('body').append('div').attr('class','groupSetting1').style('position','fixed')
        .style('left',groupLeft+'px').style('top',groupTop+'px').style('width','105px').style('z-index','10')
        .style('height','30px')
        .style('font-weight','bold');
    $('.groupSetting1').prepend('' +
        '                    <select id="filterBy">\n' +
        '                        <option value="0">Num. of Views</option>\n' +
        '                        <option value="1">Layout</option>\n' +
        '                    </select>');

    groupLeft = $('.option')[1].getBoundingClientRect()['left']+65;
    groupTop =  $('.option')[1].getBoundingClientRect()['top'];
    d3.select('body').append('div').attr('class','groupSetting2').style('position','fixed')
        .style('left',groupLeft+'px').style('top',groupTop+'px').style('width','105px').style('z-index','10')
        .style('height','30px')
        .style('font-weight','bold');
    $('.groupSetting2').prepend('' +
        '                    <select id="colorBy">\n' +
        '                        <option value="0">Year</option>\n' +
        '                        <option value="1">Venue</option>\n' +
        '                    </select>');


    //功能
    $("#filterBy").change(function(){
        filterBy=parseInt($("#filterBy").val());
        group(filtered_data,filterBy);
    });

    $("#colorBy").change(function(){

        colorBy=parseInt($("#colorBy").val());
        metricButton(metrics[colorBy]);
    });

    // let numViewB = d3.select('.numViewB');
    //  for (let i = 0;i < numViewButtons.length;i++){
    //      numViewB.append('div')
    //          .attr('class','numViewButton')
    //          .text(numViewButtons[i])
    //          .on('click', function () {
    //              numViewUpdate(numViewButtons[i]);
    //          });
    //  }


    // viewType

    let viewTypes = d3.select('.viewType-body').append('table').attr('cellpadding','1');
    // 创建type
    let row_type = viewTypes.append('tr');
    for(let i = 0;i<viewType_all.length;i++){
        if(i%rowNum_type === 0 && i !== 0){
            row_type = viewTypes.append('tr');
        }
            row_type.append('td').attr('class','viewButton')
                .attr('id',function (d) {
                    return 'ty'+i;
                }).on('click',function (d) {
                filter('view_type', viewType_all[i]);
            }).text(function (d) {
                return viewType_all[i];
            }).attr('style', 'font-size:17px; background:'+select_color_light);
    }


    // numView
    let numViews = d3.select('.numView-body').append('table').attr('class','numBox');

    //创建数字
    let row = numViews.append('tr');
    for(let i = 0;i<sumViewNum.length;i++){
        if(i%rowNum === 0 && i !== 0){
            row = numViews.append('tr');
        }
        row.append('td').attr('class','viewButton')
            .attr('id',function (d) {
                return 'v'+sumViewNum2[i];
            }).on('click',function (d) {
                filter('view_num', sumViewNum2[i]);
            }).text(function (d) {
            return sumViewNum[i];
        }).attr('style', 'font-size:17px; background:'+select_color_light);
    }

    //tile view
    d3.select('.tile-body').selectAll('div').remove();

    for(let i = 0;i<tileRule.length;i++){
        let tileView = d3.select('.tile-body')
            .append('div')
            .attr('class','tileButton');
        for(let j = 0; j<tileRule[i].length; j++){
            let tileBox = tileView.append('div')
                .attr('class','tileBox');

            tileBox.append('span').text(function () {
                return (i+2) +alphabet[j];
            }).style('margin-right', '2px');

            tileBox.append('img').attr('class','tile-img')
                .attr('src',function (d) {
                        return 'data/tile_img/' + tileRule[i][j] + '_on.png'
                    })
                    .attr('id',function () {
                        return 't'+tileRule[i][j];
                    }).on('click',function () {
                        filter('tile',tileRule[i][j]);
                    });
        }
    }

    for(let i = 0; i < select_ids.length ; i++){
        d3.select('#'+select_ids[i][0]).style('color', select_color);
        d3.select('#'+select_ids[i][1]).style('color', unselect_color);
    }

    for(let i = 0; i < select_ids.length ; i++){
        for(let j = 0; j < select_ids[i].length;j++){
            let select_string = select_ids[i][j];
            let select_string1 = select_ids[i][select_ids[i].length - 1 - j];
            d3.select('#'+select_string)
                .on('click',function () {
                    if(j===0){
                        getVal(i);
                    }
                    if(j===1){removeVal(i);}
                    d3.select('#'+select_string).style('color', select_color);
                    d3.select('#'+select_string1).style('color', unselect_color);
                })
        }
    }
};

