let color_diversity = [['#a6cee3', '#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6'],
    // ['#1f78b4', '#a6cee3','#33a02c','#b2df8a','#fb9a99'],
    ["#80b1d3",'#b3de69','#fb9a99','#fdbf6f','#bc80bd'],
    ['#acd98d','#82853a','#ffb877','#b85a0d','#ffd949','#fa9fb5','#3bb7cc','#31a151','#ff7e0e','#85b4a9','#97d9e3','#cd6577','#fff7bc','#3690c0']];
let colorData = [[2011,2012,2013,2014,2015,2016,2017,2018,2019],['VAST','InfoVis','SciVis','EuroVis','PacificVis'],["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree and Network (Graph)", "Grid/Matrix", "Line", "Map", "Point", "Table", "Text",'SciVis','Panel']];
let domainData = [[2011,2012,2013,2014,2015,2016,2017,2018,2019],['VAST','InfoVis','SciVis','EuroVis','PacificVis'],["Area", "Bar", "Circle", "Diagram", "Distribution", "Tree and Network (Graph)", "Grid/Matrix", "Line", "Map", "Point", "Table", "Text Based",'SciVis','Panel']];
let viewTypeAbb = ["Area", "Bar", "Circle", "Diag.", "Distri.", "Graph", "Grid", "Line", "Map", "Point", "Table", "Text",'SciVis','Panel'];
let yearAbb = [2011,'\'12','\'13','\'14','\'15','\'16','\'17', '\'18','\'19'];
let metricsData = ['year','venue','domain_viewType'];
let legendText = ['Year:','Venue:','Dominant Type'];
let lgText = ['Year:','Venue:','ViewType:'];
let legendXGlobal = document.getElementsByClassName('svg')[0].clientWidth;
let legendX = [legendXGlobal*0.68,legendXGlobal*0.72,legendXGlobal*0.7];
let legendY = -69;
let legendMargin = [37,68,30];
let legendR = 12;
let legendFontSize = '16px';

let legendTextMove = [legendXGlobal*0.68 -legendR*5,legendXGlobal*0.72 -legendR*7,legendXGlobal*0.7 -legendR*10];
let legendTextMoveY = [legendY+95+legendR*0.8,legendY+95+legendR*0.8,legendY+95+legendR*0.8];


function default_setting(i) {
    d3.selectAll('.legend').remove();
    d3.select('#metric'+default_set).style('fill','#BDBDBD');
    delDetail();
    AR_DI(i);
    gradualChangeColor(colorData[i], domainData[i], color_diversity[i], i);

}

function metricButton(metric) {
    let metricIndex = metrics.indexOf(metric);
        d3.selectAll('.legend').remove();
        delDetail();

        // let metricIndex = metrics.indexOf(metric);
        metricButtonLogic(metricIndex);

        AR_DI(metricIndex);
        gradualChangeColor(colorData[metricIndex], domainData[metricIndex], color_diversity[metricIndex], metricIndex)

}

