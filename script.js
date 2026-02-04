// Minimal scrapbook behavior: wire existing polaroids, add scatter, lightbox, and background audio control
const scatterGrid = document.getElementById('scatterGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const musicToggle = document.getElementById('musicToggle');
const bgAudio = document.getElementById('bgAudio');
const exploreArrow = document.getElementById('exploreArrow');
// AR Photo Filter elements
const arSection = document.getElementById('ar');
const arVideo = document.getElementById('arVideo');
const arCanvas = document.getElementById('arCanvas');
const startCameraBtn = document.getElementById('startCamera');
const stopCameraBtn = document.getElementById('stopCamera');
const toggleHeart = document.getElementById('toggleHeart');
const heartSizeInput = document.getElementById('heartSize');
const captureBtn = document.getElementById('capturePhoto');
const captureResult = document.getElementById('captureResult');

let arStream = null;
let arAnimId = null;

function startCamera(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then(stream => {
      arStream = stream;
      arVideo.srcObject = stream;
      arVideo.play().catch(()=>{});
      arVideo.addEventListener('loadedmetadata', () => {
        setupCanvasSize();
        drawAR();
      }, {once:true});
    })
    .catch(err => console.warn('Camera access denied', err));
}

function stopCamera(){
  if(arStream){
    arStream.getTracks().forEach(t=>t.stop());
    arStream = null;
  }
  if(arAnimId) cancelAnimationFrame(arAnimId);
  if(arCanvas) {
    const ctx = arCanvas.getContext('2d');
    ctx && ctx.clearRect(0,0,arCanvas.width, arCanvas.height);
  }
}

function setupCanvasSize(){
  if(!arVideo || !arCanvas) return;
  const w = arVideo.videoWidth || arVideo.clientWidth;
  const h = arVideo.videoHeight || Math.floor(w * 4/3);
  arCanvas.width = w;
  arCanvas.height = h;
  arCanvas.style.width = arVideo.clientWidth + 'px';
}

function drawAR(){
  if(!arCanvas || !arVideo) return;
  const ctx = arCanvas.getContext('2d');
  function frame(){
    if(arVideo.paused || arVideo.ended) { arAnimId = requestAnimationFrame(frame); return; }
    // draw video frame
    try{ ctx.drawImage(arVideo, 0, 0, arCanvas.width, arCanvas.height); }catch(e){}
    // overlay heart emoji and initials (MT)
    if(toggleHeart && toggleHeart.checked){
      const size = parseInt(heartSizeInput ? heartSizeInput.value : 160, 10) || 160;
      const cx = arCanvas.width / 2;
      const cy = arCanvas.height / 2;
      // draw heart emoji with subtle shadow
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${size}px serif`;
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillText('❤️', cx + 6, cy + 6);
      ctx.fillStyle = 'rgba(255,80,120,0.95)';
      ctx.fillText('❤️', cx, cy);

      // draw initials centered in the heart
      const initials = 'MT';
      const initialsSize = Math.floor(size * 0.34); // slightly smaller
      ctx.font = `bold ${initialsSize}px Inter, sans-serif`;
      // position a bit higher inside the heart (nudged up)
      const initialsY = cy - Math.max(8, Math.floor(size * 0.155));
      // small shadow for legibility
      ctx.fillStyle = 'rgba(0,0,0,0.36)';
      ctx.fillText(initials, cx + 3, initialsY + 3);
      ctx.fillStyle = 'white';
      ctx.fillText(initials, cx, initialsY);
    }
    arAnimId = requestAnimationFrame(frame);
  }
  frame();
}

function captureImage(){
  if(!arCanvas) return;
  const data = arCanvas.toDataURL('image/png');
  // show result preview and download link
  captureResult.innerHTML = '';
  const img = document.createElement('img'); img.src = data; img.alt = 'capture';
  const a = document.createElement('a'); a.href = data; a.download = 'talia_capture.png'; a.textContent = 'Download Photo'; a.className='btn';
  captureResult.appendChild(img); captureResult.appendChild(document.createElement('br'));
  captureResult.appendChild(a);
}

// wire AR controls
if(startCameraBtn) startCameraBtn.addEventListener('click', startCamera);
if(stopCameraBtn) stopCameraBtn.addEventListener('click', stopCamera);
if(captureBtn) captureBtn.addEventListener('click', captureImage);


// list of images present in the assets folder (user-added)
const IMAGE_LIST = [
  { src: 'assets/eid_barhoma_house.jpeg' },
  { src: 'assets/funny_tanoura.jpg' },
  { src: 'assets/stairs_chicago_photoshoot.jpeg' },
  { src: 'assets/wndr_museum.jpeg' },
  { src: 'assets/basye.jpeg' },
  { src: 'assets/engagement_sign.jpeg' },
  { src: 'assets/engagement_1.jpg' },
  { src: 'assets/chicago_photoshoot_1.jpg' },
  { src: 'assets/touty_pouting.jpg' },
  { src: 'assets/jinya.jpg' },
  { src: 'assets/touty_cat_1.jpg' },
  { src: 'assets/touty_grad_1.jpg' }
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
      showLightbox(src, '');
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
    const img = document.createElement('img'); img.src = it.src; img.alt = '';
    wrap.appendChild(img);
    
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

/* Quiz Section */
const quizContainer = document.getElementById('quizContainer');
const quizSection = document.getElementById('quiz');

const QUIZ_QUESTIONS = [
  {
    question: "What is Muhannad's favorite feature of Talia?",
    options: ['Eyes', 'Hair', 'Face', 'Body'],
    correct: [0, 1, 2, 3],
    multiCorrect: true
  },
  {
    question: "What is Muhannad's favorite experience with Talia?",
    options: ['Big Sam Concert', 'Skydiving', 'Michigan Trip', 'DC Trip'],
    correct: [1]
  },
  {
    question: "What does Muhannad admire most about Talia's personality?",
    options: ['Her kindness', 'Her strength', 'Her sense of humor', 'Her intelligence'],
    correct: [0]
  },
  {
    question: "What is one habit of Talia's that Muhannad secretly loves?",
    options: ['The way she gets excited over small things', 'How she organizes everything', 'How she laughs at her own jokes', 'The way she overthinks'],
    correct: [0, 1, 2, 3],
    multiCorrect: true
  },
  {
    question: "What does Muhannad think makes Talia a great wife?",
    options: ['Her care', 'Her attitude', 'Her patience', 'Her love'],
    correct: [2]
  },
  {
    question: "What does Muhannad think is Talia's love language?",
    options: ['Words of affirmation', 'Quality time', 'Acts of service', 'Physical touch'],
    correct: [2]
  },
  {
    question: "What does Muhannad think Talia doesn't realize about herself?",
    options: ['How beautiful she is', 'How strong she is', 'How loved she is', 'How special she is'],
    correct: [0, 1, 2, 3],
    multiCorrect: true
  },
  {
    question: "What does Talia do that Muhannad finds adorable?",
    options: ['Getting excited', 'Being sleepy', 'Laughing', 'Teasing him'],
    correct: [0]
  },
  {
    question: "What has Talia made better in Muhannad's life?",
    options: ['His happiness', 'His mindset', 'His sense of home', 'Everything'],
    correct: [3]
  }
];

function createConfetti() {
  const colors = ['#ff6b8a', '#ff9bb8', '#57c4bf', '#2aa6a3', '#ffd700'];
  for(let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '0px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.delay = Math.random() * 0.5 + 's';
    confetti.style.animation = `confettiFall ${2 + Math.random() * 1}s ease-out forwards`;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3500);
  }
}

function renderQuiz() {
  if(!quizContainer) return;
  
  quizContainer.innerHTML = '';
  QUIZ_QUESTIONS.forEach((q, qIndex) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'quiz-question';
    
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = q.question;
    questionDiv.appendChild(questionText);
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'quiz-options';
    
    q.options.forEach((option, oIndex) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = option;
      btn.dataset.questionIndex = qIndex;
      btn.dataset.optionIndex = oIndex;
      
      btn.addEventListener('click', (e) => {
        handleQuizAnswer(e.target, qIndex, oIndex, q);
      });
      
      optionsDiv.appendChild(btn);
    });
    
    questionDiv.appendChild(optionsDiv);
    quizContainer.appendChild(questionDiv);
  });
}

function handleQuizAnswer(btn, questionIndex, optionIndex, question) {
  // Disable all buttons for this question
  const allButtons = document.querySelectorAll(`[data-question-index="${questionIndex}"]`);
  allButtons.forEach(b => b.disabled = true);
  
  // Check if answer is correct
  const isCorrect = question.correct.includes(optionIndex);
  
  if(isCorrect) {
    btn.classList.add('correct');
    createConfetti();
  } else {
    btn.classList.add('incorrect');
  }
  
  // Show all correct answers
  allButtons.forEach((b, idx) => {
    if(question.correct.includes(idx) && !b.classList.contains('correct')) {
      b.classList.add('correct');
    } else if(!question.correct.includes(idx) && !b.classList.contains('incorrect')) {
      b.classList.add('incorrect');
    }
  });
}

// Use IntersectionObserver to trigger quiz when section comes into view
if(quizSection){
  const quizObs = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ 
        renderQuiz(); 
        observer.disconnect(); 
      }
    });
  }, {threshold:0.2});
  quizObs.observe(quizSection);
}

