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
            console.log('testTile');
            console.log(filter_list);
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

        for (let i = 2; i<=10;i++){
            let flag0= 0;
            for (let index = 0; index < filter_list[0].length; index++) {
                if(i==filter_list[0][index]){ flag0=1;}
            }
            if(flag0) {
                $('#v'+i)
                    .css('background','#4B677B')
                    .css('color','#ffffff')
                    .css('font-weight','bold');
                // $('#v'+i)[0].children[0]['style'].color ='#252525';
                // $('#v'+i)[0].children[0]['style'].fontWeight = 'bold';
            } else {
                $('#v'+i)
                    .css('background','#ffffff')
                    .css('color','#787878')
                    .css('font-weight','normal');

                // $('#v'+i)[0].children[0]['style'].color ='#252525';
                // $('#v'+i)[0].children[0]['style'].fontWeight ='normal';
            }
        }
};

