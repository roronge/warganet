export function createVillageEngine(canvas) {
  const cv = canvas;
  const g = cv.getContext('2d');
  const bub = {};
const TW=64,TH=32,BW=4,BH=3;
const FAC={1:['Balai Warga','🏛',5,'#c9a46a',24],3:['Masjid','🕌',15,'#efe9d6',22],5:['Lapangan','🎾',30,'#4fae78',1],8:['Sekolah','🏫',50,'#e9c46a',20],11:['Taman','🌳',75,'#7fc06a',1],14:['Puskesmas','🏥',100,'#f7f7f7',22],18:['Pasar','🛒',200,'#d98b5f',16],23:['Sawah','🌾',300,'#b9a45a',2],29:['Stasiun','🚉',500,'#9aa6b5',20]};
let docs=[],uid=null,sc=1,ox=0,oy=0,W,H,dpr=1,ready=false,L=null;
function rnd(s){s=(s*9301+49297)%233280;return Math.abs(s)/233280}
function layout(n){ // blocks in spiral rings, house blocks hold 6 houses
 const blocks=[],hb=[];let r=0;
 for(;;){const ring=[];
  if(r==0)ring.push([0,0]);else{for(let x=-r;x<=r;x++)ring.push([x,-r]);for(let y=-r+1;y<=r;y++)ring.push([r,y]);for(let x=r-1;x>=-r;x--)ring.push([x,r]);for(let y=r-1;y>-r;y--)ring.push([-r,y])}
  ring.forEach(b=>{const s=blocks.length;const f=FAC[s];blocks.push({bx:b[0],by:b[1],f:f?{id:s,n:f[0],e:f[1],th:f[2],c:f[3],h:f[4]}:null});if(!f)hb.push(blocks[s])});
  if(r>=2&&hb.length*6>=n+6)break;r++}
 return{blocks,hb,R:r}}
const P=(i,j)=>[(i-j)*TW/2,(i+j)*TH/2];
function poly(p,f){g.beginPath();p.forEach((q,k)=>k?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();g.fillStyle=f;g.fill()}
function shade(c,k){const n=parseInt(c.slice(1),16);const f=v=>Math.max(0,Math.min(255,Math.round(v*k)));return'#'+((1<<24)|(f(n>>16)<<16)|(f((n>>8)&255)<<8)|f(n&255)).toString(16).slice(1)}
function box(x0,y0,x1,y1,z0,z1,c){const A=P(x1,y0),B=P(x1,y1),C=P(x0,y1),T=P(x0,y0),u=q=>[q[0],q[1]-z1],d=q=>[q[0],q[1]-z0];
 poly([d(B),d(C),u(C),u(B)],shade(c,.86));poly([d(A),d(B),u(B),u(A)],shade(c,.72));poly([u(T),u(A),u(B),u(C)],c)}
const KF=[[0,'#222f66','#37448a',[20,28,85],.62,1],[5,'#2a3978','#4a4f95',[30,40,95],.55,.9],[6,'#7a8fd0','#ffbf8a',[255,170,120],.2,.35],[7.5,'#8fc3ef','#fde3bd',[255,225,180],.07,.05],[10,'#79b8f0','#cfe8fb',[255,255,255],0,0],[16,'#79b8f0','#cfe8fb',[255,255,255],0,0],[17.5,'#7aa6dc','#ffd49a',[255,195,120],.14,.08],[18.5,'#6b6bb0','#f59a6a',[235,125,105],.28,.45],[19.5,'#2a3578','#4a4590',[25,35,95],.55,.9],[24,'#222f66','#37448a',[20,28,85],.62,1]];
const hx=c=>{const n=parseInt(c.slice(1),16);return[n>>16,(n>>8)&255,n&255]},mixc=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t),rgb=(a,al)=>'rgba('+a.map(Math.round)+','+(al==null?1:al)+')';
let SIM=null,HR=12,NG=0,E={top:[120,180,240],bot:[200,230,250],tint:[255,255,255],ta:0,n:0},SH={dx:0,dy:5,al:.2},LG=[];
function env(){const d=new Date();HR=SIM!=null?SIM:d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;let k=0;while(k<KF.length-2&&HR>=KF[k+1][0])k++;
 const a=KF[k],b=KF[k+1],t=Math.max(0,Math.min(1,(HR-a[0])/(b[0]-a[0])));
 E={top:mixc(hx(a[1]),hx(b[1]),t),bot:mixc(hx(a[2]),hx(b[2]),t),tint:mixc(a[3],b[3],t),ta:a[4]+(b[4]-a[4])*t,n:a[5]+(b[5]-a[5])*t};NG=E.n;
 const day=HR>=6&&HR<=18,ang=day?(HR-6)/12*Math.PI:Math.PI*.35,c=Math.cos(ang),len=10+34*Math.abs(c);SH={dx:-c*len,dy:5+4*Math.abs(c),al:day?.26*(1-E.n*.8):.07}}
const vh=(i,j)=>Math.abs(i*73+j*191+i*j*13)%997;
const WALL=['#f3e5c8','#f7ecc0','#e6eed3','#f1d8cc','#e9e4dc'],ROOF=['#ee8a4a','#c8553d','#6f95c0','#6a9a5a','#9a7a58','#b24a3a'];
function win(P1,P2,t0,t1,z0,z1,col){const a=lp(P1,P2,t0),b=lp(P1,P2,t1);poly([[a[0],a[1]-z0],[b[0],b[1]-z0],[b[0],b[1]-z1],[a[0],a[1]-z1]],col);g.strokeStyle='rgba(60,50,40,.45)';g.lineWidth=.8;g.stroke()}
function stripes(a,b,c,d,n){g.strokeStyle='rgba(0,0,0,.14)';g.lineWidth=1;for(let k=1;k<n;k++){const t=k/n,e=lp(a,b,t),f=lp(d,c,t);g.beginPath();g.moveTo(e[0],e[1]);g.lineTo(f[0],f[1]);g.stroke()}}
function house(i,j,v){const wl=WALL[v%5],rf=ROOF[(v>>2)%6],hh=12+(v%3)*2,lit=NG>.3&&((v*7)%10)<7,wc=lit?'#ffd36a':'#8fb3cf';
 const m=.07,x0=i+m,x1=i+1-m,y0=j+m,y1=j+1-m;box(x0,y0,x1,y1,0,hh,wl);
 const A=P(x1,y0),B=P(x1,y1),C=P(x0,y1),T0=P(x0,y0),h=q=>[q[0],q[1]-hh],xm=(x0+x1)/2,r0=P(xm,y0),r1=P(xm,y1),rid=q=>[q[0],q[1]-hh-13];
 win(B,C,.1,.34,5,10,wc);win(B,C,.66,.9,5,10,wc);win(B,C,.42,.58,0,8,'#7a4a2a');win(A,B,.16,.4,5,10,wc);win(A,B,.6,.84,5,10,wc);
 poly([h(B),h(C),rid(r1)],shade(rf,.8));poly([h(A),h(B),rid(r1),rid(r0)],shade(rf,.72));stripes(h(A),rid(r0),rid(r1),h(B),5);
 poly([h(T0),h(A),rid(r0)],shade(rf,.85));poly([h(T0),rid(r0),rid(r1),h(C)],rf);stripes(h(T0),rid(r0),rid(r1),h(C),5);
 if(v%3==0)box(xm+.1,y0+.22,xm+.26,y0+.38,hh+4,hh+16,'#a65a4a');
 if(lit){const q=P(i+.5,j+.5);LG.push({x:q[0],y:q[1]-8,r:34,c:[255,185,95],a:.3})}}
const GR=[['#2a6a30','#3f8f45','#62b85e'],['#2f6f3a','#47964a','#74c068'],['#365f2c','#527f3a','#85a84c']];
function circ(x,y,r,c){g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill()}
function drawTree(t){const p=P(t.i,t.j),x=p[0],y=p[1],s=t.s,sd=t.sd,sw=Math.sin(T/900+sd)*1.3*s,gs=GR[sd%3];g.lineCap='round';
 if(t.ty==0){g.fillStyle='#5a3d22';g.fillRect(x-1.6*s,y-7*s,3.2*s,8*s);
  for(let k=0;k<3;k++){const w=(13-3*k)*s,by=y-(6+k*9)*s,ty=by-15*s,tx=x+sw*(k+1)/3;g.fillStyle=gs[0];g.beginPath();g.moveTo(tx,ty);g.lineTo(x+w,by);g.lineTo(x-w,by);g.fill();g.fillStyle=gs[1];g.beginPath();g.moveTo(tx,ty);g.lineTo(x,by);g.lineTo(x-w,by);g.fill()}}
 else if(t.ty==1||t.ty==4){g.fillStyle='#6a4a2a';g.fillRect(x-2*s,y-12*s,4*s,13*s);const k=t.ty==4?.85:1;
  circ(x+sw*.5,y-22*s,11*s*k,gs[0]);circ(x-6*s+sw,y-19*s,8*s*k,gs[1]);circ(x+6*s+sw,y-20*s,8.5*s*k,gs[1]);circ(x-3*s+sw,y-25*s,7*s*k,gs[2]);circ(x+3*s+sw*1.2,y-27*s,4*s*k,'#9bd37a');
  if(t.ty==4)for(let q=0;q<10;q++)circ(x-9*s+rnd(sd+q)*18*s+sw,y-30*s+rnd(sd+q*5)*16*s,1.8*s,sd%2?'#f4a6c0':'#f2d24c')}
 else if(t.ty==2){const tx=x+4*s+sw,ty=y-32*s;g.strokeStyle='#8a6a3a';g.lineWidth=3.4*s;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x-4*s,y-16*s,tx,ty);g.stroke();
  for(let k=0;k<7;k++){const an=k*Math.PI*2/7+.3,c=Math.cos(an),sn=Math.sin(an);g.strokeStyle=k%2?'#3f9a3a':'#58b04a';g.lineWidth=3*s;g.beginPath();g.moveTo(tx,ty);g.quadraticCurveTo(tx+c*9*s,ty-6*s+sn*3*s,tx+c*18*s,ty+sn*5*s+9*s);g.stroke()}circ(tx-1.5,ty+2,2*s,'#6a4a22');circ(tx+2,ty+3,2*s,'#6a4a22')}
 else if(t.ty==3){g.fillStyle='#5a3d22';g.fillRect(x-1.2*s,y-5*s,2.4*s,6*s);g.fillStyle=gs[0];g.beginPath();g.ellipse(x+sw*.4,y-20*s,5.5*s,18*s,0,0,7);g.fill();g.fillStyle=gs[1];g.beginPath();g.ellipse(x-1.5*s+sw*.4,y-21*s,3*s,15*s,0,0,7);g.fill()}
 else{circ(x-4*s,y-3*s,5*s,gs[0]);circ(x+4*s,y-3*s,5*s,gs[0]);circ(x,y-6*s,5.5*s,gs[1]);circ(x-2*s,y-8*s,3*s,gs[2]);if(sd%2){circ(x-3*s,y-5*s,1.4*s,'#f26a8d');circ(x+3*s,y-7*s,1.4*s,'#fff')}}}
