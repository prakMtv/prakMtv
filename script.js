const hand = document.getElementById("hand");
const items = document.querySelectorAll(".selectable");
let selectedIndex = 0;

function updateHandPosition() {
  const items = document.querySelectorAll('.selectable');
  const hand = document.getElementById('hand');
  if (!items.length || !hand) return;

  const selected = document.activeElement.classList.contains('selectable')
    ? document.activeElement
    : items[selectedIndex];

  const rect = selected.getBoundingClientRect();
  const containerRect = selected.parentElement.getBoundingClientRect();

  hand.style.top = (rect.top - containerRect.top + rect.height / 2 - hand.offsetHeight / 2) + 'px';
  hand.style.left = (rect.left - containerRect.left - hand.offsetWidth - 10) + 'px';

  hand.classList.remove('animate');
  void hand.offsetWidth;
  hand.classList.add('animate');
}

function setSelectedClass() {
  const items = document.querySelectorAll('.selectable');
  items.forEach((item, idx) => {
    if (idx === selectedIndex) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

function handleKeyPress(e) {
  const items = document.querySelectorAll('.selectable');
  if (!items.length) return;

  const key = e.key.toLowerCase();
  if (["input", "textarea"].includes(document.activeElement.tagName.toLowerCase())) return;

  // F key toggles theme (without moving hand)
  if (key === "f") {
    e.preventDefault();
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
      themeToggleBtn.dispatchEvent(new CustomEvent("toggle-theme", { bubbles: true }));
    }
    return;
  }

  // A/D or ArrowLeft/ArrowRight for horizontal navigation in social row
  if (selectedIndex < 2) {
    if (key === "a" || key === "arrowleft") {
      e.preventDefault();
      selectedIndex = selectedIndex === 0 ? 1 : 0;
      items[selectedIndex].focus();
      setSelectedClass();
      updateHandPosition();
      return;
    }
    if (key === "d" || key === "arrowright") {
      e.preventDefault();
      selectedIndex = selectedIndex === 0 ? 1 : 0;
      items[selectedIndex].focus();
      setSelectedClass();
      updateHandPosition();
      return;
    }
    // S or ArrowDown moves to OCE Cheaters
    if (key === "s" || key === "arrowdown") {
      e.preventDefault();
      selectedIndex = 2;
      items[selectedIndex].focus();
      setSelectedClass();
      updateHandPosition();
      return;
    }
  }
  // W or ArrowUp moves back to social row (Twitter)
  if (selectedIndex === 2 && (key === "w" || key === "arrowup")) {
    e.preventDefault();
    selectedIndex = 0;
    items[selectedIndex].focus();
    setSelectedClass();
    updateHandPosition();
    return;
  }
  // Tab navigation (cycles through all)
  if (key === "tab") {
    e.preventDefault();
    selectedIndex = e.shiftKey
      ? (selectedIndex - 1 + items.length) % items.length
      : (selectedIndex + 1) % items.length;
    items[selectedIndex].focus();
    setSelectedClass();
    updateHandPosition();
    return;
  }
  // Enter to click (except OCE Cheaters)
  if (key === "enter") {
    const selectedItem = items[selectedIndex];
    if (selectedItem && !selectedItem.classList.contains("oce-cheaters")) {
      selectedItem.click();
    }
    return;
  }
}

function setupInteractiveSelection() {
  const items = document.querySelectorAll('.selectable');
  items.forEach((item, idx) => {
    item.addEventListener('focus', function() {
      selectedIndex = idx;
      setSelectedClass();
      updateHandPosition();
    });
    item.addEventListener('mouseover', function() {
      this.focus();
    });
    item.addEventListener('mousedown', function() {
      selectedIndex = idx;
      setSelectedClass();
      updateHandPosition();
    });
  });
  if (items.length) {
    items[0].focus();
    setSelectedClass();
  }
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const avatarImg = document.getElementById("avatar-img");
  if (!themeToggleBtn || !avatarImg) return;

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      themeToggleBtn.textContent = "🌙";
      avatarImg.src = "Images/tigersitting.png";
    } else {
      document.body.classList.remove("dark-theme");
      themeToggleBtn.textContent = "🌞";
      avatarImg.src = "Images/claytiger.png";
    }
  };

  const currentTheme = localStorage.getItem("theme");
  applyTheme(currentTheme || "light");

  // Normal click: move hand
  themeToggleBtn.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    triggerThemeFade();
    moveHandToButton();
  });

  // F key: toggle theme without moving hand
  themeToggleBtn.addEventListener("toggle-theme", () => {
    const newTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    triggerThemeFade();
    // Do NOT move hand
  });
}

function triggerThemeFade() {
  const fade = document.getElementById('theme-gradient-fade');
  if (!fade) return;
  fade.style.opacity = '1';
  setTimeout(() => {
    fade.style.opacity = '0';
  }, 1500); // Match the CSS transition duration
}

function moveHandToButton() {
  const hand = document.getElementById('hand');
  const btn = document.getElementById('theme-toggle-btn');
  const container = document.querySelector('.link-container');
  if (!hand || !btn || !container) return;

  const btnRect = btn.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  hand.style.top = (btnRect.top - containerRect.top + btnRect.height / 2 - hand.offsetHeight / 2) + 'px';
  hand.style.left = (btnRect.left - containerRect.left - hand.offsetWidth - 10) + 'px';

  hand.classList.remove('animate');
  void hand.offsetWidth;
  hand.classList.add('animate');
}

function setupHandOnThemeButton() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.addEventListener('mouseover', moveHandToButton);
  btn.addEventListener('focus', moveHandToButton);
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupInteractiveSelection();
  setupHandOnThemeButton();
  document.addEventListener('keydown', handleKeyPress);
});
