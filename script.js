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
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
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

if (record && audio) {
  record.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      record.classList.add("is-playing");
      record.classList.remove("is-paused");
    } else {
      audio.pause();
      record.classList.remove("is-playing");
      record.classList.add("is-paused");
    }
  });

  audio.addEventListener("ended", () => {
    record.classList.remove("is-playing");
    record.classList.add("is-paused");
  });
}
