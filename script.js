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

  /* ===== Site-wide chat widget (rule-based lead-qualification assistant) =====
     No backend, no API key — a decision tree that gets a visitor from an
     opening question to booking the free consultation via Calendly, with a
     mailto fallback. Swap this out for a real LLM-backed agent later. */
  const widget = document.getElementById('chatWidget');
  if (widget) {
    const isEn = document.documentElement.lang === 'en';
    const CALENDLY_URL = 'https://calendly.com/vero-studio/konsultacja';
    const CONTACT_EMAIL = 'hello@verostudio.pl';

    const copy = isEn ? {
      greeting: "Hi! I'm the Vero Studio assistant 👋 What can I help you with?",
      options: [
        { id: 'www', label: 'Website / store quote', reply: "Great — we design premium websites and eCommerce stores built for conversion. What's your name?" },
        { id: 'auto', label: 'AI automation', reply: "Good choice — AI automation can take repetitive tasks off your team's plate. What's your name?" },
        { id: 'bot', label: 'Chatbot / AI agent', reply: "That's our specialty — chatbots and AI agents that answer customers 24/7. What's your name?" },
        { id: 'unsure', label: 'Just browsing', reply: "No rush at all! Mind telling me your name so I can point you in the right direction?" }
      ],
      askEmail: (name) => `Great to meet you, ${name}! What's your email address? I'll send over some times for a free consultation.`,
      invalidEmail: "Hmm, that email doesn't look quite right — mind double-checking it?",
      final: (name) => `Thank you, ${name}! Book a slot below, or email us directly — we'll get back to you as soon as possible.`,
      calendlyLabel: '📅 Book a free consultation',
      emailLabel: '✉️ Email us',
      restartLabel: '↺ Start over',
      placeholderChoice: 'Type a message…',
      placeholderName: 'Your name…',
      placeholderEmail: 'Your email address…',
      fallbackStart: 'You can type your own message, or just pick one of the options above –',
      mailSubject: 'Free consultation request — Vero Studio',
      mailBody: (name, email, interest) => `Hi Vero Studio,%0D%0A%0D%0AName: ${name}%0D%0AEmail: ${email}%0D%0AInterested in: ${interest}%0D%0A%0D%0APlease reach out to arrange a free consultation.`,
      toggleLabel: 'Open chat with the Vero Studio assistant'
    } : {
      greeting: 'Cześć! Jestem asystentem Vero Studio 👋 W czym mogę pomóc?',
      options: [
        { id: 'www', label: 'Wycena strony / sklepu', reply: 'Świetnie! Strony WWW i sklepy eCommerce projektujemy w klasie premium, pod konwersję. Jak masz na imię?' },
        { id: 'auto', label: 'Automatyzacje AI', reply: 'Dobry wybór — automatyzacje AI potrafią przejąć powtarzalne zadania w Twojej firmie. Jak masz na imię?' },
        { id: 'bot', label: 'Chatbot / Agent AI', reply: 'To nasza specjalność — chatboty i agenci AI, którzy odpowiadają klientom 24/7. Jak masz na imię?' },
        { id: 'unsure', label: 'Jeszcze się rozglądam', reply: 'Jasne, nie ma pośpiechu! Zostawisz mi swoje imię, żebym mogła podpowiedzieć Ci, od czego zacząć?' }
      ],
      askEmail: (name) => `Miło Cię poznać, ${name}! Podaj adres e-mail, na który prześlę propozycję terminów bezpłatnej konsultacji.`,
      invalidEmail: 'Hmm, ten adres e-mail nie wygląda poprawnie — możesz go poprawić?',
      final: (name) => `Dziękuję, ${name}! Umów termin poniżej, albo napisz do nas bezpośrednio — odezwiemy się najszybciej, jak to możliwe.`,
      calendlyLabel: '📅 Umów bezpłatną konsultację',
      emailLabel: '✉️ Napisz e-mail',
      restartLabel: '↺ Zacznij od nowa',
      placeholderChoice: 'Napisz wiadomość…',
      placeholderName: 'Twoje imię…',
      placeholderEmail: 'Twój adres e-mail…',
      fallbackStart: 'Możesz napisać własną wiadomość, albo wybrać jedną z opcji powyżej –',
      mailSubject: 'Zapytanie o bezpłatną konsultację — Vero Studio',
      mailBody: (name, email, interest) => `Cześć Vero Studio,%0D%0A%0D%0AImię: ${name}%0D%0AE-mail: ${email}%0D%0AZainteresowanie: ${interest}%0D%0A%0D%0AProszę o kontakt w sprawie bezpłatnej konsultacji.`,
      toggleLabel: 'Otwórz czat z asystentem Vero Studio'
    };

    const toggle = document.getElementById('chatWidgetToggle');
    const closeBtn = document.getElementById('chatWidgetClose');
    const body = document.getElementById('chatWidgetBody');
    const quick = document.getElementById('chatWidgetQuick');
    const form = document.getElementById('chatWidgetForm');
    const input = document.getElementById('chatWidgetInput');

    if (toggle) toggle.setAttribute('aria-label', copy.toggleLabel);

    let state = 'start';
    let leadName = '';
    let leadInterest = '';
    let started = false;

    function addBubble(role, text) {
      const div = document.createElement('div');
      div.className = 'chat-msg chat-msg--' + role;
      div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    }

    function showTyping() {
      const t = document.createElement('div');
      t.className = 'chat-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      return t;
    }

    function botSay(text, delay) {
      return new Promise((resolve) => {
        const t = showTyping();
        setTimeout(() => {
          t.remove();
          addBubble('bot', text);
          resolve();
        }, delay || 800);
      });
    }

    function clearQuick() { quick.innerHTML = ''; }

    function renderOptions() {
      clearQuick();
      copy.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => choose(opt));
        quick.appendChild(btn);
      });
      input.placeholder = copy.placeholderChoice;
    }

    function renderFinal() {
      clearQuick();
      const cal = document.createElement('a');
      cal.href = CALENDLY_URL;
      cal.target = '_blank';
      cal.rel = 'noopener';
      cal.className = 'chat-widget-cta';
      cal.textContent = copy.calendlyLabel;
      quick.appendChild(cal);

      const mail = document.createElement('a');
      mail.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.mailSubject)}&body=${copy.mailBody(leadName, lastEmail, leadInterest)}`;
      mail.textContent = copy.emailLabel;
      quick.appendChild(mail);

      const restart = document.createElement('button');
      restart.type = 'button';
      restart.textContent = copy.restartLabel;
      restart.addEventListener('click', resetConversation);
      quick.appendChild(restart);

      form.classList.add('is-hidden');
    }

    let lastEmail = '';

    function choose(opt) {
      addBubble('user', opt.label);
      leadInterest = opt.label;
      clearQuick();
      state = 'ask_name';
      botSay(opt.reply, 700).then(() => { input.focus(); });
    }

    function resetConversation() {
      body.innerHTML = '';
      state = 'start';
      leadName = '';
      leadInterest = '';
      lastEmail = '';
      form.classList.remove('is-hidden');
      started = false;
      startConversation();
    }

    function startConversation() {
      if (started) return;
      started = true;
      botSay(copy.greeting, 500).then(renderOptions);
    }

    function isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';

      if (state === 'start') {
        addBubble('user', val);
        botSay(copy.fallbackStart, 700).then(renderOptions);
        return;
      }
      if (state === 'ask_name') {
        addBubble('user', val);
        leadName = val;
        state = 'ask_email';
        input.placeholder = copy.placeholderEmail;
        botSay(copy.askEmail(leadName), 700);
        return;
      }
      if (state === 'ask_email') {
        addBubble('user', val);
        if (!isValidEmail(val)) {
          botSay(copy.invalidEmail, 600);
          return;
        }
        lastEmail = val;
        state = 'done';
        botSay(copy.final(leadName), 700).then(renderFinal);
        return;
      }
      addBubble('user', val);
      botSay(copy.final(leadName || ''), 500);
    });

    function openWidget() {
      widget.classList.add('open');
      startConversation();
    }
    function closeWidget() { widget.classList.remove('open'); }

    if (toggle) toggle.addEventListener('click', openWidget);
    if (closeBtn) closeBtn.addEventListener('click', closeWidget);
  }

});
