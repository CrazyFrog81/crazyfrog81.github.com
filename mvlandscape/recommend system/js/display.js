//功能
let directionAll = ['left', 'right', 'top', 'bottom', 'rightBottomCorner', 'leftUpCorner', 'rightUpCorner', 'leftBottomCorner'];
let direction = -1;
let rect, mouseDownX, mouseDownY, clickBoxWidth, clickBoxHeight, selectRect, selectRectX, selectRectY,selectRect1;


let dragTest = false;
let testIndex;
let dragId;
let dragSelectRect = false;
let lasso_rect = new RectShape(0,0,0,0);
let lasso_box;
let last_e;
let draw_lasso = false;
// let lasso_rect_set = []
let lasso_rect_set = new Map();
let drag_all_rect = false;
let defaultViewSize = 70;
let floatFlag = false;
let shift_down = false;
let shift_chosed_list = new Map();
shift_drag_rect =false;
let lasso_drag = false;

function GetdefaultViewSize(){
    return defaultViewSize  + 45*Math.random()
}
// let applyflag = -1;


function RectShape(_left,_top,_right,_bottom,flag=false){
        this.left = _left;
        this.top = _top;
        this.right = _right;
        this.bottom = _bottom;
        this.vertical_middle = (_left+_right)/2.0;
        this.horizon_middle = (_top+_bottom)/2.0;
        this.choosed = flag;
}

function countCircles(){
    let el = document.getElementsByTagName('circle');
    // console.log(el.length)
    shift_chosed_list.clear();
    // console.log(rectPosition)
    for(var i = 0; i < el.length;i+=8){
        var name = el[i].parentElement.id;
        name = name.substring(0, name.length-1);
        var aRectShape = rectPosition.get(name)
        shift_chosed_list.set(name,aRectShape);
    }

    // if(shift_chosed_list.size >1)
    //     change_align('_off.png') 
    // else
    //     change_align('_no.png'); 
}
function change_align(a){
     for(let i = 5; i<9;i++)
            $('#imgButton' + i).attr('src',iconImgPath + iconBox[i] + a); 
}
 
