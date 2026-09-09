(() => {
  const style=document.createElement('style');
  style.textContent=`
    body:has(.pos-layout) .product-card{
      height:225px!important;
      min-height:225px!important;
      padding:12px!important;
      box-sizing:border-box!important;
      overflow:hidden!important;
      display:flex!important;
      flex-direction:column!important;
      align-items:stretch!important;
      gap:5px!important;
    }
    body:has(.pos-layout) .product-card .product-thumb{
      display:flex!important;
      position:relative!important;
      inset:auto!important;
      order:1!important;
      width:100%!important;
      height:125px!important;
      min-height:125px!important;
      max-height:125px!important;
      flex:0 0 125px!important;
      margin:0 0 5px!important;
      padding:0!important;
      overflow:hidden!important;
      border-radius:10px!important;
      z-index:auto!important;
      background:#eef2f6!important;
    }
    body:has(.pos-layout) .product-card .product-thumb img{
      display:block!important;
      position:static!important;
      width:100%!important;
      height:100%!important;
      min-width:100%!important;
      min-height:100%!important;
      object-fit:cover!important;
      object-position:center!important;
    }
    body:has(.pos-layout) .product-card>.product-top{order:0!important;flex:0 0 auto!important}
    body:has(.pos-layout) .product-card>b{position:static!important;order:2!important;display:block!important;left:auto!important;right:auto!important;top:auto!important;margin:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
    body:has(.pos-layout) .product-card>small{position:static!important;order:3!important;display:block!important;left:auto!important;top:auto!important;margin:0!important}
    body:has(.pos-layout) .product-card>strong{position:static!important;order:4!important;display:block!important;left:auto!important;top:auto!important;margin:0!important}
  `;
  document.head.appendChild(style);
})();
