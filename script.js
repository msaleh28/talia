// Minimal scrapbook behavior: wire existing polaroids, add scatter, lightbox, and background audio control
const scatterGrid = document.getElementById('scatterGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const musicToggle = document.getElementById('musicToggle');
const bgAudio = document.getElementById('bgAudio');
const exploreArrow = document.getElementById('exploreArrow');

// list of images present in the assets folder (detected earlier)
const IMAGE_LIST = [
  {src: 'assets/eid_barhoma_house.jpeg', caption: 'Home'},
  {src: 'assets/funny_tanoura.jpg', caption: 'Smile'},
  {src: 'assets/stairs_chicago_photoshoot.jpeg', caption: 'City'},
  {src: 'assets/wndr_museum.jpeg', caption: 'Museum'}
];

function randomizePolaroids(){
  const items = document.querySelectorAll('.scatter-grid .polaroid');
  items.forEach((p)=>{
    const rot = (Math.random()*8)-4; // reduced rotation for more polished look
    const tx = (Math.random()*10)-5; // reduced translation
    const ty = (Math.random()*4)-2;
    const s = 0.99 + Math.random()*0.02; // minimal scale variation
    p.style.transform = `rotate(${rot}deg) translate(${tx}px, ${ty}px) scale(${s})`;
    p.style.zIndex = `${10 + Math.floor(Math.random()*20)}`;
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
  // wait for user to explore before showing photos
  if(exploreArrow){
    exploreArrow.addEventListener('click', showPhotosOnce, {once:true});
  }
  window.addEventListener('scroll', onFirstScroll, {passive:true});
  if(musicToggle) musicToggle.addEventListener('click', toggleMusic);
  // try to play once on first gesture (user must interact for audio in many browsers)
  function tryPlayOnce(){ if(bgAudio) bgAudio.play().catch(()=>{}); document.removeEventListener('click', tryPlayOnce); }
  document.addEventListener('click', tryPlayOnce, {once:true});
});

function onFirstScroll(){
  showPhotosOnce();
  window.removeEventListener('scroll', onFirstScroll);
}

function showPhotosOnce(){
  // hide arrow
  if(exploreArrow) exploreArrow.classList.add('hide');
  revealPhotos();
}

function revealPhotos(){
  if(!scatterGrid) return;
  
  // Check if photos have already been added
  if(scatterGrid.querySelectorAll('.polaroid').length > 0) return;
  
  IMAGE_LIST.forEach((it, idx)=>{
    const wrap = document.createElement('div'); wrap.className = 'polaroid';
    const img = document.createElement('img'); img.src = it.src; img.alt = it.caption || '';
    const cap = document.createElement('div'); cap.className = 'caption'; cap.textContent = it.caption || '';
    wrap.appendChild(img); wrap.appendChild(cap);
    
    // Set random rotation for scattered effect
    const rotation = (Math.random() * 8) - 4; // Random rotation between -4 and 4 degrees
    wrap.style.setProperty('--rotation', `${rotation}deg`);
    
    scatterGrid.appendChild(wrap);
  });
  // Use IntersectionObserver to animate photos as they scroll into view
  const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  }, {threshold: 0.1});
  
  document.querySelectorAll('.scatter-grid .polaroid').forEach(photo => photoObserver.observe(photo));
}

/* Reasons hearts */
const reasonsSection = document.getElementById('reasons');
const heartsContainer = document.getElementById('heartsContainer');
const REASONS = [
  "You're my best friend",
  'You always include me',
  'You make me laugh',
  'You make me a better person'
];

function createHeart(text, styleClass){
  const el = document.createElement('div'); el.className = `heart ${styleClass}`;
  // create inline SVG heart with simple path and a gradient defs
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox','0 0 100 90'); svg.setAttribute('aria-hidden','true');
  const defs = document.createElementNS(ns,'defs');
  // gradients
  const gradRed = document.createElementNS(ns,'linearGradient'); gradRed.id='grad-red'; gradRed.setAttribute('x1','0'); gradRed.setAttribute('x2','0'); gradRed.setAttribute('y1','0'); gradRed.setAttribute('y2','1');
  const stop1 = document.createElementNS(ns,'stop'); stop1.setAttribute('offset','0%'); stop1.setAttribute('stop-color','#ff6b8a');
  const stop2 = document.createElementNS(ns,'stop'); stop2.setAttribute('offset','100%'); stop2.setAttribute('stop-color','#ff3d6e');
  gradRed.appendChild(stop1); gradRed.appendChild(stop2);
  const gradPink = gradRed.cloneNode(true); gradPink.id='grad-pink'; gradPink.querySelectorAll('stop')[0].setAttribute('stop-color','#ff9bb8'); gradPink.querySelectorAll('stop')[1].setAttribute('stop-color','#ff6b96');
  const gradTeal = gradRed.cloneNode(true); gradTeal.id='grad-teal'; gradTeal.querySelectorAll('stop')[0].setAttribute('stop-color','#57c4bf'); gradTeal.querySelectorAll('stop')[1].setAttribute('stop-color','#2aa6a3');
  defs.appendChild(gradRed); defs.appendChild(gradPink); defs.appendChild(gradTeal);
  svg.appendChild(defs);
  const path = document.createElementNS(ns,'path');
  path.setAttribute('d','M50 82 L18 50 A18 22 0 0 1 50 18 A18 22 0 0 1 82 50 Z');
  path.setAttribute('class','heart-shape');
  svg.appendChild(path);

  const label = document.createElement('div'); label.className='heart-label'; label.textContent = text;
  el.appendChild(svg); el.appendChild(label);
  return el;
}

function revealHearts(){
  if(!heartsContainer) return;
  // clear any existing
  heartsContainer.innerHTML = '';
  REASONS.forEach((t,i)=>{
    const cls = i%3===0? 'red' : (i%3===1? 'pink' : 'teal');
    const h = createHeart(t, cls);
    // set a CSS rotation variable for this heart so animation preserves it
    const rot = (Math.random()*20)-10; // Random rotation between -10 and 10 degrees
    h.style.setProperty('--rot', `${rot}deg`);
    heartsContainer.appendChild(h);
    // animate with better stagger timing so they pop one at a time
    setTimeout(()=> h.classList.add('pop'), 150 * i);
  });
}

// use IntersectionObserver to trigger hearts when section comes into view
if(reasonsSection){
  const obs = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ revealHearts(); observer.disconnect(); }
    });
  }, {threshold:0.35});
  obs.observe(reasonsSection);
}
