(() => {
  const KEY='bones-language';
  let lang=localStorage.getItem(KEY)||'id';
  const dict={
    'Dashboard':'Dashboard','POS':'POS','Produk':'Products','Transaksi':'Transactions','PRD':'PRD',
    'Manajemen Produk':'Product Management','Kelola inventori dan produk':'Manage inventory and products',
    'Riwayat Transaksi':'Transaction History','Semua transaksi penjualan':'All sales transactions',
    'Ringkasan penjualan dan analitik':'Sales summary and analytics','Proses transaksi penjualan':'Process sales transactions',
    'Point of Sale':'Point of Sale','Produk':'Products','Kelola produk, harga, kategori, SKU, dan stok.':'Manage products, prices, categories, SKUs, and stock.',
    'Tambah Produk':'Add Product','Edit Produk':'Edit Product','Lengkapi informasi produk':'Complete product information',
    'Nama Produk':'Product Name','Harga':'Price','Harga Retail':'Retail Price','Harga Jual':'Selling Price','Stok':'Stock','Kategori':'Category',
    'Makanan':'Food','Minuman':'Beverage','Snack':'Snack','Semua Kategori':'All Categories','Aksi':'Actions','Hapus':'Delete','Simpan':'Save','Batal':'Cancel',
    'Total Produk':'Total Products','Stok Rendah':'Low Stock','Nilai Inventori':'Inventory Value','Margin per item:':'Margin per item:',
    'Total Penjualan':'Total Sales','Total Transaksi':'Total Transactions','Rata-rata Transaksi':'Average Transaction','Produk perlu restok':'Products need restocking',
    'Semua transaksi':'All transactions','Transaksi tercatat':'Recorded transactions','Per transaksi':'Per transaction',
    'Tren Penjualan':'Sales Trend','Ringkasan 7 hari terakhir':'Last 7 days summary','Metode Pembayaran':'Payment Methods','Jumlah transaksi':'Number of transactions',
    'Produk Terlaris':'Top Products','Berdasarkan jumlah terjual':'Based on quantity sold','Penjualan per Kategori':'Sales by Category','Nilai penjualan':'Sales value',
    'Transaksi Terbaru':'Recent Transactions','Aktivitas penjualan terbaru':'Latest sales activity','Lihat semua →':'View all →',
    'Keranjang':'Cart','item':'items','Keranjang kosong':'Cart is empty','Pilih produk untuk memulai transaksi':'Select a product to start a transaction',
    'Nama pelanggan (opsional)':'Customer name (optional)','Tunai':'Cash','Kartu':'Card','QRIS':'QRIS','Gopay':'GoPay','Subtotal':'Subtotal','Total':'Total',
    'Bayar via':'Pay via','Cari produk atau SKU...':'Search product or SKU...','Cari ID transaksi atau nama pelanggan...':'Search transaction ID or customer name...',
    'SKU':'SKU','Pelanggan':'Customer','Tanggal & Waktu':'Date & Time','Items':'Items','Pembayaran':'Payment',
    'Product Requirements Document':'Product Requirements Document','Toko Online':'Online Store','Administrator':'Administrator','Margin kotor':'Gross margin'
  };
  const reverse=Object.fromEntries(Object.entries(dict).map(([id,en])=>[en,id]));
  function tr(s){ if(!s)return s; return lang==='en'?(dict[s]||s):(reverse[s]||s); }
  function translateNode(node){
    if(node.nodeType===3){const raw=node.nodeValue, trimmed=raw.trim(); if(dict[trimmed]||reverse[trimmed]) node.nodeValue=raw.replace(trimmed,tr(trimmed)); return;}
    if(node.nodeType!==1)return;
    if(node.id==='bones-lang'||node.closest('#bones-lang'))return;
    ['placeholder','title','aria-label'].forEach(a=>{const v=node.getAttribute(a);if(v&&(dict[v]||reverse[v]))node.setAttribute(a,tr(v));});
    node.childNodes.forEach(translateNode);
  }
  function addToggle(){
    if(document.getElementById('bones-lang'))return;
    const el=document.createElement('div');el.id='bones-lang';
    el.innerHTML=`<button data-lang="id">ID</button><span>/</span><button data-lang="en">EN</button>`;
    el.querySelectorAll('button').forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem(KEY,lang);renderLanguage();});
    document.body.appendChild(el);
  }
  function renderLanguage(){
    translateNode(document.body); addToggle();
    document.querySelectorAll('#bones-lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
    document.documentElement.lang=lang==='en'?'en':'id';
  }
  const style=document.createElement('style');style.textContent=`#bones-lang{position:fixed;top:14px;right:18px;z-index:9999;display:flex;align-items:center;gap:5px;padding:5px 8px;background:#fff;border:1px solid #e2e5e9;border-radius:9px;box-shadow:0 2px 8px rgba(15,23,42,.08);font:600 12px Arial;color:#94a3b8}#bones-lang button{border:0;background:transparent;color:#64748b;cursor:pointer;font-weight:700;padding:3px 5px;border-radius:5px}#bones-lang button.active{background:#155eef;color:#fff}`;document.head.appendChild(style);
  const observer=new MutationObserver(()=>requestAnimationFrame(renderLanguage));
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(renderLanguage,0);
})();
