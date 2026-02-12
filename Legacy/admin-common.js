(function () {
  const sessionRaw = sessionStorage.getItem("gymadm-session");
  if (!sessionRaw) {
    window.location.href = "index.html";
    return;
  }

  const session = JSON.parse(sessionRaw);
  if (session.role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  const userName = document.getElementById("admin-user-name");
  if (userName) userName.textContent = session.name;

  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      sessionStorage.removeItem("gymadm-session");
    });
  }

  const hamburger = document.getElementById("hamburger");
  const menuPanel = document.getElementById("menu-panel");
  if (hamburger && menuPanel) {
    hamburger.addEventListener("click", () => {
      menuPanel.classList.toggle("open");
    });
  }
})();
