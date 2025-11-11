// год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// ----- DROPS -----
const dropsGrid = document.getElementById('dropsGrid');

function dropCard(d){
  const el = document.createElement('article');
  el.className = 'drop-card';
  el.innerHTML = `
    <a href="#">
      <div class="media">${imgTag(d.image_url)}</div>
      <div class="title">${escapeHtml(d.title || 'Drop')}</div>
      <div class="meta">${d.status || 'SOON'}</div>
    </a>
  `;
  return el;
}

// ----- SHOP -----
const shopGrid = document.getElementById('shopGrid');

function productCard(p){
  const el = document.createElement('article');
  el.className = 'product-card';
  el.innerHTML = `
    <a href="#">
      <div class="media">${imgTag(p.image)}</div>
      <div class="title">${escapeHtml(p.title)}</div>
      <div class="price">$${Number(p.price).toFixed(0)}</div>
    </a>
  `;
  return el;
}

// helpers
function imgTag(src){
  const safe = src || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000&q=80&auto=format&fit=crop';
  return `<img src="${safe}" alt="" loading="lazy" />`;
}
function escapeHtml(s=''){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// load drops from /api/raffles
(async function loadDrops(){
  try{
    const res = await fetch('/api/raffles');
    const data = await res.json();
    const arr = (data?.raffles || []).map(r => ({
      title: r.title || 'Drop',
      image_url: r.image_url, // если добавишь в API
      status: r.ends_at ? 'ENDED' : (r.starts_at ? 'SOON' : 'SOON')
    }));
    dropsGrid.innerHTML = '';
    if(arr.length === 0){
      dropsGrid.innerHTML = `<div class="meta">Скоро новые дропы</div>`;
    } else {
      arr.forEach(d => dropsGrid.appendChild(dropCard(d)));
    }
  }catch(e){
    dropsGrid.innerHTML = `<div class="meta">Не удалось загрузить дропы</div>`;
  }
})();

// load shop from /api/products (см. файл ниже)
(async function loadShop(){
  try{
    const res = await fetch('/api/products');
    const data = await res.json();
    const arr = data?.products || [];
    shopGrid.innerHTML = '';
    if(arr.length === 0){
      shopGrid.innerHTML = `<div class="meta">Товары скоро появятся</div>`;
    } else {
      arr.forEach(p => shopGrid.appendChild(productCard(p)));
    }
  }catch(e){
    shopGrid.innerHTML = `<div class="meta">Не удалось загрузить товары</div>`;
  }
})();
