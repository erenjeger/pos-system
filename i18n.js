(() => {
  const KEY = 'bones-language';
  let lang = localStorage.getItem(KEY) || 'id';
  const dict = {
    'Dashboard':'Dashboard','POS':'Payment','Produk':'Products','Transaksi':'Transactions','PRD':'PRD','Admin':'Admin','Administrator':'Administrator',
    'Point of Sale':'Payment','POS System':'POS System','Bones App':'Bones App','Toko Online':'Online Store',
    'Manajemen Produk':'Product Management','Kelola inventori dan produk':'Manage inventory and products','Riwayat Transaksi':'Transaction History','Semua transaksi penjualan':'All sales transactions',
    'Ringkasan penjualan dan analitik':'Sales summary and analytics','Proses transaksi penjualan':'Process sales transactions','Product Requirements Document':'Product Requirements Document',
    'Total Penjualan':'Total Sales','Total Transaksi':'Total Transactions','Rata-rata Transaksi':'Average Transaction','Stok Rendah':'Low Stock','Semua transaksi':'All transactions','Transaksi tercatat':'Recorded transactions','Per transaksi':'Per transaction','Produk perlu restok':'Products need restocking',
    'Tren Penjualan':'Sales Trend','Ringkasan 7 hari terakhir':'Last 7 days summary','Metode Pembayaran':'Payment Methods','Jumlah transaksi':'Number of transactions','Produk Terlaris':'Top Products','Berdasarkan jumlah terjual':'Based on quantity sold',
    'Penjualan per Kategori':'Sales by Category','Nilai penjualan':'Sales value','Transaksi Terbaru':'Recent Transactions','Aktivitas penjualan terbaru':'Latest sales activity','Lihat semua →':'View all →',
    'Keranjang':'Cart','Keranjang kosong':'Cart is empty','Pilih produk untuk memulai transaksi':'Select a product to start a transaction','Nama pelanggan (opsional)':'Customer name (optional)',
    'Subtotal':'Subtotal','Total':'Total','Tunai':'Cash','Kartu':'Card','QRIS':'QRIS','Gopay':'GoPay','Bayar via':'Pay via',
    'Cari produk atau SKU...':'Search product or SKU...','Cari ID transaksi atau nama pelanggan...':'Search transaction ID or customer name...','Semua Kategori':'All Categories','＋ Tambah':'＋ Add',
    'Stok':'Stock','Kategori':'Category','Harga':'Price','Harga Retail':'Retail Price','Harga Jual':'Selling Price','SKU':'SKU','Pelanggan':'Customer','Tanggal & Waktu':'Date & Time','Items':'Items','Pembayaran':'Payment','Aksi':'Actions',
    'Edit':'Edit','Hapus':'Delete','Simpan':'Save','Batal':'Cancel','Tambah Produk':'Add Product','Edit Produk':'Edit Product','Lengkapi informasi produk':'Complete product information',
    'Nama Produk':'Product Name','Makanan':'Food','Minuman':'Beverage','Snack':'Snack','Nilai Inventori':'Inventory Value','Total Produk':'Total Products','Margin per item:':'Margin per item:','Margin kotor':'Gross margin','Total Keuntungan':'Total Profit',
    'Detail Transaksi':'Transaction Details','Tanggal':'Date','ID':'ID','Pembayaran Gopay':'GoPay Payment','Pembayaran QRIS':'QRIS Payment',
    'Scan QR berikut menggunakan aplikasi pembayaran pelanggan.':'Scan the QR code using the customer payment app.','Pembayaran berlaku selama 05:00':'Payment valid for 05:00','Pembayaran Diterima':'Payment Received','Batalkan':'Cancel','Scan QR':'Scan QR',
    'Master product: harga retail, harga jual, dan margin dihitung otomatis.':'Product master: retail price, selling price, and margin are calculated automatically.',
    'Lengkapi data produk':'Please complete the product information.','Harga jual tidak boleh lebih kecil dari harga retail':'Selling price cannot be lower than retail price','SKU harus unik':'SKU must be unique',
    'QR Gopay akan muncul saat checkout':'The GoPay QR will appear at checkout','QR Tunai akan muncul saat checkout':'The Cash QR will appear at checkout','QR Kartu akan muncul saat checkout':'The Card QR will appear at checkout','QR QRIS akan muncul saat checkout':'The QRIS QR will appear at checkout',
    'Walk-in Customer':'Walk-in Customer'
  };
  const reverse = Object.fromEntries(Object.entries(dict).map(([id,en]) => [en,id]));
  const paymentNames = {Tunai:'Cash',Kartu:'Card',QRIS:'QRIS',Gopay:'GoPay',Cash:'Tunai',Card:'Kartu','GoPay':'Gopay'};
  function exact(value) { return lang === 'en' ? (dict[value] || value) : (reverse[value] || value); }
  function dynamic(value) {
    let s = exact(value);
    if (s !== value) return s;
    if (lang === 'en') {
      s = s.replace(/^Stok:\s*(\d+)$/i, 'Stock: $1');
      s = s.replace(/^(\d+)\s+item$/i, (_, n) => `${n} item${Number(n) === 1 ? '' : 's'}`);
      s = s.replace(/^QR\s+(Tunai|Kartu|QRIS|Gopay)\s+akan muncul saat checkout$/i, (_, p) => `The ${paymentNames[p] || p} QR will appear at checkout`);
      s = s.replace(/^Bayar via\s+(Tunai|Kartu|QRIS|Gopay)$/i, (_, p) => `Pay via ${paymentNames[p] || p}`);
      s = s.replace(/(💵|▣)\s*Tunai\b/g, '$1 Cash').replace(/(💳|▤)\s*Kartu\b/g, '$1 Card').replace(/(📱|▯)\s*Gopay\b/g, '$1 GoPay');
      s = s.replace(/^＋\s*Tambah Produk$/i, '＋ Add Product').replace(/^＋\s*Tambah$/i, '＋ Add');
      s = s.replace(/^\s*(\d+)\s+items?\s*·/i, (_, n) => `${n} item${Number(n) === 1 ? '' : 's'} ·`);
    } else {
      s = s.replace(/^Stock:\s*(\d+)$/i, 'Stok: $1');
      s = s.replace(/^(\d+)\s+items?$/i, '$1 item');
      s = s.replace(/^The\s+(Cash|Card|QRIS|GoPay)\s+QR will appear at checkout$/i, (_, p) => `QR ${paymentNames[p] || p} akan muncul saat checkout`);
      s = s.replace(/^Pay via\s+(Cash|Card|QRIS|GoPay)$/i, (_, p) => `Bayar via ${paymentNames[p] || p}`);
      s = s.replace(/(💵|▣)\s*Cash\b/g, '$1 Tunai').replace(/(💳|▤)\s*Card\b/g, '$1 Kartu').replace(/(📱|▯)\s*GoPay\b/g, '$1 Gopay');
      s = s.replace(/^＋\s*Add Product$/i, '＋ Tambah Produk').replace(/^＋\s*Add$/i, '＋ Tambah');
    }
    return s;
  }
  function translateText(node) { const raw=node.nodeValue, trimmed=raw.trim(); if(!trimmed)return; const translated=dynamic(trimmed); if(translated!==trimmed)node.nodeValue=raw.replace(trimmed,translated); }
  function translateNode(node) {
    if(node.nodeType===3){translateText(node);return;}
    if(node.nodeType!==1||node.id==='bones-lang'||node.closest('#bones-lang'))return;
    ['placeholder','title','aria-label'].forEach(attr=>{const value=node.getAttribute(attr);if(value){const translated=dynamic(value);if(translated!==value)node.setAttribute(attr,translated);}});
    node.childNodes.forEach(translateNode);
  }
  function translateAlert(message){return lang==='en'?(dict[message]||dynamic(message)):(reverse[message]||dynamic(message));}
  const nativeAlert=window.alert.bind(window); window.alert=message=>nativeAlert(translateAlert(String(message)));
  function addToggle(){if(document.getElementById('bones-lang'))return;const el=document.createElement('div');el.id='bones-lang';el.innerHTML='<button type="button" data-lang="id">ID</button><span>/</span><button type="button" data-lang="en">EN</button>';el.querySelectorAll('button').forEach(button=>button.onclick=()=>{lang=button.dataset.lang;localStorage.setItem(KEY,lang);renderLanguage();});document.body.appendChild(el);}
  let rendering=false,observer;
  function renderLanguage(){if(rendering||!document.body)return;rendering=true;if(observer)observer.disconnect();translateNode(document.body);addToggle();document.querySelectorAll('#bones-lang button').forEach(button=>button.classList.toggle('active',button.dataset.lang===lang));document.documentElement.lang=lang==='en'?'en':'id';document.title='Bones App';if(observer)observer.observe(document.body,{childList:true,subtree:true});rendering=false;}
  const style=document.createElement('style');style.textContent='#bones-lang{position:fixed;top:14px;right:18px;z-index:9999;display:flex;align-items:center;gap:5px;padding:5px 8px;background:#fff;border:1px solid #e2e5e9;border-radius:9px;box-shadow:0 2px 8px rgba(15,23,42,.08);font:600 12px Arial;color:#94a3b8}#bones-lang button{border:0;background:transparent;color:#64748b;cursor:pointer;font-weight:700;padding:3px 5px;border-radius:5px}#bones-lang button.active{background:#155eef;color:#fff}';document.head.appendChild(style);
  observer=new MutationObserver(()=>requestAnimationFrame(renderLanguage));observer.observe(document.body,{childList:true,subtree:true});renderLanguage();
})();
