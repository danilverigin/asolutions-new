document.addEventListener('DOMContentLoaded', () => {
  // --- Элементы
  const toggleButton = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');
  const overlay = document.querySelector('.overlay');
  const links = document.querySelectorAll('.navbar__link');
  const button = document.querySelector('.navbar__button');
  const tabButtons = document.querySelectorAll('.tabs__button');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  const toggleButtons = document.querySelectorAll('.pricing__toggle-button');
  const priceBlocks = document.querySelectorAll('.pricing__plan-price');
  const userSelects = document.querySelectorAll('.pricing__plan-users-select');
  const faqItems = document.querySelectorAll('.faq__item');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modals = document.querySelectorAll('.modal');
  const modalButtons = document.querySelectorAll('[data-modal]');
  const closeButtons = document.querySelectorAll('.modal__close');
  const consultationModal = document.getElementById('consultation-modal');
  const consultationForm = document.getElementById('consultation-form');
  const consultationPlanInfo = document.getElementById(
    'consultation-plan-info'
  );
  const consultationSuccess = document.querySelector('.consultation__success');
  const heroButton = document.querySelector('.hero__button');
  const serviceButtons = document.querySelectorAll('.services__button');
  const pricingPlanButtons = document.querySelectorAll('.pricing__plan-button');
  const contactForm = document.getElementById('contact-form');

  // --- Меню
  function toggleMenu() {
    toggleButton.classList.toggle('open');
    menu.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  }

  function closeMenu() {
    toggleButton.classList.remove('open');
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  if (toggleButton && menu && overlay) {
    toggleButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    links.forEach((link) => link.addEventListener('click', closeMenu));
    button?.addEventListener('click', closeMenu);
  }

  // --- Анимация текста в hero
  const typeText = async (el, text, speed = 100) => {
    el.textContent = '';
    for (let char of text) {
      el.textContent += char;
      await new Promise((r) => setTimeout(r, speed));
    }
  };

  const eraseText = async (el, speed = 50) => {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1);
      await new Promise((r) => setTimeout(r, speed));
    }
  };

  const heroTextSpan = document.getElementById('text');
  const heroTexts = [
    'Рост вашего бизнеса начинается с CRM',
    'Автоматизация с A-Solutions Group',
    'Увеличьте продажи и лояльность клиентов',
    'CRM для бизнеса: выведите свою компанию на новый уровень!',
    'Внедрение CRM: оптимизируйте процессы и увеличьте прибыль',
    'Эффективный бизнес с CRM: от лидов до лояльных клиентов',
    'Индивидуальные CRM решения для роста вашего бизнеса',
    'Управляйте будущим своего бизнеса с помощью современной CRM',
  ];

  if (heroTextSpan) {
    let i = 0;
    const animate = async () => {
      await typeText(heroTextSpan, heroTexts[i]);
      await new Promise((r) => setTimeout(r, 3000));
      await eraseText(heroTextSpan);
      i = (i + 1) % heroTexts.length;
      animate();
    };
    animate();
  }

  // --- Табы
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const id = btn.getAttribute('data-tab');
      document.getElementById(id)?.classList.add('active');
    });
  });

  // --- Переключение тарифов
  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.pricing');
      const period = btn.getAttribute('data-period');
      const allToggles = parent.querySelectorAll('.pricing__toggle-button');
      const allPrices = parent.querySelectorAll('.pricing__plan-price');

      allToggles.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      allPrices.forEach((price) => {
        const p = price.getAttribute('data-period');
        price.classList.toggle('hidden', p !== period);
      });
    });
  });

  // --- Динамическое обновление цены (Энтерпрайз)
  const formatPrice = (price) => price.toLocaleString('ru-RU') + ' тг/месяц';

  const updatePrice = (select) => {
    const priceBlock = select.closest('.pricing__plan-price');
    const users = parseInt(select.value, 10);
    const baseUsers = 250;
    const period = priceBlock.getAttribute('data-period');
    const base = parseInt(
      priceBlock.dataset[`basePrice${period === 'year' ? 'Year' : 'Month'}`]
    );

    const ratio = users / baseUsers;
    const newPrice = Math.round(base * ratio);
    const oldPrice = Math.round(newPrice * 1.25);

    priceBlock.querySelector('.pricing__plan-new-price').textContent =
      formatPrice(newPrice);
    const oldPriceEl = priceBlock.querySelector('.pricing__plan-old-price');
    if (oldPriceEl) oldPriceEl.textContent = formatPrice(oldPrice);
  };

  userSelects.forEach((select) => {
    updatePrice(select);
    select.addEventListener('change', () => updatePrice(select));
  });

  // --- FAQ
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const icon = question.querySelector('.faq__icon');

    question.addEventListener('click', () => {
      const open = answer.classList.contains('active');
      answer.classList.toggle('active');
      icon.textContent = open ? '+' : '−';
    });
  });

  // --- Модалки
  const openModal = (modalId, infoText = '') => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'consultation-modal' && consultationPlanInfo) {
      consultationPlanInfo.textContent =
        infoText || 'Оставьте заявку — мы подберем лучшее решение!';
      consultationForm.style.display = 'block';
      consultationSuccess.style.display = 'none';
    }

    modal.classList.add('is-open');
    modalOverlay.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    modals.forEach((modal) => modal.classList.remove('is-open'));
    modalOverlay.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  modalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-modal');
      // Закрываем все текущие модальные окна перед открытием нового
      closeModal();
      // Открываем новое модальное окно с небольшой задержкой для плавности
      setTimeout(() => openModal(id), 300);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // --- Обработка формы консультации
  consultationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(consultationForm).entries());
    console.log('Consultation form:', data);

    consultationForm.style.display = 'none';
    consultationSuccess.style.display = 'block';
    consultationForm.reset();

    setTimeout(closeModal, 5000);
  });

  // --- Обработка формы "Связаться с нами"
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    console.log('Contact form:', data);
    alert('Заявка отправлена!');
    contactForm.reset();
  });

  // --- Обработка спец-кнопок
  heroButton?.addEventListener('click', () =>
    openModal('consultation-modal', 'Вы хотите увеличить продажи с CRM')
  );

  serviceButtons.forEach((btn, i) => {
    const titles = [
      'Внедрение amoCRM',
      'Внедрение Bitrix24',
      'Консалтинг и обучение',
      'Техническая поддержка',
    ];
    btn.addEventListener('click', () =>
      openModal(
        'consultation-modal',
        `Вы заинтересованы в услуге "${titles[i]}"`
      )
    );
  });

  pricingPlanButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.closest('.pricing__plan');
      const title = plan.querySelector('.pricing__plan-title')?.textContent;
      const users = plan.querySelector('.pricing__plan-users')?.textContent;
      openModal('consultation-modal', `Вы выбрали тариф "${title}" (${users})`);
    });
  });
});