document.onmousedown = function (e) {
    if(e.shiftKey == 1){
        shift_down = true
    }
    else if(e.target['id'] == 'svg'){
        // console.log('clear')
        shift_down = false
        shift_chosed_list.clear();
        countCircles();
        // console.log("Fffff")
    }
    let downName = e.target['id'];
    // console.log()
    // console.log(e.target['className']);

    if(downName == "Cancel" || downName == "OK" ){
        CancelOrOK(downName,e);
        // return;
    }

    if(lasso_selected)
    {
        if (e.clientX > $('.svg').offset().left && e.clientX < $('.svg').offset().left + $('.svg')[0].clientWidth && e.clientY > $('.svg').offset().top && e.clientY < $('.svg').offset().top + $('.svg')[0].clientHeight) {
            let judge = (e.clientX - $('.svg').offset().left > lasso_rect.left &&
                   e.clientX - $('.svg').offset().left < lasso_rect.right&&
                   e.clientY - $('.svg').offset().top > lasso_rect.top &&
                   e.clientY - $('.svg').offset().top < lasso_rect.bottom );

            if($('div').hasClass('lasso_box') && judge){
                    drag_all_rect = true;
            }
            else{
                 // console.log('down')
                lasso_rect.left = e.clientX - $('.svg').offset().left;
                lasso_rect.top = e.clientY -  $('.svg').offset().top;
                lasso_rect.right = lasso_rect.left;
                lasso_rect.bottom = lasso_rect.top;
                draw_lasso = true;
            }
        }
        else
        {
            lasso_rect = new RectShape(0,0,0,0);
        }
    }
    if(e.target['className']['baseVal'] === 'recommendView'){
        recommendViewTypeFlag = 0;
        recommendViewTypeItem = downName;
    }
    if (e.target['className'] == 'vTm'|| e.target['className']==='vTmText') {

        flagApply = true;
        e.preventDefault();
        if(!shift_down)
        {
            d3.selectAll('circle').remove();
            changeRectStyle();
        }

        // d3.selectAll('.tileRect').remove();
        d3.select('#delDetailView').remove();
        d3.select('.detailView').remove();
        d3.selectAll('.recommendView').remove();
        d3.selectAll('#RecLink').remove();

        //注释0304
        // for (let i = 0; i < d3.selectAll('rect')[0].length; i++) {
        //     // d3.select('#' + d3.selectAll('rect')[0][i]['id'])
        //     //     .style('stroke', 'none');
        // }

        dragTest = true;
        dragSelectRect = false;
        dragId = e.target['id'];
        testIndex = dragId.substring(8, dragId.length);
        let tmp_size = GetdefaultViewSize();
        let tmp_size1 = GetdefaultViewSize();
        imgBox = d3.select('body')
            .append('div')
            .attr('class','box')
            .attr('id','floatbox')
            .style('height',defaultViewSize+'px')
            .style('width',defaultViewSize+'px')
            .style('position', 'absolute')
            .style('left',e.clientX+'px')
            .style('top',e.clientY+'px')
            .attr('x', e.clientX)
            .attr('y', e.clientY)
            .style('background-color',viewTypeColor[testIndex]);
            // .style('border', '1px solid #787878');
            // .style('background-color','#ffffff');

        imgBox.append('img')
            .attr('src', function (){return iconImgPath +viewType[testIndex] + '.png'})
            .attr('width',defaultViewSize+'px')
            .attr('height',defaultViewSize+'px');

        // alignmentHint("floatbox",e);
    }
    if (e.target['className']['baseVal'] == 'svg') {

        applyflag = -1;
        deleteList = [];
        d3.selectAll('#lineHint').remove();
        if(!shift_down){
            d3.selectAll('circle').remove();
            changeRectStyle();
        }

        dragTest = false;
        dragSelectRect = false;
        d3.selectAll('.recommendView').remove();
        d3.selectAll('#RecLink').remove();
    }
    if (e.target['className']['baseVal'] == 'currentRect') {

        draw_lasso = false;
        d3.selectAll('.recommendView').remove();
        d3.selectAll('#RecLink').remove();

        flagApply = true;
        // d3.selectAll('.tileRect').remove();
        d3.select('#delDetailView').remove();
        d3.select('.detailView').remove();
        if (downName != deleteList[0]) {
            deleteList = [];
            if(e.shiftKey != 1){
                d3.selectAll('circle').remove();
                changeRectStyle();
            }

            // d3.selectAll('rect').style('stroke', 'none');
        }
        deleteList.push(downName);
        createSelectStyle(downName);
        direction = 'drag';
        dragSelectRect = true;
        dragTest = false;
        VMousedown(e);
        // if(e.shiftKey != 1)
        // {
        //     d3.selectAll('circle').remove();
        // }
        if(shift_down){
            drawEightCircles(downName);
            shift_drag_rect =true;
        }
        if(lasso_rect_set.size>1 && lasso_rect_set.has(downName))
        {
            lasso_drag = true;
            $('#'+downName+'R').css('stroke','black').css('stroke-dasharray','3,3').css('stroke-width','2px');
        }
        // updateRectPosition(downName);
    }
    else if(e.clientX > $('.svg').offset().left && e.clientX < $('.svg').offset().left + $('.svg')[0].clientWidth 
        && e.clientY > $('.svg').offset().top && e.clientY < $('.svg').offset().top + $('.svg')[0].clientHeight) 
        ;
    else{
        shift_drag_rect = false;
        lasso_drag = false;
    }
    if (e.target['className']['baseVal'] == 'currentCircle')
    {
        d3.selectAll('.recommendView').remove();
        d3.selectAll('#RecLink').remove();
        flagApply = true;
        d3.select('#delDetailView').remove();
        d3.select('.detailView').remove();
        // $(this).css('cursor', createMouseStyle(name));
        direction = downName;
        dragSelectRect = true;
        dragTest = false;
        VMousedown(e);
        draw_lasso = false;
    }
    if(e.target['className'] == 'imgData'){
        createDetail(downName,e);
    }

    document.onmousemove = function (p) {

        
        if(draw_lasso)
        {
            // console.log('move')
            let left = e.clientX;
            let top = e.clientY;
            if(p.clientX < e.clientX){
                lasso_rect.left = p.clientX - $('.svg').offset().left;
                left = p.clientX;
            }
            else
                lasso_rect.right = p.clientX - $('.svg').offset().left;
            if(p.clientY < e.clientY){
                lasso_rect.top = p.clientY - $('.svg').offset().top;
                top = p.clientY;
            }
            else
                lasso_rect.bottom = p.clientY - $('.svg').offset().top;
            // lasso_rect = new RectShape(lasso_rect.left,lasso_rect.top, lasso_rect.right,lasso_rect.bottom)
            let height = lasso_rect.bottom - lasso_rect.top;
            let width  = lasso_rect.right - lasso_rect.left;

            if( width>20 || height>20){
                $('.lasso_box').remove();
               lasso_box = d3.select('body')
                            .append('div')
                            .attr('class','lasso_box')
                            .attr('id','lasso_box')
                            .style('height',height+'px')
                            .style('width',width+'px')
                            .style('position', 'absolute')
                            .style('left',left+'px')
                            .style('top',top+'px')
                            .attr('x', lasso_rect.left)
                            .attr('y', lasso_rect.top)
                            .style("border",'solid 3px red');
            }
            else{
                $('.lasso_box').remove();
                lasso_rect_set.clear();
                // rectPosition.forEach((value,key,self) => {
                //     $('#'+key+'R').css('stroke','#787878')
                //         .css('stroke-width','1px')
                //         .css('stroke-dasharray','0');
                // });
            }
        }
        if(lasso_drag){
            let shift_left = p.clientX - e.clientX;
            let shift_top = p.clientY - e.clientY;
            // console.log(p.clientY, e.clientY)
            lasso_rect_set.forEach((value,key,self) => {
                 $('#' + key).attr('x', value.left+shift_left);
                 $('#' + key).attr('y', value.top+shift_top);
                 $('#' + key + 'R').attr('x', value.left+shift_left);
                 $('#' + key + 'R').attr('y', value.top+shift_top);
                 $('#'+key+'R').css('stroke','black').css('stroke-dasharray','3,3').css('stroke-width','2px');
             });
        }


        if (dragTest) {
            $('.box')
                .css('left',p.clientX+'px')
                .css('top',p.clientY+'px');

            if(cutRec_flag!==2){
                if($('div').hasClass('box'))
                    alignmentHint("floatbox",p);
            }

        }
        if (dragSelectRect) {
            d3.select('.warn').remove();
            p = p || event; //是要是使用原生js给我们提供的e回调参数，这存储了很多有用的信息
            let xx = p.clientX;
            let yy = p.clientY;
            let xSub;
            let ySub;
            let xWidthLeft;
            let xWidthRight;
            let yHeightTop;
            let yHeightBottom;
            let xNew;
            let yNew;

            xSub = mouseDownX - xx;
            ySub = mouseDownY - yy;
            xNew = selectRectX - xSub + 'px';
            yNew = selectRectY - ySub + 'px';



            xWidthLeft = clickBoxWidth + xSub + 'px';
            xWidthRight = clickBoxWidth - xSub + 'px';
            yHeightTop = clickBoxHeight + ySub + 'px';
            yHeightBottom = clickBoxHeight - ySub + 'px';

            if (direction == 'left') {
                if (judge(xWidthLeft, clickBoxHeight, xNew, selectRectY)) {
                    // if(xWidthLeft.slice(0,xWidthLeft.length-2)<0)
                    // {
                    //     xWidthLeft = Math.abs(parseFloat(xWidthLeft.slice(0,xWidthLeft.length-2))) + 'px';
                    //     selectRect.attr('x', xNew);
                    //     selectRect.attr('width', xWidthLeft);
                    //     selectRect1.attr('x', xNew);
                    //     selectRect1.attr('width', xWidthLeft);
                    // }
                    // rect.style.width = xWidthLeft;
                        selectRect.attr('x', xNew);
                        selectRect.attr('width', xWidthLeft);
                        selectRect1.attr('x', xNew);
                        selectRect1.attr('width', xWidthLeft);

                    judgeRatio(xWidthLeft, clickBoxHeight, selectRect[0][0]['id']);

                } else {
                    warnText(selectRect);
                }

            } else if (direction == 'right') {
                if (judge(xWidthRight, clickBoxHeight, selectRectX, selectRectY)) {
                    if(xWidthRight<0)
                    {
                        xWidthRight = Math.abs(xWidthRight);
                    }
                    selectRect.attr('width', xWidthRight);
                    selectRect1.attr('width', xWidthRight);

                    judgeRatio(xWidthRight, clickBoxHeight,selectRect[0][0]['id']);
                    // rect.style.width = xWidthRight;
                } else {
                    warnText(selectRect);
                }

            } else if (direction == 'top') {

                if (judge(clickBoxWidth, yHeightTop, selectRectX, yNew)) {
                    selectRect.attr('height', yHeightTop);
                    selectRect.attr('y', yNew);
                    selectRect1.attr('height', yHeightTop);
                    selectRect1.attr('y', yNew);
                    judgeRatio(clickBoxWidth, yHeightTop,selectRect[0][0]['id']);
                } else {
                    warnText(selectRect);
                }

            } else if (direction == 'bottom') {
                if (judge(clickBoxWidth, yHeightBottom, selectRectX, selectRectY)) {
                    selectRect.attr('height', yHeightBottom);
                    selectRect1.attr('height', yHeightBottom);
                    judgeRatio(clickBoxWidth, yHeightBottom,selectRect[0][0]['id']);
                } else {
                    warnText(selectRect);
                }
            } else if (direction == 'rightBottomCorner') {
                if (judge(xWidthRight, yHeightBottom, selectRectX, selectRectY)) {
                    selectRect.attr('height', yHeightBottom);
                    selectRect.attr('width', xWidthRight);
                    selectRect1.attr('height', yHeightBottom);
                    selectRect1.attr('width', xWidthRight);
                    judgeRatio(xWidthRight, yHeightBottom,selectRect[0][0]['id']);
                    // rect.style.width = xWidthRight;
                    // rect.style.height = yHeightBottom;
                } else {
                    warnText(selectRect);
                }
            } else if (direction == 'rightUpCorner') {
                if (judge(xWidthRight, yHeightTop, selectRectX, yNew)) {
                    selectRect.attr('height', yHeightTop);
                    selectRect.attr('width', xWidthRight);
                    selectRect.attr('y', yNew);
                    selectRect1.attr('height', yHeightTop);
                    selectRect1.attr('width', xWidthRight);
                    selectRect1.attr('y', yNew);
                    judgeRatio(xWidthRight, yHeightTop,selectRect[0][0]['id']);
                } else {
                    warnText(selectRect);
                }
            } else if (direction == 'leftUpCorner') {
                if (judge(xWidthLeft, yHeightTop, xNew, yNew)) {
                    selectRect.attr('height', yHeightTop);
                    selectRect.attr('width', xWidthLeft);
                    selectRect.attr('y', yNew);
                    selectRect.attr('x', xNew);
                    selectRect1.attr('height', yHeightTop);
                    selectRect1.attr('width', xWidthLeft);
                    selectRect1.attr('y', yNew);
                    selectRect1.attr('x', xNew);
                    judgeRatio(xWidthLeft, yHeightTop,selectRect[0][0]['id']);
                } else {
                    warnText(selectRect);
                }
            } else if (direction == 'leftBottomCorner') {

                if (judge(xWidthLeft, yHeightBottom, xNew, selectRectY)) {
                    selectRect.attr('x', xNew);
                    selectRect.attr('height', yHeightBottom);
                    selectRect.attr('width', xWidthLeft);
                    selectRect1.attr('x', xNew);
                    selectRect1.attr('height', yHeightBottom);
                    selectRect1.attr('width', xWidthLeft);
                    judgeRatio(xWidthLeft, yHeightBottom,selectRect[0][0]['id']);
                } else {
                    warnText(selectRect);
                }
            } else if (direction == "drag") {
                if (judge(clickBoxWidth, clickBoxHeight, xNew, yNew)) {
                    selectRect.attr('x', xNew)
                        .attr('y', yNew);
                    selectRect1.attr('x', xNew)
                        .attr('y', yNew);
                    judgeRatio(clickBoxWidth, clickBoxHeight,selectRect[0][0]['id']);
                }
            }
            let selectImgW = selectRect[0][0]['width']['baseVal'].value;
            let selectImgH = selectRect[0][0]['height']['baseVal'].value;
            let selectImgId = selectRect[0][0]['id'];
            rotateImg(selectImgW,selectImgH,selectImgId);
            // if(!shift_down)
            // d3.selectAll('circle').remove();
            // d3.selectAll('rect').style('stroke', 'none');
            createSelectStyle(deleteList[0]);


            if(cutRec_flag !==2){
                if(direction==='drag'){
                    alignmentHint(selectImgId,e);
                }else{
                    alignmentHint(selectImgId,e,false);
                }
            }


            //8个推荐移动
            // if(recommendViewTypeFlag===-1){
            //     console.log('move');
            //     d3.selectAll('.recommendView').remove();
            //     recommendViewType(selectRect[0][0]['id']);
            // }
            // else
            //     updateRectPosition(downName);
            // console.log("downName");
            // console.log(downName);
            d3.selectAll('.recommendView').remove();
            d3.selectAll('#RecLink').remove();


        }
        last_e = 'move'
        if(shift_chosed_list.size>1 && shift_drag_rect){
            let shift_left = p.clientX - e.clientX;
            let shift_top = p.clientY - e.clientY;
            d3.selectAll('circle').remove()
            shift_chosed_list.forEach((value,key,self) => {
                 $('#' + key).attr('x', value.left+shift_left);
                 $('#' + key).attr('y', value.top+shift_top);
                 $('#' + key + 'R').attr('x', value.left+shift_left);
                 $('#' + key + 'R').attr('y', value.top+shift_top);
                 drawEightCircles(key,true)
             });
            d3.selectAll('#lineHint').remove();
        }
        else
            shift_drag_rect = false;
    };
    document.onmouseup = function (e) {
        $('.lasso_box').remove();
        if(draw_lasso){
            //get all chosed rect
            lasso_rect_set.clear();
            rectPosition.forEach((value,key,self) => {
                //不相交
                if( value.bottom     < lasso_rect.top ||
                    lasso_rect.bottom < value.top     ||
                    value.right      < lasso_rect.left||
                    lasso_rect.right  < value.left      )
                       ;
                else{
                    lasso_rect_set.set(key,value);
                    $('#'+key+'R').css('stroke','black').css('stroke-dasharray','3,3').css('stroke-width','2px');
                }

            });
            // 
        }
        if(lasso_drag){
            var tmp_map = new Map();
            lasso_rect_set.forEach((value,key,self)=>{
                updateRectPosition(key)
                let value_now = rectPosition.get(key)
                tmp_map.set(key, value_now)
                $('#'+key+'R').css('stroke','black').css('stroke-dasharray','3,3').css('stroke-width','2px');
            })
            lasso_rect_set.clear();
            lasso_rect_set = tmp_map;
        }
        if(shift_drag_rect){
            // console.log('shift drag',shift_chosed_list)
            var tmp_map = new Map();
            shift_chosed_list.forEach((value,key,self)=>{
                updateRectPosition(key)
                let value_now = rectPosition.get(key)
                tmp_map.set(key, value_now)
            })
            shift_chosed_list.clear();
            shift_chosed_list = tmp_map;
            // console.log('shift drag',shift_chosed_list)
        }


        let upName;
        let tmp_flag = false;
        if(recommendViewTypeFlag===0){

            let reW = $('#'+recommendViewTypeItem)[0]['width']['baseVal'].value;
            let reH = $('#'+recommendViewTypeItem)[0]['height']['baseVal'].value;
            let reX = $('#'+recommendViewTypeItem)[0]['x']['baseVal'].value;
            let reY = $('#'+recommendViewTypeItem)[0]['y']['baseVal'].value;
            let reIndex = compareViewType1.indexOf(recommendViewTypeItem.substring(0,3));
            let reIndexOrient = recommendViewTypeItem.substring(3,4);
            let tmp_size = GetdefaultViewSize()
            let tmp_size1 = GetdefaultViewSize();
            if(reIndexOrient === "0"){
                reY = reY + reH - tmp_size;
            }

            if(reIndexOrient === "3"){
                reX = reX +reW - tmp_size;
            }

            let viewName = viewType[reIndex];
            viewTypeTime[reIndex] += 1;
            if (viewName == 'Tree and Network' || viewName == 'Grid Matrix' || viewName == 'Text Based') {

                viewName = viewName.substring(0, 4);
            }
            upName = viewName + viewTypeTime[reIndex];
            let g = d3.select('.svg')
                .append('g')
                .attr('class', 'currentG')
                .attr('id', upName+'G');
            g.append('rect')
                .attr('width', tmp_size+'px')
                .attr('height', tmp_size1+'px')
                .attr('x', reX)
                .attr('y', reY)
                //0304
                .style('fill',viewTypeColor[reIndex])
                // .style('fill', '#ffffff')
                .style('stroke','#787878')
                .style('stroke-width','1px')
                .attr('id', upName+'R');
            g.append('image')
            //0310
            // .attr("preserveAspectRatio","none")
            // 0310
                .attr('xlink:href', iconImgPath +viewType[reIndex] + '.png')
                // .attr('xlink:href', iconImg1Path)
                .attr('width', tmp_size+'px')
                .attr('height', tmp_size1+'px')
                .attr('x', reX)
                .attr('y', reY)
                .attr('id', upName)
                .attr('class','currentRect');
            d3.selectAll('.recommendView').remove();
            d3.selectAll('#RecLink').remove();
            recommendViewTypeFlag=1;
            recordPathUpdate();
            if(flagApplyQuery){
                query();
            }
            // if(cutRec_flag === false){
            //     cutRecProject();
            // }
            updateRectPosition(upName);

        }
        if (dragTest) {


            // tmp_flag = true;
            // console.log('dragTest')
            d3.select('.box').remove();
            if (e.clientX > $('.svg').offset().left && e.clientX < $('.svg').offset().left + $('.svg')[0].clientWidth && e.clientY > $('.svg').offset().top && e.clientY < $('.svg').offset().top + $('.svg')[0].clientHeight) {

                tmp_flag = true;
                let viewName = viewType[testIndex];
                viewTypeTime[testIndex] += 1;
                if (viewName == 'Tree and Network' || viewName == 'Grid Matrix' || viewName == 'Text Based') {

                    viewName = viewName.substring(0, 4);
                }
                upName = viewName + viewTypeTime[testIndex];

                let g = d3.select('.svg')
                    .append('g')
                    .attr('class', 'currentG')
                    .attr('id', upName+'G');
                let tmp_size = GetdefaultViewSize();
                let tmp_size1 = GetdefaultViewSize();
                g.append('rect')
                    .attr('width', tmp_size+'px')
                    .attr('height', tmp_size1+'px')
                    .attr('x', e.clientX - $('.svg').offset().left)
                    .attr('y', e.clientY - $('.svg').offset().top)
                    //0304
                    .style('fill',viewTypeColor[testIndex])
                    .style('stroke','#787878')
                    .style('stroke-width','1px')
                    // .style('fill', '#ffffff')
                    // .style('stroke','#969696')
                    // .style('stroke-width','1px')
                    .attr('id', upName+'R');
                g.append('image')
                    //0310
                    // .attr("preserveAspectRatio","none")
                       // 0310
                    .attr('xlink:href', iconImgPath +viewType[testIndex] + '.png')
                    // .attr('xlink:href', iconImg1Path)
                    .attr('width', tmp_size+'px')
                    .attr('height', tmp_size1+'px')
                    .attr('x', e.clientX - $('.svg').offset().left)
                    .attr('y', e.clientY - $('.svg').offset().top)
                    .attr('id', upName)
                    .attr('class','currentRect');




                //产生推荐类型
                recommendViewType(upName);

                // d3.select('.svg')
                //     .append('rect')
                //     .attr('width', '80px')
                //     .attr('height', '80px')
                //     .attr('x', e.clientX - $('.svg').offset().left)
                //     .attr('y', e.clientY - $('.svg').offset().top)
                //     .attr('class', 'currentRect')
                //     .attr('id', upName)
                //     .style('fill', viewTypeColor[testIndex]);

                if(flagApplyQuery){
                    query();
                    resetfilterByViews();
                }
                // if(cutRec_flag === false){
                //
                //     cutRecProject();
                // }
                // cutRecProject();
                // query();
                dragTest = false;
                autoFill(e);
                //注释0304
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
                recordPathUpdate();

            }
            d3.selectAll('#lineHint').remove();
            if(!shift_down)
            {
                d3.selectAll('circle').remove();
                changeRectStyle();
            }

        }
        if (dragSelectRect) {

            //initPosition

            tmp_flag = true;
            // console.log('dragSelectRect')
            let upNameClass = e.target.className.baseVal;

            if(upNameClass == "currentCircle" )
                upName = $('#'+e.target.id).attr('name');
            else
                upName = e.target['id'];
            createMouseStyle1();
            if(flagApplyQuery ){
                query();
                resetfilterByViews();
            }
            // if(cutRec_flag === false){
            //     cutRecProject();
            // }
            // query();
            d3.selectAll('#lineHint').remove();
            dragSelectRect = false;
            autoFill(e);
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

            recordPathUpdate();
            // d3.selectAll('#lineHint').remove();
            // d3.selectAll('circle').remove();
        }
        if( tmp_flag && lasso_selected){
            // console.log('tem');
            tmp_flag = false;
            updateRectPosition(upName,true);
            d3.selectAll("#lineHint").remove();
            recordPathUpdate();
        }
        else if(tmp_flag){
            d3.selectAll("#lineHint").remove();
            updateRectPosition(upName);
        }
        // d3.selectAll('circle').remove();

        draw_lasso = false;
        // console.log('up')
        drag_all_rect = false;
        shift_drag_rect = false;
        lasso_drag =false;
    };
};
document.onkeydown = function (e) {
    //var e=arguments[0]||window.event;
    e = e || window.event;
    if (e.keyCode == 46) {
        if (deleteList.length != 0) {
            deleteRect();
        }
    }
};