function lamp(x,y){const p=P(x,y),on=NG>.3;g.fillStyle='rgba(0,0,0,.15)';g.beginPath();g.ellipse(p[0]+SH.dx*.3,p[1]+1,5,2,0,0,7);g.fill();
 g.strokeStyle='#2b2e38';g.lineWidth=2.2;g.lineCap='round';g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0],p[1]-30);g.lineTo(p[0]+5,p[1]-33);g.stroke();
 g.fillStyle=on?'#fff1b8':'#d6d6cc';g.beginPath();g.roundRect(p[0]+2,p[1]-35,7,5,2);g.fill();
 if(on){LG.push({x:p[0]+5,y:p[1]-32,r:46,c:[255,200,110],a:.5});LG.push({x:p[0]+5,y:p[1]+2,r:38,c:[255,190,100],a:.16,e:.5})}}
function wfall(x,y,h,w){
 poly([[x-w*.92,y-h+5],[x-w*.7,y-h-8],[x+w*.7,y-h-8],[x+w*.92,y-h+5],[x+w*.72,y+3],[x-w*.72,y+3]],'#465b61');
 poly([[x-w*1.28,y-h+7],[x-w*.72,y-h-13],[x+w*.72,y-h-13],[x+w*1.28,y-h+7],[x+w*.9,y-h+13],[x-w*.9,y-h+13]],'#74858a');
 poly([[x-w*1.08,y-h+5],[x-w*.7,y-h-7],[x+w*.7,y-h-7],[x+w*1.08,y-h+5],[x+w*.78,y-h+10],[x-w*.78,y-h+10]],'#a9b9b8');
 const gr=g.createLinearGradient(x-w,0,x+w,0);
 gr.addColorStop(0,'rgba(92,174,218,.3)');gr.addColorStop(.18,'rgba(147,218,244,.96)');
 gr.addColorStop(.52,'rgba(225,249,255,.99)');gr.addColorStop(.82,'rgba(125,205,237,.94)');gr.addColorStop(1,'rgba(75,157,205,.3)');
 g.fillStyle=gr;g.beginPath();g.moveTo(x-w*.68,y-h+1);
 g.bezierCurveTo(x-w*.48,y-h*.55,x-w*.72,y-h*.22,x-w*.62,y);
 g.lineTo(x+w*.62,y);g.bezierCurveTo(x+w*.72,y-h*.22,x+w*.48,y-h*.55,x+w*.68,y-h+1);g.closePath();g.fill();
 for(let k=0;k<11;k++){const u=k/10-.5,phase=(T/520+k*.19)%1,xx=x+u*w*1.12,yy=y-h+phase*h*.78;
  g.strokeStyle=k%3===0?'rgba(255,255,255,.9)':'rgba(239,251,255,.58)';g.lineWidth=k%3===0?2.2:1.15;
  g.lineCap='round';g.beginPath();g.moveTo(xx+Math.sin(T/300+k)*1.8,yy);
  g.bezierCurveTo(xx-u*3,yy+h*.12,xx+u*4,yy+h*.22,xx+Math.sin(T/350+k)*2,y);g.stroke()}
 const pulse=Math.sin(T/260)*2,pool=g.createRadialGradient(x,y+5,2,x,y+5,w*1.45);
 pool.addColorStop(0,'rgba(255,255,255,.9)');pool.addColorStop(.35,'rgba(190,239,250,.65)');pool.addColorStop(1,'rgba(89,177,216,0)');
 g.fillStyle=pool;g.beginPath();g.ellipse(x,y+5,w*1.45,13+pulse,0,0,7);g.fill();
 g.strokeStyle='rgba(255,255,255,.88)';g.lineWidth=2;
 for(let k=0;k<4;k++){const u=(k-1.5)*.42;g.beginPath();g.ellipse(x+u*w,y+4+Math.sin(T/330+k)*2,w*(.34+k*.035),3.5,0,0,7);g.stroke()}
 for(let k=0;k<10;k++){const u=(T/900+k*.137)%1,side=k%2?1:-1;circ(x+side*(w*.25+u*w*.9),y+2-u*24,1.4+u*2.2,'rgba(255,255,255,'+(.65*(1-u))+')')}
 const mist=g.createRadialGradient(x,y+7,2,x,y+7,w*1.8);mist.addColorStop(0,'rgba(255,255,255,.32)');mist.addColorStop(1,'rgba(255,255,255,0)');
 g.fillStyle=mist;g.beginPath();g.ellipse(x,y+7,w*1.8,18,0,0,7);g.fill();
}
let TRK=-1,TRL=[];
const walkers=new Map();
function person(w){const p=P(w.x,w.y),f=(w.dir==0||w.dir==3)?1:-1,sw=Math.sin(w.ph)*(w.wait>0?0:3.2);
 if(NG>.3)LG.push({x:p[0],y:p[1]-10,r:16,c:[255,225,170],a:.35});g.save();g.translate(p[0],p[1]-Math.abs(Math.sin(w.ph))*(w.wait>0?0:1.2));g.scale(.8,.8);g.lineCap='round';
 g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(0,1,6.5,2.6,0,0,7);g.fill();
 g.strokeStyle='#3a3350';g.lineWidth=2.6;g.beginPath();g.moveTo(-1.6,-7);g.lineTo(-1.6+sw*f,0);g.moveTo(1.6,-7);g.lineTo(1.6-sw*f,0);g.stroke();
 g.fillStyle=w.c;g.beginPath();g.roundRect(-4.6,-17,9.2,11,3);g.fill();
 g.strokeStyle=w.c;g.lineWidth=2.2;g.beginPath();g.moveTo(-4.4,-15);g.lineTo(-4.4-sw*.5*f,-9);g.moveTo(4.4,-15);g.lineTo(4.4+sw*.5*f,-9);g.stroke();
 g.fillStyle='#f1c9a0';g.beginPath();g.arc(0,-22,4.7,0,7);g.fill();
 g.fillStyle=w.hr;g.beginPath();g.arc(0,-23.4,4.9,Math.PI,0);g.fill();
 g.fillStyle='#2a2a22';g.fillRect(f*1.9-.7,-22,1.4,1.7);g.restore()}
