/* script.js — Touch Life Spa (consolidated) */
"use strict";
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* See More */
function showMoreCards() {
  const hiddenCards = $$('.massage-card.hidden');
  hiddenCards.forEach(card => { card.classList.remove('hidden'); card.classList.add('block'); });
  const btn = $('#seeMoreBtn'); if (btn) btn.style.display = 'none';
}
window.showMoreCards = showMoreCards;

/* Hero slider */
(function heroSlider(){
  const slides=$$('.slide'), dots=$$('.dot'), next=$('.next'), prev=$('.prev');
  if(!slides.length || !dots.length) return;
  let index=0, t=null;
  const idle = window.requestIdleCallback
    ? (cb)=>window.requestIdleCallback(cb, { timeout: 1500 })
    : (cb)=>setTimeout(cb, 400);

  const loadSlideImage = (slide)=>{
    if(!slide) return;
    const img = slide.querySelector('img[data-src]');
    if(!img || img.dataset.loading === '1') return;
    img.dataset.loading = '1';
    if(img.dataset.srcset){
      img.setAttribute('srcset', img.dataset.srcset);
      img.removeAttribute('data-srcset');
    }
    if(img.dataset.sizes){
      img.setAttribute('sizes', img.dataset.sizes);
      img.removeAttribute('data-sizes');
    }
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
    delete img.dataset.loading;
  };

  const warmNeighbors = (current)=>{
    const total = slides.length;
    const targets = [
      slides[(current + 1) % total],
      slides[(current - 1 + total) % total]
    ];
    targets.forEach(slide=> idle(()=>loadSlideImage(slide)));
  };

  const show=i=>{
    slides.forEach(s=>s.classList.remove('active'));
    dots.forEach(d=>d.classList.remove('active'));
    slides[i].classList.add('active');
    dots[i].classList.add('active');
    loadSlideImage(slides[i]);
    warmNeighbors(i);
  };
  const nextSlide=()=>{ index=(index+1)%slides.length; show(index); };
  const prevSlide=()=>{ index=(index-1+slides.length)%slides.length; show(index); };
  const start=()=>{ stop(); t=setInterval(nextSlide,4000); };
  const stop=()=>{ if(t) clearInterval(t); t=null; };
  show(index);
  warmNeighbors(index);
  start();
  next && next.addEventListener('click', ()=>{ nextSlide(); start(); });
  prev && prev.addEventListener('click', ()=>{ prevSlide(); start(); });
  dots.forEach(dot=>dot.addEventListener('click', ()=>{ index=parseInt(dot.dataset.index||'0',10); show(index); start(); }));
})();

/* Swiper (if present) */
(function initSwiper(){
  if(typeof Swiper==='undefined') return;
  if(!document.querySelector('.beauty-swiper')) return;
  // eslint-disable-next-line no-undef
  new Swiper('.beauty-swiper', {
    slidesPerView:3, spaceBetween:20,
    navigation:{ nextEl:'.swiper-button-next', prevEl:'.swiper-button-prev' },
    breakpoints:{ 1024:{slidesPerView:3}, 768:{slidesPerView:2}, 480:{slidesPerView:1} }
  });
})();

/* WhatsApp form */
function sendToWhatsApp(){
  const val=id=> (document.getElementById(id)?.value||'').trim();
  const enc=s=> encodeURIComponent(s);
  const message = `New inquiry from website:%0A👤 Name: ${enc(val('name'))}%0A📧 Email: ${enc(val('email'))}%0A📱 Phone: ${enc(val('phone'))}%0A💬 Question: ${enc(val('question'))}`;
  const phoneNumber="971565785800";
  window.open(`https://wa.me/${phoneNumber}?text=${message}`,'_blank');
}
window.sendToWhatsApp = sendToWhatsApp;

/* Clear hash after load */
window.addEventListener('DOMContentLoaded', ()=>{ if(window.location.hash){ setTimeout(()=>{ history.replaceState(null,'',window.location.pathname + window.location.search); },500); }});

/* QR param reveal */
(function(){
  const params=new URLSearchParams(location.search);
  if(params.get('qr')==='1'){ const sec=document.getElementById('menu'); if(sec){ sec.classList.remove('qr-hidden'); setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),0); } }
})();