//实现伸缩功能
function VMousedown(e) {

    rect = document.getElementById(deleteList[0]);
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    clickBoxWidth = rect.getBoundingClientRect().width;
    clickBoxHeight = rect.getBoundingClientRect().height;
    selectRect = d3.select('#' + deleteList[0]);
    selectRect1 = d3.select('#' + deleteList[0] + 'R');
    selectRectX = selectRect[0][0]['x']['baseVal'].value;
    selectRectY = selectRect[0][0]['y']['baseVal'].value;

};

//判断是否超出界面，已经长宽比例
function judge(width, height, x, y) {


    let nWidth = parseFloat(width);
    let nHeight = parseFloat(height);
    let nX = parseFloat(x);
    let nY = parseFloat(y);
    let widthMax = document.getElementsByClassName('svg')[0]['width']['baseVal'].value;
    let heightMax = document.getElementsByClassName('svg')[0]['height']['baseVal'].value;


    if(nWidth <0 || nHeight < 0){
        return  false;
    }

   if (width > widthMax) {
        return false;
    } else if (height > heightMax) {
        return false;
    }
    if (nY < 0 || nY + nHeight > heightMax - 4) {
        return false;
    }
    if (nX < 0 || nX + nWidth > widthMax - 4) {
        return false;
    }
    return true;

}


