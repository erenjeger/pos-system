(() => {
  const IMAGE_KEY = 'bones-product-images';
  const SAMPLE = {
    '1':'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=420&q=80',
    '2':'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&h=420&q=80',
    '3':'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=600&h=420&q=80',
    '4':'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&h=420&q=80',
    '5':'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&h=420&q=80',
    '6':'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&h=420&q=80',
    '7':'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&h=420&q=80',
    '8':'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&h=420&q=80',
    '9':'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&h=420&q=80',
    '10':'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&h=420&q=80'
  };

  const readSaved = () => { try { return JSON.parse(localStorage.getItem(IMAGE_KEY) || '{}'); } catch { return {}; } };
  const saved = readSaved();
  const appState = () => window.state;

  function seedSamples() {
    const state = appState();
    if (!state || !state.products) return;
    state.products.forEach(p => {
      if (!p.image && SAMPLE[p.id]) p.image = SAMPLE[p.id];
      if (saved[p.id]) p.image = saved[p.id];
    });
  }

  function persist(id, image) {
    if (!id || !image) return;
    saved[id] = image;
    localStorage.setItem(IMAGE_KEY, JSON.stringify(saved));
    const state = appState();
    const p = state?.products?.find(x => String(x.id) === String(id));
    if (p) p.image = image;
  }

  function addUploadToModal() {
    const modal = document.querySelector('#profit-product-modal .profit-product-modal');
    if (!modal || modal.dataset.imageReady === '1') return;
    modal.dataset.imageReady = '1';
    const state = appState();
    const id = state?.editingId || null;
    const existing = id ? state.products.find(p => String(p.id) === String(id)) : null;
    const currentImage = existing?.image || '';
    const box = document.createElement('div');
    box.className = 'product-image-upload';
    box.innerHTML = `<label>Foto Produk<input id="product-image-input" type="file" accept="image/png,image/jpeg,image/webp"><small>Upload JPG, PNG, atau WebP. Maksimal 2 MB.</small></label><div class="product-image-preview" id="product-image-preview">${currentImage ? `<img src="${currentImage}" alt="Product preview">` : '<span>Preview foto produk</span>'}</div>`;
    const grid = modal.querySelector('.form-grid');
    if (grid) grid.insertAdjacentElement('afterend', box); else modal.querySelector('.margin-preview')?.before(box);

    let selectedImage = currentImage;
    const input = box.querySelector('#product-image-input');
    const preview = box.querySelector('#product-image-preview');
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) { input.value = ''; alert('Ukuran foto maksimal 2 MB'); return; }
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { input.value = ''; alert('Format foto harus JPG, PNG, atau WebP'); return; }
      const reader = new FileReader();
      reader.onload = () => { selectedImage = String(reader.result); preview.innerHTML = `<img src="${selectedImage}" alt="Product preview">`; box.dataset.selectedImage = selectedImage; };
      reader.readAsDataURL(file);
    });

    const save = modal.querySelector('#profit-save');
    if (save) {
      save.addEventListener('click', () => {
        const sku = modal.querySelector('#profit-sku')?.value.trim();
        const name = modal.querySelector('#profit-name')?.value.trim();
        const targetId = existing?.id || null;
        const chosen = box.dataset.selectedImage || selectedImage;
        setTimeout(() => {
          const products = appState()?.products || [];
          const target = targetId ? products.find(p => String(p.id) === String(targetId)) : products.find(p => p.sku === sku || p.name === name);
          if (target && chosen) persist(target.id, chosen);
          requestAnimationFrame(patchCards);
        }, 0);
      });
    }
  }

  function patchCards() {
    const state = appState();
    if (!state) return;
    seedSamples();
    document.querySelectorAll('.product-card').forEach(card => {
      const onclick = card.getAttribute('onclick') || '';
      const m = onclick.match(/addCart\(['"]([^'"]+)['"]\)/);
      const id = m?.[1];
      const p = state.products.find(x => String(x.id) === String(id));
      if (!p) return;
      let thumb = card.querySelector('.product-thumb');
      if (!thumb) { thumb = document.createElement('div'); thumb.className = 'product-thumb'; card.insertBefore(thumb, card.querySelector('b')); }
      if (p.image) thumb.innerHTML = `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
      else thumb.textContent = p.name?.[0] || 'P';
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    body:has(.pos-layout) .product-card .product-thumb{display:flex!important;width:100%;height:70px;margin:-3px 0 3px;align-items:center;justify-content:center;overflow:hidden;border-radius:10px;background:#f4f6f8;order:1}
    body:has(.pos-layout) .product-card .product-thumb img{width:100%;height:100%;object-fit:cover;display:block}
    body:has(.pos-layout) .product-card>b{order:2}
    body:has(.pos-layout) .product-card small{order:3}
    body:has(.pos-layout) .product-card strong{order:4}
    body:has(.pos-layout) .product-card .add-btn{order:5}
    .product-image-upload{margin-top:14px;padding:12px;border:1px dashed #cbd5e1;border-radius:10px;background:#f8fafc}
    .product-image-upload label{display:flex;flex-direction:column;gap:6px;font-weight:600;color:#334155}
    .product-image-upload input{font-weight:400}
    .product-image-upload small{font-weight:400;color:#64748b}
    .product-image-preview{height:130px;margin-top:10px;border-radius:9px;background:#eef2f6;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#94a3b8;font-size:12px}
    .product-image-preview img{width:100%;height:100%;object-fit:cover}
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(() => requestAnimationFrame(() => { addUploadToModal(); patchCards(); }));
  observer.observe(document.body, { childList:true, subtree:true });
  seedSamples();
  patchCards();
})();
