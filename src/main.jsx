import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3, ShoppingCart, Package, Receipt, FileText, Plus, Minus, Trash2, Search, Wallet } from 'lucide-react';
import './styles.css';

const initialProducts = [
  { id: 'P001', name: 'Kopi Arabica', category: 'Minuman', price: 18000, stock: 24 },
  { id: 'P002', name: 'Kopi Latte', category: 'Minuman', price: 22000, stock: 18 },
  { id: 'P003', name: 'Nasi Goreng', category: 'Makanan', price: 28000, stock: 12 },
  { id: 'P004', name: 'Mie Goreng', category: 'Makanan', price: 25000, stock: 15 },
  { id: 'P005', name: 'Es Teh', category: 'Minuman', price: 8000, stock: 30 },
  { id: 'P006', name: 'Kentang Goreng', category: 'Snack', price: 16000, stock: 20 },
];

const money = n => `Rp ${n.toLocaleString('id-ID')}`;

function App() {
  const [page, setPage] = useState('dashboard');
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 'TRX-001', date: '07 Sep 2026 08:15', customer: 'Walk-in Customer', total: 58000, method: 'Cash' },
    { id: 'TRX-002', date: '07 Sep 2026 08:42', customer: 'Andi', total: 44000, method: 'QRIS' },
    { id: 'TRX-003', date: '07 Sep 2026 09:05', customer: 'Walk-in Customer', total: 28000, method: 'GoPay' },
  ]);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const total = cart.reduce((s, x) => s + x.product.price * x.qty, 0);
  const totalItems = cart.reduce((s, x) => s + x.qty, 0);

  const addToCart = product => setCart(c => {
    const found = c.find(x => x.product.id === product.id);
    if (found) return c.map(x => x.product.id === product.id ? { ...x, qty: x.qty + 1 } : x);
    return [...c, { product, qty: 1 }];
  });
  const changeQty = (id, delta) => setCart(c => c.map(x => x.product.id === id ? { ...x, qty: x.qty + delta } : x).filter(x => x.qty > 0));
  const checkout = method => {
    if (!cart.length) return;
    setTransactions(t => [{ id: `TRX-${String(t.length + 4).padStart(3, '0')}`, date: new Date().toLocaleString('id-ID'), customer: 'Walk-in Customer', total, method }, ...t]);
    setCart([]);
    alert(`Pembayaran berhasil via ${method}`);
  };

  const stats = useMemo(() => ({ sales: transactions.reduce((s, t) => s + t.total, 0), count: transactions.length }), [transactions]);

  const nav = [
    ['dashboard', BarChart3, 'Dashboard'], ['pos', ShoppingCart, 'Kasir'], ['products', Package, 'Produk'], ['transactions', Receipt, 'Transaksi'], ['prd', FileText, 'PRD']
  ];

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">P</div><div><b>POS System</b><small>Point of Sale</small></div></div>
      <nav>{nav.map(([id, Icon, label]) => <button key={id} className={page === id ? 'nav active' : 'nav'} onClick={() => setPage(id)}><Icon size={19}/>{label}</button>)}</nav>
      <div className="sidebar-foot">Demo Mode<br/><span>Data tersimpan sementara</span></div>
    </aside>

    <main className="main">
      <header><div><h1>{nav.find(x => x[0] === page)?.[2]}</h1><p>Kelola operasional toko dengan mudah</p></div><div className="status"><span/> Toko Online</div></header>

      {page === 'dashboard' && <Dashboard stats={stats} transactions={transactions} setPage={setPage} />}
      {page === 'pos' && <POS products={filteredProducts} search={search} setSearch={setSearch} cart={cart} addToCart={addToCart} changeQty={changeQty} total={total} totalItems={totalItems} checkout={checkout} />}
      {page === 'products' && <Products products={products} />}
      {page === 'transactions' && <Transactions transactions={transactions} />}
      {page === 'prd' && <PRD />}
    </main>
  </div>;
}

