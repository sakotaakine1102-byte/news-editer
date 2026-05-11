'use strict';

/* ==========================================================
   そらHP - main.js
   - ハンバーガーメニューの開閉
   - スムーズスクロール（ページ内リンク）
   - お問い合わせフォームの簡易バリデーション
   ========================================================== */

{
  /* ---------- ハンバーガーメニュー ---------- */
  const open = document.getElementById('open');
  const overlay = document.querySelector('.overlay');
  const close = document.getElementById('close');

  if (open && overlay && close) {
    const openMenu = () => {
      overlay.classList.add('show');
      open.classList.add('hide');
      overlay.setAttribute('aria-hidden', 'false');
    };
    const closeMenu = () => {
      overlay.classList.remove('show');
      open.classList.remove('hide');
      overlay.setAttribute('aria-hidden', 'true');
    };

    open.addEventListener('click', openMenu);
    close.addEventListener('click', closeMenu);

    // キーボード操作（Enter / Space でも開閉）
    [open, close].forEach((el) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });

    // オーバーレイ内のリンクをタップしたら自動で閉じる
    overlay.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => closeMenu());
    });

    // Esc でも閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) {
        closeMenu();
      }
    });
  }
}

{
  /* ---------- スムーズスクロール ---------- */
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ========== お問い合わせフォーム Ajax送信 ========== */
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;

  const overlay = document.getElementById('form-overlay');
  const states = overlay.querySelectorAll('.form-state');
  const showState = (name) => {
    states.forEach(s => s.classList.toggle('active', s.dataset.state === name));
  };

  form.addEventListener('submit', async function(e){
    e.preventDefault();   // Formspreeの画面に飛ばないように

    // チェックボックス（ご希望）が1つ以上選択されているか
    const topicChecked = form.querySelectorAll('input[name="topic[]"]:checked');
    if (topicChecked.length === 0) {
      alert('「ご希望」を1つ以上お選びください');
      return;
    }

    // オーバーレイ表示 → 送信中
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    showState('sending');

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // 紙飛行機を最低1.5秒見せる演出
        await new Promise(r => setTimeout(r, 1500));
        showState('success');
        form.reset();
      } else {
        showState('error');
      }
    } catch (err) {
      showState('error');
    }
  });

  // 「もう一度送信する」ボタン
  document.getElementById('form-reset')?.addEventListener('click', () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  });

  // 「もう一度試す」ボタン（エラー時）
  document.getElementById('form-retry')?.addEventListener('click', () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  });
})();
/* ========== お知らせカード拡大モーダル ========== */
(function(){
  const modal = document.getElementById('news-modal');
  if (!modal) return;
  
  const content = modal.querySelector('.news-modal-content');
  const closeBtn = modal.querySelector('.news-modal-close');
  
  // カードクリックで開く
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.news-title').textContent;
      const date = card.querySelector('time').textContent;
      const fullTpl = card.querySelector('.news-full');
      const fullHTML = fullTpl ? fullTpl.innerHTML : '';
      
      content.innerHTML = `
        <h2>${title}</h2>
        <time>${date}</time>
        ${fullHTML}
      `;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // 閉じる
  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