function judgeRatio(width, height,selectId){
    console.log('judgeRatio');
    let rationMax = 10;
    let rationMin = 0.1;
    let nWidth = parseFloat(width);
    let nHeight = parseFloat(height);

    let ratioOverFlag = true;
    if ((nWidth / nHeight) > rationMax || (nWidth / nHeight < rationMin)) {
        ratioOverFlag = false;
    }
    else if ((nHeight / nWidth) > rationMax || (nHeight / nWidth < rationMin)) {
        ratioOverFlag = false;
    }
    // let selectId = selectRect[0][0]['id'];
    if(!ratioOverFlag){

        d3.select('#'+selectId+'R').style('stroke','red').style('stroke-width',3).style('stroke-dasharray','0');
    }else{
        d3.select('#'+selectId+'R').style('stroke','#666666')
            .style('stroke-width','2px')
            .style('stroke-dasharray','0');
        // d3.select('#'+selectId+'R').style('stroke','black').style('stroke-width',3);
    }
}
//出现警示文字
function warnText(selectRect) {
    let svg = d3.select('.svg');
    svg.append('text').attr('class', 'warn')
        .attr('x', selectRect[0][0]['x']['baseVal'].value)
        .attr('y', selectRect[0][0]['y']['baseVal'].value)
        .attr('fill', 'red')
        .text('WARN')
}

