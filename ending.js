'use strict';
/* ═══════════════════════════════════════════════════
   ENDING.JS — Premium Cinematic Farewell
   ═══════════════════════════════════════════════════ */

const ES = {
    running:false,rafId:null,startTime:null,
    audio:null,canvas:null,ctx:null,W:0,H:0,
    particles:[],flowers:[],fireworks:[],
    butterflies:[],stars:[],fwTimer:null
};

function endingInit(){
    buildDOM();
    // Don't grab canvas here — grab it fresh in startEnding when overlay is visible
    window.addEventListener('resize',resizeCanvas,{passive:true});
    // Use event delegation so the button works even before the letter section is visible
    document.body.addEventListener('click',function(e){
        if(e.target.closest('#endingLaunchBtn'))onLaunchClick(e);
        if(e.target.closest('#endingClose'))onEndingClose();
    });
}
function resizeCanvas(){
    if(!ES.canvas)return;
    ES.W=ES.canvas.width=window.innerWidth;
    ES.H=ES.canvas.height=window.innerHeight;
}

function buildDOM(){
    if(document.getElementById('endingOverlay'))return;
    const fade=document.createElement('div');fade.id='endingPageFade';
    document.body.appendChild(fade);
    const ov=document.createElement('div');ov.id='endingOverlay';
    ov.innerHTML=`<div id="endingSky"></div><canvas id="endingCanvas"></canvas>
<div id="endingAurora"><div class="aurora-band"></div><div class="aurora-band"></div></div>
<div class="lens-flare" style="width:18vw;height:18vw;top:8%;left:12%;"></div>
<div class="lens-flare" style="width:10vw;height:10vw;top:18%;right:14%;animation-delay:3s;opacity:.35;"></div>
<div id="endingContent">
<h2 class="ending-heading" id="eh1">Thank You, Samruddhi 🌸</h2>
<p class="ending-para" id="ep1">Thank you for being such a memorable part of my college journey.</p>
<p class="ending-para" id="ep2">Some people become part of our story for only a chapter,<br>yet remain in our memories for a lifetime.</p>
<p class="ending-para" id="ep3">I genuinely wish you happiness, success,<br>and a beautiful future.</p>
<p class="ending-para" id="ep4">Take care.</p>
<svg id="endingSignatureSvg" viewBox="0 0 260 60" xmlns="http://www.w3.org/2000/svg">
<path id="sigPath" d="M18 42 C22 20,30 18,36 30 C40 38,38 44,34 44 C28 44,26 36,32 30 M44 44 L48 18 M44 32 L56 32 M58 20 C58 20,55 44,62 44 C68 44,68 32,64 32 C60 32,58 44,66 44 M72 44 L76 18 M80 28 C78 28,74 44,80 44 C86 44,86 28,80 28 M92 28 C90 28,86 44,92 44 C98 44,100 32,96 32 C92 32,90 44,98 44 M104 20 L104 44 M104 20 C108 20,114 22,114 28 C114 34,108 34,104 34 M120 28 C118 28,114 44,120 44 C126 44,128 28,120 28"/></svg>
<p class="ending-final-quote" id="efq">Thank you for taking the time to read this.</p>
</div>
<button id="endingClose" aria-label="Close">✕</button>`;
    document.body.appendChild(ov);
}

function onLaunchClick(e){
    if(ES.running)return; ES.running=true;
    const btn=e.target.closest('#endingLaunchBtn');
    const rip=document.createElement('span'); rip.className='btn-ripple';
    const rc=btn.getBoundingClientRect(),sz=Math.max(rc.width,rc.height)*2;
    rip.style.cssText=`width:${sz}px;height:${sz}px;left:${e.clientX-rc.left}px;top:${e.clientY-rc.top}px`;
    btn.appendChild(rip); setTimeout(()=>rip.remove(),750);
    btn.classList.add('btn-used');
    const pa=document.getElementById('audioPlayer');
    if(pa&&!pa.paused){
        const sv=pa.volume,t0=performance.now();
        (function fo(now){const p=Math.min((now-t0)/1200,1);pa.volume=sv*(1-p);
            if(p<1)requestAnimationFrame(fo);else{pa.pause();pa.volume=sv;}})(performance.now());
    }
    const fade=document.getElementById('endingPageFade');
    fade.classList.add('fade-active');
    setTimeout(()=>{startEnding();fade.classList.remove('fade-active');},1000);
}

