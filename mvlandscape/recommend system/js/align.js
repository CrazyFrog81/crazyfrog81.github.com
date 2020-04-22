function align(direction){
    console.log("align "+direction);
    if(shift_chosed_list.size>1)
        choosed_rect_set = shift_chosed_list;
    else
        choosed_rect_set = lasso_rect_set;
    
    if(choosed_rect_set.size == 0)
    {
        alert("Please select Rectangles to be aligned first!");
        return;
    }

    changeRectStyle();
    d3.selectAll('circle').remove();
    d3.selectAll('#lineHint').remove();
    // d3.selectAll('rect').style('stroke', 'none');


    let sorted_rects = sort(direction, choosed_rect_set);

    if(direction == 'top' || direction ==='bottom'){
        let rect_0 = sorted_rects[0];
        let rect_n = sorted_rects[sorted_rects.length - 1];

        console.log('top');
        console.log(sorted_rects);
        console.log(rect_n[1]);
        console.log(Number.MAX_VALUE);

        let sum_width = 0, bb_top;
        if(direction === 'top'){
            bb_top = Number.MAX_VALUE;
            for(let rect of sorted_rects){
                sum_width += (rect[1].right - rect[1].left);
                bb_top = Math.min(bb_top, rect[1].top);
            }
        }
        if(direction === 'bottom'){
            bb_top = Number.MIN_VALUE;
            for(let rect of sorted_rects){
                sum_width += (rect[1].right - rect[1].left);
                bb_top = Math.max(bb_top, rect[1].bottom);
            }
        }

        let bb_x = rect_0[1].left, bb_z = rect_n[1].right;
        let shift_x = Math.max(0, sum_width - (bb_z - bb_x));
        // let min_x,max_x;
        // if(direction === 'top')
        // {
        //     min_x = 
        // }
        let min_x = bb_x, max_x = bb_z + shift_x;
        let left_bound = min_x, right_bound = max_x;
        let fixed_len = 0;

        for(let i = 0; i < sorted_rects.length; i++){
            if(direction === 'top')
                left_bound = reposition(sorted_rects[i], left_bound, right_bound, bb_top,'top');
            else 
                left_bound = reposition(sorted_rects[i], left_bound, right_bound, bb_top - sorted_rects[i][1].bottom +sorted_rects[i][1].top ,'top');
            fixed_len += sorted_rects[i][1].right - sorted_rects[i][1].left;
            right_bound = max_x - (sum_width - fixed_len);
        }
    }

    if(direction == 'left' || direction ==='right'){
        let rect_0 = sorted_rects[0];
        let rect_n = sorted_rects[sorted_rects.length - 1];

        // console.log('top');
        // console.log(sorted_rects);
        // console.log(rect_n[1]);
        // console.log(Number.MAX_VALUE);
        console.log('left');
        console.log(sorted_rects);
        let sum_width = 0, bb_top;
        if(direction === 'left'){
            bb_top = Number.MAX_VALUE;
            for(let rect of sorted_rects){
                sum_width += (rect[1].bottom - rect[1].top);
                bb_top = Math.min(bb_top, rect[1].left);
            }
        }
        if(direction === 'right'){
            bb_top = Number.MIN_VALUE;
            for(let rect of sorted_rects){
                sum_width += (rect[1].bottom - rect[1].top);
                bb_top = Math.max(bb_top, rect[1].right);
            }
        }

        let bb_x = rect_0[1].top, bb_z = rect_n[1].bottom;
        let shift_x = Math.max(0, sum_width - (bb_z - bb_x));

        let min_x = bb_x, max_x = bb_z + shift_x;
        let left_bound = min_x, right_bound = max_x;
        let fixed_len = 0;

        for(let i = 0; i < sorted_rects.length; i++){
            if(direction === 'left')
                left_bound = reposition(sorted_rects[i], left_bound, right_bound, bb_top,'left');
            else 
                left_bound = reposition(sorted_rects[i], left_bound, right_bound, bb_top - sorted_rects[i][1].right +sorted_rects[i][1].left ,'left');
            fixed_len += sorted_rects[i][1].bottom - sorted_rects[i][1].top;
            right_bound = max_x - (sum_width - fixed_len);
        }
    }

    //
    // let reference_id ;//= first_choosed_rect;
    // for(var x of choosed_rect_set){
    //     reference_id = x;
    //     break;
    // }
    // // console.log('align')
    // // console.log(reference_id)
    // // console.log(rectPosition)
    // let reference_rect = rectPosition.get(reference_id);
    // // console.log(reference_rect)
    //
    // var allRectWidth = 0;
    // var allRectHeight = 0;
    // // var maxRectWidth = 0;
    // // var maxRectHeight = 0;
    //
    // design_screen_width = $(".svg").width();
    // design_screen_height = $(".svg").height();
    //
    // var numofRect = 0;
    // rectPosition.forEach((value,key,self) => {
    //     if(value.choosed == true){
    //         numofRect += 1;
    //         allRectWidth  += value.right - value.left;
    //         allRectHeight += value.bottom- value.top;
    //         // if(value.right - value.left > maxRectWidth)  maxRectWidth  = value.right - value.left;
    //         // if(value.bottom - value.top > maxRectHeight) maxRectHeight = value.bottom- value.top;
    //     }
    // });
    //
    // var startX = reference_rect.left;
    // var startY = reference_rect.top;
    //
    // if(startX + allRectWidth - design_screen_width>0 && (direction == 'top' || direction == 'bottom')){
    //     alert('The first choosed Rectangle works as alignment reference, and the width is not enough!');
    //     return;
    // }
    // if(startY + allRectHeight - design_screen_height > 0 &&(direction == 'left'||direction == 'right'))
    // {
    //     alert('The first choosed Rectangle works as alignment reference, and the height is not enough!');
    //     return;
    // }
    //
    // var aRectShape;
    // var newRectPosition = new Map();
    // newRectPosition.set(reference_id,reference_rect);
    //
    //
    // if(direction == 'top'){
    //     startX = reference_rect.right;
    //     startY = reference_rect.top;
    //
    //     rectPosition.forEach((value,key,self) => {
    //         if(value.choosed == false || reference_id == key) return;
    //         // console.log('changed')
    //         // console.log(key)
    //
    //          var width  = $("#"+key).width();
    //          var height = $("#"+key).height();
    //          var left = startX;
    //          var right = left + width;
    //          var top = startY;
    //          // var top = Math.min(design_screen_height/2.0 - allRectHeight/(numofRect*2.0),design_screen_height/2.0 - maxRectHeight/2.0)
    //          var bottom = top + height;
    //          aRectShape = new RectShape(left,top,right,bottom,true);
    //          newRectPosition.set(key,aRectShape);
    //
    //          d3.select('#' + key).attr('x', left);
    //          d3.select('#' + key).attr('y', top);
    //          d3.select('#' + key + 'R').attr('x', left);
    //          d3.select('#' + key + 'R').attr('y', top);
    //          startX = startX + $('#'+key).width();
    //          updateSmLine(key);
    //     });
    // }
    // if(direction == 'bottom'){
    //     startX = reference_rect.right;
    //     startY = reference_rect.bottom;
    //     rectPosition.forEach((value,key,self) => {
    //          if(value.choosed == false || reference_id == key) return;
    //          var width  = $("#"+key).width();
    //          var height = $("#"+key).height();
    //          var left = startX
    //          var right = left + width
    //          // var bottom = Math.max(design_screen_height/2.0 + allRectHeight/(numofRect*2.0),design_screen_height/2.0 + maxRectHeight/2.0)
    //          var bottom = startY
    //          var top = bottom - height
    //
    //          aRectShape = new RectShape(left,top,right,bottom,true)
    //          newRectPosition.set(key,aRectShape)
    //
    //          d3.select('#' + key).attr('x', left);
    //          d3.select('#' + key).attr('y', top);
    //          d3.select('#' + key + 'R').attr('x', left);
    //          d3.select('#' + key + 'R').attr('y', top);
    //          startX = startX + $('#'+key).width();
    //          updateSmLine(key);
    //     });
    // }
    // if(direction == 'left'){
    //     startX = reference_rect.left
    //     startY = reference_rect.bottom
    //     rectPosition.forEach((value,key,self) => {
    //          if(value.choosed == false || reference_id == key) return;
    //          var width  = $("#"+key).width();
    //          var height = $("#"+key).height();
    //          var top = startY
    //          var bottom = top + height
    //          // var left = Math.min(design_screen_width/2.0 - allRectWidth/(numofRect*2.0),design_screen_width/2.0 - maxRectWidth/2.0)
    //          var left = startX
    //          var right = left + width
    //
    //          aRectShape = new RectShape(left,top,right,bottom,true);
    //          newRectPosition.set(key,aRectShape)
    //
    //          d3.select('#' + key).attr('x', left);
    //          d3.select('#' + key).attr('y', top);
    //          d3.select('#' + key +'R').attr('x', left);
    //          d3.select('#' + key + 'R').attr('y', top);
    //         startY = startY + $('#'+key).height();
    //         updateSmLine(key);
    //     });
    // }
    // if(direction == 'right'){
    //     startX = reference_rect.right;
    //     startY = reference_rect.bottom
    //     rectPosition.forEach((value,key,self) => {
    //          if(value.choosed == false || reference_id == key) return;
    //          var width  = $("#"+key).width();
    //          var height = $("#"+key).height();
    //          var top = startY;
    //          var bottom = top + height;
    //          // var right = Math.max(design_screen_width/2.0 + allRectWidth/(numofRect*2.0),design_screen_width/2.0 + maxRectWidth/2.0)
    //          var right = startX
    //          var left = right - width;
    //          aRectShape = new RectShape(left,top,right,bottom,true);
    //          newRectPosition.set(key,aRectShape);
    //
    //          d3.select('#' + key).attr('x', left);
    //          d3.select('#' + key).attr('y', top);
    //          d3.select('#' + key + 'R').attr('x', left);
    //          d3.select('#' + key + 'R').attr('y', top);
    //          startY = startY + $('#'+key).height();
    //          updateSmLine(key);
    //     });
    // }
    // alert('here')
    // rectPosition = newRectPosition;
    // initPosition = [];
    // for(let m = 0;m<d3.selectAll('rect')[0].length;m++){
    //     let p = [];
    //     p.push(d3.selectAll('rect')[0][m]['id']);
    //     p.push(d3.selectAll('rect')[0][m]['x']['baseVal'].value);
    //     p.push(d3.selectAll('rect')[0][m]['y']['baseVal'].value);
    //     p.push(d3.selectAll('rect')[0][m]['width']['baseVal'].value);
    //     p.push(d3.selectAll('rect')[0][m]['height']['baseVal'].value);
    //     initPosition.push(p);
    // }
    resetfilterByViews();
    query();

    // if(cutRec_flag === false){
    //     cutRecProject();
    // }
    recordPathUpdate();

}

