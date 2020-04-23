
let testViewTypeTime = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0];
let initPosition;
let flagApply = true;
let flagApplyQuery = true;
let applyList;
let dataJsonPath = 'data/imgJson/json/';
let adjustViews;
let storeViews;
//那些是虚框，那些实线线框
let selectTileHierarchy;
let applyRecd;
let applyLineRecd;
let usageApply = -1;
let usageApplyid;

function apply(d,i) {
    // console.log('apply');

    usageApplyid = d['name'];
    usageApply = i;
    applyRecd=[];
    applyLineRecd=[];
    selectTileHierarchy = [];
    flagApplyQuery = false;
    adjustViews = [];
    // applyflag = 1;
    $('#apply'+applyList).css('background-color','#F2F2F2');
    applyList = i;
    $('#apply'+applyList).css('background-color','#BDBDBD');
    for(let m = 0;m<testViewTypeTime.length;m++){
        testViewTypeTime[m] = 0;
    }
    // d3.selectAll('rect').remove();
    d3.selectAll('#RecLink').remove();
    d3.selectAll('circle').remove();
    d3.selectAll('#line').remove();
    d3.select('#delDetailView').remove();
    d3.select('.detailView').remove();
    d3.selectAll('.tileRect').remove();
    d3.selectAll('.recommendView').remove();

    //记住位置
    if(flagApply){
        initPosition = [];
        storeViews = [];


        for(let m = 0;m<d3.selectAll('rect')[0].length;m++){
            let p = [];
            p.push(d3.selectAll('rect')[0][m]['id']);
            p.push(d3.selectAll('rect')[0][m]['x']['baseVal'].value);
            p.push(d3.selectAll('rect')[0][m]['y']['baseVal'].value);
            p.push(d3.selectAll('rect')[0][m]['width']['baseVal'].value);
            p.push(d3.selectAll('rect')[0][m]['height']['baseVal'].value);
            initPosition.push(p);
            let storeItem = [];
            storeItem['id'] = d3.selectAll('image')[0][m]['id'];
            storeItem['width'] = d3.selectAll('image')[0][m]['width']['baseVal'].value;
            storeItem['height'] = d3.selectAll('image')[0][m]['height']['baseVal'].value;
            storeViews.push(storeItem);
        }


    }
    flagApply = false;

    $.getJSON(dataJsonPath+d['name'], function (data) {

        let interfaceW = parseFloat(data['result']['interfaceWidth']);
        let interfaceH = parseFloat(data['result']['interfaceHeight']);

        //rankList cosNum 排名
        // rankList[i]['view'].sort(function (a, b) {
        //     return b['cosNum'] - a['cosNum'];
        // });

        //    根据等级位置 画box

        let svgW = $('.svg')[0]['width']['baseVal'].value;
        let svgH = $('.svg')[0]['height']['baseVal'].value;

        // let ratio = svgW * 0.55;
        let offsetbboxs = [svgW * (1/6),svgH*(1/3)];
        let ratios = [interfaceW*0.6,interfaceH*0.6];

        // let AllBox=[0,0,0,0];

        // AllBox[2] = ratio *parseFloat(interfaceW);
        // AllBox[3] = ratio *parseFloat(interfaceH);
        // AllBox[0] = (svgW-AllBox[2])*1/3;
        // AllBox[1] = (svgH-AllBox[3])*1/3;



        // let boxContain = [];


        //对齐
        // alignment(boxContain);
        // for(let i = 0;i<boxContain.length;i++){
        //     drawBoxLine(boxContain[i]);
        // }
        // jsonViewType.indexOf(cosView[i]['view'][n]['type'])
        // viewTypeTime


        for(let j = 0;j<rankList[i]['view'].length;j++){
            let viewName;
            if(rankList[i]['view'][j]['select']){

                if(rankList[i]['view'][j].hasOwnProperty("sm")){
                    selectTileHierarchy.push(rankList[i]['view'][j]['hierarchy']);
                    testViewTypeTime[14] += 1;
                    viewName = compareViewType[14] +testViewTypeTime[14];
                } else{
                    let selectTileHie= rankList[i]['view'][j]['hierarchy'].indexOf('.');
                    if(selectTileHie == -1) {selectTileHierarchy.push(rankList[i]['view'][j]['hierarchy']);}
                    else {selectTileHierarchy.push(rankList[i]['view'][j]['hierarchy'].slice(0,selectTileHie));}

                    // console.log(rankList[i]['view'][j])['type']);
                    let index = jsonViewType.indexOf(rankList[i]['view'][j]['type']);
                    testViewTypeTime[index] +=1;
                    viewName = compareViewType[index] +testViewTypeTime[index];
                }

                // upName = viewName + viewTypeTime[testIndex];
                let w = parseFloat(rankList[i]['view'][j]['width'])*ratios[0];
                let h = parseFloat(rankList[i]['view'][j]['height'])*ratios[1];
                let x = parseFloat(rankList[i]['view'][j]['x'])*ratios[0] - w/2 + offsetbboxs[0];

                let y = parseFloat(rankList[i]['view'][j]['y']) *ratios[1] - h/2 +offsetbboxs[1];


                // console.log('test');
                // console.log(d3.select('#'+viewName+'G'));
                // console.log('test');
                // console.log(viewName);
                applyRecord(viewName+'G',x,y,w,h);
                // d3.select('#'+viewName)
                //     // .transition()
                //     // .duration(100)
                //     .attr('x',x)
                //     .attr('y',y)
                //     .attr('width',w)
                //     .attr('height',h)
                //     .style('z-index',1);
                //
                // d3.select('#'+viewName + 'R')
                //     // .transition()
                //     // .duration(100)
                //     .attr('x',x)
                //     .attr('y',y)
                //     .attr('width',w)
                //     .attr('height',h)
                //     .style('z-index',1);


                // if(rankList[i]['view'][j].hasOwnProperty("sm")){
                //
                //     updateSmLine(viewName);
                // }
                // rotateImg(w,h,viewName);
                adjustViews.push(viewName);

                // updateRectPosition(viewName);



                for(let i = 0;i<rankList.length;i++){
                    // $('#apply'+i).hover(function () {
                    //     $('#apply'+i).css('background-color','#525252');
                    //     $('#apply'+i).css('color','#ffffff');
                    // },function () {
                    //     $('#apply'+i).css('background-color','#F2F2F2');
                    //     $('#apply'+i).css('color','#525252');
                    // })

                    $('#cancel'+i).hover(function () {
                        $('#cancel'+i).css('background-color','#BDBDBD');
                        // $('#cancel'+i).css('color','#ffffff');
                    },function () {
                        $('#cancel'+i).css('background-color','#F2F2F2');
                        // $('#cancel'+i).css('color','#525252');
                    })
                }
            }
        }

        let storeX = 5;
        // console.log('storeView');
        // console.log(storeViews);
        for(let i = 0;i<storeViews.length;i++){


            let unShowFlag = -1;
            for(let j = 0;j<adjustViews.length;j++){
                if(storeViews[i].id == adjustViews[j]){
                    unShowFlag = 1;
                    break;
                }
            }
            if (unShowFlag == -1){

                applyRecord(storeViews[i].id+'G',storeX,5,75,75);

                // d3.select('#'+storeViews[i].id)
                //     .attr('x',storeX)
                //     .attr('y',5)
                //     .attr('width',75)
                //     .attr('height',75)
                //     .style('z-index',1);
                // d3.select('#'+storeViews[i].id+'R')
                //     .attr('x',storeX)
                //     .attr('y',5)
                //     .attr('width',75)
                //     .attr('height',75)
                //     .style('z-index',1);;

                storeX  += 80;
                // if(storeViews[i].id.substring(0,3) === 'sam'){
                //     updateSmLine(storeViews[i].id);
                // }
                // updateRectPosition(storeViews[i].id);
            }
        }


        let viewHierFlag;
        // console.log("apply");
        // console.log( data['result']['views']);
        for (let i in data['result']['views']){
            // let viewH = parseFloat(data['result']['views'][i]['cHeight']);
            // let viewW = parseFloat(data['result']['views'][i]['cWidth']);
            // let viewX = parseFloat(data['result']['views'][i]['cX']);
            // let viewY = parseFloat(data['result']['views'][i]['cY']);
            let viewHier = data['result']['views'][i]['hierarchy'];
            let viewTypeHie = data['result']['views'][i]['viewType'][0]['Type'];

            //
            if(viewTypeHie === 'dashboard'){ viewTypeHie = 'Panel'};
            if(viewTypeHie === 'small multiple') {
                viewHierFlag = selectTileHierarchy.indexOf(viewHier);
                viewTypeHie = data['result']['views'][i]['mid_view']['1']['viewType'][0]['Type'];
                for(let j in data['result']['views'][i]['mid_view'] ){
                    data['result']['views'][i]['mid_view'][j];
                    let viewH = parseFloat(data['result']['views'][i]['mid_view'][j]['cHeight']);
                    let viewW = parseFloat(data['result']['views'][i]['mid_view'][j]['cWidth']);
                    let viewX = parseFloat(data['result']['views'][i]['mid_view'][j]['cX']);
                    let viewY = parseFloat(data['result']['views'][i]['mid_view'][j]['cY']);
                    let viewH1 = viewH * ratios[1];
                    let viewW1 = viewW * ratios[0];
                    let viewX1 = viewX* ratios[0] -0.5 * viewW1 + offsetbboxs[0];
                    let viewY1 = viewY * ratios[1] - 0.5 * viewH1 + offsetbboxs[1];
                    d3.select('.svg')
                        .append('rect')
                        .attr('class','tileRect')
                        .attr('x',viewX1)
                        .attr('y',viewY1)
                        .attr('width',viewW1)
                        .attr('height',viewH1)
                        .style('fill',viewTypeColor[jsonViewType.indexOf(viewTypeHie)])
                        .style('fill-opacity','0.3')
                        .style('z-index',0);
                    let bbox = [0,0,0,0];
                    bbox[2] = viewW*ratios[0];
                    bbox[3] = viewH*ratios[1];
                    bbox[0] = viewX*ratios[0] - 0.5*bbox[2] + offsetbboxs[0];
                    bbox[1] = viewY*ratios[1] -0.5*bbox[3] + offsetbboxs[1];
                    drawBoxLine(bbox,-1);
                    // let applyLineRItem = {};
                    // applyLineRItem['bbox'] = bbox;
                    // applyLineRItem['viewHierFlag'] = -1;
                    // applyLineRecd.push(applyLineRItem);

                }
                let viewH = parseFloat(data['result']['views'][i]['cHeight']);
                let viewW = parseFloat(data['result']['views'][i]['cWidth']);
                let viewX = parseFloat(data['result']['views'][i]['cX']);
                let viewY = parseFloat(data['result']['views'][i]['cY']);
                let bbox = [0,0,0,0];
                bbox[2] = viewW*ratios[0];
                bbox[3] = viewH*ratios[1];
                bbox[0] = viewX*ratios[0] - 0.5*bbox[2] + offsetbboxs[0];
                bbox[1] = viewY*ratios[1] -0.5*bbox[3] + offsetbboxs[1];
                let applyLineRItem = {};
                applyLineRItem['bbox'] = bbox;
                applyLineRItem['viewHierFlag'] = 1;
                applyLineRecd.push(applyLineRItem);
                // console.log('small');
                // console.log(applyLineRItem);

            } else{
                let viewH = parseFloat(data['result']['views'][i]['cHeight']);
                let viewW = parseFloat(data['result']['views'][i]['cWidth']);
                let viewX = parseFloat(data['result']['views'][i]['cX']);
                let viewY = parseFloat(data['result']['views'][i]['cY']);
                viewHierFlag = selectTileHierarchy.indexOf(viewHier);
                // if(viewHierFlag === -1){
                let viewH1 = viewH * ratios[1];
                let viewW1 = viewW * ratios[0];
                let viewX1 = viewX* ratios[0] -0.5 * viewW1 + offsetbboxs[0];
                let viewY1 = viewY * ratios[1] - 0.5 * viewH1 + offsetbboxs[1];
                d3.select('.svg')
                    .append('rect')
                    .attr('class','tileRect')
                    .attr('x',viewX1)
                    .attr('y',viewY1)
                    .attr('width',viewW1)
                    .attr('height',viewH1)
                    .style('fill',viewTypeColor[jsonViewType.indexOf(viewTypeHie)])
                    .style('fill-opacity','0.3')
                    .style('z-index',0);
                let bbox = [0,0,0,0];
                bbox[2] = viewW*ratios[0];
                bbox[3] = viewH*ratios[1];
                bbox[0] = viewX*ratios[0] - 0.5*bbox[2] + offsetbboxs[0];
                bbox[1] = viewY*ratios[1] -0.5*bbox[3] + offsetbboxs[1];

                // let bbox = [0,0,0,0];
                // bbox[2] = b-a;
                // bbox[3] = d-c;
                // bbox[0] = a + AllBox[0];
                // bbox[1] = c +AllBox[1];
                // boxContain.push(bbox);
                let applyLineRItem = {};
                applyLineRItem['bbox'] = bbox;
                applyLineRItem['viewHierFlag'] = 1;
                applyLineRecd.push(applyLineRItem);
            }
            // viewHierFlag = selectTileHierarchy.indexOf(viewHier);
            // // if(viewHierFlag === -1){
            //     let viewH1 = viewH * ratio;
            //     let viewW1 = viewW * ratio;
            //     let viewX1 = viewX* ratio -0.5 * viewW1 + offsetbbox;
            //     let viewY1 = viewY * ratio - 0.5 * viewH1 + offsetbbox;
            //     d3.select('.svg')
            //         .append('rect')
            //         .attr('class','tileRect')
            //         .attr('x',viewX1)
            //         .attr('y',viewY1)
            //         .attr('width',viewW1)
            //         .attr('height',viewH1)
            //         .style('fill',viewTypeColor[jsonViewType.indexOf(viewTypeHie)])
            //         .style('fill-opacity','0.3')
            //         .style('z-index',0);

            // }
            // let RviewH = parseFloat(viewH) * parseFloat(interfaceH);
            // let RviewW = parseFloat(viewW) * parseFloat(interfaceW);
            // let RviewX = parseFloat(viewX) - RviewW * 0.5;
            // let RviewY = parseFloat(viewY) - RviewH * 0.5;
            // # x start x end y start y end
            // let a = (RviewX) * ratio;
            // let b = RviewW * ratio + a;
            // let c = (RviewY) * ratio;
            // let d = RviewH * ratio + c;
            // let bbox = [0,0,0,0];
            // bbox[2] = viewW*ratio;
            // bbox[3] = viewH*ratio;
            // bbox[0] = viewX*ratio - 0.5*bbox[2] + offsetbbox;
            // bbox[1] = viewY*ratio -0.5*bbox[3] + offsetbbox;
            //
            // // let bbox = [0,0,0,0];
            // // bbox[2] = b-a;
            // // bbox[3] = d-c;
            // // bbox[0] = a + AllBox[0];
            // // bbox[1] = c +AllBox[1];
            // // boxContain.push(bbox);
            // let applyLineRItem = {};
            // applyLineRItem['bbox'] = bbox;
            // applyLineRItem['viewHierFlag'] = viewHierFlag;
            // applyLineRecd.push(applyLineRItem);
            // drawBoxLine(bbox,viewHierFlag);
        }


        d3.selectAll('.currentG').remove();
        redraw();
        reDrawLine();
        recordPathUpdate();

    });



}