function AR_DI(item) {


    for(let i = 0;i<$('.barG').length;i++){
        let barId = $('.barG')[i]['id'];
        let select_circle = [];
        let select_item = [];
        let barGChildren = $('.barG')[i].children;

        for (let j = 3; j < barGChildren.length; j++){
            let circle_item = {};
            let select_circle_item = {};
            circle_item.id = barGChildren[j].id;

            for (let m = 0; m < input_data.length; m++) {
                if (circle_item.id == (input_data[m]['doi']+'r')) {
                    if (item == 2) {
                        circle_item.value = input_data[m][metricsData[item]];
                        circle_item.data = input_data[m];
                    } else if(item == 1) {
                        circle_item.value = input_data[m][metricsData[item]];
                        circle_item.data = input_data[m];
                    } else{
                        circle_item.value = parseFloat(input_data[m][metricsData[item]]);
                        circle_item.data = input_data[m];
                    }
                }
            }
            select_item.push(circle_item);

            select_circle_item.cx = barGChildren[j]['cx']['baseVal'].value;
            select_circle_item.cy = barGChildren[j]['cy']['baseVal'].value;
            select_circle_item.r = barGChildren[j]['r']['baseVal'].value;
            select_circle.push(select_circle_item);
        }

        // select_item.sort((a,b)=>b.value-a.value);
        let newOrderedArr = [];
        // //排序
        for(let i = 0;i<domainData[item].length;i++){
            for (let j = 0;j<select_item.length;j++){
                if(select_item[j].value === domainData[item][i]){
                    newOrderedArr.push(select_item[j])
                }
            }
        }
        select_item = newOrderedArr;


        d3.select("#"+barId).selectAll('circle').remove();
        for (let m = 0; m < select_item.length; m++) {
            let circle_x = parseFloat(select_circle[m].cx);
            let circle_y = parseFloat(select_circle[m].cy);
            let circle_r = parseFloat(select_circle[m].r);
            let circle_id = select_item[m].id;

            d3.select('#' + barId)
                .append('circle')
                .attr('cx',circle_x)
                .attr('cy',circle_y)
                .attr('r',circle_r)
                .attr('id',circle_id)
                .attr('fill', '#21578a')
                .on('mouseover', function (k) { detailView(select_item[m].data, circle_x, circle_y)});
        }
    }
}


function gradualChangeColor(CD, DD, CM, flag) {
//CD 数据范围， CM 数据映射颜色 DD映射的数据
    let svg_width = document.getElementsByClassName('svg')[0].clientWidth;

    // let color_test = d3.scale.threshold()
    //     .domain(DD)
    //     .range(CM);
    let color_test = d3.scale.ordinal()
        .domain(DD)
        .range(CM);


    for (let i = 0; i < $('circle').length; i++) {
        let circle_name = $('circle')[i].id;
        for (let j = 0; j < input_data.length; j++) {
            if (circle_name == input_data[j]['doi'] + 'r') {
                if (flag == 0) {
                    let circle_value = input_data[j]['year'];
                    document.getElementById(circle_name).style = "fill:" + color_test(circle_value);
                }
                if (flag == 1){
                    let circle_value = input_data[j]['venue'];
                    document.getElementById(circle_name).style = "fill:" + color_test(circle_value);
                }

                continue;
            }
        }
    }
    let svg = d3.select('svg');
    d3.select('.legendText').remove();
    svg.append('text').attr('x', function (){
        return legendTextMove[flag];
    }).style('font-weight','bold')
        .style('font-size', legendFontSize)
        .attr('y', legendTextMoveY[flag])
        .attr('class','legendText')
        .text(function () {
            return lgText[flag];
        });

    for (let i = 0; i < CD.length; i++) {
        let g = svg.append('g')
            .attr('class', 'legend')
            .attr("transform", "translate(0,100)");
        g.append('circle')
            .attr('id', 'legend')
            .attr('cx', legendX[flag] + i*(legendMargin[flag]+legendR))
            .attr('cy', legendY)
            .attr('r',legendR)
            // .attr('width', legendWidth)
            // .attr('height', legendHeight)
            .style('fill', function(){
                return color_test(CD[i]);});

        g.append('text')
            .attr('x', (legendX[flag] + i*(legendMargin[flag]+legendR)))
            .attr('y', legendY+legendR)
            .attr('alignment-baseline','hanging')
            .attr('text-anchor','middle')
            .style('fill','black')
            .style('font-size',legendFontSize)
            .text(function (){
                if(flag===1){return CD[i];}
                if(flag===0) {return yearAbb[i];}
            });
    }
};

function metricButtonLogic(i) {
    if(i !== default_set){
        d3.select('#metric'+default_set).style('fill','#DCDCDC');
        d3.select('#metric'+i).style('fill','#BDBDBD');
        default_set = i;
    }
}