function pick(w){const row=Math.round((w.y-2.5)/BH);const R=L.R,xm=-R*BW+3.5,xM=R*BW+3.5,ym=-R*BH+2.5,yM=R*BH+2.5;
 const o=[[BW,0],[-BW,0],[0,BH],[0,-BH]].map((v,d)=>[d,w.x+v[0],w.y+v[1]]).filter(a=>a[1]>=xm-.01&&a[1]<=xM+.01&&a[2]>=ym-.01&&a[2]<=yM+.01);
 if(w.x>xM+.01){o.length=0;o.push([1,xM,w.y])}else if(Math.abs(w.x-xM)<.01&&Math.abs(row)<=R&&row%2==0)o.push([0,xM+2*BW,w.y]);
 const fw=o.filter(a=>a[0]!=(w.dir^1));const c=fw.length?fw:o;const a=c[Math.floor(Math.random()*c.length)];
 if(!a)return;w.dir=a[0];w.tx=a[1];w.ty=a[2];if(Math.random()<.25)w.wait=1+Math.random()*3}
function step(dt){walkers.forEach(w=>{if(w.wait>0){w.wait-=dt;return}w.ph+=dt*9*w.sp;const dx=w.tx-w.x,dy=w.ty-w.y,d=Math.hypot(dx,dy),mv=w.sp*dt;
 if(d<=mv){w.x=w.tx;w.y=w.ty;pick(w)}else{w.x+=dx/d*mv;w.y+=dy/d*mv}})}