function startAudio(){
    if(!ES.audio){ES.audio=new Audio('assets/Chaudhary_0.mp3');ES.audio.preload='auto';}
    if(!ES.audio.paused)return;
    ES.audio.currentTime=0; ES.audio.volume=0;
    ES.audio.play().then(()=>{
        const t0=performance.now(),target=0.75,dur=2500;
        (function fi(now){const p=Math.min((now-t0)/dur,1);ES.audio.volume=p*target;
            if(p<1)requestAnimationFrame(fi);})(performance.now());
    }).catch(()=>{});
}

function startEnding(){
    const ov=document.getElementById('endingOverlay');
    ov.classList.add('ending-active');
    ov.style.opacity='0'; ov.style.transition='opacity 1.5s ease';
    // Grab canvas fresh now that overlay is in DOM and visible
    ES.canvas=document.getElementById('endingCanvas');
    ES.ctx=ES.canvas.getContext('2d');
    resizeCanvas();
    requestAnimationFrame(()=>{ov.style.opacity='1';});
    startAudio();
    initStars(); initParticles(); initFlowers();
    ES.fireworks=[]; ES.butterflies=[];
    ES.startTime=performance.now();
    ES.rafId=requestAnimationFrame(loop);
    const sky=document.getElementById('endingSky');
    setTimeout(()=>sky.classList.add('phase-golden'),1000);
    setTimeout(()=>sky.classList.add('phase-twilight'),5500);
    setTimeout(()=>sky.classList.add('phase-night'),10000);
    setTimeout(()=>document.getElementById('endingAurora').classList.add('aurora-visible'),11000);
    setTimeout(startFireworks,1500);
    setTimeout(()=>{
        const c=document.getElementById('endingContent');
        if(c)c.classList.add('content-visible');
        revealText();
    },3000);
    setTimeout(initButterflies,9000);
    setTimeout(()=>document.getElementById('endingClose').classList.add('close-visible'),5000);
}

function loop(now){
    const el=now-ES.startTime,{ctx,W,H}=ES;
    ctx.clearRect(0,0,W,H);
    drawStars(ctx,el); drawParticles(ctx,el);
    drawFlowers(ctx,el); drawFireworks(ctx);
    drawButterflies(ctx,el);
    ES.rafId=requestAnimationFrame(loop);
}

function initStars(){
    ES.stars=Array.from({length:200},()=>({
        x:Math.random(),y:Math.random()*0.65,
        r:0.5+Math.random()*1.6,
        tw:Math.random()*Math.PI*2,sp:0.5+Math.random()*1.4
    }));
}
function drawStars(ctx,el){
    const t=el/1000,a=Math.max(0,Math.min(1,(t-9)/5));
    if(a<=0)return;
    ES.stars.forEach(s=>{
        const op=a*(0.4+0.6*Math.abs(Math.sin(s.tw+t*s.sp)));
        ctx.beginPath();ctx.arc(s.x*ES.W,s.y*ES.H,s.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,248,220,${op})`;ctx.fill();
    });
}

function initParticles(){
    const C=['212,175,55','255,240,180','255,200,180','200,180,255'];
    ES.particles=Array.from({length:250},()=>({
        x:Math.random()*ES.W,y:Math.random()*ES.H,
        vx:(Math.random()-.5)*.22,vy:-.12-Math.random()*.38,
        r:.8+Math.random()*2.4,col:C[Math.floor(Math.random()*C.length)],
        ph:Math.random()*Math.PI*2,op:.3+Math.random()*.5
    }));
}
function drawParticles(ctx,el){
    const t=el/1000;
    ES.particles.forEach(p=>{
        p.x+=p.vx+Math.sin(t*.35+p.ph)*.2; p.y+=p.vy;
        if(p.y<-5){p.y=ES.H+5;p.x=Math.random()*ES.W;}
        const a=p.op*(.55+.45*Math.sin(t*1.2+p.ph));
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.col},${a})`;ctx.fill();
    });
}

