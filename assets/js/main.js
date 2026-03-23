// main.js - smooth scroll + lightbox gallery + interactivity (FAB, back-to-top, reveal on scroll)

document.addEventListener('DOMContentLoaded', function(){
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        var target = document.querySelector(href);
        if(target){
          var offset = target.getBoundingClientRect().top + window.pageYOffset - 20;
          window.scrollTo({top: offset, behavior:'smooth'});
        }
      }
    });
  });

  // Lightbox / Modal gallery
  const galleryImages = Array.from(document.querySelectorAll('.gallery .grid img'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');
  const btnClose = document.getElementById('lightbox-close');

  let currentIndex = 0;

  function openLightbox(index){
    currentIndex = index;
    const img = galleryImages[currentIndex];
    lightboxImage.src = img.dataset.large || img.src;
    lightboxImage.alt = img.alt || '';
    lightboxCaption.textContent = img.alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    btnPrev.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext(){
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox(currentIndex);
  }
  function showPrev(){
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentIndex);
  }

  galleryImages.forEach((img, idx) => {
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', () => openLightbox(idx));
    img.addEventListener('keydown', (e) => { if(e.key === 'Enter') openLightbox(idx); });
  });

  // Controls
  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);

  // Close when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('active')) return;
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') showNext();
    if(e.key === 'ArrowLeft') showPrev();
  });

  // Floating action button (FAB)
  const fabToggle = document.getElementById('fab-toggle');
  const fabActions = document.getElementById('fab-actions');
  fabToggle.addEventListener('click', function(){
    const open = fabActions.classList.toggle('open');
    fabActions.setAttribute('aria-hidden', !open);
    fabToggle.setAttribute('aria-expanded', open);
  });

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });

  window.addEventListener('scroll', function(){
    if(window.pageYOffset > 360) backToTop.classList.add('show'); else backToTop.classList.remove('show');

    // header shrink
    const header = document.querySelector('.site-header');
    if(window.pageYOffset > 40) header.classList.add('shrink'); else header.classList.remove('shrink');

    // reveal on scroll
    document.querySelectorAll('[data-reveal]').forEach(function(el){
      const rect = el.getBoundingClientRect();
      if(rect.top < (window.innerHeight - 80)) el.classList.add('reveal');
    });
  });

  // initialize reveal for hero
  setTimeout(()=>{
    const hc = document.querySelector('.hero-content');
    if(hc) hc.classList.add('is-visible');
  },220);

  // small accessibility: allow escape to close FAB actions
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      fabActions.classList.remove('open');
      fabActions.setAttribute('aria-hidden','true');
      fabToggle.setAttribute('aria-expanded','false');
    }
  });

  // make review chips interactive (filter UI mock)
  document.querySelectorAll('.chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      this.classList.add('active');
      // for demo: flash review list
      const list = document.querySelector('.review-list');
      list.style.transition = 'background .25s ease';
      list.style.background = 'linear-gradient(90deg, rgba(250,250,250,1), rgba(255,250,240,1))';
      setTimeout(()=>list.style.background='',350);
    });
  });

});