function Dashboard({ stats, transactions, setPage }) { return <div className="content">
  <div className="cards"><Stat icon={<Wallet/>} title="Total Penjualan" value={money(stats.sales)}/><Stat icon={<Receipt/>} title="Total Transaksi" value={stats.count}/><Stat icon={<BarChart3/>} title="Rata-rata Transaksi" value={money(Math.round(stats.sales / (stats.count || 1)))} /></div>
  <section className="panel"><div className="panel-head"><div><h2>Transaksi Terbaru</h2><p>Aktivitas penjualan terbaru</p></div><button className="link" onClick={() => setPage('transactions')}>Lihat semua</button></div><TransactionTable transactions={transactions.slice(0, 5)} /></section>
</div> }
function Stat({ icon, title, value }) { return <div className="stat"><div className="icon">{icon}</div><div><span>{title}</span><strong>{value}</strong></div></div> }
function POS({ products, search, setSearch, cart, addToCart, changeQty, total, totalItems, checkout }) { return <div className="pos-grid">
  <section className="panel product-panel"><div className="search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."/></div><div className="product-grid">{products.map(p => <button className="product" key={p.id} onClick={() => addToCart(p)}><div className="product-img">{p.name[0]}</div><div className="product-name">{p.name}</div><small>{p.category} · Stok {p.stock}</small><b>{money(p.price)}</b><span className="add"><Plus size={15}/> Tambah</span></button>)}</div></section>
  <section className="panel cart"><div className="panel-head"><div><h2>Keranjang</h2><p>{totalItems} item</p></div></div>{cart.length === 0 ? <div className="empty">Keranjang masih kosong<br/><small>Pilih produk untuk memulai transaksi</small></div> : <>{cart.map(x => <div className="cart-item" key={x.product.id}><div><b>{x.product.name}</b><small>{money(x.product.price)}</small></div><div className="qty"><button onClick={() => changeQty(x.product.id, -1)}><Minus size={14}/></button><span>{x.qty}</span><button onClick={() => changeQty(x.product.id, 1)}><Plus size={14}/></button></div><b>{money(x.product.price * x.qty)}</b></div>)}<div className="total"><span>Total</span><strong>{money(total)}</strong></div><div className="pay"><button onClick={() => checkout('Cash')}>Cash</button><button onClick={() => checkout('QRIS')}>QRIS</button><button onClick={() => checkout('GoPay')}>GoPay</button></div></>}</section>
</div> }
function Products({ products }) { return <div className="content"><div className="panel-head action"><div><h2>Daftar Produk</h2><p>Kelola produk dan stok</p></div><button className="primary"><Plus size={17}/> Tambah Produk</button></div><section className="panel table-wrap"><table><thead><tr><th>SKU</th><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td>{p.id}</td><td><b>{p.name}</b></td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td></tr>)}</tbody></table></section></div> }
function Transactions({ transactions }) { return <div className="content"><section className="panel table-wrap"><div className="panel-head"><div><h2>Riwayat Transaksi</h2><p>Semua transaksi penjualan</p></div></div><TransactionTable transactions={transactions}/></section></div> }
function TransactionTable({ transactions }) { return <table><thead><tr><th>ID Transaksi</th><th>Tanggal & Waktu</th><th>Pelanggan</th><th>Metode</th><th>Total</th></tr></thead><tbody>{transactions.map(t => <tr key={t.id}><td><b>{t.id}</b></td><td>{t.date}</td><td>{t.customer}</td><td><span className="badge">{t.method}</span></td><td><b>{money(t.total)}</b></td></tr>)}</tbody></table> }
function PRD() { return <div className="content"><section className="panel prd"><h2>Product Requirements Document</h2><p>POS System untuk mengelola penjualan, produk, stok, pembayaran, dan laporan transaksi.</p><h3>Fitur Utama</h3><ul><li>Dashboard reporting dan ringkasan penjualan</li><li>Kasir dengan keranjang dan checkout</li><li>Manajemen produk dan stok</li><li>Riwayat transaksi</li><li>Simulasi pembayaran Cash, QRIS, dan GoPay</li></ul><h3>Status</h3><p>Demo frontend — data saat ini bersifat in-memory dan akan reset ketika halaman direfresh.</p></section></div> }

createRoot(document.getElementById('root')).render(<App/>);
