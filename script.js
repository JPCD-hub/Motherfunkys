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

const record = document.querySelector(".record");
const audio = document.querySelector("#band-audio");
const recordHint = document.querySelector("[data-record-hint]");

if (record && audio) {
  record.addEventListener("click", () => {
    if (audio.paused) {
      audio.play()
        .then(() => {
          record.classList.add("is-playing");
          record.classList.remove("is-paused");
          record.setAttribute("aria-label", "Pausar Aeroshot");
          record.setAttribute("aria-pressed", "true");
          if (recordHint) recordHint.textContent = "⏸ Pausar";
        })
        .catch(() => {
          record.classList.remove("is-playing");
          record.classList.add("is-paused");
          record.setAttribute("aria-label", "Reproducir Aeroshot");
          record.setAttribute("aria-pressed", "false");
          if (recordHint) recordHint.textContent = "No se pudo reproducir el audio.";
        });
    } else {
      audio.pause();
      record.classList.remove("is-playing");
      record.classList.add("is-paused");
      record.setAttribute("aria-label", "Reproducir Aeroshot");
      record.setAttribute("aria-pressed", "false");
      if (recordHint) recordHint.textContent = "▶ Haz clic para escuchar";
    }
  });

  audio.addEventListener("ended", () => {
    record.classList.remove("is-playing");
    record.classList.add("is-paused");
    record.setAttribute("aria-label", "Reproducir Aeroshot");
    record.setAttribute("aria-pressed", "false");
    if (recordHint) recordHint.textContent = "▶ Haz clic para escuchar";
  });
}