const PC=[['#fff8f0','#f9c8d0'],['#e8b0bc','#c04060'],
    ['#ffd0e0','#f08098'],['#ffffff','#e8e8e8'],['#f7c0d0','#e06080']];

function mkF(){return{
    x:Math.random()*(ES.W||innerWidth),
    y:-(20+Math.random()*80),
    vx:(Math.random()-.5)*1.2,vy:.8+Math.random()*1.8,
    rot:Math.random()*Math.PI*2,rs:(Math.random()-.5)*.055,
    sz:9+Math.random()*22,tp:Math.floor(Math.random()*5),
    op:.6+Math.random()*.35,sw:Math.random()*Math.PI*2,sa:.4+Math.random()*1.0
};}

function initFlowers(){
    const H=ES.H||innerHeight;
    ES.flowers=Array.from({length:80},()=>{const f=mkF();f.y=Math.random()*H;return f;});
}

function drawFlowers(ctx,el){
    const t=el/1000;
    for(const f of ES.flowers){
        f.x+=f.vx+Math.sin(t*.5+f.sw)*f.sa; f.y+=f.vy; f.rot+=f.rs;
        if(f.y>ES.H+40){f.y=-(15+Math.random()*60);f.x=Math.random()*ES.W;f.vx=(Math.random()-.5)*1.2;f.vy=.8+Math.random()*1.8;f.tp=Math.floor(Math.random()*5);f.sz=9+Math.random()*22;f.op=.6+Math.random()*.35;}
        if(f.x<-50)f.x=ES.W+30; if(f.x>ES.W+50)f.x=-30;
        ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.rot);ctx.globalAlpha=f.op;paintP(ctx,f.tp,f.sz);ctx.restore();
    }
    ctx.globalAlpha=1;
}

function paintP(ctx,tp,sz){
    const[c1,c2]=PC[tp];
    const g=ctx.createRadialGradient(0,0,0,0,0,sz);
    g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;
    if(tp===2||tp===4){for(let i=0;i<5;i++){ctx.save();ctx.rotate((i/5)*Math.PI*2);ctx.beginPath();ctx.ellipse(0,-sz*.5,sz*.27,sz*.46,0,0,Math.PI*2);ctx.fill();ctx.restore();}}
    else{ctx.beginPath();ctx.ellipse(0,0,sz*.35,sz*.68,0,0,Math.PI*2);ctx.fill();}
}

function startFireworks(){if(!ES.running)return;launchFW();ES.fwTimer=setTimeout(startFireworks,800+Math.random()*1200);}
function launchFW(){
    const C=['#d4af37','#ffd970','#fffadc','#f7c5d0','#e8d0ff','#ffe4b8','#fff'];
    const cx=ES.W*(.15+Math.random()*.7),cy=ES.H*(.08+Math.random()*.38);
    const col=C[Math.floor(Math.random()*C.length)],pts=[],n=60+Math.floor(Math.random()*40);
    for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+Math.random()*.3,sp=1.5+Math.random()*3.5;pts.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1,life:1,decay:.012+Math.random()*.012,r:1.6+Math.random()*2.4,col});}
    for(let i=0;i<20;i++){const a=Math.random()*Math.PI*2,sp=.4+Math.random()*1;pts.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,decay:.028+Math.random()*.02,r:.8+Math.random()*1.2,col:'#fff'});}
    ES.fireworks.push(pts);
}
function drawFireworks(ctx){
    ES.fireworks=ES.fireworks.filter(pts=>{
        let alive=false;
        for(const p of pts){if(p.life<=.02)continue;alive=true;p.x+=p.vx;p.y+=p.vy;p.vy+=.06;p.vx*=.975;p.life-=p.decay;ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);ctx.fillStyle=p.col;ctx.globalAlpha=Math.max(0,p.life*.85);ctx.fill();}
        ctx.globalAlpha=1;return alive;
    });
}

