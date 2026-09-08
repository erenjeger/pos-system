(() => {
  const money = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
  const monthMap = {Januari:0,Februari:1,Maret:2,April:3,Mei:4,Juni:5,Juli:6,Agustus:7,September:8,Oktober:9,November:10,Desember:11};
  const parseDate = value => {
    const m = String(value || '').match(/^(\d{1,2})\s+([^,]+),\s+(\d{4})/);
    return m && monthMap[m[2]] !== undefined ? new Date(Number(m[3]), monthMap[m[2]], Number(m[1])) : null;
  };
  const key = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const shortDate = d => d.toLocaleDateString('id-ID', {day:'2-digit', month:'short'});

  function trendHtml(state) {
    const tx = state.transactions || [];
    const dates = tx.map(t => parseDate(t.date)).filter(Boolean);
    const anchor = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
    anchor.setHours(0,0,0,0);
    const days = [];
    for (let i=6;i>=0;i--) { const d=new Date(anchor); d.setDate(anchor.getDate()-i); days.push(d); }
    const byDay = new Map(days.map(d => [key(d), {date:d, sales:0, units:0, count:0, products:new Map()}]));
    tx.forEach(t => {
      const d=parseDate(t.date), bucket=d && byDay.get(key(d));
      if (!bucket) return;
      bucket.sales += Number(t.total || 0);
      bucket.count += 1;
      (t.items || []).forEach(item => {
        bucket.units += Number(item.qty || 0);
        const p=(state.products||[]).find(x => String(x.id)===String(item.productId));
        if (p) bucket.products.set(p.name, (bucket.products.get(p.name)||0)+Number(item.qty||0));
      });
    });
    const data=[...byDay.values()];
    const max=Math.max(...data.map(x=>x.sales),1);
    const total=data.reduce((s,x)=>s+x.sales,0);
    const units=data.reduce((s,x)=>s+x.units,0);
    const active=data.filter(x=>x.count>0).length;
    const best=[...data.flatMap(x=>[...x.products.entries()].map(([name,qty])=>({name,qty})))].reduce((a,x)=>!a||x.qty>a.qty?x:a,null);
    const bars=data.map(x=>{
      const pct=Math.max(3, Math.round(x.sales/max*100));
      const top=[...x.products.entries()].sort((a,b)=>b[1]-a[1])[0];
      return `<div class="trend-col" title="${shortDate(x.date)} • ${money(x.sales)} • ${x.units} item${x.units===1?'':'s'}"><div class="trend-value">${x.sales?money(x.sales):'Rp 0'}</div><div class="trend-bar-wrap"><div class="trend-bar" style="height:${pct}%"></div></div><b>${shortDate(x.date)}</b><small>${x.units} item${x.units===1?'':'s'}${top?` · ${top[0]}`:''}</small></div>`;
    }).join('');
    return `<div class="trend-summary"><div><span>7-day sales</span><strong>${money(total)}</strong></div><div><span>Units sold</span><strong>${units}</strong></div><div><span>Active days</span><strong>${active}/7</strong></div><div><span>Top product</span><strong>${best?best.name:'-'}</strong></div></div><div class="sales-trend-chart">${bars}</div><div class="trend-note">Actual transaction data is used. Daily bars combine all products sold on that date.</div>`;
  }

  function patchTrend() {
    const state = window.state;
    if (!state || state.page !== 'dashboard') return;
    const headings=[...document.querySelectorAll('h2')];
    const heading=headings.find(h => h.textContent.trim()==='Tren Penjualan' || h.textContent.trim()==='Sales Trend');
    if (!heading) return;
    const panel=heading.closest('.panel');
    if (!panel || panel.dataset.trendEnhanced==='1') return;
    const head=heading.closest('.panel-head');
    if (!head) return;
    const old=head.nextElementSibling;
    if (old) old.remove();
    const wrap=document.createElement('div');
    wrap.className='enhanced-trend';
    wrap.innerHTML=trendHtml(state);
    head.after(wrap);
    panel.dataset.trendEnhanced='1';
  }

  function renamePayment() {
    document.querySelectorAll('.nav').forEach(btn => {
      const text=[...btn.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue.trim()).join(' ');
      if (text==='POS') {
        [...btn.childNodes].filter(n=>n.nodeType===3).forEach(n=>{ if(n.nodeValue.trim()==='POS') n.nodeValue=n.nodeValue.replace('POS','Payment'); });
      }
    });
    document.querySelectorAll('h1').forEach(h => { if(h.textContent.trim()==='Point of Sale') h.textContent='Payment'; });
    document.querySelectorAll('p').forEach(p => { if(p.textContent.trim()==='Proses transaksi penjualan') p.textContent='Process sales transactions'; });
  }

  const style=document.createElement('style');
  style.textContent=`
    .enhanced-trend{padding:4px 0 0}.trend-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:4px 0 18px}.trend-summary>div{padding:10px 12px;border:1px solid #edf0f3;border-radius:10px;background:#fafbfc;min-width:0}.trend-summary span{display:block;font-size:11px;color:#7b8494;margin-bottom:4px}.trend-summary strong{display:block;font-size:14px;color:#101828;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sales-trend-chart{height:235px;display:grid;grid-template-columns:repeat(7,1fr);gap:12px;align-items:end;padding:4px 2px 0}.trend-col{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0}.trend-value{font-size:9px;color:#667085;height:18px;white-space:nowrap;transform:scale(.9)}.trend-bar-wrap{height:145px;width:100%;display:flex;align-items:flex-end;justify-content:center}.trend-bar{width:min(34px,65%);min-height:4px;border-radius:7px 7px 3px 3px;background:#155eef}.trend-col b{font-size:10px;color:#344054;margin-top:8px}.trend-col small{font-size:9px;color:#98a2b3;max-width:95px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.trend-note{font-size:10px;color:#98a2b3;margin-top:12px}.store-status{transition:none}@media(max-width:900px){.trend-summary{grid-template-columns:repeat(2,1fr)}.sales-trend-chart{gap:5px}.trend-bar{width:70%}}
  `;
  document.head.appendChild(style);

  const observer=new MutationObserver(()=>requestAnimationFrame(()=>{patchTrend();renamePayment();}));
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>{patchTrend();renamePayment();},50);
})();
