// Minimal scrapbook behavior: wire existing polaroids, add scatter, lightbox, and background audio control
const scatterGrid = document.getElementById('scatterGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const musicToggle = document.getElementById('musicToggle');
const bgAudio = document.getElementById('bgAudio');

function randomizePolaroids(){
  const items = document.querySelectorAll('.scatter-grid .polaroid');
  items.forEach((p)=>{
    const rot = (Math.random()*24)-12;
    const tx = (Math.random()*20)-10;
    const ty = (Math.random()*10)-5;
    const s = 0.98 + Math.random()*0.06;
    p.style.transform = `rotate(${rot}deg) translate(${tx}px, ${ty}px) scale(${s})`;
    p.style.zIndex = `${10 + Math.floor(Math.random()*40)}`;
    p.addEventListener('click', ()=>{
      const img = p.querySelector('img');
      const src = img ? img.src : '';
      const cap = p.querySelector('.caption') ? p.querySelector('.caption').textContent : '';
      showLightbox(src, cap);
    });
  });
}

function showLightbox(src, caption){
  if(!lightbox) return;
  lightboxImg.src = src || '';
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('show');
}

function closeLightbox(){ if(!lightbox) return; lightbox.classList.remove('show'); lightboxImg.src = ''; }

// music control
function toggleMusic(){
  if(!bgAudio) return;
  if(bgAudio.paused){ bgAudio.play().catch(()=>{}); musicToggle.textContent = '⏸'; }
  else { bgAudio.pause(); musicToggle.textContent = '🎵'; }
}

// close handlers
document.addEventListener('click', (e)=>{
  if(e.target.matches('.modal-close')) closeLightbox();
  if(e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

// start: randomize polaroids and wire music toggle
window.addEventListener('load', ()=>{
  randomizePolaroids();
  if(musicToggle) musicToggle.addEventListener('click', toggleMusic);
  // try to play once on first gesture (user must interact for audio in many browsers)
  function tryPlayOnce(){ if(bgAudio) bgAudio.play().catch(()=>{}); document.removeEventListener('click', tryPlayOnce); }
  document.addEventListener('click', tryPlayOnce, {once:true});
});