function sort(direction, rect_set){
    let array_obj = Array.from(rect_set);
    array_obj.sort(function(a, b){
        let a_comp = comp(direction, a);
        let b_comp = comp(direction, b);

        if(a_comp < b_comp){
            return -1;
        } else if (a_comp > b_comp){
            return 1;
        }

        return 0;
    });

    return array_obj;
}

function comp(direction, rect){
    if (direction == 'top' || direction == 'bottom') {
       return rect[1].left;
    } else
        return rect[1].top;
}

function reposition(obj, left_bound, right_bound, y ,direction){
    let key = obj[0];
    let rect = obj[1];
    let x_view,y_view;
    if(direction === 'top'){
        x_view = Math.max(rect.left, left_bound);
        x_view = Math.min(x_view, right_bound);
        y_view = y;
    }
    // if(direction === 'bottom'){
    //     x_view = Math.max(rect.left, left_bound);
    //     x_view = Math.min(x_view, right_bound);
    //     y_view = y;
    // }
    if(direction === 'left'){
        y_view = Math.max(rect.top, left_bound);
        y_view = Math.min(y_view, right_bound);
        x_view = y;
    }

    console.log(key+" x:"+x_view+" y:" +y_view);

    d3.select('#' + key).attr('x', x_view).attr('y', y_view);
    d3.select('#' + key + 'R').attr('x', x_view).attr('y', y_view);
    let aRectShape = new RectShape(x_view,y_view,x_view+rect.right-rect.left,y_view+rect.bottom-rect.top)
    rectPosition.set(key,aRectShape)
    if(shift_chosed_list.size>1)
        shift_chosed_list.set(key,aRectShape)
    else
        lasso_rect_set.set(key,aRectShape)
    if(direction === 'top'){
        return x_view + (rect.right - rect.left);
    }else if(direction === 'left'){
        return y_view + (rect.bottom - rect.top);
    }
    

}