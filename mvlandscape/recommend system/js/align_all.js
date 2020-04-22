function align_all(direction){
    d3.selectAll('circle').remove();
    d3.selectAll('#lineHint').remove();
    d3.select('.lasso_box').remove();
    console.log('align_all')
    console.log(direction)
    // d3.selectAll('rect').style('stroke', 'none');

    var allRectWidth = 0;
    var allRectHeight = 0;
    var maxRectWidth = 0;
    var maxRectHeight = 0;

    design_screen_width = $(".svg").width();
    design_screen_height = $(".svg").height();


    lasso_rect_set.forEach((value,key,self) => {
        allRectWidth  += value.right - value.left;
        allRectHeight += value.bottom- value.top;
        if(value.right - value.left > maxRectWidth)  maxRectWidth  = value.right - value.left;
        if(value.bottom - value.top > maxRectHeight) maxRectHeight = value.bottom- value.top;
    });
    // console.log('align '+direction)
    // console.log(rectPosition);

    var numofRect = lasso_rect_set.size;
    var startX = design_screen_width/2.0 - allRectWidth/2.0;
    var startY = design_screen_height/2.0 - allRectHeight/2.0;

    if(startX<0 && (direction == 'top' || direction == 'bottom')){
        alert('The width is not enough!'+design_screen_width+','+allRectWidth);
        return;
    }
    if(startY < 0 &&(direction == 'left'||direction == 'right'))
    {
        alert('The height is not enough!'+design_screen_height+','+allRectHeight);
        return;
    }

    var aRectShape;
    var newlasso_rect_set = new Map();
    var arrayObj=Array.from(lasso_rect_set);


    if(direction == 'top'){
        console.log(arrayObj)
        arrayObj.sort(function(a,b){return a[1].top-b[1].top})
        console.log("arrayObj")
        console.log(arrayObj)
        lasso_rect_set.forEach((value,key,self) => {
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var left = startX;
             var right = left + width;
             var top = Math.min(design_screen_height/2.0 - allRectHeight/(numofRect*2.0),design_screen_height/2.0 - maxRectHeight/2.0)
             var bottom = top + height;
             aRectShape = new RectShape(left,top,right,bottom);
             newlasso_rect_set.set(key,aRectShape);

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key + 'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
             startX = startX + $('#'+key).width();
             updateSmLine(key);

        });
    }
    if(direction == 'bottom'){
        lasso_rect_set.forEach((value,key,self) => {
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var left = startX
             var right = left + width
             var bottom = Math.max(design_screen_height/2.0 + allRectHeight/(numofRect*2.0),design_screen_height/2.0 + maxRectHeight/2.0)
             var top = bottom - height

             aRectShape = new RectShape(left,top,right,bottom)
             newlasso_rect_set.set(key,aRectShape)

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key + 'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
             startX = startX + $('#'+key).width();
             updateSmLine(key);
        });
    }
    if(direction == 'left'){
        lasso_rect_set.forEach((value,key,self) => {
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var top = startY
             var bottom = top + height
             var left = Math.min(design_screen_width/2.0 - allRectWidth/(numofRect*2.0),design_screen_width/2.0 - maxRectWidth/2.0)
             var right = left + width

             aRectShape = new RectShape(left,top,right,bottom);
             newlasso_rect_set.set(key,aRectShape)

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key +'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
            startY = startY + $('#'+key).height();
            updateSmLine(key);
        });
    }
    if(direction == 'right'){
        lasso_rect_set.forEach((value,key,self) => {
             var width  = $("#"+key).width();
             var height = $("#"+key).height();
             var top = startY;
             var bottom = top + height;
             var right = Math.max(design_screen_width/2.0 + allRectWidth/(numofRect*2.0),design_screen_width/2.0 + maxRectWidth/2.0)
             var left = right - width;
             aRectShape = new RectShape(left,top,right,bottom);
             newlasso_rect_set.set(key,aRectShape);

             d3.select('#' + key).attr('x', left);
             d3.select('#' + key).attr('y', top);
             d3.select('#' + key + 'R').attr('x', left);
             d3.select('#' + key + 'R').attr('y', top);
             startY = startY + $('#'+key).height();
             updateSmLine(key);
        });
    }
    // alert('here')
    // rectPosition = newlasso_rect_set;
    //here, need to change the original rect position
    newlasso_rect_set.forEach((value,key,self) => {
        rectPosition.set(key,value)
    });

    query();
    recordPathUpdate();
}