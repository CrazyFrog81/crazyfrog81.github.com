function align_lasso(direction){
    // if(shift_chosed_list.size < 1)
        d3.selectAll('circle').remove();
    d3.selectAll('#lineHint').remove();
    d3.selectAll('.lasso_box').remove();
    d3.selectAll('rect').style('stroke', 'none');
    let align_rect_set = new Map();

    if(shift_chosed_list.size>1)
        align_rect_set = shift_chosed_list;
    else
        align_rect_set = lasso_rect_set;

    console.log("align_lasso")
    console.log(align_rect_set)
    if(align_rect_set.size == 0)
    {
        alert("Please select Rectangles to be aligned first!");
        return;
    }

    var arrayObj_v= Array.from(align_rect_set);
    var arrayObj_h = Array.from(align_rect_set);
    arrayObj_v.sort(function(a,b){return a[1].top-b[1].top})
    arrayObj_h.sort(function(a,b){return a[1].left-b[1].left})
    var reference_top_id,reference_top_rect;
    var reference_bot_id,reference_bot_rect;
    var reference_left_id,reference_left_rect;
    var reference_right_id,reference_right_rect;
    var size = align_rect_set.size;
    reference_top_id = arrayObj_v[0][0]
    reference_top_rect = arrayObj_v[0][1];
    reference_left_id = arrayObj_h[0][0]
    reference_left_rect = arrayObj_h[0][1]
    reference_bot_id = arrayObj_v[size-1][0]
    reference_bot_rect = arrayObj_v[size-1][1];
    reference_right_id = arrayObj_h[size-1][0]
    reference_right_rect = arrayObj_h[size-1][1]


    let reference_id_v, reference_rect_v;
    // let reference_id_h, reference_rect_h;
    if(direction == 'top')
    {
        reference_id_v = reference_top_id
        reference_rect_v = reference_top_rect
    }
    if(direction == 'bottom')
    {
        reference_id_v = reference_bot_id
        reference_rect_v = reference_bot_rect
    }
    if(direction == 'left')
    {
        reference_id_v = reference_left_id
        reference_rect_v = reference_left_rect
    }
    if(direction == 'right')
    {
        reference_id_v = reference_right_id
        reference_rect_v = reference_right_rect
    }

    var sorted_rect_set;
    if(direction == "top" || direction == 'bottom')
        sorted_rect_set = new Map(arrayObj_h);
    else
        sorted_rect_set = new Map(arrayObj_v);

     // console.log('align_lasso')
     // console.log(align_rect_set)
     // console.log(sorted_rect_set)

    var allRectWidth = 0;
    var leftRectWidth = 0, rightRectWidth = 0;
    var topRectWidth = 0, bottomRectWidth = 0;
    var allRectHeight = 0;
    let tmpflag = false
    design_screen_width = $(".svg").width();
    design_screen_height = $(".svg").height();

    sorted_rect_set.forEach((value,key,self) => {
        if(key == reference_id_v) tmpflag = true;
        if(tmpflag) {
            rightRectWidth += value.right - value.left;
            bottomRectWidth += value.bottom - value.top;
        }
        else{
            leftRectWidth += value.right - value.left;
            topRectWidth += value.bottom - value.top
        }
        allRectWidth  += value.right - value.left;
        allRectHeight += value.bottom- value.top;
    });

    var startX = reference_rect_v.left;
    var startY = reference_rect_v.top;
    if(direction == "top" || direction=="bottom"){
        if(design_screen_width - allRectWidth<0)
            startX = -1;
        else if(startX - leftRectWidth <0 || startX + rightRectWidth > design_screen_width)
            startX = (design_screen_width - allRectWidth)/2;
        else
            startX = startX - leftRectWidth;
    }
    else
    {
        if(design_screen_height - allRectHeight<0)
            startY = -1;
        else if(startY - topRectWidth <0 || startY + bottomRectWidth > design_screen_height)
            startY = (design_screen_height - allRectHeight)/2;
        else
            startY = startY - topRectWidth;
        startY = Math.min(startY, design_screen_height - allRectHeight);
    }

    if(startX < 0){
        alert('The whole width of the choosed Rectangles are more than the width of display screen!')
        return;
    }
    if(startY < 0)
    {
        // alert('The first choosed Rectangle works as alignment reference, and the height is not enough!');
        alert('The whole height of the choosed Rectangles are more than the height of display screen!')
        return;
    }

    var aRectShape;
    var newRectPosition = new Map();
    // newRectPosition.set(reference_id,reference_rect);

    if(direction == 'top'){
        // startX = startX+ reference_rect_h.right - reference_rect_h.left;// reference_rect.right;
        // startY = startY;
        sorted_rect_set.forEach((value,key,self) => {
            // if(reference_id == key) return;
            // console.log('changed')
            // console.log(key)
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var left = startX;
             var right = left + width;
             var top = startY;
             // var top = Math.min(design_screen_height/2.0 - allRectHeight/(numofRect*2.0),design_screen_height/2.0 - maxRectHeight/2.0)
             var bottom = top + height;
             aRectShape = new RectShape(left,top,right,bottom,true);
             newRectPosition.set(key,aRectShape);

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key + 'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
             startX = startX + $('#'+key).width();
             updateSmLine(key);
        });
    }
    if(direction == 'bottom'){
        // startX = startX + reference_rect.right - reference_rect.left;;
        // startY = startY + reference_rect.bottom - reference_rect.top;
        startY = startY + reference_rect_v.bottom - reference_rect_v.top;
        sorted_rect_set.forEach((value,key,self) => {
             // if(reference_id == key) return;
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var left = startX
             var right = left + width
             // var bottom = Math.max(design_screen_height/2.0 + allRectHeight/(numofRect*2.0),design_screen_height/2.0 + maxRectHeight/2.0)
             var bottom = startY
             var top = bottom - height

             aRectShape = new RectShape(left,top,right,bottom,true)
             newRectPosition.set(key,aRectShape)

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key + 'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
             startX = startX + $('#'+key).width();
             updateSmLine(key);
        });
    }
    if(direction == 'left'){
        // startX = startX
        // startY =  startY + reference_rect.bottom - reference_rect.top;
        sorted_rect_set.forEach((value,key,self) => {
             // if(value.choosed == false || reference_id == key) return;
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var top = startY
             var bottom = top + height
             // var left = Math.min(design_screen_width/2.0 - allRectWidth/(numofRect*2.0),design_screen_width/2.0 - maxRectWidth/2.0)
             var left = startX
             var right = left + width

             aRectShape = new RectShape(left,top,right,bottom,true);
             newRectPosition.set(key,aRectShape)

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key +'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
            startY = startY + $('#'+key).height();
            updateSmLine(key);
        });
    }
    if(direction == 'right'){
        startX = startX + reference_rect_v.right - reference_rect_v.left;;
        // startY =  startY + reference_rect.bottom - reference_rect.top;
        sorted_rect_set.forEach((value,key,self) => {
             // if(reference_id == key) return;
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var top = startY;
             var bottom = top + height;
             // var right = Math.max(design_screen_width/2.0 + allRectWidth/(numofRect*2.0),design_screen_width/2.0 + maxRectWidth/2.0)
             var right = startX
             var left = right - width;
             aRectShape = new RectShape(left,top,right,bottom,true);
             newRectPosition.set(key,aRectShape);

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key + 'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
             startY = startY + $('#'+key).height();
             updateSmLine(key);
        });
    }
    align_rect_set.clear();
    // alert('here')
    // rectPosition = newRectPosition;
    newRectPosition.forEach((value,key,self) => {
        rectPosition.set(key,value)
        if(shift_down)
            drawEightCircles(key);
    });
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
    resetfilterByViews();
    query();
    // if (cutRec_flag){
    //     resetfilterByViews();
    //     query();
    // }
    // if(cutRec_flag === false){
    //     cutRecProject();
    // }
    recordPathUpdate();
}