// Interactive behavior: WebAudio ambient synth, confetti, secret message
const playGift = document.getElementById('playGift');
const lego = document.getElementById('legoSecret');
const secret = document.getElementById('secretMessage');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

let audioCtx, masterGain, isPlaying = false;

function resizeCanvas(){canvas.width = innerWidth; canvas.height = innerHeight}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function playAmbient(){
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain(); masterGain.gain.value = 0.06; masterGain.connect(audioCtx.destination);
    // create a drifting pad using multiple oscillators
    const freqs = [220, 277.18, 329.63];
    freqs.forEach((f,i)=>{
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.value = 0.12/(i+1);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
    });
  }
  if(audioCtx.state === 'suspended') audioCtx.resume();
  isPlaying = true;
}

function stopAmbient(){
  if(audioCtx && masterGain){ masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1); }
  isPlaying = false;
}

playGift.addEventListener('click', ()=>{
  if(!isPlaying){
    playAmbient();
    playGift.textContent = '🔊';
    confettiBurst();
  } else {
    stopAmbient();
    playGift.textContent = '🎁';
  }
});

lego.addEventListener('click', ()=>{
  secret.classList.toggle('show');
  confettiBurst(60);
});

// Simple confetti implementation
function confettiBurst(count = 120){
  const pieces = [];
  for(let i=0;i<count;i++){
    pieces.push({
      x: innerWidth/2 + (Math.random()-0.5)*200,
      y: innerHeight/2 + (Math.random()-0.5)*80,
      vx: (Math.random()-0.5)*8,
      vy: (Math.random()*-6)-2,
      r: Math.random()*6+4,
      c: ['#2aa6a3','#57c4bf','#7bd7d2','#ffd3c5','#fff5b1'][Math.floor(Math.random()*5)],
      rot: Math.random()*360
    });
  }
  let t = 0;
  function frame(){
    t++; ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.vy += 0.18; p.x += p.vx; p.y += p.vy; p.rot += p.vx;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);
      ctx.restore();
    });
    if(t<180) requestAnimationFrame(frame); else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  requestAnimationFrame(frame);
}

// Gentle parallax for clouds
window.addEventListener('scroll', ()=>{
  const hero = document.querySelector('.hero');
  const y = window.scrollY; hero.style.backgroundPosition = `center ${y*0.15}px`;
});

// Handy: reveal secret when pressing 'L'
window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='l'){ secret.classList.toggle('show'); confettiBurst(50);} });

// Initial micro-interaction: animate title on load
window.addEventListener('load', ()=>{
  const t = document.querySelector('.title'); t.style.transform='translateY(-6px)'; setTimeout(()=>t.style.transform='none',700);
});
