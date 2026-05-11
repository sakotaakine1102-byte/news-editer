`use scrict`;

  const open = document.getElementById('open');
const close = document.getElementById('close');
const overlay = document.querySelector('.overlay');
const navLinks = document.querySelectorAll('.overlay nav a'); // メニュー内のリンクを全部取得

// 開くボタンを押した時
open.addEventListener('click', () => {
  overlay.classList.add('show');
  open.classList.add(`hide`);
});

// 閉じるボタンを押した時
close.addEventListener('click', () => {
  overlay.classList.remove('show');
  open.classList.remove(`hide`);
});

// ★追加：メニュー内のリンクをクリックしたら閉じる
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    overlay.classList.remove('show');
    open.classList.remove(`hide`);
  });
});
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
