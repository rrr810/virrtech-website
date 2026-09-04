/* VirrTech v2 — light motion, no decoration */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els=document.querySelectorAll('[data-rv]');
  if(!reduce && 'IntersectionObserver' in window && els.length){
    var io=new IntersectionObserver(function(en){
      en.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.1,rootMargin:'0px 0px -24px 0px'});
    els.forEach(function(e){io.observe(e);});
  } else { els.forEach(function(e){e.classList.add('in');}); }
  document.addEventListener('click',function(e){if(e.target.closest('.mnav a'))document.body.classList.remove('mo');});
  window.matchMedia('(min-width:901px)').addEventListener('change',function(){document.body.classList.remove('mo');});
})();

/* colour theme toggle (light/dark) */
(function(){
  function cur(){ return document.documentElement.getAttribute('data-theme') || 'light'; }
  function paint(){
    var dark = cur()==='dark';
    document.querySelectorAll('.thb').forEach(function(b){
      var ic=b.querySelector('.thb-ic'); if(ic) ic.textContent = dark ? '☾' : '☀';
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      var lbl=b.querySelector('.thb-lbl'); if(lbl) lbl.textContent = dark ? '☾ Light mode' : '☀ Dark mode';
    });
  }
  function set(t){
    if(t==='dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme');
    try{ localStorage.setItem('vt-theme',t); }catch(e){}
    paint();
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest ? ev.target.closest('.thb') : null;
    if(b){ set(cur()==='dark' ? 'light' : 'dark'); }
  });
  paint();
})();
