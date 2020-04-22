let attr_ids = ['view_num', 'tile','view_type'];
let filter_list = [[],[],[]];
let input_data = [];
let filtered_data = [];
let barAxis = [];
let MaxLength = 10;
let firstClick = 0;
function filter(attr_id, attr_value,selectFlag =0){
    firstClick = firstClick+1;
    let attr_index,filter_index;
    if(selectFlag === 0){
        attr_index = attr_ids.indexOf(attr_id);
        filter_index = filter_list[attr_index].indexOf(attr_value);

        if (filter_index == -1) {
            filter_list[attr_index].push(attr_value);
        } else {
            filter_list[attr_index].splice(filter_index, 1);
        }
    }

    if(firstClick === 1){
        d3.select('#type_all').style('color','#888888');
        d3.select('#num_all').style('color','#888888');
        d3.select('#layout_all').style('color','#888888');
    }
    if(attr_index === 1){
        d3.select('#type_all').style('color','#888888');
        d3.select('#type_none').style('color','#888888');
    }

    if(attr_index === 0){
        d3.select('#num_all').style('color','#888888');
        d3.select('#num_none').style('color','#888888');
    }
    if(attr_index === 2){
        d3.select('#layout_all').style('color','#888888');
        d3.select('#layout_none').style('color','#888888');
    }



    filtered_data = [];

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




    //交集
    for(let i = 0;i<attr_ids.length;i++){
        if(filtered_data1[i].length === 0) filtered_data1[i] = input_data;
    }


    let filtered_data2_1 = filtered_data1[0].filter(v => filtered_data1[1].includes(v));
    let filtered_data2_2 = filtered_data1[0].filter(v => filtered_data1[2].includes(v));
    filtered_data = filtered_data2_1.filter(v => filtered_data2_2.includes(v));

    group(filtered_data,filterBy);
    Tile_Num_logic();


}

function group(data1,attr_index1) {
        console.log('group');
        barAxis = groupSum(data1,attr_index1);

        console.log(barAxis);
        drawBar(attr_index1);



    // default_setting(default_set);
}

function groupSum(data1,attr_index1) {

    let barView = [];
    let barTile = [];
    let tileNum = [];
    let viewNum = [];
    let allTile1 = [];
    let barTile1 = [];
    let barView1 = [];
    let allBarView1= [];


    for (let i in data1) {
        let tiles = data1[i]['tile'];
        tileNum[tiles] == undefined ? tileNum[tiles] = 1 : tileNum[tiles] += 1;
    }


    for(let i = 0;i<tileRule.length;i++) {
        let dataTile = [];
        for (let j = 0; j < tileRule[i].length; j++) {
            let dataItem = {};
            if (tileNum[tileRule[i][j]] !== undefined) {
                dataItem['name'] = tileRule[i][j];
                dataItem['num'] = tileNum[tileRule[i][j]];
                dataTile.push(dataItem);
                allTile1.push(dataItem);
            }
        }
        dataTile.sort((a, b) => b.num - a.num);
        if (dataTile.length != 0) {
            barTile.push(dataTile);
        }
    }


    //只取前10个
    let allTile1Len;
    if(allTile1.length < filterByNum +2) {
        allTile1Len = allTile1.length;
    } else{
        allTile1Len = filterByNum +2;
    }


    allTile1.sort((a,b) => b.num - a.num);
    for(let i = 0;i<barTile.length;i++){
        let barTileItem = [];
        for(let j = 0;j<barTile[i].length;j++){
            let allTile1Flag = 0;
            for(let m = 0;m<allTile1Len;m++){
                if(barTile[i][j]['name'] === allTile1[m]['name']){
                    allTile1Flag = 1;
                    break;
                }
            }
            if(allTile1Flag === 1){
                barTileItem.push(barTile[i][j]);
            }
        }
        barTile1.push(barTileItem);
    }


    for(let i in data1) {

        let viewNums = data1[i]['view_num'];
        if(viewNums>10) viewNums = 11;
        viewNum[viewNums] == undefined ? viewNum[viewNums] = 1 : viewNum[viewNums] += 1;
    }




    for(let j = 0;j<sumViewNum1.length;j++){
        let barViewTest = [];
        if (viewNum[sumViewNum1[j]] !== undefined){
            let dataItem = {};

            dataItem['name'] = sumViewNum1[j];
            dataItem['num'] = viewNum[sumViewNum1[j]];
            barViewTest.push(dataItem);
            barView.push(barViewTest);
            allBarView1.push(dataItem);

        }
    }


    //
    let allView1Len;
    if(allBarView1.length < filterByNum +2) {
        allView1Len = allBarView1.length;
    } else{
        allView1Len = filterByNum +2;
    }
    //
    for(let i = 0;i<barView.length;i++) {
        let barTileItem = [];
        for (let j = 0; j < barView[i].length; j++) {
            let allTile1Flag = 0;
            for (let m = 0; m < allView1Len; m++) {
                if (barView[i][j]['name'] === allBarView1[m]['name']) {
                    allTile1Flag = 1;
                    break;
                }
            }
            if (allTile1Flag === 1) {
                barTileItem.push(barView[i][j]);
            }
        }
        if (barTileItem.length !== 0) {
            barView1.push(barTileItem);
        }

    }

    if(attr_index1 === 0) return barView1;
    if(attr_index1 === 1) return barTile1;



}

