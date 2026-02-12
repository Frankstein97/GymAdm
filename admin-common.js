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
  if (userName) {
    userName.textContent = session.name;
  }
})();