//创造点击色块 后的样式

function createSelectStyle(name) {
    drawEightCircles(name);
}

// 创造悬停后 鼠标样式
function createMouseStyle1() {
    for (let i = 0; i < directionAll.length; i++) {
        $('#' + directionAll[i]).hover(function () {
            $('#' + directionAll[i]).css('cursor', createMouseStyle(directionAll[i]));
        })
    }
}

// 根据名字 返回悬停的样式名字
function createMouseStyle(name) {
    if (name == 'left' || name == 'right') {
        return 'w-resize';
    } else if (name == 'top' || name == 'bottom') {
        return 's-resize';
    } else if (name == 'rightBottomCorner' || name == 'leftUpCorner') {
        return 'se-resize';
    } else if (name == 'rightUpCorner' || name == 'leftBottomCorner') {
        return 'ne-resize';
    }
}

function alignmentHint(name,e,flag=true){
    var selectX, selectY, selectWidth, selectHeight;

    if(name == "floatbox")
    {
        selectX = e.clientX - $('.svg').offset().left;
        selectY = e.clientY - $('.svg').offset().top;
        selectHeight = defaultViewSize;
        selectWidth = defaultViewSize;

    }
    else{
        selectX = d3.select('#' + name)[0][0]['x']['baseVal'].value;
        selectY = d3.select('#' + name)[0][0]['y']['baseVal'].value;
        selectWidth = d3.select('#' + name)[0][0]['width']['baseVal'].value;
        selectHeight = d3.select('#' + name)[0][0]['height']['baseVal'].value;
    }

    var aRectShape = new RectShape(selectX,selectY,selectX + selectWidth,selectY + selectHeight);
    d3.selectAll('#lineHint').remove();

    rectPosition.forEach((value,key,self) => {

        if(lasso_drag)
            if(lasso_rect_set.size>1 && lasso_rect_set.has(key))
                return true;
        if(shift_drag_rect)
            if(shift_chosed_list.size>1 && shift_chosed_list.has(key))
                return true;

        if(key == name)
            return true;

        let bRect = value;

        let indexbRect = compareViewType1.indexOf(key.substring(0,3));

        let color = viewTypeColor[indexbRect];
        let svg = d3.select('.svg');
        var x1,y1,x2,y2;
        if(Math.abs(aRectShape.top - bRect.top)<5 || 
            // Math.abs(aRectShape.horizon_middle - bRect.top)<5 ||
            Math.abs(aRectShape.bottom - bRect.top)<5 ){
            //draw a horizontal line align  bRect.top
            x1 = Math.min(bRect.left,aRectShape.left);
            x2 = Math.max(bRect.right, aRectShape.right);
            y1 = bRect.top;
            y2 = bRect.top;
            drawLine(x1,y1,x2,y2,color);

            if(flag){
                if(Math.abs(aRectShape.top - bRect.top)<5)
                    adsorption(name,aRectShape,"top", bRect,bRect.top)
                else
                    adsorption(name,aRectShape,"bottom", bRect, bRect.top)
            }

        }
        if(
            // Math.abs(aRectShape.top - bRect.horizon_middle)<5 || 
            Math.abs(aRectShape.horizon_middle - bRect.horizon_middle)<5 
            // ||Math.abs(aRectShape.bottom - bRect.horizon_middle)<5
            ){
                x1 = Math.min(bRect.left,aRectShape.left);
                x2 = Math.max(bRect.right, aRectShape.right);
                y1 = bRect.horizon_middle;
                y2 = bRect.horizon_middle;
                drawLine(x1,y1,x2,y2,color);
                if(flag){
                    adsorption(name,aRectShape,"horizon_middle", bRect,bRect.horizon_middle)
                }

            //draw a horizontal line align  bRect.horizon_middle
        }
            
        if(
            Math.abs(aRectShape.top - bRect.bottom)<5 || 
            // Math.abs(aRectShape.horizon_middle - bRect.bottom)<5 ||
            Math.abs(aRectShape.bottom - bRect.bottom)<5){
                x1 = Math.min(bRect.left,aRectShape.left);
                x2 = Math.max(bRect.right, aRectShape.right);
                y1 = bRect.bottom;
                y2 = bRect.bottom;
                drawLine(x1,y1,x2,y2,color);
                if(flag){
                    if(Math.abs(aRectShape.top - bRect.bottom)<5)
                        adsorption(name,aRectShape,"top", bRect,bRect.bottom)
                    else
                        adsorption(name,aRectShape,"bottom", bRect, bRect.bottom)
                }

            //draw a horizontal line align  bRect.top
        }
            
        if(
            Math.abs(aRectShape.left - bRect.left)<5 || 
            // Math.abs(aRectShape.vertical_middle - bRect.left)<5 ||
            Math.abs(aRectShape.right - bRect.left)<5){
            //draw a horizontal line align  bRect.left
                y1 = Math.min(bRect.top,aRectShape.top);
                y2 = Math.max(bRect.bottom, aRectShape.bottom);
                x1 = bRect.left;
                x2 = bRect.left;
                drawLine(x1,y1,x2,y2,color);
                if(flag){
                    if(Math.abs(aRectShape.left - bRect.left)<5)
                        adsorption(name,aRectShape,"left", bRect,bRect.left)
                    else
                        adsorption(name,aRectShape,"right", bRect, bRect.left)
                }


        }
            
        if(
            // Math.abs(aRectShape.left - bRect.vertical_middle)<5 || 
            Math.abs(aRectShape.vertical_middle - bRect.vertical_middle)<5 
            // ||Math.abs(aRectShape.right - bRect.vertical_middle)<5
            ){
                y1 = Math.min(bRect.top,aRectShape.top);
                y2 = Math.max(bRect.bottom, aRectShape.bottom);
                x1 = bRect.vertical_middle;
                x2 = bRect.vertical_middle;
                drawLine(x1,y1,x2,y2,color);
                if(flag){
                    adsorption(name,aRectShape,"vertical_middle", bRect,bRect.vertical_middle);
                }

        }
            
        if(
            Math.abs(aRectShape.left - bRect.right)<5 || 
            // Math.abs(aRectShape.vertical_middle - bRect.right)<5 ||
            Math.abs(aRectShape.right - bRect.right)<5){
                y1 = Math.min(bRect.top,aRectShape.top);
                y2 = Math.max(bRect.bottom, aRectShape.bottom);
                x1 = bRect.right;
                x2 = bRect.right;
                drawLine(x1,y1,x2,y2,color);
                if(flag){
                    if(Math.abs(aRectShape.left - bRect.right)<5)
                        adsorption(name,aRectShape,"left", bRect,bRect.right)
                    else
                        adsorption(name,aRectShape,"right", bRect, bRect.right)
                }

            
        }
    });

}