function drawBoxLine(displayBox,viewHierFlag) {

    // console.log(displayBox);

    let lineP = [[displayBox[0],displayBox[1],displayBox[0]+displayBox[2],displayBox[1]],
        [displayBox[0],displayBox[1],displayBox[0],displayBox[1]+displayBox[3]],
        [displayBox[0]+displayBox[2],displayBox[1],displayBox[0]+displayBox[2],displayBox[1]+displayBox[3]],
        [displayBox[0],displayBox[1]+displayBox[3],displayBox[0]+displayBox[2],displayBox[1]+displayBox[3]]];

    if(viewHierFlag !== -1){
        for(let i = 0;i<4;i++){
            d3.select('.svg')
                .append('line')
                .attr('id','line')
                .attr('x1',lineP[i][0])
                .attr('y1',lineP[i][1])
                .attr('x2',lineP[i][2])
                .attr('y2',lineP[i][3])
                .style('stroke','black')
                .style('stroke-width','1px');
        }
    } else{
        for(let i = 0;i<4;i++){
            d3.select('.svg')
                .append('line')
                .attr('id','line')
                .attr('x1',lineP[i][0])
                .attr('y1',lineP[i][1])
                .attr('x2',lineP[i][2])
                .attr('y2',lineP[i][3])
                .style('stroke','black')
                .style('stroke-dasharray','2 2')
                .style('stroke-width','1px');
        }

    }


}

