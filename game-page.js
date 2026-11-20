document.querySelectorAll('.toc').forEach(t=>{if(t.tagName==='DETAILS')t.open=matchMedia('(min-width:981px)').matches});
const viewer=document.getElementById('asb-game-viewer');
document.querySelectorAll('.enlarge').forEach(button=>button.addEventListener('click',()=>{const image=button.querySelector('img');if(!image)return;viewer.querySelector('img').src=image.currentSrc||image.src;viewer.querySelector('img').alt=image.alt;viewer.querySelector('[data-caption]').textContent=image.closest('figure')?.querySelector('figcaption')?.textContent||image.alt;viewer.querySelector('a').href=image.currentSrc||image.src;viewer.showModal()}));
viewer.querySelector('button').addEventListener('click',()=>viewer.close());