function updateRectPosition(name,flag=false){
    // console.log('updateRect');
    // console.log(name);
    //push the position of rectangle to rectPosition
    if(name == 'svg'){
        if(rectPosition.has(name))
            rectPosition.delete(name);
        return;
    } 


    // if(rectPosition.has(name))
    // {

    //     if(rectPosition.get(name).choosed === true && flag === true)
    //         flag = false;
    //     if(flag){
    //         $('#'+name+'R').css('stroke','red').css('stroke-dasharray','3,3').css('stroke-width','2px');
    //         choosed_rect_set.add(name) 
    //     }
    //     else{
    //         $('#'+name+'R').css('stroke','none')
    //         if(name.substring(0,3)=='sam'){
    //              $('#'+name+'R').css('stroke','black').css('stroke-width','1px').css('stroke-dasharray','0');
    //         }
    //          choosed_rect_set.delete(name)
    //     }
    //     if(choosed_rect_set.size!= 0){
    //         for(var x of choosed_rect_set){
    //                 $('#'+x+'R').css('stroke','black').css('stroke-dasharray','3,3').css('stroke-width','2px');
    //             break;
    //         }
    //     }
    // }
    

    
    let selectX = d3.select('#' + name)[0][0]['x']['baseVal'].value;
    let selectY = d3.select('#' + name)[0][0]['y']['baseVal'].value;
    let selectWidth = d3.select('#' + name)[0][0]['width']['baseVal'].value;
    let selectHeight = d3.select('#' + name)[0][0]['height']['baseVal'].value;
    let aRectShape = new RectShape(selectX,selectY,selectX + selectWidth,selectY + selectHeight,flag);



    if(rectPosition.has(name))
        rectPosition.delete(name);
    if(name.indexOf('img') === -1){
        rectPosition.set(name,aRectShape);
    }
}
//A is absorbed by B 
function adsorption(name,A,Adirection, B, BdirectionValue){
   if(name == "floatbox"){
        if(Adirection == "left")
            d3.select("#floatbox").style('left',BdirectionValue+$('.svg').offset().left+'px')
        else if(Adirection == "right")
            d3.select("#floatbox").style('left',BdirectionValue+$('.svg').offset().left- defaultViewSize +'px')
        else if(Adirection == "top")
            d3.select("#floatbox").style('top',BdirectionValue+$('.svg').offset().top+'px')
        else if(Adirection == "bottom")
            d3.select("#floatbox").style('top',BdirectionValue+$('.svg').offset().top-defaultViewSize+'px')
        else if(Adirection == "horizon_middle")
            d3.select("#floatbox").style('top', BdirectionValue+$('.svg').offset().top-defaultViewSize/2+'px');
        else
            d3.select("#floatbox").style('left', BdirectionValue+$('.svg').offset().left-defaultViewSize/2+'px');
    }
    else
    {
        if(Adirection == "left"){
            d3.select('#' + name).attr('x', BdirectionValue);
            d3.select('#' + name+'R').attr('x', BdirectionValue);
        }
        else if(Adirection == "right")
        {
            d3.select('#' + name).attr('x', BdirectionValue - d3.select('#' + name)[0][0]['width']['baseVal'].value);
            d3.select('#' + name+'R').attr('x', BdirectionValue - d3.select('#' + name+'R')[0][0]['width']['baseVal'].value);
        }

        else if(Adirection == "top")
        {
            d3.select('#' + name).attr('y', BdirectionValue);
            d3.select('#' + name+'R').attr('y', BdirectionValue);
        }

        else if(Adirection == "bottom")
        {
            d3.select('#' + name).attr('y', BdirectionValue - d3.select('#' + name)[0][0]['height']['baseVal'].value);
            d3.select('#' + name+'R').attr('y', BdirectionValue - d3.select('#' + name+'R')[0][0]['height']['baseVal'].value);
        }

        else if(Adirection == "horizon_middle")
        {
            d3.select('#' + name).attr('y', A.top + B.horizon_middle - A.horizon_middle);
            d3.select('#' + name+'R').attr('y', A.top + B.horizon_middle - A.horizon_middle);
        }

        else
        {
            d3.select('#' + name).attr('x', A.left + B.vertical_middle - A.vertical_middle);
            d3.select('#' + name+'R').attr('x', A.left + B.vertical_middle - A.vertical_middle);
        }

        drawEightCircles(name);
    }
}
function drawLine(x1,y1,x2,y2,color,lineweight='3px',id_name='svg',class_name='')
{
    // console.log('drawLine');

    let svg = d3.select('#'+id_name);
    // if(lineweight == '3px') 
    //     svg = d3.select('')
    svg.append("line")
        .attr("id",function(){
            if(lineweight === '3px') return "lineHint";
            if(lineweight === '2px') return  "RecLink";
            return 'sm_line';
        })
        .attr('class',class_name)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", color)
        .attr("stroke-width", lineweight).attr("stroke-dasharray","3,3");
}
function drawEightCircles(name,count_flag=false)
{
    let selectX = d3.select('#' + name)[0][0]['x']['baseVal'].value;
    let selectY = d3.select('#' + name)[0][0]['y']['baseVal'].value;
    let selectWidth = d3.select('#' + name)[0][0]['width']['baseVal'].value;
    let selectHeight = d3.select('#' + name)[0][0]['height']['baseVal'].value;
    let selectPosition = [{'name': 'leftUpCorner', 'x': selectX, 'y': selectY},
        {'name': 'rightUpCorner', 'x': (selectX + selectWidth), 'y': selectY},
        {'name': 'top', 'x': (selectX + selectWidth / 2), 'y': selectY},
        {'name': 'left', 'x': selectX, 'y': (selectY + selectHeight / 2)},
        {'name': 'leftBottomCorner', 'x': selectX, 'y': (selectY + selectHeight)},
        {'name': 'bottom', 'x': (selectX + selectWidth / 2), 'y': (selectY + selectHeight)},
        {'name': 'rightBottomCorner', 'x': (selectX + selectWidth), 'y': (selectY + selectHeight)},
        {'name': 'right', 'x': (selectX + selectWidth), 'y': (selectY + selectHeight / 2)}];
    let g = d3.select('#'+name+'G');
    g.selectAll('circle').remove();
    g.selectAll('circle')
        .data(selectPosition)
        .enter()
        .append('circle')
        .attr('class', 'currentCircle')
        .attr('id', function (d) {
            return d.name;
        })
        .attr('cx', function (d) {
            return d.x;
        })
        .attr('cy', function (d) {
            return d.y;
        })
        .attr('name',name)
        .attr('r', '4px')
        .style('stroke', '#515151')
        .style('fill', '#ffffff');
    if(shift_down && !count_flag){
        countCircles();
        d3.select('#'+name+'R').style('stroke','#666666')
            .style('stroke-width','2px')
    } else{
    changeRectStyle();
    d3.select('#'+name+'R').style('stroke','#666666')
        .style('stroke-width','2px');
}

    console.log('change');
    judgeRatio(selectWidth,selectHeight,name);

        // updateSmLine(name);
    if(name.substring(0,3) == 'sam'){
        let samG = name.substring(0,4)+'G';

        let rows_sm =  $('#'+samG).children(".rows").length+1;
        let columns_sm =  $('#'+samG).children(".columns").length+1;
        startX = selectX;
        startY = selectY;
        height = selectHeight/rows_sm;
        width = selectWidth/columns_sm;
        d3.selectAll('#'+samG +' #sm_line').remove();
        for(let i = 1; i < rows_sm; i++)
            drawLine(startX,startY+i*height,startX+selectWidth,startY+i*height,'black','1px',samG,'rows');
        for(let j =1; j < columns_sm; j++)
            drawLine(startX + j*width,startY,startX+ j*width,startY+selectHeight,'black','1px',samG,'columns');
        rows_sm =  $('#'+samG).children(".rows").length;
        columns_sm =  $('#'+samG).children(".columns").length;
    }

}
function updateSmLine(name){
    // console.log('updateLine');
    // console.log(name);
    let selectX = d3.select('#' + name)[0][0]['x']['baseVal'].value;
    let selectY = d3.select('#' + name)[0][0]['y']['baseVal'].value;
    let selectWidth = d3.select('#' + name)[0][0]['width']['baseVal'].value;
    let selectHeight = d3.select('#' + name)[0][0]['height']['baseVal'].value;
    // console.log(selectHeight);
    if(name.substring(0,3) == 'sam'){
        let samG = name.substring(0,4)+'G';
        // console.log('row');
        // console.log($('#'+samG));
        //计算row column 线的数量
        let columns_sm = 1, rows_sm = 1;
        for(let m = 0;m<$('#'+samG)[0]['childNodes'].length;m++){
            if($('#'+samG)[0]['childNodes'][m]['className']['baseVal'] === 'columns'){
                columns_sm += 1;
            }
            if($('#'+samG)[0]['childNodes'][m]['className']['baseVal'] === 'rows'){
                rows_sm += 1;
            }
        }
        // let rows_sm =  $('#'+samG).children[0](".rows").length+1;
        // let columns_sm =  $('#'+samG).children[0](".columns").length+1;


        let startX = selectX;
        let startY = selectY;
        let height = selectHeight/rows_sm;
        let width = selectWidth/columns_sm;

        d3.selectAll('#'+samG +' #sm_line').remove();
        for(let i = 1; i < rows_sm; i++){

            drawLine(startX,startY+i*height,startX+selectWidth,startY+i*height,'black','1px',samG,'rows');
        }

        for(let j =1; j < columns_sm; j++){
            drawLine(startX + j*width,startY,startX+ j*width,startY+selectHeight,'black','1px',samG,'columns');
        }

        // rows_sm =  $('#'+samG).children(".rows").length;
        // columns_sm =  $('#'+samG).children(".columns").length;
    }
}