function sync(){const ids=new Set(docs.map(d=>d.id));walkers.forEach((w,id)=>{if(!ids.has(id))walkers.delete(id)});
 docs.forEach((d,k)=>{if(walkers.has(d.id)||(k>=200&&d.id!=uid))return;const b=L.hb[Math.floor(k/6)];let h=0;for(const ch of d.id)h=(h*31+ch.charCodeAt(0))>>>0;
  const w={id:d.id,x:b.bx*BW+3.5,y:b.by*BH+2.5,tx:0,ty:0,sp:.8+(h%50)/100,ph:h%6,wait:0,c:d.id==uid?'#e8a317':'hsl('+(h%360)+' 55% 48%)',hr:['#2a2118','#5a3d22','#1d1d1d','#8a5a2b'][h%4],me:d.id==uid,dir:0};
  w.tx=w.x;w.ty=w.y;walkers.set(d.id,w);pick(w)})}
let T=0;const lp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function mount(c,hw,h,sd){const q=P(c[0],c[1]),cx=q[0],cy=q[1],A=[cx+(rnd(sd)-.5)*30,cy-h],Lf=[cx-hw,cy],B=[cx,cy+hw/2],Rt=[cx+hw,cy];
 poly([A,Lf,B],'#8b9c86');poly([A,B,Rt],'#6c7c6c');poly([A,lp(A,Lf,.3),lp(A,B,.22),lp(A,B,.4)],'#fff');poly([A,lp(A,B,.4),lp(A,Rt,.3)],'#dde7ef');
 // Lereng gunung dibiarkan alami tanpa pepohonan.
}
function duck(x,j,k){const p=P(x,j),b=Math.sin(T/500+k)*.8;g.save();g.translate(p[0],p[1]+b);
 g.fillStyle='rgba(0,0,0,.15)';g.beginPath();g.ellipse(0,1,7,3,0,0,7);g.fill();
 g.fillStyle='#f4f1e6';g.beginPath();g.ellipse(0,-3,6.5,3.6,0,0,7);g.fill();g.beginPath();g.moveTo(6,-4);g.lineTo(10,-8);g.lineTo(5,-1);g.fill();
 g.fillStyle='#2f7d4a';g.beginPath();g.arc(-5,-7,2.9,0,7);g.fill();g.fillStyle='#f0a030';g.beginPath();g.moveTo(-7.5,-7.5);g.lineTo(-11,-6.5);g.lineTo(-7.5,-5.5);g.fill();g.restore()}
function reed(i,j){const p=P(i,j);g.strokeStyle='#6f8f3a';g.lineWidth=1.4;for(let k=0;k<4;k++){const a=(k-1.5)*3,hh=14+rnd(i*7+j+k)*10,sw=Math.sin(T/900+k+i)*1.2;g.beginPath();g.moveTo(p[0]+a,p[1]);g.lineTo(p[0]+a+sw,p[1]-hh);g.stroke();if(k%2==0){g.fillStyle='#7a4a22';g.fillRect(p[0]+a+sw-1.2,p[1]-hh-5,2.4,6)}}}
let used=[];
function label(x,y,txt,gold,force){const k=1/sc;g.font='700 '+12*k+'px Nunito,Trebuchet MS,sans-serif';const w=g.measureText(txt).width+14*k,h=20*k;
 const r=[x-w/2,y-h/2,x+w/2,y+h/2];if(!force&&used.some(u=>r[0]<u[2]&&r[2]>u[0]&&r[1]<u[3]&&r[3]>u[1]))return;used.push(r);
 g.fillStyle=gold?'#f6d77a':'#fffaf0';g.strokeStyle='#2a2a22';g.lineWidth=1.5*k;g.beginPath();g.roundRect(r[0],r[1],w,h,7*k);g.fill();g.stroke();
 g.fillStyle='#2a2a22';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,x,y)}
function build(){const n=docs.length;L=layout(n);
 L.me=-1;docs.forEach((d,k)=>{if(d.id==uid)L.me=k});
 L.pos=docs.map((d,k)=>{const b=L.hb[Math.floor(k/6)],l=k%6;return{i:b.bx*BW+(l%3),j:b.by*BH+Math.floor(l/3),d,k}})}