function initButterflies(){
    ES.butterflies=Array.from({length:10},()=>({x:Math.random()*ES.W,y:ES.H*(.25+Math.random()*.55),vx:(Math.random()-.5)*1,vy:(Math.random()-.5)*.5,wp:Math.random()*Math.PI*2,ws:3.5+Math.random()*3,sz:8+Math.random()*10,op:0}));
}
function drawButterflies(ctx,el){
    if(!ES.butterflies.length)return;
    const t=el/1000;
    for(const b of ES.butterflies){
        b.op=Math.min(.65,b.op+.006);b.x+=b.vx+Math.sin(t*.55+b.wp)*.45;b.y+=b.vy+Math.cos(t*.4+b.wp)*.28;
        if(b.x<-30)b.x=ES.W+20;if(b.x>ES.W+30)b.x=-20;if(b.y<15)b.vy=Math.abs(b.vy);if(b.y>ES.H-15)b.vy=-Math.abs(b.vy);
        const wg=Math.abs(Math.sin(t*b.ws+b.wp));
        ctx.save();ctx.translate(b.x,b.y);ctx.globalAlpha=b.op;
        for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*b.sz*wg,0,b.sz*.88,b.sz*.52,s*.4,0,Math.PI*2);ctx.fillStyle='rgba(255,248,215,.5)';ctx.fill();ctx.strokeStyle='rgba(212,175,55,.45)';ctx.lineWidth=.8;ctx.stroke();}
        ctx.beginPath();ctx.ellipse(0,0,1.8,b.sz*.32,0,0,Math.PI*2);ctx.fillStyle='rgba(212,175,55,.9)';ctx.fill();
        ctx.restore();
    }
    ctx.globalAlpha=1;
}

function revealText(){
    const show=(id,d)=>setTimeout(()=>document.getElementById(id)?.classList.add('line-visible'),d);
    show('eh1',0);show('ep1',900);show('ep2',1900);show('ep3',3000);show('ep4',4000);
    setTimeout(()=>{
        const svg=document.getElementById('endingSignatureSvg'),path=document.getElementById('sigPath');
        if(!svg||!path)return;
        svg.classList.add('sig-visible');
        setTimeout(()=>{path.classList.add('sig-draw');setTimeout(sigSparkle,2600);},300);
    },5200);
    show('efq',8200);
}

function sigSparkle(){
    const svg=document.getElementById('endingSignatureSvg');if(!svg)return;
    const rc=svg.getBoundingClientRect();
    for(let i=0;i<8;i++){
        const sp=document.createElement('div');
        sp.style.cssText=`position:fixed;z-index:9200;pointer-events:none;font-size:${.55+Math.random()*.5}rem;color:#d4af37;user-select:none;left:${rc.right-30+(Math.random()-.5)*50}px;top:${rc.top+rc.height/2+(Math.random()-.5)*24}px;animation:cursorPetalFade 950ms ease-out forwards;--cp-rot:${Math.random()*60-30}deg;--cp-dy:-${1+Math.random()*1.8}rem;--cp-dur:950ms;`;
        sp.textContent='✦';document.body.appendChild(sp);setTimeout(()=>sp.remove(),1000);
    }
}

function onEndingClose(){
    if(ES.audio&&!ES.audio.paused){const a=ES.audio,sv=a.volume,t0=performance.now();(function fo(now){const p=Math.min((now-t0)/1400,1);a.volume=sv*(1-p);if(p<1)requestAnimationFrame(fo);else a.pause();})(performance.now());}
    clearTimeout(ES.fwTimer);cancelAnimationFrame(ES.rafId);
    ES.running=false;ES.fireworks=[];ES.butterflies=[];
    const ov=document.getElementById('endingOverlay');
    ov.style.transition='opacity 1s ease';ov.style.opacity='0';
    setTimeout(()=>{
        ov.classList.remove('ending-active');ov.style.opacity='';
        ['eh1','ep1','ep2','ep3','ep4','efq'].forEach(id=>document.getElementById(id)?.classList.remove('line-visible'));
        document.getElementById('endingSignatureSvg')?.classList.remove('sig-visible');
        document.getElementById('sigPath')?.classList.remove('sig-draw');
        document.getElementById('endingContent')?.classList.remove('content-visible');
        document.getElementById('endingSky')?.className='';
        document.getElementById('endingAurora')?.classList.remove('aurora-visible');
        document.getElementById('endingClose')?.classList.remove('close-visible');
        document.getElementById('endingLaunchBtn')?.classList.remove('btn-used');
        ES.canvas=null; ES.ctx=null;
        ES.running=false;
    },1050);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',endingInit);}else{endingInit();}