function rotateImg(selectImgW,selectImgH,selectImgId) {
    // let r = selectImgW/selectImgH;
    //
    //
    // //宽度大则图片不旋转
    // if (r>1){
    //     d3.select('#'+selectImgId).attr('xlink:href', iconImgPath +viewType[compareViewType1.indexOf(selectImgId.slice(0,3))]+ '.png');
    // }
    // if (r<1){
    //     d3.select('#'+selectImgId).attr('xlink:href', iconImgPath +viewType[compareViewType1.indexOf(selectImgId.slice(0,3))] + '1.png');
    // }

}

$('#imgButton3').click(function(){
    // alert('click')
    // alert($(".sm_setting").length)
    // console.log($(".sm_setting"))
    if($(".sm_setting").length > 0) 
    { 
        // alert('>0')
        d3.select(".sm_setting").remove();
        return;
    }
    // alert('click')

    let left = $('#imgButton3').offset().left - 150;
    let top  = $('#imgButton3').offset().top  + 35;
    // alert(left+' '+top)
    sm_setting = d3.select('body').append('div').attr('class','sm_setting').style('position','fixed')
                    .style('left',left+'px').style('top',top+'px').style('width','300px').style('z-index','10')
                    .style('height','100px')
                    .style('font-weight','bold').style('padding','16px').style('padding-top','1px');


     $('.sm_setting').prepend('<div style="padding-left:80px"> \
                                     <button id="Cancel" class="Cancel">Cancel</button> \
                                     <button id="OK" class="OK">OK</button> </div>')
    $('.sm_setting').prepend('<div class="rows_columns"> Rows * Columns: \
         <input type="number" id="rows" min="1" max="10" value="1"/> \
         *\
         <input type="number" id="columns" min="1" max="10" value="2"/>\
        </div>');  
    option_str = '<option value="Area" choosed>Area</option>';   
    for(let cnt = 1 ; cnt < 14; cnt++){
        option_str += " <option value=" + jsonViewType[cnt] +'>'+ jsonViewType[cnt]+ '</option>';
    }
    
    $('.sm_setting').prepend('<div> View Type:\
        <select id="sm_viewtype"> ' 
        + option_str +
        '</select></div>')  
  });