function cancel(d,i_cancel) {

    flagApplyQuery = true;
    d3.selectAll('#line').remove();
    // d3.selectAll('rect').remove();
    d3.selectAll('circle').remove();
    d3.selectAll('.tileRect').remove();


    $('#apply'+applyList).css('background-color','#F2F2F2');
    applyList = '';


    //
    // console.log('cancel');
    // console.log(initPosition);
    for(let i = 0;i<initPosition.length;i++){
        if(initPosition[i][0]==='') continue;
        d3.select('#'+initPosition[i][0])
            // .transition()
            // .duration(500)
            .attr('x',initPosition[i][1])
            .attr('y',initPosition[i][2])
            .attr('width',initPosition[i][3])
            .attr('height',initPosition[i][4]);

        d3.select('#'+initPosition[i][0].slice(0,initPosition[i][0].length-1))
            // .transition()
            // .duration(500)
            .attr('x',initPosition[i][1])
            .attr('y',initPosition[i][2])
            .attr('width',initPosition[i][3])
            .attr('height',initPosition[i][4]);
        if(initPosition[i][0].substring(0,3) === 'sam'){
            updateSmLine(initPosition[i][0]);
        }

        updateRectPosition(initPosition[i][0].slice(0,initPosition[i][0].length-1));

    }
    recordPathUpdate();
}


