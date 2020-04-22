// let blob = new Blob(["欢迎访问 hangge.com"], {type: "text/plain;charset=utf-8"});
// saveAs(blob, "文件导出测试.txt");
let recordFlag = 0;
let time1,time2,timeDiff,minutes,seconds,time;
let recordExperiement;
function record(iconIndex) {
    recordFlag += 1;
    let time = new Date();
    if(recordFlag === 1){
        alert('Start experiment!');
        recordFlag = true;
        $('#imgButton' + iconIndex).attr('src',iconImgPath + iconBox[iconIndex] + '_off.png');
        time1 = new Date();
    }
    if(recordFlag === 2){
        recordExperiement = {};
        alert('Experiment end!');
        recordFlag = false;
        $('#imgButton' + iconIndex).attr('src',iconImgPath + iconBox[iconIndex] + '_on.png');
        time2 = new Date();
        timeDiff = time2.getTime() - time1.getTime();
        minutes = parseInt((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        seconds = (timeDiff) / 1000;
        time = seconds;
        recordExperiement['time'] = time;
        let positionExperiment = [];
        console.log('viewtype'+ viewTypeTime);
        for(let i = 0;i<$('.svg')[0].childNodes.length;i++){
            let item1Experiment =[];
            if($('.svg')[0].childNodes[i].tagName == 'g'){
                for (let j = 0;j< $("#" + $('.svg')[0].childNodes[i]['id']).children().length;j++){
                    let itemExperiment ={};
                    let nodes = $('.svg')[0].childNodes[i].childNodes;
                    if(nodes[j].tagName == 'rect'){

                        itemExperiment['id'] = nodes[j]['id'];
                        itemExperiment['width'] = nodes[j]['width']['baseVal'].value;
                        itemExperiment['height'] = nodes[j]['height']['baseVal'].value;
                        itemExperiment['className'] = nodes[j]['className']['baseVal'];
                        itemExperiment['x'] = nodes[j]['x']['baseVal'].value;
                        itemExperiment['y'] = nodes[j]['y']['baseVal'].value;


                    }
                    if(nodes[j].tagName == 'line'){
                        itemExperiment['id'] = nodes[j]['id'];
                        itemExperiment['class'] = nodes[j]['className']['baseVal'];
                        itemExperiment['tagName'] = nodes[j].tagName;
                        itemExperiment['x1'] = nodes[j]['x1']['baseVal'].value;
                        itemExperiment['x2'] = nodes[j]['x2']['baseVal'].value;
                        itemExperiment['y1'] = nodes[j]['y1']['baseVal'].value;
                        itemExperiment['y2'] = nodes[j]['y2']['baseVal'].value;
                    }
                    if(JSON.stringify(itemExperiment) !== "{}"){
                        item1Experiment.push(itemExperiment);
                    }

                }
            }
            if(item1Experiment.length !== 0){
                positionExperiment.push(item1Experiment);
            }


        }
        recordExperiement['views'] = positionExperiment;
        recordExperiement['usageApply'] = usageApply;
        recordExperiement['usageApplyid'] = usageApplyid;
        let blob = new Blob([JSON.stringify(recordExperiement)], { type: "" });
        saveAs(blob, "log.json");
    }


}