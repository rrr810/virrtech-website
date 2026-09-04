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