/* Burger */
(function(){
  const btn=document.getElementById('burger-btn');
  const menu=document.getElementById('mobile-menu');
  const openI=document.getElementById('icon-open');
  const closeI=document.getElementById('icon-close');
  if(!btn||!menu||!openI||!closeI) return;
  btn.addEventListener('click', ()=>{
    menu.classList.toggle('hidden');
    openI.classList.toggle('hidden'); closeI.classList.toggle('hidden');
    document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
  });
  document.querySelectorAll('.mobilelink').forEach(a=>a.addEventListener('click', ()=>{
    if(!menu.classList.contains('hidden')){
      menu.classList.add('hidden'); openI.classList.remove('hidden'); closeI.classList.add('hidden'); document.body.style.overflow='';
    }
  }));
})();

/* Active link highlight */
(function(){
  const normalize = (value)=>{
    if(!value) return '';
    let path = value.trim();
    if(path.startsWith('http')){
      try { path = new URL(path).pathname; }
      catch { return ''; }
    }
    if(path.startsWith('tel:') || path.startsWith('mailto:')) return '';
    const hashIndex = path.indexOf('#');
    if(hashIndex !== -1) path = path.slice(0, hashIndex);
    if(!path) return '';
    if(!path.startsWith('/')) path = '/' + path;
    path = path.replace(/index\.html$/, '/');
    path = path.replace(/\.html$/, '');
    if(path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    return path;
  };
  const current = normalize(location.pathname.toLowerCase());
  document.querySelectorAll('.navlink, .mobilelink').forEach(a=>{
    const normalizedHref = normalize((a.getAttribute('href')||'').toLowerCase());
    if(normalizedHref && normalizedHref !== '/' && normalizedHref === current){
      a.classList.add('text-teal-700','font-semibold');
    }
  });
})();

/* Treatments dropdown */
(function(){
  const btn=document.getElementById('treatmentsBtn');
  const menu=document.getElementById('treatmentsMenu');
  if(!btn||!menu) return;
  const open = ()=>{ menu.classList.remove('invisible','opacity-0','pointer-events-none'); btn.setAttribute('aria-expanded','true'); };
  const close= ()=>{ menu.classList.add('invisible','opacity-0','pointer-events-none'); btn.setAttribute('aria-expanded','false'); };
  const toggle=()=> menu.classList.contains('invisible') ? open() : close();
  btn.addEventListener('click',(e)=>{ e.preventDefault(); toggle(); });
  document.addEventListener('click',(e)=>{ if(!menu.contains(e.target) && !btn.contains(e.target)) close(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') close(); });
})();

// Fallback for Elfsight if widget doesn't mount (quota/errors)
(function(){
  try {
    var holder = document.querySelector('.elfsight-app-72a98893-2543-40fa-a762-735d337640c7');
    var fb = document.getElementById('reviews-fallback');
    if (!holder || !fb) return;
    setTimeout(function(){
      var empty = holder.children.length === 0 || holder.querySelector('.eapps-widget-loading-error');
      if (empty) fb.classList.remove('hidden');
    }, 3500);
  } catch(e) {}
})();

// Lazy-load Elfsight only when visible + fallback if quota hit
(function(){
  var holder = document.querySelector('.elfsight-app-72a98893-2543-40fa-a762-735d337640c7');
  var fb = document.getElementById('reviews-fallback');
  if (!holder) return;

  function showFallback(){ if(fb) fb.classList.remove('hidden'); }
  function loadElfsight(){
    if (window.__elfLoaded) return;
    window.__elfLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://static.elfsight.com/platform/platform.js';
    s.defer = true;
    document.head.appendChild(s);
    // если скрипт не успел отрисоваться (квота/блокировка), показываем фолбэк
    setTimeout(function(){
      var notMounted = holder.children.length === 0 ||
                       holder.querySelector('.eapps-widget-loading-error');
      if (notMounted) showFallback();
    }, 3500);
  }

  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      if(entries[0].isIntersecting){ loadElfsight(); io.disconnect(); }
    }, {rootMargin: '200px'});
    io.observe(holder);
  } else {
    // запасной вариант
    window.addEventListener('load', loadElfsight);
  }
})();
