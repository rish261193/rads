(() => {

  const root =
    document.getElementById('radhika-date-v1');

  if (root.dataset.ready)
    return;

  root.dataset.ready = '1';

  const stages =
    [...root.querySelectorAll('.stage')];

  const yesBtn =
    root.querySelector('#yesBtn');

  const noBtn =
    root.querySelector('#noBtn');

  const arena =
    root.querySelector('#arena');

  const msg =
    root.querySelector('#attemptMsg');

  const dog1 =
    root.querySelector('#dog1');

  const burst =
    root.querySelector('.heart-burst');

  let attempts = 0;
  let selectedDate = '';
  let selectedActivity = '';

  const messages = [
    'Really?',
    'Ego again?',
    'Nice try, Diva Princess.',
    'We both know how this ends.',
    'Even the dog is judging you now.',
    'At this point just press YES.'
  ];

  function showStage(n) {

    stages.forEach(stage => {

      stage.classList.toggle(
        'active',
        Number(stage.dataset.stage) === n
      );

    });

  }

  function hearts(count = 12) {

    const box =
      root.querySelector('.game')
          .getBoundingClientRect();

    for (let i = 0; i < count; i++) {

      const heart =
        document.createElement('span');

      heart.className = 'heart';

      heart.textContent =
        Math.random() > .45
          ? '♥'
          : '♡';

      heart.style.left =
        (
          20 +
          Math.random() *
          (box.width - 40)
        ) + 'px';

      heart.style.top =
        (
          180 +
          Math.random() * 260
        ) + 'px';

      heart.style.animationDelay =
        (Math.random() * .25) + 's';

      burst.appendChild(heart);

      setTimeout(
        () => heart.remove(),
        1300
      );

    }

  }

  function dogReact() {

    dog1.classList.remove(
      'shake',
      'jump',
      'sideeye'
    );

    void dog1.offsetWidth;

    if (attempts === 1) {

      dog1.style.transform =
        'rotate(7deg)';

    }

    else if (attempts === 2) {

      dog1.classList.add('jump');

    }

    else if (attempts === 3) {

      dog1.classList.add('shake');

    }

    else if (attempts >= 5) {

      dog1.classList.add('sideeye');

    }

  }

  function dodgeNo(event) {

    if (event)
      event.preventDefault();

    attempts =
      Math.min(attempts + 1, 7);

    msg.textContent =
      messages[
        Math.min(
          attempts - 1,
          messages.length - 1
        )
      ];

    dogReact();

    const noScale =
      Math.max(
        .28,
        1 - attempts * .14
      );

    const yesScale =
      Math.min(
        2.0,
        1 + attempts * .16
      );

    yesBtn.style.transform =
      'scale(' + yesScale + ')';

    noBtn.style.transform =
      'scale(' + noScale + ')';

    const arenaRect =
      arena.getBoundingClientRect();

    const buttonRect =
      noBtn.getBoundingClientRect();

    const padding = 10;

    const maxX =
      Math.max(
        padding,
        arenaRect.width -
        buttonRect.width -
        20
      );

    const maxY =
      Math.max(
        42,
        arenaRect.height -
        buttonRect.height -
        16
      );

    const x =
      padding +
      Math.random() * maxX;

    const y =
      42 +
      Math.random() *
      Math.max(
        20,
        maxY - 42
      );

    noBtn.style.position =
      'absolute';

    noBtn.style.left =
      x + 'px';

    noBtn.style.top =
      y + 'px';

  }

  noBtn.addEventListener(
    'pointerenter',
    event => {

      if (
        event.pointerType ===
        'mouse'
      ) {
        dodgeNo(event);
      }

    }
  );

  noBtn.addEventListener(
    'pointerdown',
    dodgeNo
  );

  noBtn.addEventListener(
    'click',
    dodgeNo
  );

  yesBtn.addEventListener(
    'click',
    () => {

      hearts(18);

      dog1.classList.add(
        'jump'
      );

      setTimeout(
        () => showStage(2),
        420
      );

    }
  );

  root.querySelectorAll(
    '[data-next]'
  ).forEach(button => {

    button.addEventListener(
      'click',
      () => {

        showStage(
          Number(
            button.dataset.next
          )
        );

      }
    );

  });

  const dateInput =
    root.querySelector(
      '#datePick'
    );

  const dateContinue =
    root.querySelector(
      '#dateContinue'
    );

  const dateSpark =
    root.querySelector(
      '#dateSpark'
    );

  const now =
    new Date();

  const yyyy =
    now.getFullYear();

  const mm =
    String(
      now.getMonth() + 1
    ).padStart(2, '0');

  const dd =
    String(
      now.getDate()
    ).padStart(2, '0');

  dateInput.min =
    yyyy +
    '-' +
    mm +
    '-' +
    dd;

  dateInput.addEventListener(
    'change',
    () => {

      if (!dateInput.value) {

        selectedDate = '';

        dateContinue.disabled =
          true;

        dateSpark.textContent =
          '';

        return;

      }

      selectedDate =
        dateInput.value;

      dateContinue.disabled =
        false;

      dateSpark.textContent =
        '♥ Good choice.';

    }
  );

  dateContinue.addEventListener(
    'click',
    () => {

      if (selectedDate)
        showStage(4);

    }
  );

  const lockBtn =
    root.querySelector(
      '#lockBtn'
    );

  root.querySelector(
    '#activityGrid'
  ).addEventListener(
    'click',
    event => {

      const button =
        event.target.closest(
          '.activity'
        );

      if (!button)
        return;

      root.querySelectorAll(
        '.activity'
      ).forEach(item => {

        item.classList.remove(
          'selected'
        );

      });

      button.classList.add(
        'selected'
      );

      selectedActivity =
        button.dataset.value;

      lockBtn.disabled =
        false;

    }
  );

  lockBtn.addEventListener(
    'click',
    () => {

      if (!selectedActivity)
        return;

      const [y, m, d] =
        selectedDate
          .split('-')
          .map(Number);

      const date =
        new Date(
          Date.UTC(
            y,
            m - 1,
            d
          )
        );

      root.querySelector(
        '#confirmDate'
      ).textContent =
        new Intl.DateTimeFormat(
          'en-CA',
          {
            year:'numeric',
            month:'long',
            day:'numeric',
            timeZone:'UTC'
          }
        ).format(date);

      root.querySelector(
        '#confirmActivity'
      ).textContent =
        selectedActivity;

      showStage(5);

      hearts(22);

    }
  );

  const sendVerdictBtn =
    root.querySelector(
      '#sendVerdictBtn'
    );

  const WHATSAPP_NUMBER =
    '17052577070';

  sendVerdictBtn.addEventListener(
    'click',
    () => {

      const dateText =
        root.querySelector(
          '#confirmDate'
        ).textContent.trim();

      const activityText =
        root.querySelector(
          '#confirmActivity'
        ).textContent.trim();

      const verdictMessage =
        'The Queen has decided 👑\n' +
        '📅 ' + dateText + '\n' +
        '🎢 ' + activityText + '\n' +
        'It’s a date ♥️';

      const whatsappUrl =
        'https://wa.me/' +
        WHATSAPP_NUMBER +
        '?text=' +
        encodeURIComponent(
          verdictMessage
        );

      window.open(
        whatsappUrl,
        '_blank',
        'noopener'
      );

    }
  );

  const modal =
    root.querySelector(
      '#noteModal'
    );

  const open =
    root.querySelector(
      '#openNote'
    );

  const close =
    root.querySelector(
      '#closeNote'
    );

  open.addEventListener(
    'click',
    () => {

      modal.classList.add(
        'open'
      );

      close.focus();

    }
  );

  close.addEventListener(
    'click',
    () => {

      modal.classList.remove(
        'open'
      );

    }
  );

  root.querySelector(
    '.backdrop'
  ).addEventListener(
    'click',
    () => {

      modal.classList.remove(
        'open'
      );

    }
  );

})();