function numViewUpdate(viewButtonId) {

    if(viewButtonId == 'Select All'){
        filter_list[0] = [2, 3, 4, 5, 6, 7, 8, 9, 10,11];
        filter_list[1] = [];
        for(let i = 0;i<tileRule.length;i++){
            for(let j = 0;j<tileRule[i].length;j++){
                filter_list[1].push(tileRule[i][j]);
            }
        }

        Tile_Num_logic();
        filtered_data = input_data;


        group(input_data,filterBy);
        // default_setting(default_set);
    }else if(viewButtonId == 'Unselect All'){
        filter_list[0] = [];
        filter_list[1] = [];
        Tile_Num_logic();
        filtered_data = [];

        group([],0);
        // default_setting(default_set);
    }
    
}

// function tileUpdate(tileButtonId) {
//     if(tileButtonId == 'Top10'){
//         filtered_data=[];
//         let topTileData = [];
//         let topTile = ["1", "3", "4", "6", "11","13", "8", "5","16","2"];
//         for(let i = 0;i<input_data.length;i++){
//             if(topTile.indexOf(input_data[i]['tile']) !== -1){
//                 topTileData.push(input_data[i]);
//             }
//         }
//         filter_list[0] = [];
//         filter_list[1] = [1,2,3, 4,5, 6,8,11,13,16];
//         filtered_data = topTileData;
//         Tile_Num_logic();
//         group(filtered_data,1);
//         // default_setting(default_set);
//     }else if(tileButtonId == 'Unselect All'){
//         filter_list[0] = [];
//         filter_list[1] = [];
//         Tile_Num_logic();
//         filtered_data = [];
//         group([],0);
//         // default_setting(default_set);
//     }
//
// }
///展示效果
let maxTile = 213;
function Tile_Num_logic() {

        for (let i = 1; i <= maxTile; i++) {
            let flagI = 0;

            for(let j = 0;j<tileRule.length;j++){
                for (let m = 0;m<tileRule[j].length;m++){
                    if(tileRule[j][m] === i){
                        flagI = 1;
                    }
                }
            }

            if(flagI === 1) {
                let flag1 = 0;
                for (let index = 0; index < filter_list[1].length; index++) {
                    if (i == filter_list[1][index]) {
                        flag1 = 1;
                    }
                }
                if (flag1) {
                    $('#t' + i)[0]['src'] = 'data/tile_img/' + i + '_on.png';
                } else {
                    $('#t' + i)[0]['src'] = 'data/tile_img/' + i + '_off.png';
                }
            }
        }



    for (let i = 2; i<=11;i++){
        let flag0= 0;
        for (let index = 0; index < filter_list[0].length; index++) {
            if(i==filter_list[0][index]){ flag0=1;}
        }
        if(flag0) {
            $('#v'+i)
                .css('background', select_color_light)
                .css('color','#000000')
                // .css('color', '#ffffff');
                // .css('font-weight','bold');
        } else {
            $('#v'+i)
                .css('background','#f2f2f2')
                .css('color','#787878');
                // .css('font-weight','normal');
        }
    }

    for(let i = 0;i<viewType_all.length;i++){
        if (filter_list[2].indexOf(viewType_all[i]) !== -1){
            $('#ty'+i).css('background', select_color_light)
                .css('color','#000000')
                // .css('color','#ffffff')
            ;
        }else{
            $('#ty'+i).css('background','#f2f2f2').css('color','#787878');
        }
    }
}