// console.log("$('button')")
// console.log($('#imgButton3'))
// $('button').click(function(){
//     alert('here')
//     if($('button').id == 'Cancel'){
//         alert('here')
//         d3.select(".sm_setting").remove();
//     }
// });

function CancelOrOK(idName,e){
    // console.log('rows')
    // console.log(document.getElementById('rows'))
    let rows = document.getElementById('rows').value;
    let columns = document.getElementById('columns').value;
    let sm_viewtype =  document.getElementById('sm_viewtype').value;
    // console.log(sm_viewtype)
    let colorIndex = compareViewType1.indexOf(sm_viewtype.substring(0,3))
    // alert(idName)
    d3.select(".sm_setting").remove();
    if(idName == "Cancel") return;

    startX = 50;
    startY = 50;
    width  = 73/columns;
    height = 73/rows;
    viewTypeTime[14]+=1;
    id = 'sam'+viewTypeTime[14];


    let g = d3.select('.svg')
                .append('g')
                .attr('class', 'currentG')
                .attr('id', id+'G');
    g.append('rect')
        .attr('width', '73px')
        .attr('height', '73px')
        .attr('x',50)
        .attr('y',50)
        .style('fill',viewTypeColor[colorIndex])
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .attr('id', id+'R')
        .attr('class',id+compareViewType1[colorIndex]+(columns*rows));
        // .attr('class','currentRect');
    // g.append('div')
    //     // .attr('xlink:href', iconImgPath +viewType[testIndex] + '.png')
    //     .attr('width', '0')
    //     .attr('height', '0')
    //     // .attr('x', e.clientX - $('.svg').offset().left)
    //     // .attr('y', e.clientY - $('.svg').offset().top)
    //     .attr('id', id)
    //     .attr('class','currentRect');
    g.append('image')
        .attr('xlink:href', iconImgPath  + 'sam.png')
        .attr('width', '73px')
        .attr('height', '73px')
        .attr('x',50)
        .attr('y', 50)
        .attr('id', id)
        .attr('class','currentRect');

    for(let i = 1; i < rows; i++)
        drawLine(startX,startY+i*height,startX+73,startY+i*height,'black','1px',id+'G','rows');
    for(let j =1; j < columns; j++)
        drawLine(startX + j*width,startY,startX+ j*width,startY+73,'black','1px',id+'G','columns');

    updateRectPosition(id);

    query();
    dragTest = false;
    recordPathUpdate();

};

$('.displayOrNot').click(function () {
    // console.log(d3.select('.displayOrNot')[0][0]['id']);
    if(d3.select('.displayOrNot')[0][0]['id']=='release'){
        $('.displayOrNot').attr('id','retract');
        $('.displayOrNot').attr('src',iconImgPath+'release.png');
        $('.display').css('width','79%');
        $('.queryResult').css('width','0%');
    }
    else
    {
        $('.displayOrNot').attr('id','release');
        $('.displayOrNot').attr('src',iconImgPath+'retract.png');
        $('.display').css('width','50%');
        $('.queryResult').css('width','32.3%');
    }
});


function changeRectStyle() {
    let change_RectStyle = d3.selectAll('.currentRect')[0];
    for(let i = 0;i<change_RectStyle.length;i++){
        d3.select('#'+change_RectStyle[i]['id']+'R')
            .style('stroke','#787878')
            .style('stroke-width','1px')
            .style('stroke-dasharray','0');
    }
}
