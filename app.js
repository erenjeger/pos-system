const products = [
  { id: 'P001', name: 'Kopi Arabica', category: 'Minuman', price: 18000, stock: 24 },
  { id: 'P002', name: 'Kopi Latte', category: 'Minuman', price: 22000, stock: 18 },
  { id: 'P003', name: 'Nasi Goreng', category: 'Makanan', price: 28000, stock: 12 },
  { id: 'P004', name: 'Mie Goreng', category: 'Makanan', price: 25000, stock: 15 },
  { id: 'P005', name: 'Es Teh', category: 'Minuman', price: 8000, stock: 30 },
  { id: 'P006', name: 'Kentang Goreng', category: 'Snack', price: 16000, stock: 20 }
];
let cart = [];
let transactions = [
  { id: 'TRX-001', date: '2026-09-07 08:15', total: 46000, method: 'QRIS', items: 2 },
  { id: 'TRX-002', date: '2026-09-07 09:20', total: 28000, method: 'Cash', items: 1 }
];
const money = n => 'Rp ' + n.toLocaleString('id-ID');
const app = document.getElementById('app');
function layout(active, content) {
  app.innerHTML = `<aside><div class="brand">POS<span>System</span></div><nav>
  ${[['dashboard','Dashboard'],['pos','Kasir'],['products','Produk'],['transactions','Transaksi'],['prd','PRD']].map(([id,label])=>`<button class="nav ${active===id?'active':''}" data-page="${id}">${label}</button>`).join('')}
  </nav></aside><main><header><div><h1>${content.title}</h1><p>${content.subtitle||''}</p></div><div class="status">● Demo Mode</div></header><section class="content">${content.body}</section></main>`;
  document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>render(b.dataset.page));
}
function dashboard(){
 const sales=transactions.reduce((s,t)=>s+t.total,0), items=transactions.reduce((s,t)=>s+t.items,0);
 layout('dashboard',{title:'Dashboard',subtitle:'Ringkasan penjualan dan operasional',body:`<div class="cards"><div class="card"><small>Total Penjualan</small><strong>${money(sales)}</strong><span>Hari ini</span></div><div class="card"><small>Transaksi</small><strong>${transactions.length}</strong><span>Transaksi tercatat</span></div><div class="card"><small>Item Terjual</small><strong>${items}</strong><span>Unit</span></div><div class="card"><small>Produk</small><strong>${products.length}</strong><span>SKU aktif</span></div></div><div class="panel"><h2>Transaksi Terbaru</h2><table><thead><tr><th>ID</th><th>Waktu</th><th>Metode</th><th>Item</th><th>Total</th></tr></thead><tbody>${transactions.map(t=>`<tr><td>${t.id}</td><td>${t.date}</td><td><span class="badge">${t.method}</span></td><td>${t.items}</td><td>${money(t.total)}</td></tr>`).join('')}</tbody></table></div>`});
}
function pos(){
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 layout('pos',{title:'Kasir',subtitle:'Pilih produk untuk membuat transaksi',body:`<div class="pos-grid"><div class="panel"><div class="toolbar"><input id="search" placeholder="Cari produk..." /></div><div class="product-grid" id="product-grid">${products.map(p=>`<button class="product" data-id="${p.id}"><b>${p.name}</b><small>${p.category}</small><strong>${money(p.price)}</strong><em>Stok ${p.stock}</em></button>`).join('')}</div></div><div class="panel cart"><h2>Keranjang</h2>${cart.length?cart.map(x=>`<div class="cart-row"><div><b>${x.name}</b><small>${money(x.price)}</small></div><div class="qty"><button data-minus="${x.id}">−</button><b>${x.qty}</b><button data-plus="${x.id}">+</button></div></div>`).join(''):'<p class="muted">Belum ada produk.</p>'}<div class="total"><span>Total</span><strong>${money(total)}</strong></div><button class="primary" id="pay" ${!cart.length?'disabled':''}>Bayar</button></div></div>`});
 document.querySelectorAll('.product').forEach(b=>b.onclick=()=>{const p=products.find(x=>x.id===b.dataset.id);const x=cart.find(x=>x.id===p.id);if(x)x.qty++;else cart.push({...p,qty:1});pos();});
 document.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>{const x=cart.find(x=>x.id===b.dataset.minus);x.qty--;if(x.qty<=0)cart=cart.filter(y=>y.id!==x.id);pos();});
 document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>{const x=cart.find(x=>x.id===b.dataset.plus);x.qty++;pos();});
 document.getElementById('pay')?.addEventListener('click',()=>{const total=cart.reduce((s,x)=>s+x.price*x.qty,0);transactions.unshift({id:'TRX-'+String(Date.now()).slice(-6),date:new Date().toLocaleString('id-ID'),total,method:'Cash',items:cart.reduce((s,x)=>s+x.qty,0)});cart=[];alert('Pembayaran berhasil');pos();});
 document.getElementById('search').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('.product').forEach(b=>b.style.display=b.innerText.toLowerCase().includes(q)?'flex':'none');};
}
function productPage(){layout('products',{title:'Produk',subtitle:'Kelola katalog produk',body:`<div class="panel"><div class="toolbar"><input id="product-search" placeholder="Cari produk..." /></div><table><thead><tr><th>ID</th><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th></tr></thead><tbody>${products.map(p=>`<tr><td>${p.id}</td><td><b>${p.name}</b></td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.stock}</td></tr>`).join('')}</tbody></table></div>`});}
function transactionsPage(){layout('transactions',{title:'Transaksi',subtitle:'Riwayat transaksi penjualan',body:`<div class="panel"><table><thead><tr><th>ID</th><th>Tanggal</th><th>Metode</th><th>Item</th><th>Total</th></tr></thead><tbody>${transactions.map(t=>`<tr><td>${t.id}</td><td>${t.date}</td><td><span class="badge">${t.method}</span></td><td>${t.items}</td><td><b>${money(t.total)}</b></td></tr>`).join('')}</tbody></table></div>`});}
function prd(){layout('prd',{title:'Product Requirements Document',subtitle:'Ringkasan kebutuhan sistem POS',body:`<div class="panel doc"><h2>POS System</h2><h3>Tujuan</h3><p>Menyediakan sistem point-of-sale sederhana untuk mengelola produk, transaksi kasir, dan laporan penjualan.</p><h3>Fitur Utama</h3><ul><li>Dashboard penjualan</li><li>Kasir dan keranjang belanja</li><li>Manajemen katalog produk</li><li>Riwayat transaksi</li><li>Struktur siap dikembangkan ke backend/API</li></ul><h3>Deployment</h3><p>Versi demo ini berjalan sebagai static web app dan dapat dipublikasikan melalui GitHub Pages.</p></div>`});}
function render(page){({dashboard,pos,products:productPage,transactions:transactionsPage,prd}[page]||dashboard)();}
render('dashboard');
