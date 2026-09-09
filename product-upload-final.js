(() => {
  const KEY='bones-product-images';
  const getState=()=>window.state;
  let pendingImage='';
  function saved(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
  function store(id,img){if(!id||!img)return;const data=saved();data[id]=img;try{localStorage.setItem(KEY,JSON.stringify(data))}catch{};const p=getState()?.products?.find(x=>String(x.id)===String(id));if(p)p.image=img}
  function findModal(){return document.querySelector('#profit-product-modal .profit-product-modal')}
  function inject(){
    const modal=findModal();
    if(!modal||modal.querySelector('#final-product-image-upload'))return;
    const box=document.createElement('div');box.id='final-product-image-upload';box.className='final-product-image-upload';
    box.innerHTML='<div class="final-image-title">Product Image</div><input id="final-product-image" type="file" accept="image/jpeg,image/png,image/webp"><div class="final-image-help">JPG, PNG or WebP · maximum 2 MB</div><div id="final-image-preview" class="final-image-preview"><span>Click to choose an image</span></div>';
    const actions=modal.querySelector('.modal-actions');
    if(actions)modal.insertBefore(box,actions);else modal.appendChild(box);
    const input=box.querySelector('#final-product-image'),preview=box.querySelector('#final-image-preview');
    input.addEventListener('change',()=>{
      const file=input.files?.[0];if(!file)return;
      if(file.size>2*1024*1024){input.value='';alert('Maximum image size is 2 MB');return}
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)){input.value='';alert('Image must be JPG, PNG or WebP');return}
      const reader=new FileReader();reader.onload=()=>{pendingImage=String(reader.result);preview.innerHTML='<img src="'+pendingImage+'" alt="Product preview">'};reader.readAsDataURL(file);
    });
  }
  function saveImageAfterClick(){
    if(!pendingImage)return;
    const modal=findModal(),s=getState();if(!modal||!s)return;
    const sku=modal.querySelector('#profit-sku')?.value?.trim();
    const p=s.products.find(x=>x.sku===sku)||s.products[s.products.length-1];
    if(p)store(p.id,pendingImage);
    pendingImage='';
  }
  document.addEventListener('click',e=>{if(e.target.closest('#profit-save'))setTimeout(saveImageAfterClick,120)},true);
  const css=document.createElement('style');css.textContent=`
    #profit-product-modal .final-product-image-upload{display:block!important;width:100%!important;box-sizing:border-box!important;margin:16px 0!important;padding:14px!important;border:1px dashed #c6d0dc!important;border-radius:10px!important;background:#f8fafc!important}
    #profit-product-modal .final-image-title{font-size:13px!important;font-weight:700!important;color:#334155!important;margin-bottom:8px!important}
    #profit-product-modal #final-product-image{display:block!important;width:100%!important;box-sizing:border-box!important;padding:8px!important;border:1px solid #cbd5e1!important;border-radius:7px!important;background:#fff!important;font-size:13px!important}
    #profit-product-modal .final-image-help{font-size:11px!important;color:#64748b!important;margin-top:6px!important}
    #profit-product-modal .final-image-preview{width:100%!important;height:110px!important;margin-top:10px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;border-radius:8px!important;background:#eef2f6!important;color:#94a3b8!important;font-size:12px!important}
    #profit-product-modal .final-image-preview img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
  `;document.head.appendChild(css);
  inject();
  new MutationObserver(inject).observe(document.body,{childList:true,subtree:true});
  setInterval(inject,500);
})();
