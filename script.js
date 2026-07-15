/* VERO STUDIO — script.js */

document.addEventListener('DOMContentLoaded', () => {

  /* Header scroll state */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav toggle */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    }));
  }

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* Hero neural-node canvas animation */
  const canvas = document.querySelector('.hero-nodes');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const NODE_COUNT = 46;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    const SCALE = 1.69; // moving elements enlarged 30%, then another 30%
    const LINK_DIST = 170 * SCALE;
    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: (Math.random() * 1.6 + 0.6) * SCALE,
        star: Math.random() < 0.3
      }));
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(201,162,75,${(1 - dist / LINK_DIST) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.star ? 'rgba(255,255,255,0.9)' : 'rgba(232,214,160,0.85)';
        ctx.fill();
      });
      requestAnimationFrame(step);
    }
    resize();
    initNodes();
    window.addEventListener('resize', () => { resize(); initNodes(); });
    step();
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('open');
    });
  });

  /* Contact form (demo submit) */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
      contactForm.reset();
      if (success) setTimeout(() => success.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    });
  }

  /* ===== Chatbot demo ===== */
  const chatWindow = document.querySelector('[data-chat-window]');
  const chatReplay = document.querySelector('[data-chat-replay]');
  const chatInputForm = document.querySelector('[data-chat-form]');

  const chatScript = window.__VERO_CHAT_SCRIPT__ || [];

  function addMsg(role, text) {
    if (!chatWindow) return;
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--' + role;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    t.setAttribute('data-typing', '');
    chatWindow.appendChild(t);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return t;
  }

  function playChatScript() {
    if (!chatWindow || !chatScript.length) return;
    chatWindow.innerHTML = '';
    let delay = 300;
    chatScript.forEach((line) => {
      if (line.role === 'bot') {
        delay += 700;
        setTimeout(() => {
          const t = showTyping();
          setTimeout(() => { t.remove(); addMsg('bot', line.text); }, 900);
        }, delay);
        delay += 900;
      } else {
        delay += 500;
        setTimeout(() => addMsg('user', line.text), delay);
      }
    });
  }

  if (chatWindow) {
    playChatScript();
    if (chatReplay) chatReplay.addEventListener('click', playChatScript);
  }
  if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatInputForm.querySelector('input');
      if (!input.value.trim()) return;
      addMsg('user', input.value.trim());
      input.value = '';
      const t = showTyping();
      setTimeout(() => {
        t.remove();
        addMsg('bot', chatInputForm.getAttribute('data-fallback') || 'Dziękuję za wiadomość — to jest wersja demonstracyjna. W realnym wdrożeniu asystent odpowiada na podstawie wiedzy Twojej firmy 24/7.');
      }, 1100);
    });
  }

  /* ===== Agent workflow demo ===== */
  const agentSteps = document.querySelectorAll('[data-agent-step]');
  if (agentSteps.length) {
    let i = 0;
    const cycle = () => {
      agentSteps.forEach(s => s.classList.remove('active'));
      agentSteps[i].classList.add('active');
      i = (i + 1) % agentSteps.length;
    };
    cycle();
    setInterval(cycle, 2200);
  }

});
