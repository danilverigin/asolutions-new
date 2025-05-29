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

  // --- Установка статического заголовка в hero
  const heroTextSpan = document.getElementById('text');
  if (heroTextSpan) {
    heroTextSpan.textContent = 'Рост вашего бизнеса начинается с CRM';
  }

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
      closeModal();
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
  // 52524n
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
  const promoWidget = document.querySelector('.promo-widget');
  const promoWidgetClose = document.querySelector('.promo-widget__close');
  const promoWidgetButton = document.querySelector('.promo-widget__button');

  if (promoWidget && promoWidgetClose && promoWidgetButton) {
    // Show widget after 5 seconds with animation
    setTimeout(() => {
      promoWidget.classList.remove('hidden');
      setTimeout(() => {
        promoWidget.classList.add('visible');
      }, 10); // Small delay to ensure display:none is removed before animation
    }, 5000);

    promoWidgetClose.addEventListener('click', () => {
      promoWidget.classList.remove('visible');
      setTimeout(() => {
        promoWidget.classList.add('hidden');
      }, 500); // Match transition duration
    });

    promoWidgetButton.addEventListener('click', () => {
      promoWidget.classList.remove('visible');
      setTimeout(() => {
        promoWidget.classList.add('hidden');
      }, 500); // Match transition duration
      openModal(
        'consultation-modal',
        'Вы хотите получить скидку 10% на внедрение CRM'
      );
    });

    // Countdown timer
    const deadline = new Date('2025-06-10T23:59:59');
    const daysSpan = document.getElementById('countdown-days');
    const hoursSpan = document.getElementById('countdown-hours');
    const minutesSpan = document.getElementById('countdown-minutes');
    const secondsSpan = document.getElementById('countdown-seconds');

    function updateCountdown() {
      const now = new Date();
      const timeRemaining = deadline - now;

      if (timeRemaining <= 0) {
        promoWidget.classList.add('hidden');
        return;
      }

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      daysSpan.textContent = days;
      hoursSpan.textContent = hours.toString().padStart(2, '0');
      minutesSpan.textContent = minutes.toString().padStart(2, '0');
      secondsSpan.textContent = seconds.toString().padStart(2, '0');
    }

    if (daysSpan && hoursSpan && minutesSpan && secondsSpan) {
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }
});
