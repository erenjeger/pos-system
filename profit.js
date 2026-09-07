(() => {
  const state = window.state;
  if (!state) return;
  const money = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

  // Backfill the master-product cost/sale model.
  const defaults = {
    'BEV-001':5000,'BEV-002':7000,'BEV-003':8000,'BEV-004':6000,
    'FOOD-001':10000,'FOOD-002':9000,'FOOD-003':14000,'FOOD-004':9000,
    'FOOD-005':12000,'BEV-005':6000
  };
  state.products.forEach(p => {
    if (p.retailPrice == null) p.retailPrice = defaults[p.sku] ?? Math.round(Number(p.price || 0) * 0.4);
    if (p.salePrice == null) p.salePrice = Number(p.price || 0);
    p.price = p.salePrice;
  });

  const profitOf = t => (t.items || []).reduce((sum, item) => {
    const p = state.products.find(x => x.id === item.productId);
    const cost = Number(item.unitCost ?? p?.retailPrice ?? 0);
    const sale = Number(item.unitPrice ?? p?.salePrice ?? p?.price ?? 0);
    return sum + (sale - cost) * Number(item.qty || 0);
  }, 0);

  // Preserve cost/sale price on new transactions so historical profit is stable.
  const originalTransactions = state.transactions;
  originalTransactions.forEach(t => t.items?.forEach(item => {
    const p = state.products.find(x => x.id === item.productId);
    if (item.unitCost == null) item.unitCost = Number(p?.retailPrice || 0);
    if (item.unitPrice == null) item.unitPrice = Number(p?.salePrice || p?.price || 0);
  }));
  state.transactions = new Proxy(originalTransactions, {
    get(target, prop) {
      if (prop === 'unshift') return (...items) => {
        items.forEach(t => t.items?.forEach(item => {
          const p = state.products.find(x => x.id === item.productId);
          item.unitCost = Number(item.unitCost ?? p?.retailPrice ?? 0);
          item.unitPrice = Number(item.unitPrice ?? p?.salePrice ?? p?.price ?? 0);
        }));
        return target.unshift(...items);
      };
      return Reflect.get(target, prop);
    }
  });

  function refreshMetrics() {
    const app = document.getElementById('app');
    if (!app) return;
    if (state.page === 'dashboard') {
      const content = app.querySelector('.content');
      if (!content) return;
      const grid = content.querySelector('.stat-grid');
      if (grid) {
        let card = grid.querySelector('.profit-stat');
        const profit = state.transactions.reduce((s,t) => s + profitOf(t), 0);
        if (!card) {
          card = document.createElement('div');
          card.className = 'stat profit-stat';
          grid.insertBefore(card, grid.children[1] || null);
        }
        card.innerHTML = `<div class="stat-icon profit-icon">📈</div><div><span>Total Keuntungan</span><strong>${money(profit)}</strong><small>Margin kotor</small></div>`;
      }
    }

    if (state.page === 'products') patchProductPage();
    if (state.page === 'transactions') patchTransactionPage();
  }

  function patchProductPage() {
    const table = document.querySelector('.content table');
    if (!table) return;
    const head = table.querySelector('thead tr');
    if (head && !head.querySelector('.retail-head')) {
      head.insertBefore(Object.assign(document.createElement('th'), {className:'retail-head', textContent:'Harga Retail'}), head.children[3]);
      head.insertBefore(Object.assign(document.createElement('th'), {className:'sale-head', textContent:'Harga Jual'}), head.children[4]);
      head.insertBefore(Object.assign(document.createElement('th'), {className:'margin-head', textContent:'Margin'}), head.children[5]);
    }
    table.querySelectorAll('tbody tr').forEach((row, i) => {
      const p = state.products[i]; if (!p) return;
      const cells = row.children;
      if (row.querySelector('.retail-cell')) return;
      const retail = document.createElement('td'); retail.className='retail-cell'; retail.textContent=money(p.retailPrice);
      const sale = document.createElement('td'); sale.className='sale-cell'; sale.innerHTML=`<b>${money(p.salePrice)}</b>`;
      const margin = document.createElement('td'); margin.className='margin-cell'; margin.innerHTML=`<span class="profit-pill">${money(p.salePrice-p.retailPrice)}</span>`;
      row.insertBefore(retail, cells[3]);
      row.insertBefore(sale, row.children[4]);
      row.insertBefore(margin, row.children[5]);
    });
  }

  function patchTransactionPage() {
    const table = document.querySelector('.content table');
    if (!table) return;
    const head = table.querySelector('thead tr');
    if (head && !head.querySelector('.profit-head')) {
      const th=document.createElement('th'); th.className='profit-head'; th.textContent='Keuntungan'; head.insertBefore(th, head.lastElementChild);
    }
    table.querySelectorAll('tbody tr').forEach((row, i) => {
      const t=state.transactions[i]; if(!t || row.querySelector('.profit-cell')) return;
      const td=document.createElement('td'); td.className='profit-cell'; td.innerHTML=`<span class="profit-pill">${money(profitOf(t))}</span>`; row.insertBefore(td,row.lastElementChild);
    });
  }

  // Replace the product dialog before the original inline handler runs.
  document.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    const text = button.textContent.trim();
    if (!text.includes('Tambah Produk') && text !== 'Edit') return;
    e.preventDefault(); e.stopImmediatePropagation();
    const match = (button.getAttribute('onclick') || '').match(/openProduct\(['"]([^'"]+)['"]\)/);
    const id = match ? match[1] : null;
    openProfitProductModal(id);
  }, true);

  function openProfitProductModal(id) {
    const p = state.products.find(x => x.id === id);
    const overlay = document.createElement('div'); overlay.className='overlay'; overlay.id='profit-product-modal';
    overlay.innerHTML=`<div class="modal wide profit-product-modal"><button class="close" id="profit-close">×</button><h2>${p?'Edit Produk':'Tambah Produk'}</h2><p>Master product: harga retail, harga jual, dan margin dihitung otomatis.</p><div class="form-grid"><label>Nama Produk<input id="profit-name" value="${p?.name || ''}"></label><label>SKU<input id="profit-sku" value="${p?.sku || ''}"></label><label>Harga Retail<input id="profit-retail" type="number" min="0" value="${p?.retailPrice ?? ''}"></label><label>Harga Jual<input id="profit-sale" type="number" min="0" value="${p?.salePrice ?? p?.price ?? ''}"></label><label>Stok<input id="profit-stock" type="number" min="0" value="${p?.stock ?? ''}"></label><label>Kategori<select id="profit-category"><option ${p?.category==='Makanan'?'selected':''}>Makanan</option><option ${p?.category==='Minuman'?'selected':''}>Minuman</option><option ${p?.category==='Snack'?'selected':''}>Snack</option></select></label></div><div class="margin-preview">Margin per item: <strong id="profit-preview">${money((p?.salePrice ?? p?.price ?? 0)-(p?.retailPrice ?? 0))}</strong></div><div class="modal-actions"><button class="secondary" id="profit-cancel">Batal</button><button class="primary" id="profit-save">Simpan</button></div></div>`;
    document.body.appendChild(overlay);
    const updatePreview=()=>{const a=Number(document.getElementById('profit-retail').value||0),b=Number(document.getElementById('profit-sale').value||0);document.getElementById('profit-preview').textContent=money(b-a)};
    document.getElementById('profit-retail').addEventListener('input',updatePreview);document.getElementById('profit-sale').addEventListener('input',updatePreview);
    const close=()=>overlay.remove();document.getElementById('profit-close').onclick=close;document.getElementById('profit-cancel').onclick=close;
    document.getElementById('profit-save').onclick=()=>{
      const name=document.getElementById('profit-name').value.trim(),sku=document.getElementById('profit-sku').value.trim(),retail=Number(document.getElementById('profit-retail').value),sale=Number(document.getElementById('profit-sale').value),stock=Number(document.getElementById('profit-stock').value),category=document.getElementById('profit-category').value;
      if(!name||!sku||sale<=0||retail<0||stock<0)return alert('Lengkapi data produk');
      if(sale<retail)return alert('Harga jual tidak boleh lebih kecil dari harga retail');
      if(state.products.some(x=>x.sku.toLowerCase()===sku.toLowerCase()&&x.id!==id))return alert('SKU harus unik');
      if(p) Object.assign(p,{name,sku,retailPrice:retail,salePrice:sale,price:sale,stock,category});
      else state.products.push({id:String(Date.now()),name,sku,retailPrice:retail,salePrice:sale,price:sale,stock,category});
      close(); if(window.go) window.go('products');
    };
  }

  const observer = new MutationObserver(() => requestAnimationFrame(refreshMetrics));
  observer.observe(document.getElementById('app'), {childList:true,subtree:true});
  setTimeout(refreshMetrics, 0);
})();