function applyRecord(viewName,x,y,w,h) {

    let item = {};
    if(viewName.substring(viewName.length-4)==='imgG') return;
    item['id'] = $('#'+viewName)[0]['id'];
    item['tagName'] = $('#'+viewName)[0].tagName;
    item['childNode'] = [];



    for (let j = 0;j< $("#" + item['id'])[0].childNodes.length;j++){
        let item1 = {};
        let nodes = $("#" + item['id'])[0].childNodes;


        if(nodes[j].tagName == 'rect'){

            item1['id'] = nodes[j]['id'];
            item1['tagName'] = nodes[j].tagName;
            item1['width'] = w;
            item1['height'] = h;
            item1['className'] = nodes[j]['className']['baseVal'];
            item1['x'] = x;
            item1['y'] = y;
            item1['fill'] = nodes[j]['style']['fill'];


        }
        if(nodes[j].tagName == 'image'){
            item1['id'] = nodes[j]['id'];
            item1['tagName'] = nodes[j].tagName;
            item1['width'] = w;
            item1['height'] = h;
            item1['x'] = x;
            item1['y'] = y;
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
    applyRecd.push(item);
    
}

function redraw() {


    for(let i = 0;i<applyRecd.length;i++){
        let g = d3.select('.svg')
            .append('g')
            .attr('class', 'currentG')
            .attr('id', applyRecd[i]['id']);
        let applyRecdId = applyRecd[i]['id'];

        for(let p = 0;p<2;p++) {
            if (applyRecd[i]['childNode'][p].tagName == 'rect') {
                let newRect = g.append('rect')
                    .attr('width', applyRecd[i]['childNode'][p].width)
                    .attr('height', applyRecd[i]['childNode'][p].height)
                    .attr('x', applyRecd[i]['childNode'][p].x)
                    .attr('y', applyRecd[i]['childNode'][p].y)
                    // .style('fill', '#ffffff')
                    .style('fill', applyRecd[i]['childNode'][p].fill)
                    .attr('id', applyRecd[i]['childNode'][p].id)
                    .attr('class',applyRecd[i]['childNode'][p].className);
                if ((applyRecd[i]['childNode'][p].id).substring(0, 3) == 'sam')
                    newRect.style('stroke', 'black').style('stroke-width', '1px');


            }
        }
        for(let p = 0;p<2;p++) {
            if(applyRecd[i]['childNode'][p].tagName == 'image'){
                g.append('image')
                // .attr("preserveAspectRatio","none")
                    .attr('xlink:href', applyRecd[i]['childNode'][p].href)
                    .attr('width', applyRecd[i]['childNode'][p].width)
                    .attr('height', applyRecd[i]['childNode'][p].height)
                    .attr('x', applyRecd[i]['childNode'][p].x)
                    .attr('y', applyRecd[i]['childNode'][p].y)
                    .attr('id', applyRecd[i]['childNode'][p].id)
                    .attr('class','currentRect');
            }
        }

        for(let p =0; p< applyRecd[i]['childNode'].length; p++){
            if(applyRecd[i]['childNode'][p].tagName == 'line'){
                g.append('line')
                    .attr('id','sm_line')
                    .attr('class',applyRecd[i]['childNode'][p].class)
                    .attr('x1',applyRecd[i]['childNode'][p]['x1'])
                    .attr('y1',applyRecd[i]['childNode'][p]['y1'])
                    .attr('x2',applyRecd[i]['childNode'][p]['x2'])
                    .attr('y2',applyRecd[i]['childNode'][p]['y2'])
                    .style('stroke','black')
                    .style('stroke-width','1px')
                    .style('stroke-dasharray','3,3');
            }
        }


        if((applyRecd[i]['childNode'][0].id).substring(0,3)=='sam'){

            updateSmLine(applyRecd[i]['id'].substring(0,applyRecd[i]['id'].length-1));

        }
        //
        updateRectPosition(applyRecdId.substring(0,applyRecdId.length-1));
    }

    
}

function reDrawLine() {
    for(let i = 0;i<applyLineRecd.length;i++){
        drawBoxLine(applyLineRecd[i]['bbox'],applyLineRecd[i]['viewHierFlag']);
    }

}


let autoFillRects;
function autoFill(event) {

    // console.log('autoFill');
    // console.log(event);
    autoFillRects = [];
    let tileRects = d3.selectAll('.tileRect')[0];
    for (let i = 0;i<tileRects.length;i++){
        let item = {};
        item['x'] = tileRects[i]['x']['baseVal'].value;
        item['y'] = tileRects[i]['y']['baseVal'].value;
        item['width'] = tileRects[i]['width']['baseVal'].value;
        item['height'] = tileRects[i]['height']['baseVal'].value;
        item['num'] = 0;
        autoFillRects.push(item);
    }

    let autoFillRectTemp = [];

    let userRects = d3.selectAll('.currentRect')[0];
    for(let j =0;j<autoFillRects.length;j++){
        let autoFillFlag = 1;
        for (let i = 0;i<userRects.length;i++){
            if(autoFillRects[j]['x'] ===  userRects[i]['x']['baseVal'].value && autoFillRects[j]['y'] === userRects[i]['y']['baseVal'].value
            && autoFillRects[j]['width']=== userRects[i]['width']['baseVal'].value && autoFillRects[j]['height'] ===userRects[i]['height']['baseVal'].value ){
                // console.log(autoFillRects[j]);
                autoFillFlag = 0;
                continue;
            }
        }
        if(autoFillFlag === 1){
            autoFillRectTemp.push(autoFillRects[j]);
        }
    }
    autoFillRects = [];
    autoFillRects = autoFillRectTemp;

    let testRect = [];
    if(event.target['className']['baseVal'] === 'currentRect'){

        let testRectId = d3.select('#'+event.target['id']);
        let item={};

        item['x'] = testRectId[0][0]['x']['baseVal'].value;
        item['y'] = testRectId[0][0]['y']['baseVal'].value;
        item['width'] = testRectId[0][0]['width']['baseVal'].value;
        item['height'] = testRectId[0][0]['height']['baseVal'].value;
        testRect.push(item);

        let RankAutoFill = [];
        for(let i = 0;i<autoFillRects.length;i++){
            autoFillRects[i]['num'] = 0;
            autoFillRects[i]['num']=intersectionArea(autoFillRects[i],testRect[0]);
        }
        autoFillRects.sort(function (a, b) {
            return b['num'] - a['num'];
        });


        if(autoFillRects.length !==0){
            if(autoFillRects[0]['num'] >0.05){
                d3.select('#'+event.target['id']).attr('x',autoFillRects[0]['x'])
                    .attr('y',autoFillRects[0]['y'])
                    .attr('width',autoFillRects[0]['width'])
                    .attr('height',autoFillRects[0]['height']);
                d3.select('#'+event.target['id']+'R').attr('x',autoFillRects[0]['x'])
                    .attr('y',autoFillRects[0]['y'])
                    .attr('width',autoFillRects[0]['width'])
                    .attr('height',autoFillRects[0]['height'])
                    .style('stroke','none');
                drawEightCircles(event.target['id']);
            }
        }



    }


}

function intersectionArea (rect1,rect2) {

    let Xa1 = rect1['x'];
    let Ya1 = rect1['y'];
    let Xa2 = rect1['x'] +rect1['width'];
    let Ya2 = rect1['y'] +rect1['height'];
    let Xb1 = rect2['x'] ;
    let Yb1 = rect2['y'] ;
    let Xb2 = rect2['x'] +rect2['width'];
    let Yb2 = rect2['y'] +rect2['height'];
    let Xc1 = Math.max(Xa1,Xb1);
    let Yc1 = Math.max(Ya1,Yb1);
    let Xc2 = Math.min(Xa2,Xb2);
    let Yc2 = Math.min(Ya2,Yb2);
    if(Xc1 <= Xc2 &&Yc1 <= Yc2){
        // console.log(Math.abs(Xc1-Xc2)*Math.abs(  Yc1-Yc2));
        return Math.abs(Xc1-Xc2)*Math.abs(  Yc1-Yc2);

    }else{
        return 0;
    }

}