function draw(){if(!L)return;env();g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 {const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,rgb(E.top));gr.addColorStop(.5,rgb(E.bot));gr.addColorStop(1,rgb(mixc(E.bot,[255,255,255],.4)));g.fillStyle=gr;g.fillRect(0,0,W,H);
  if(E.n>.15){g.fillStyle='rgba(255,255,255,'+Math.min(.9,E.n)+')';for(let k=0;k<50;k++){g.globalAlpha=.5+.5*Math.sin(T/600+k);g.fillRect(rnd(k*3+1)*W,rnd(k*7+2)*H*.35,1.6,1.6)}g.globalAlpha=1}
  if(HR>=6&&HR<=18){const u=(HR-6)/12,sx=W*(.08+.84*u),sy=H*.2-Math.sin(Math.PI*u)*H*.15;const gg=g.createRadialGradient(sx,sy,0,sx,sy,60);gg.addColorStop(0,'rgba(255,240,170,.9)');gg.addColorStop(1,'rgba(255,240,170,0)');g.fillStyle=gg;g.fillRect(sx-60,sy-60,120,120);circ(sx,sy,15,'#fff6c4')}
  else{const m=(HR<6?HR+24:HR)-18,u=Math.max(0,Math.min(1,m/12)),sx=W*(.08+.84*u),sy=H*.2-Math.sin(Math.PI*u)*H*.15;circ(sx,sy,15,'#f4f1de');circ(sx+5,sy-3,13,rgb(E.top))}
  g.fillStyle='rgba(255,255,255,'+(.8-E.n*.5)+')';for(let k=0;k<5;k++){const cx=((T/1000*(7+k*3)+k*320)%(W+360))-180,cy=H*(.05+(k%3)*.05);[[0,0,26],[24,4,20],[-24,5,18],[10,-8,18]].forEach(o=>{g.beginPath();g.ellipse(cx+o[0],cy+o[1],o[2],o[2]*.5,0,0,7);g.fill()})}}
 g.save();g.translate(ox,oy);g.scale(sc,sc);used=[];LG=[];
 const R=L.R,i0=-R*BW-12,i1=(R+1)*BW+12,j0=-R*BH-12,j1=(R+1)*BH+12,ei0=-R*BW,ei1=(R+1)*BW,ej0=-R*BH,ej1=(R+1)*BH;
 const inV=(i,j)=>i>=ei0&&i<ei1&&j>=ej0&&j<ej1;
 const rc=j=>{const sn=Math.sin(j*.4);return ei1+3+(sn>.35?1:sn<-.35?-1:0)};
 const wat=(i,j)=>j>=j0+3&&i>=rc(j)&&i<rc(j)+2;
 const brow=j=>{const lj=((j%BH)+BH)%BH;return lj==BH-1&&j>=ej0&&j<ej1&&Math.round((j-(BH-1))/BH)%2==0};
 const bspan=(i,j)=>brow(j)&&i>=ei1&&i<=ei1+8;
 const vis=(x,y,pad)=>{const sx=ox+x*sc,sy=oy+y*sc;return sx>-pad&&sx<W+pad&&sy>-pad*2&&sy<H+pad};
 const occ=new Map();L.pos.forEach(p=>occ.set(p.i+','+p.j,p));
 // pulau: sisi tanah + air terjun di tepi
 {const D=38,pA=P(i1,j0),pB=P(i1,j1),pC=P(i0,j1),dn=(q,d)=>[q[0],q[1]+d];
  poly([pA,pB,dn(pB,D),dn(pA,D)],'#7a5a38');poly([dn(pA,D*.6),dn(pB,D*.6),dn(pB,D),dn(pA,D)],'#5e432a');poly([pA,pB,dn(pB,7),dn(pA,7)],'#5f9e3e');
  poly([pB,pC,dn(pC,D),dn(pB,D)],'#8c6a42');poly([dn(pB,D*.6),dn(pC,D*.6),dn(pC,D),dn(pB,D)],'#6c4e31');poly([pB,pC,dn(pC,7),dn(pB,7)],'#6fb04a');
  const a=P(rc(j1),j1),b=P(rc(j1)+2,j1),H2=D+80;
  const edge=g.createLinearGradient(a[0],0,b[0],0);
  edge.addColorStop(0,'rgba(79,164,211,.22)');edge.addColorStop(.2,'rgba(127,211,239,.94)');
  edge.addColorStop(.5,'rgba(230,250,255,.98)');edge.addColorStop(.8,'rgba(112,199,232,.92)');edge.addColorStop(1,'rgba(65,151,202,.22)');
  g.fillStyle=edge;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);
  g.bezierCurveTo(b[0]+5,b[1]+H2*.28,b[0]-5,b[1]+H2*.72,b[0],b[1]+H2);
  g.lineTo(a[0],a[1]+H2);g.bezierCurveTo(a[0]-5,a[1]+H2*.72,a[0]+5,a[1]+H2*.28,a[0],a[1]);g.closePath();g.fill();
  g.strokeStyle='rgba(255,255,255,.92)';g.lineWidth=3;g.beginPath();g.moveTo(a[0],a[1]);g.quadraticCurveTo((a[0]+b[0])/2,a[1]+4,b[0],b[1]);g.stroke();
  for(let k=0;k<13;k++){const q=lp(a,b,(k+.5)/13),phase=(T/430+k*.17)%1,o=phase*(H2-18);
   g.strokeStyle=k%3===0?'rgba(255,255,255,.88)':'rgba(238,251,255,.52)';g.lineWidth=k%3===0?2:1.1;g.beginPath();
   g.moveTo(q[0]+Math.sin(T/280+k)*1.4,q[1]+o);
   g.bezierCurveTo(q[0]-2,q[1]+o+H2*.12,q[0]+2,q[1]+o+H2*.22,q[0],q[1]+Math.min(H2,o+H2*.3));g.stroke()}
  const foam=g.createRadialGradient((a[0]+b[0])/2,a[1]+H2-5,2,(a[0]+b[0])/2,a[1]+H2-5,75);
  foam.addColorStop(0,'rgba(255,255,255,.78)');foam.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=foam;g.fillRect((a[0]+b[0])/2-75,a[1]+H2-80,150,90);
  for(let k=0;k<12;k++){const u=(T/950+k*.083)%1,q=lp(a,b,(k+.5)/12);
   circ(q[0]+Math.sin(k*3+T/420)*7,q[1]+H2-12-u*54,1.5+u*2.4,'rgba(255,255,255,'+(.8*(1-u))+')')}
  }
 for(let s=i0+j0;s<=i1+j1;s++)for(let i=Math.max(i0,s-j1);i<=Math.min(i1,s-j0);i++){const j=s-i;let f;
  if(wat(i,j))f=(i+j)%2?'#5cb3d8':'#63b9dc';else if(bspan(i,j))f='#6b6f78';else if(!inV(i,j))f=(j>=j0+3&&(i==rc(j)-1||i==rc(j)+2))?'#d9d09b':shade((i+j)%2?'#8fc55f':'#98cb68',.93+rnd(i*7+j*13)*.14);
  else{const li=((i%BW)+BW)%BW,lj=((j%BH)+BH)%BH;f=(li==BW-1||lj==BH-1)?'#6b6f78':(occ.has(i+','+j)?'#bfe08f':'#dfe9b0')}
  const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);poly([a,b,c,d],f);
  if(!inV(i,j)&&!wat(i,j)&&!bspan(i,j)){const q=rnd(i*19+j*23+4);if(q<.14){const m=P(i+.5,j+.5);g.strokeStyle='rgba(40,100,30,.35)';g.lineWidth=1.3;g.beginPath();for(let k=-1;k<=1;k++){g.moveTo(m[0]+k*3,m[1]);g.lineTo(m[0]+k*4,m[1]-5)}g.stroke();if(q<.03)circ(m[0]+4,m[1]-1,1.7,'#f6e05a')}}
  if(wat(i,j)){const ph=((T/1800)+i*.31+j*.17)%1,m1=P(i+.2,j+ph*.8),m2=P(i+.7,j+ph*.8+.1);g.strokeStyle='rgba(255,255,255,'+(.5*Math.sin(ph*3.14))+')';g.lineWidth=1.3;g.beginPath();g.moveTo(m1[0],m1[1]);g.lineTo(m2[0],m2[1]);g.stroke();
   if(!bspan(i,j)&&rnd(i*53+j*29)<.14){const q=P(i+.3+rnd(i+j)*.4,j+.5);g.fillStyle='#3f9a4a';g.beginPath();g.ellipse(q[0],q[1],7,3.5,0,0,7);g.fill();if(rnd(i*7+j*3)<.4)circ(q[0],q[1]-1,2,'#f4a6c0')}}
  if(inV(i,j)){const li=((i%BW)+BW)%BW,lj=((j%BH)+BH)%BH;let m1=null,m2=null;
   if(li==BW-1&&lj<BH-1){m1=P(i+.5,j+.25);m2=P(i+.5,j+.75)}else if(lj==BH-1&&li<BW-1){m1=P(i+.25,j+.5);m2=P(i+.75,j+.5)}
   if(m1){g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1.5;g.beginPath();g.moveTo(m1[0],m1[1]);g.lineTo(m2[0],m2[1]);g.stroke()}}}
 // gunung, air terjun, ikan
 const M=[[rc(j0+3)+1,j0+3,150,330]];for(let i=i0+4;i<ei1+1;i+=6)M.push([i,j0+4+rnd(i)*3,90+rnd(i+1)*60,200+rnd(i+2)*170]);for(let j=j0+10;j<(ej0+ej1)/2;j+=6)M.push([i0+4+rnd(j)*3,j,90+rnd(j+1)*60,190+rnd(j+2)*160]);
 M.sort((a,b)=>a[0]+a[1]-b[0]-b[1]).forEach((m,k)=>mount(m,m[2],m[3],k*13+3));
 {
  // Cari gunung yang paling dekat dengan alur sungai.
  // M sudah diurutkan untuk proses menggambar, jadi M[0] belum tentu gunung tepi sungai.
  const riverMount=M.reduce((best,m)=>{
   const d=Math.abs(m[0]-(rc(m[1])+1));
   return !best||d<best.d?{m,d}:best;
  },null).m;
  // Pertahankan ujung bawah di sungai, tetapi mulai air terjun lebih rendah
  // pada lereng agar bagian atasnya tidak terlalu tinggi.
  const streamFoot=P(rc(riverMount[1])+1,riverMount[1]);
  const riverDrop=55;
  const waterfallHeight=215;
  wfall(streamFoot[0],streamFoot[1]+riverDrop,waterfallHeight,38);
 }
 const len=j1-j0-3,nf=Math.floor(len/5)+3;
 for(let k=0;k<nf;k++){const jf=j0+3+((T/1000*(.5+(k%5)*.12)+k*7.3)%len),ji=Math.floor(jf),xi=rc(ji)+.3+((k*.37)%1.3),fr=((T/1000+k*3)%9),jump=fr<.7;
  const p=P(xi,jf),dy=jump?-Math.sin(fr/.7*3.14)*12:0;g.save();g.translate(p[0],p[1]+dy);g.rotate(Math.atan2(.5,-1));
  g.fillStyle=k%3?'#f08a3c':'#3a5f7a';g.globalAlpha=jump?1:.8;g.beginPath();g.ellipse(0,0,5.5,2.3,0,0,7);g.fill();g.beginPath();g.moveTo(-4,0);g.lineTo(-9,-3);g.lineTo(-9,3);g.fill();g.restore();
  if(jump&&fr<.15){g.strokeStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(p[0],p[1],9,4,0,0,7);g.stroke()}}
 // Pohon latar: jangan gambar di dalam siluet gunung.
 const pointInTri=(p,a,b,c)=>{
  const v0=[c[0]-a[0],c[1]-a[1]],v1=[b[0]-a[0],b[1]-a[1]],v2=[p[0]-a[0],p[1]-a[1]];
  const dot=(u,v)=>u[0]*v[0]+u[1]*v[1],d00=dot(v0,v0),d01=dot(v0,v1),d02=dot(v0,v2),d11=dot(v1,v1),d12=dot(v1,v2),den=d00*d11-d01*d01;
  if(Math.abs(den)<1e-8)return false;
  const u=(d11*d02-d01*d12)/den,v=(d00*d12-d01*d02)/den;
  return u>=0&&v>=0&&u+v<=1;
 };
 const onMountain=(i,j)=>{const p=P(i,j);return M.some((m,k)=>{
  const q=P(m[0],m[1]),cx=q[0],cy=q[1],sd=k*13+3;
  const A=[cx+(rnd(sd)-.5)*30,cy-m[3]],Lf=[cx-m[2],cy],B=[cx,cy+m[2]/2],Rt=[cx+m[2],cy];
  return pointInTri(p,A,Lf,B)||pointInTri(p,A,B,Rt);
 })};
 if(TRK!=R){
  TRK=R;TRL=[];
  for(let i=i0;i<i1;i++)for(let j=j0;j<j1;j++){
   if(inV(i,j)||!(i<ei0-3||i>=ei1+3||j<ej0-3||j>=ej1+3))continue;
   if((j>=j0+3&&i>=rc(j)-1&&i<rc(j)+3)||(brow(j)&&i>=ei1&&i<=ei1+9)||(brow(j+1)&&i>=ei1+7&&i<=ei1+9))continue;
   const q=rnd(i*131+j*17+5);if(q>=.5)continue;
   const ti=i+q,tj=j+rnd(q*997);
   if(onMountain(ti,tj))continue;
   const u=rnd(i*977+j*31+9),ty=u<.34?0:u<.56?1:u<.68?2:u<.78?3:u<.88?4:5;
   TRL.push({i:ti,j:tj,s:.7+rnd(i+j*3)*.55,ty,sd:Math.floor(q*1000)});
  }
 }
 // bayangan mengikuti matahari
 if(SH.al>.02){g.fillStyle='rgba(15,25,10,'+SH.al+')';g.beginPath();
  TRL.forEach(t=>{const p=P(t.i,t.j);if(!vis(p[0],p[1],80))return;g.moveTo(p[0]+SH.dx*t.s*.55+(7+Math.abs(SH.dx)*.45)*t.s,p[1]+SH.dy*.6);g.ellipse(p[0]+SH.dx*t.s*.55,p[1]+SH.dy*.6,(7+Math.abs(SH.dx)*.45)*t.s,3.2*t.s,0,0,7)});
  L.pos.forEach(pp=>{const q=P(pp.i+.5,pp.j+.5);if(!vis(q[0],q[1],80))return;[.4,.75,1.1].forEach(k=>{const ox2=SH.dx*k*1.1,oy2=SH.dy*k*1.4,a=P(pp.i+.07,pp.j+.07),b=P(pp.i+.93,pp.j+.07),c=P(pp.i+.93,pp.j+.93),d=P(pp.i+.07,pp.j+.93);g.moveTo(a[0]+ox2,a[1]+oy2);g.lineTo(b[0]+ox2,b[1]+oy2);g.lineTo(c[0]+ox2,c[1]+oy2);g.lineTo(d[0]+ox2,d[1]+oy2);g.closePath()})});g.fill()}
 const items=[];walkers.forEach(w=>items.push({k:w.x+w.y+.6,fn:()=>person(w)}));
 L.pos.forEach(p=>{const q=P(p.i+.5,p.j+.5);if(vis(q[0],q[1],90))items.push({k:p.i+p.j+1,fn:()=>house(p.i,p.j,vh(p.i,p.j))})});
 L.blocks.forEach(b=>{const x=b.bx*BW,y=b.by*BH;const lq=P(x+3,y+2);if(vis(lq[0],lq[1],90)){items.push({k:x+3+y+2+.4,fn:()=>lamp(x+3.15,y+2.15)});items.push({k:x+1+y+2+.4,fn:()=>lamp(x+1,y+2.12)})}
  const f=b.f;if(!f)return;const u=docs.length>=f.th;
  items.push({k:x+y+2.5,fn:()=>{if(!u){box(x+.2,y+.2,x+2.8,y+1.8,0,1,'#cfe3a6');return}
   box(x+.1,y+.1,x+2.9,y+1.9,0,Math.max(1,f.h>3?2:f.h),f.h>3?'#d9d2bd':f.c);if(f.h>3)box(x+.5,y+.4,x+2.5,y+1.6,2,f.h,f.c);
   if(f.id==3){const q=P(x+1.5,y+1);circ(q[0],q[1]-f.h-8,11,'#2f8a6a');circ(q[0]-3,q[1]-f.h-11,5,'#58b08e')}
   if(f.id==5){g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=1.4;const a=P(x+.35,y+.3),b2=P(x+2.65,y+.3),c=P(x+2.65,y+1.7),d=P(x+.35,y+1.7),m1=P(x+1.5,y+.3),m2=P(x+1.5,y+1.7);g.beginPath();[a,b2,c,d].forEach((q,k)=>k?g.lineTo(q[0],q[1]-1):g.moveTo(q[0],q[1]-1));g.closePath();g.moveTo(m1[0],m1[1]-1);g.lineTo(m2[0],m2[1]-1);g.stroke()}
   if(f.id==23){g.strokeStyle='#7c8a3a';g.lineWidth=2;g.beginPath();for(let k=0;k<5;k++){const a=P(x+.25,y+.3+k*.35),b2=P(x+2.75,y+.3+k*.35);g.moveTo(a[0],a[1]-2);g.lineTo(b2[0],b2[1]-2)}g.stroke()}
   if(NG>.3&&f.h>3){const q=P(x+1.5,y+1);LG.push({x:q[0],y:q[1]-f.h*.6,r:62,c:[255,200,120],a:.3})}}});
  if(u&&f.id==11)[[.5,.6,1,0],[1.5,.5,1.1,1],[2.4,.7,.9,4],[1,1.5,.8,1],[2.2,1.5,1,2]].forEach((o,k)=>items.push({k:x+o[0]+y+o[1]+.2,fn:()=>drawTree({i:x+o[0],j:y+o[1],s:o[2],ty:o[3],sd:k+7})}))});
 TRL.forEach(t=>{const p=P(t.i,t.j);if(vis(p[0],p[1],70))items.push({k:t.i+t.j,fn:()=>drawTree(t)})});
 for(let k=0;k<Math.floor(len/12)+2;k++){const jf=j0+3+((T/1000*.18+k*11.1)%len),ji=Math.floor(jf),xi=rc(ji)+.5+(k%2)*.5+Math.sin(T/1000*.8+k)*.15;items.push({k:xi+jf+.3,fn:()=>duck(xi,jf,k)})}
 for(let j=j0+4;j<j1;j++){if(rnd(j*11)<.55&&!brow(j))items.push({k:rc(j)-.6+j,fn:()=>reed(rc(j)-.6,j+.5)});if(rnd(j*17)<.5&&!brow(j))items.push({k:rc(j)+2.7+j,fn:()=>reed(rc(j)+2.7,j+.5)})}
 for(let by=-R;by<=R;by++){if(by%2)continue;const j=by*BH+BH-1;for(let i=ei1;i<=ei1+8;i++)if(wat(i,j))items.push({k:i+j+.5,fn:()=>{box(i,j+.12,i+1,j+.88,0,4,'#b0824f');box(i,j+.08,i+1,j+.16,4,10,'#8a5f34');box(i,j+.84,i+1,j+.92,4,10,'#8a5f34')}});
  items.push({k:ei1+8+j,fn:()=>house(ei1+8,j-1,vh(ei1+8,j-1))});items.push({k:ei1+1+j+.4,fn:()=>lamp(ei1+1,j+.1)});items.push({k:ei1+7+j+.4,fn:()=>lamp(ei1+7,j+.1)})}
 items.sort((a,b)=>a.k-b.k).forEach(o=>o.fn());
 g.restore();
 // suasana: warna hari + cahaya malam
 g.setTransform(dpr,0,0,dpr,0,0);
 if(E.ta>.005){g.globalCompositeOperation='multiply';g.fillStyle=rgb(E.tint,E.ta);g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over'}
 g.save();g.translate(ox,oy);g.scale(sc,sc);
 if(E.n>.12){const kk=Math.min(1,(E.n-.12)/.4);g.globalCompositeOperation='lighter';
  LG.forEach(l=>{const sx=ox+l.x*sc,sy=oy+l.y*sc,rr=l.r*sc;if(sx<-rr||sx>W+rr||sy<-rr||sy>H+rr)return;g.save();g.translate(l.x,l.y);if(l.e)g.scale(1,l.e);const gr=g.createRadialGradient(0,0,0,0,0,l.r);gr.addColorStop(0,'rgba('+l.c+','+l.a*kk+')');gr.addColorStop(1,'rgba('+l.c+',0)');g.fillStyle=gr;g.fillRect(-l.r,-l.r,l.r*2,l.r*2);g.restore()});
  for(let k=0;k<36;k++){const jj=j0+4+((k*13.7)%len),q=P(rc(Math.floor(jj))+((k*5)%7)-2+Math.sin(T/1200+k)*.8,jj+Math.cos(T/1500+k)*.6),pu=.5+.5*Math.sin(T/400+k*2),gr=g.createRadialGradient(q[0],q[1]-12,0,q[0],q[1]-12,8);gr.addColorStop(0,'rgba(210,255,120,'+.8*pu*kk+')');gr.addColorStop(1,'rgba(210,255,120,0)');g.fillStyle=gr;g.fillRect(q[0]-8,q[1]-20,16,16)}
  g.globalCompositeOperation='source-over'}
 const showAll=sc>1.1;
 L.blocks.forEach(b=>{const f=b.f;if(!f)return;const p=P(b.bx*BW+1.5,b.by*BH+1),u=docs.length>=f.th;label(p[0],p[1]-(u?f.h+14:12),u?f.e+' '+f.n:'🔒 '+f.n+' · '+f.th+' warga',u,u)});
 L.pos.forEach(p=>{const q=P(p.i+.5,p.j+.5),me=p.d.id==uid,rt=p.k%10==0;if(me||rt||showAll)label(q[0],q[1]-40,(me?'★ ':'')+(rt?'Ketua RT '+(Math.floor(p.k/10)%4+1)+' · ':'')+p.d.name,me||rt,me)});
 walkers.forEach(w=>{if(w.me){const q=P(w.x,w.y);label(q[0],q[1]-36,'★ Kamu',true,true)}});
 walkers.forEach(w=>{const b=bub[w.id],age=b?Date.now()-b.ts:1e9;if(age<10000){const q=P(w.x,w.y);g.globalAlpha=Math.min(1,(10000-age)/1500);label(q[0],q[1]-(w.me?58:40),b.text.length>32?b.text.slice(0,31)+'…':b.text,false,true);g.globalAlpha=1}});
 g.restore();
 if(E.n<.5)for(let k=0;k<6;k++){const x=((T/1000*(26+k*7)+k*230)%(W+100))-50,y=H*.07+(k*37)%80+Math.sin(T/700+k)*6,fl=Math.sin(T/120+k)*4;g.strokeStyle='#3b3b48';g.lineWidth=1.6;g.beginPath();g.moveTo(x-7,y+fl);g.quadraticCurveTo(x-3,y-3,x,y);g.quadraticCurveTo(x+3,y-3,x+7,y+fl);g.stroke()}}

  function fit() {
    dpr = window.devicePixelRatio || 1;
    W = cv.clientWidth;
    H = cv.clientHeight;
    cv.width = Math.max(1, Math.round(W * dpr));
    cv.height = Math.max(1, Math.round(H * dpr));
    if (!ready) home();
    draw();
  }
  function home() {
    if (!L || !W || !H) return;
    const R=L.R,i0=-R*BW-12,i1=(R+1)*BW+12,j0=-R*BH-12,j1=(R+1)*BH+12;
    const w=((i1-i0)+(j1-j0))*TW/2,h=((i1-i0)+(j1-j0))*TH/2;
    sc=Math.min(W/(w*.8),H/(h*.95),1.6);
    const c=P((i0+i1)/2,(j0+j1)/2);
    ox=W/2-c[0]*sc; oy=H/2-c[1]*sc-10;
  }
  function zoom(k,cx=W/2,cy=H/2) {
    const n=Math.max(.15,Math.min(3,sc*k));
    ox=cx-(cx-ox)*n/sc; oy=cy-(cy-oy)*n/sc; sc=n; draw();
  }
  let drag=null;
  const onPointerDown=e=>{drag=[e.clientX,e.clientY,ox,oy];cv.setPointerCapture(e.pointerId)};
  const onPointerMove=e=>{if(drag){ox=drag[2]+e.clientX-drag[0];oy=drag[3]+e.clientY-drag[1];draw()}};
  const onPointerUp=()=>{drag=null};
  const onWheel=e=>{e.preventDefault();zoom(e.deltaY<0?1.12:.89,e.offsetX,e.offsetY)};
  cv.addEventListener('pointerdown',onPointerDown);
  cv.addEventListener('pointermove',onPointerMove);
  cv.addEventListener('pointerup',onPointerUp);
  cv.addEventListener('pointercancel',onPointerUp);
  cv.addEventListener('wheel',onWheel,{passive:false});
  const resizeObserver=new ResizeObserver(fit); resizeObserver.observe(cv);
  let rafId=0,ld=0,last=0;
  function animate(t){
    const dt=Math.min(.1,(t-last)/1000); last=t;
    if(L){T=t;step(dt);if(t-ld>28){ld=t;draw()}}
    rafId=requestAnimationFrame(animate);
  }
  build(); fit(); rafId=requestAnimationFrame(animate);

  return {
    setResidents(list,userId=null){
      docs=[...list].sort((a,b)=>a.joined-b.joined||(a.id<b.id?-1:1));
      uid=userId; build(); sync();
      if(!ready && docs.length){ready=true;home()}
      draw();
    },
    setCurrentUser(userId){uid=userId;build();sync();draw()},
    setSimulatedHour(hour){SIM=hour;env();draw()},
    setLive(){SIM=null;env();draw()},
    zoomIn(){zoom(1.25)}, zoomOut(){zoom(.8)}, center(){home();draw()},
    focusResident(index){
      if(!L?.pos[index])return false;
      const p=L.pos[index],q=P(p.i+.5,p.j+.5);sc=1.4;ox=W/2-q[0]*sc;oy=H/2-q[1]*sc;draw();return true;
    },
    setChatBubbles(messages){
      Object.keys(bub).forEach(k=>delete bub[k]);
      messages.forEach(m=>{bub[m.uid]={text:m.text,ts:m.ts}});draw();
    },
    destroy(){
      cancelAnimationFrame(rafId);resizeObserver.disconnect();
      cv.removeEventListener('pointerdown',onPointerDown);
      cv.removeEventListener('pointermove',onPointerMove);
      cv.removeEventListener('pointerup',onPointerUp);
      cv.removeEventListener('pointercancel',onPointerUp);
      cv.removeEventListener('wheel',onWheel);
    }
  };
}
