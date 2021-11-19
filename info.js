const info = document.getElementById('info');
info.innerHTML = `
    <div>
        <img src="/images/Zengwei.jpeg" width="150px" style="margin:0 auto"/>
    </div>
    <p>
        <b style="font-weight:bold; font-size:13px">ZENG Wei (曾伟), Ph.D.</b>
    </p>

    <p>
        <h4>Assistant Professor</h4>
        <a href="https://hkust-gz.edu.cn/">The Hong Kong University of Science and Technology (Guangzhou)</a><br/>
    </p>

    <p>
        Nansha district, Guangzhou, Guangdong Province, China  <br/>
            <br/>
        Contact: weizeng (at) ust.hk
    </p>

    <p>
        <a href="/images/CV_Zeng%20Wei.pdf">
            <img src="/images/cv.png" width="25px" style="float:left;margin-left:5px;margin-right:12px;"/>
        </a>
        <a href="https://scholar.google.com/citations?user=kTZhR2EAAAAJ&hl=en">
            <img src="/images/gscholar.png" width="25px" style="float:left;margin-right:12px;"/>
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