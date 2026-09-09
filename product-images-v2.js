(() => {
  const KEY='bones-product-images';
  const SAMPLES={
    1:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&h=650&q=85',
    2:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&h=650&q=85',
    3:'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=900&h=650&q=85',
    4:'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&h=650&q=85',
    5:'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&h=650&q=85',
    6:'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=900&h=650&q=85',
    7:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&h=650&q=85',
    8:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&h=650&q=85',
    9:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&h=650&q=85',
    10:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&h=650&q=85'
  };
  let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
  const st=()=>window.state;
  function seed(){const s=st();if(!s?.products)return;s.products.forEach(p=>{if(saved[p.id])p.image=saved[p.id];else if(!p.image&&SAMPLES[p.id])p.image=SAMPLES[p.id]})}
  function saveImage(id,img){if(!id||!img)return;saved[id]=img;try{localStorage.setItem(KEY,JSON.stringify(saved))}catch{};const p=st()?.products?.find(x=>String(x.id)===String(id));if(p)p.image=img}
  function modal(){return document.querySelector('#profit-product-modal .profit-product-modal')||document.querySelector('#profit-product-modal .modal')}
  function uploadUI(){
    const m=modal();if(!m||m.querySelector('.product-image-upload'))return;
    const sku=m.querySelector('#profit-sku')?.value?.trim()||'';
    const p=st()?.products?.find(x=>x.sku===sku);
    const current=p?.image||'';
    const box=document.createElement('div');box.className='product-image-upload';
    box.innerHTML='<label>Product Image<input class="product-image-input" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG or WebP · maximum 2 MB</small></label><div class="product-image-preview">'+(current?'<img src="'+current+'" alt="Product preview">':'<span>Image preview</span>')+'</div>';
    const grid=m.querySelector('.form-grid');if(grid)grid.insertAdjacentElement('afterend',box);else m.querySelector('.margin-preview')?.before(box);
    const input=box.querySelector('.product-image-input'),preview=box.querySelector('.product-image-preview');
    input.onchange=()=>{const f=input.files?.[0];if(!f)return;if(f.size>2097152){input.value='';alert('Maximum image size is 2 MB');return}if(!['image/jpeg','image/png','image/webp'].includes(f.type)){input.value='';alert('Image must be JPG, PNG or WebP');return}const r=new FileReader();r.onload=()=>{box.dataset.image=String(r.result);preview.innerHTML='<img src="'+String(r.result)+'" alt="Product preview">'};r.readAsDataURL(f)};
  }
  function afterSave(){const box=document.querySelector('#profit-product-modal .product-image-upload');const img=box?.dataset.image;if(!img)return;const s=st();if(!s?.products?.length)return;const sku=box.closest('.modal')?.querySelector('#profit-sku')?.value?.trim();const p=s.products.find(x=>x.sku===sku)||s.products[s.products.length-1];if(p)saveImage(p.id,img)}
  function cards(){const s=st();if(!s)return;seed();document.querySelectorAll('.product-card').forEach(c=>{const x=(c.getAttribute('onclick')||'').match(/addCart\(['"]([^'"]+)['"]\)/);const p=x&&s.products.find(z=>String(z.id)===String(x[1]));const t=c.querySelector('.product-thumb');if(p&&t&&p.image)t.innerHTML='<img src="'+p.image+'" alt="'+p.name+'" loading="lazy">'})}
  const css=document.createElement('style');css.textContent='#profit-product-modal .product-image-upload{display:block!important;margin-top:16px!important;padding:14px!important;border:1px dashed #b8c4d3!important;border-radius:10px!important;background:#f8fafc!important}.product-image-upload label{display:flex!important;flex-direction:column!important;gap:7px!important;font-weight:600!important;color:#334155!important}.product-image-input{display:block!important;width:100%!important;padding:8px!important;box-sizing:border-box!important}.product-image-upload small{font-size:11px!important;color:#64748b!important}.product-image-preview{height:150px!important;margin-top:10px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;border-radius:9px!important;background:#eef2f6!important;color:#94a3b8!important}.product-image-preview img{width:100%!important;height:100%!important;object-fit:cover!important}';document.head.appendChild(css);
  document.addEventListener('click',e=>{if(e.target.closest('#profit-save'))setTimeout(afterSave,80)},true);
  new MutationObserver(()=>requestAnimationFrame(()=>{seed();uploadUI();cards()})).observe(document.body,{childList:true,subtree:true});
  seed();uploadUI();cards();
})();
