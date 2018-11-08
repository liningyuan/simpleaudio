//By LNY
const exptable=[2,3,5,7,8,10,12,14];
function getfreq(x0){
	x0=Math.round(x0);
	var i1=Math.floor(x0/7);
	x0-=i1*7;
	//console.log(440*Math.pow(2,i1+exptable[x0]/12));
	return 440*Math.pow(2,i1+exptable[x0]/12);
};
var audioctx=new AudioContext();

var freq=880,timelen=0.3;
function playsound(freq0,time0){
	if(!freq0)freq0=freq;
	if(!time0)time0=timelen;
	var osc=audioctx.createOscillator();
	var gain=audioctx.createGain();
	osc.connect(gain);
	gain.connect(audioctx.destination);
	osc.frequency.value=freq0;
	osc.type='square';
	osc.start();
	gain.gain.setValueAtTime(1,audioctx.currentTime);
	gain.gain.linearRampToValueAtTime(0,time0+audioctx.currentTime);
	setTimeout(function(){osc.stop();osc.disconnect();gain.disconnect();},1000);
	return;
}
var playlist={};
function startsound(x0){
	var osc=audioctx.createOscillator();
	var gain=audioctx.createGain();
	osc.connect(gain);
	gain.connect(audioctx.destination);
	osc.frequency.value=x0;
	osc.type='square';
	osc.start();
	gain.gain.setValueAtTime(1,audioctx.currentTime);
	gain.gain.setTargetAtTime(0.4,audioctx.currentTime,0.4);
	return {"oscillator":osc,"gainnode":gain};
}
var endtime=0.2;
function endnode(osc,gain){
	gain.gain.linearRampToValueAtTime(0,endtime+audioctx.currentTime);
	gain.gain.setTargetAtTime(0,audioctx.currentTime,endtime*0.5);
	setTimeout(function(){osc.stop();gain.disconnect();osc.disconnect();return;},endtime*1000);
	return;
}

var freqoffset=1;
function changeoffset(){
	var i1=Math.pow(2,document.getElementById("offset").value);
	if(i1)freqoffset=i1;
	return;
}
const keytable={'!':8,'@':9,'#':10,'$':11,'%':12,'^':13,'&':14,'*':15,'(':16,')':17,q:8,w:9,e:10,r:11,t:12,y:13,u:14,i:15,o:16,p:17,Q:1,W:2,E:3,R:4,T:5,Y:6,U:7,I:8,O:9,P:10};
var halfkey={32:1,66:1,67:1,77:1,78:1,86:1,88:1,90:1,188:1,190:1,191:1};
var halfup=1,halfcnt=0;
window.onkeydown=function(e)
{
	//console.info(e.code,e);
	var i1=440;
	if(e.keyCode>=48&&e.keyCode<=57)
	{
		i1=e.keyCode-48;
		if(i1==0)i1=10;
		if(e.shiftKey)i1-=7;
		i1=getfreq(i1)*freqoffset*halfup;
	}else if(keytable[e.key]){
		i1=getfreq(keytable[e.key]-14)*freqoffset*halfup;
	}else{
		if(halfkey[e.keyCode]==1){
			++halfcnt;
			halfup=1.0594630943592953;
			halfkey[e.keyCode]=2;
		}
		return;
	}
	if(!playlist[e.code])playlist[e.code]=startsound(i1);
	return;
}
window.onkeyup=function(e)
{
	// console.log(e.code,e);
	if(playlist[e.code]){
		endnode(playlist[e.code].oscillator,playlist[e.code].gainnode);
		playlist[e.code]=null;
	}else if(halfkey[e.keyCode]==2){
		--halfcnt;
		if(!halfcnt)halfup=1;
		halfkey[e.keyCode]=1;
	}
	return;
}
