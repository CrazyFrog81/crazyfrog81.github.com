const info = document.getElementById('info');
info.innerHTML = `
    <div>
        <img src="/images/Zengwei.jpeg" width="150px" style="margin:0 auto"/>
    </div>
    <p>
        <b style="font-weight:bold; font-size:13px">ZENG Wei (曾伟), Ph.D.</b>
    </p>

    <p>
        <h4>Associate Professor</h4>
        <a href="http://www.siat.ac.cn/">Shenzhen Institute of Advanced Technology,</a><br/>
        <a href="http://www.cas.cn/">Chinese Academy of Sciences</a>
    </p>

    <p>
        1068 Xueyuan Avenue<br/>
        Shenzhen University Town<br/>
        Shenzhen, P.R.China 518055 <br/>
            <br/>
<!--        wei.zeng (at) siat.ac.cn<br/>-->
        zengwei81 (at) gmail.com
    </p>

    <p>
        <a href="https://scholar.google.com/citations?user=kTZhR2EAAAAJ&hl=en">
            <img src="/images/gscholar.png" width="25px" style="float:left;margin-left:10px;margin-right:12px;"/>
        </a>

        <a href="https://www.researchgate.net/profile/Wei_Zeng13?ev=hdr_xprf">
            <img src="/images/rg.png" width="25px" style="float:left;margin-right:12px;"/>
        </a>
    
        <a href="https://www.youtube.com/user/CrazyFrog0801/featured?view_as=subscriber">
            <img src="/images/youtube.png" width="25px" style="float:left;margin-right:12px;"/>
        </a>
    </p>
`

document.body.appendChild(info.content);