// Мобильное меню
const burgerBtn = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');
if (burgerBtn && mobileNav) {
  burgerBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  }));
}

// Текущий год в футере
document.getElementById('year').textContent = new Date().getFullYear().toString();

// Статус /api/health
(async function checkStatus(){
  const el = document.getElementById('statusBar');
  try{
    const res = await fetch('/api/health');
    if(!res.ok) throw new Error('not ok');
    const data = await res.json();
    el.textContent = `API: OK • ${new Date(data.ts).toLocaleString()}`;
  }catch(e){
    el.textContent = 'API недоступно. Попробуйте позже.';
  }
})();

// Подгрузка рафлов
const rafflesList = document.getElementById('rafflesList');
function raffleCard(r){
  const card = document.createElement('article');
  card.className = 'card raffle-card';
  card.innerHTML = `
    <h3>${r.title ?? 'Релиз'}</h3>
    <p>${r.description ?? 'Лимитированный дроп'}</p>
    <div class="raffle-meta">
      <span>Победителей: ${r.winners_count ?? 1}</span>
      ${r.starts_at ? `<span>Старт: ${new Date(r.starts_at).toLocaleString()}</span>` : ''}
      ${r.ends_at ? `<span>Финиш: ${new Date(r.ends_at).toLocaleString()}</span>` : ''}
    </div>
  `;
  return card;
}

(async function loadRaffles(){
  try{
    const res = await fetch('/api/raffles');
    if(!res.ok) throw new Error('not ok');
    const data = await res.json();
    const arr = data.raffles ?? [];
    rafflesList.innerHTML = '';
    if(arr.length === 0){
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.textContent = 'Скоро добавим новые розыгрыши.';
      rafflesList.appendChild(empty);
    } else {
      arr.forEach(r => rafflesList.appendChild(raffleCard(r)));
    }
  }catch(e){
    const err = document.createElement('div');
    err.className = 'card';
    err.textContent = 'Не удалось загрузить список рафлов.';
    rafflesList.appendChild(err);
  }
})();

// Отправка формы участия
const form = document.getElementById('raffleForm');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submitBtn');

function showError(field, msg){
  const wrap = field.closest('.field');
  wrap.querySelector('.error').textContent = msg || '';
}

function validate(form){
  let ok = true;
  const name = form.elements['name'];
  const tg = form.elements['telegram'];
  const size = form.elements['size'];
  showError(name,''); showError(tg,''); showError(size,'');

  if(!name.value.trim()){ showError(name,'Укажи имя'); ok = false; }
  if(!tg.value.trim() || !/^@?[A-Za-z0-9_]{5,32}$/.test(tg.value.trim())){ showError(tg,'Некорректный @username'); ok = false; }
  if(!size.value){ showError(size,'Выбери размер'); ok = false; }

  return ok;
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!validate(form)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';
    toast.classList.remove('show');
    try{
      const payload = {
        name: form.elements['name'].value.trim(),
        telegram: form.elements['telegram'].value.trim().replace(/^@/, ''),
        size: form.elements['size'].value,
      };
      const res = await fetch('/api/raffles', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(()=> ({}));
      if(!res.ok) throw new Error(data?.error || 'Ошибка заявки');

      toast.textContent = 'Заявка отправлена! Удачи в розыгрыше ✨';
      toast.classList.add('show');
      form.reset();
    }catch(err){
      toast.textContent = 'Не удалось отправить заявку. Попробуй позже.';
      toast.classList.add('show');
    }finally{
      submitBtn.disabled = false;
      submitBtn.textContent = 'Участвовать';
    }
  });
}
