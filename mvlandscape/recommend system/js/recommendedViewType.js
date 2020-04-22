
let recommendViewTypeFlag= -1;
let recommendViewTypeItem;
let recommendViewTypeSpace = [25,20,25];

let testList;
let recommendViewTypeLength = 8;
let edgeNum = [2,2,2,2];

function recommendViewType(viewName) {

    calRecommendViewType(viewName);

    let x = $('#'+viewName)[0]['x']['baseVal'].value;
    let y = $('#'+viewName)[0]['y']['baseVal'].value;
    let width = $('#'+viewName)[0]['width']['baseVal'].value;
    let height = $('#'+viewName)[0]['height']['baseVal'].value;
    let arrWidth = new Array(recommendViewTypeLength);
    let arrHeight = new Array(recommendViewTypeLength);
    let arrX = new Array(recommendViewTypeLength);
    let arrY = new Array(recommendViewTypeLength);
    let arrX1 =  new Array(recommendViewTypeLength);
    let arrY1 = new Array(recommendViewTypeLength);
    let arrX2 =  new Array(recommendViewTypeLength);
    let arrY2 = new Array(recommendViewTypeLength);

//    宽高
    let reViewWidths = [],reViewHeights = [];
    for (let i = 0;i<recommendViewTypeLength;i++){
        reViewWidths.push(width/2.3-i*2);
        reViewHeights.push(height/2.3 - i*2);

    }

//    版本2
    for(let i = 0;i<recommendViewTypeLength;i++){
        let remainder = i/2;
        remainder = parseInt(remainder);
        arrWidth[i] = reViewWidths[i] ;
        arrHeight[i] = reViewHeights[i];
        if(remainder ===0){

                arrX[i] = x+ i*(recommendViewTypeSpace[0] +arrWidth[i]);
                arrY[i] = y-arrHeight[i] - recommendViewTypeSpace[1];
                arrX1[i] = arrX2[i] = arrX[i] + arrWidth[i]*0.5;
                arrY1[i] = y-recommendViewTypeSpace[1];
                arrY2[i] = y;


            }
            if(remainder === 1){
                arrX[i] = x+width + recommendViewTypeSpace[1];
                arrY[i] = y+(i-2)*(arrHeight[i]+recommendViewTypeSpace[0]);
                arrX1[i] = x+width;
                arrX2[i] = x+width + recommendViewTypeSpace[1];
                arrY1[i] =arrY2[i]= arrY[i] + arrHeight[i]*0.5;
            }
            if(remainder === 2){
                arrX[i] = x+ (5-i)*(recommendViewTypeSpace[0] +arrWidth[i]);
                arrY[i] = y+height + recommendViewTypeSpace[1];
                arrX1[i] = arrX2[i] = arrX[i] + arrWidth[i]*0.5;
                arrY1[i] = y+height;
                arrY2[i] = y+height+recommendViewTypeSpace[1];
            }

            if(remainder===3 || remainder ==4){
                arrX[i] = x - recommendViewTypeSpace[1] - arrWidth[i];
                arrY[i] = y+(7-i)*(arrHeight[i]+recommendViewTypeSpace[0]);
                arrX1[i] = x;
                arrX2[i] = x- recommendViewTypeSpace[1];
                arrY1[i] =arrY2[i]= arrY[i] + arrHeight[i]*0.5;

            }
        }


//画图
    for(let i = 0;i<recommendViewTypeLength;i++){
        let remainder = i/2;
        remainder = parseInt(remainder);
        let recViewTypeIndex = compareViewType1.indexOf(testList[i]);
        let g = d3.select('.svg')
            .append('g')
            .attr('class', 'recommendView')
            .attr('id', testList[i]+'rg');
        g.append('rect')
            .attr('width',arrWidth[i])
            .attr('height', arrHeight[i])
            .attr('x',arrX[i] )
            .attr('y', arrY[i])
            //0304
            .style('fill',viewTypeColor[recViewTypeIndex])
            // .style('fill', '#ffffff')
            .style('stroke','red')
            .style('stroke-dasharray',5)
            .style('stroke-width',1)
            .attr('id', testList[i]+'rr');
        g.append('image')
        //0310
        // .attr("preserveAspectRatio","none")
        // 0310
            .attr('xlink:href', iconImgPath +viewType[recViewTypeIndex] + '.png')
            // .attr('xlink:href', iconImg1Path)
            .attr('width', arrWidth[i])
            .attr('height',  arrHeight[i])
            .attr('x',arrX[i] )
            .attr('y', arrY[i])
            .attr('id', testList[i]+remainder+'img')
            .attr('class','recommendView');

        drawLine(arrX1[i],arrY1[i],arrX2[i],arrY2[i],'black','2px');
    }
}


function calRecommendViewType(viewName) {

    let viewIndex = compareViewType1.indexOf(viewName.substring(0,3));
    let list1 = recommendViewTypeData[viewIndex];

    let keysSorted = Object.keys(list1).sort(function(a,b){return list1[a]-list1[b]}).reverse();
    testList = keysSorted.map(function (item) { return item.substring(0,3);
    });
}
