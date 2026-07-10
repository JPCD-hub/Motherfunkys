const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const funkCursor = document.querySelector(".funk-cursor");

if (funkCursor && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    funkCursor.classList.add("is-visible");
    funkCursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
  });

  document.addEventListener("pointerleave", () => {
    funkCursor.classList.remove("is-visible");
  });

  document.querySelectorAll("a, button, [contenteditable='true']").forEach((element) => {
    element.addEventListener("pointerenter", () => funkCursor.classList.add("is-active"));
    element.addEventListener("pointerleave", () => funkCursor.classList.remove("is-active"));
  });
}

if (navToggle && navMenu) {
  const closeNavMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNavMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      closeNavMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavMenu();
      navToggle.focus();
    }
  });
}

document.querySelectorAll("[data-member-modal]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const modal = document.getElementById(trigger.dataset.memberModal);

    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest("dialog");

    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  });
});

document.querySelectorAll("dialog").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});

const riderFields = document.querySelectorAll("[data-rider-editable]");
const riderStatus = document.querySelector("[data-rider-status]");
const riderDefaults = new Map();

riderFields.forEach((field) => {
  const key = field.dataset.riderEditable;
  riderDefaults.set(key, field.innerHTML);

  const savedValue = localStorage.getItem(`motherfunkys-rider-${key}`);
  if (savedValue !== null) {
    field.innerHTML = savedValue;
  }
});

document.querySelector("[data-save-rider]")?.addEventListener("click", () => {
  riderFields.forEach((field) => {
    localStorage.setItem(`motherfunkys-rider-${field.dataset.riderEditable}`, field.innerHTML);
  });

  if (riderStatus) {
    riderStatus.textContent = "Rider guardado en este navegador.";
  }
});

document.querySelector("[data-reset-rider]")?.addEventListener("click", () => {
  riderFields.forEach((field) => {
    const key = field.dataset.riderEditable;
    localStorage.removeItem(`motherfunkys-rider-${key}`);
    field.innerHTML = riderDefaults.get(key) || "";
  });

  if (riderStatus) {
    riderStatus.textContent = "Rider restaurado.";
  }
});

const recordDeck = document.querySelector("[data-record-deck]");
const audio = document.querySelector("#band-audio");
const recordHint = document.querySelector("[data-record-hint]");
const trackButtons = document.querySelectorAll("[data-track]");
let activeTrackButton = document.querySelector("[data-track].is-selected");

const getTrackTitle = () => activeTrackButton?.dataset.trackTitle || "Aeroshot";

const setRecordPaused = (message = `▶ Escuchar ${getTrackTitle()}`) => {
  activeTrackButton.classList.remove("is-playing");
  activeTrackButton.classList.add("is-paused");
  activeTrackButton.setAttribute("aria-label", `Reproducir ${getTrackTitle()}`);
  activeTrackButton.setAttribute("aria-pressed", "false");
  if (recordHint) recordHint.textContent = message;
};

const setRecordPlaying = () => {
  activeTrackButton.classList.add("is-playing");
  activeTrackButton.classList.remove("is-paused");
  activeTrackButton.setAttribute("aria-label", `Pausar ${getTrackTitle()}`);
  activeTrackButton.setAttribute("aria-pressed", "true");
  if (recordHint) recordHint.textContent = "⏸ Pausar";
};

if (recordDeck && activeTrackButton && audio) {
  const playSelectedTrack = () => {
    audio.play().then(setRecordPlaying).catch(() => {
      setRecordPaused("No se pudo reproducir el audio.");
    });
  };

  const selectTrack = (trackButton, shouldPlay = false) => {
    const wasPlaying = !audio.paused;
    audio.pause();
    activeTrackButton = trackButton;

    trackButtons.forEach((button) => {
      const isActive = button === trackButton;
      button.classList.toggle("is-selected", isActive);
      button.classList.remove("is-playing", "is-paused");
      button.setAttribute("aria-pressed", String(isActive));
    });

    audio.src = new URL(trackButton.dataset.trackSrc, window.location.href).href;
    setRecordPaused();
    trackButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

    if (wasPlaying || shouldPlay) playSelectedTrack();
  };

  let dragStartX = 0;
  let isDragging = false;

  recordDeck.addEventListener("pointerdown", (event) => {
    dragStartX = event.clientX;
    isDragging = false;
  });

  recordDeck.addEventListener("pointermove", (event) => {
    if (Math.abs(event.clientX - dragStartX) > 10) isDragging = true;
  });

  recordDeck.addEventListener("pointerup", () => {
    if (!isDragging) return;

    const deckCenter = recordDeck.getBoundingClientRect().left + recordDeck.clientWidth / 2;
    const closestTrack = [...trackButtons].reduce((closest, button) => {
      const buttonCenter = button.getBoundingClientRect().left + button.clientWidth / 2;
      const closestCenter = closest.getBoundingClientRect().left + closest.clientWidth / 2;
      return Math.abs(buttonCenter - deckCenter) < Math.abs(closestCenter - deckCenter) ? button : closest;
    });

    selectTrack(closestTrack, true);
    window.setTimeout(() => {
      isDragging = false;
    }, 0);
  });

  trackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (isDragging) return;

      if (button === activeTrackButton) {
        if (audio.paused) {
          playSelectedTrack();
        } else {
          audio.pause();
          setRecordPaused();
        }
      } else {
        selectTrack(button, true);
      }
    });
  });

  audio.addEventListener("ended", () => {
    setRecordPaused();
  });

  audio.addEventListener("error", () => {
    setRecordPaused(`No se pudo cargar ${getTrackTitle()}.`);
  });
}
