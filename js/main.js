(function(){
  var modal = document.getElementById('quoteModal');
  document.querySelectorAll('[data-modal="quote"]').forEach(function(el){
    el.addEventListener('click',function(e){e.preventDefault();modal.classList.add('open');});
  });
  var closeBtn = modal.querySelector('.modal-close');
  closeBtn && closeBtn.addEventListener('click',function(){modal.classList.remove('open');});
  modal.addEventListener('click',function(e){if(e.target===modal)modal.classList.remove('open');});

  document.querySelectorAll('.faq-question').forEach(function(q){
    q.addEventListener('click',function(){
      q.closest('.faq-item').classList.toggle('open');
    });
  });

  var ham = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  ham && ham.addEventListener('click',function(){
    mobileNav.classList.toggle('open');
    ham.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });

  document.querySelectorAll('.nav-dropdown > button').forEach(function(btn){
    btn.addEventListener('click',function(){
      var dropdown = btn.closest('.nav-dropdown');
      document.querySelectorAll('.nav-dropdown').forEach(function(d){if(d!==dropdown)d.classList.remove('open');});
      dropdown.classList.toggle('open');
      btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
    });
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.nav-dropdown')){
      document.querySelectorAll('.nav-dropdown').forEach(function(d){d.classList.remove('open');});
    }
  });
})();

document.querySelectorAll('.ba-slider').forEach(function(slider){
  var afterImg = slider.querySelector('.ba-slide-img--after');
  var handle = slider.querySelector('.ba-handle');
  var dragging = false;
  function setPos(pct){
    pct = Math.max(0,Math.min(100,pct));
    afterImg.style.clipPath = 'inset(0 '+(100-pct)+'% 0 0)';
    handle.style.left = pct+'%';
  }
  function getPct(e){
    var rect = slider.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }
  slider.addEventListener('mousedown',function(e){dragging=true;setPos(getPct(e));e.preventDefault();});
  slider.addEventListener('touchstart',function(e){dragging=true;setPos(getPct(e));},{passive:true});
  document.addEventListener('mousemove',function(e){if(dragging)setPos(getPct(e));});
  document.addEventListener('touchmove',function(e){if(dragging)setPos(getPct(e));},{passive:true});
  document.addEventListener('mouseup',function(){dragging=false;});
  document.addEventListener('touchend',function(){dragging=false;});
});

(function(){
  var els=document.querySelectorAll('[data-counter]');
  if(!els.length) return;
  function run(){
    els.forEach(function(el){
      var target=parseFloat(el.dataset.counter);
      var suffix=el.dataset.suffix||'';
      var isFloat=el.dataset.counter.indexOf('.')!==-1;
      var t0=null,dur=850;
      requestAnimationFrame(function tick(now){
        if(!t0) t0=now;
        var p=Math.min((now-t0)/dur,1);
        var ease=1-Math.pow(1-p,3);
        el.textContent=(isFloat?(target*ease).toFixed(1):Math.round(target*ease))+suffix;
        if(p<1) requestAnimationFrame(tick);
      });
    });
  }
  if(!window.IntersectionObserver){run();return;}
  var done=false;
  var io=new IntersectionObserver(function(entries){
    if(done||!entries.some(function(e){return e.isIntersecting;})) return;
    done=true; io.disconnect(); run();
  },{threshold:0.5});
  var block=document.querySelector('.owner-stats');
  if(block) io.observe(block);
})();


(function(){
  if(!window.matchMedia||window.matchMedia('(pointer:coarse)').matches) return;
  var heroImg=document.querySelector('.hero-right img');
  var hero=document.querySelector('.hero');
  if(!heroImg||!hero) return;
  heroImg.style.willChange='transform';
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY||window.pageYOffset;
      if(y<=hero.offsetHeight) heroImg.style.transform='translateY('+(-(y*0.18))+'px)';
      ticking=false;
    });
  },{passive:true});
})();
