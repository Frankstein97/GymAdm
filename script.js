const form = document.getElementById("login-form");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");
const adminMenu = document.getElementById("admin-menu");
const adminTitle = document.getElementById("admin-title");
const tabButtons = [...document.querySelectorAll(".tab-button")];
const adminPanels = [...document.querySelectorAll(".admin-panel")];

const users = {
  "45112233": {
    role: "alumno",
    name: "Valentina",
    className: "Funcional 19:00",
    place: "Sala Norte",
  },
  "99887766": {
    role: "profe",
    name: "Marco Pérez",
    focus: "Musculación",
  },
  "11223344": {
    role: "admin",
    name: "Sofía García",
  },
};

const openModal = () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

const hideModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

const renderContent = (content) => {
  modalBody.innerHTML = content;
  openModal();
};

const normalizeInput = (value) => value.replace(/\s+/g, "").trim();

const openAdminPanel = (name) => {
  adminMenu.hidden = false;
  adminTitle.textContent = `Panel administrativo · ${name}`;
  adminMenu.scrollIntoView({ behavior: "smooth", block: "start" });
};

const switchAdminTab = (tabName) => {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  adminPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchAdminTab(button.dataset.tab);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const rawValue = normalizeInput(form.dni.value);

  if (!rawValue) {
    renderContent(
      `
      <h3>Necesitamos tu DNI</h3>
      <p>Escribí tu DNI para continuar.</p>
    `,
    );
    return;
  }

  const isTeacher = rawValue.endsWith("+");
  const cleanValue = rawValue.replace("+", "");
  const user = users[cleanValue];

  if (!user) {
    renderContent(
      `
      <h3>No encontramos ese usuario</h3>
      <p>Probá con un DNI demo o consultá en recepción.</p>
    `,
    );
    return;
  }

  if (user.role === "alumno" && !isTeacher) {
    adminMenu.hidden = true;
    renderContent(
      `
      <h3>Bienvenido, ${user.name}</h3>
      <p><span class="pill">Clase</span> ${user.className}</p>
      <p><span class="pill">Lugar</span> ${user.place}</p>
    `,
    );
    return;
  }

  if (user.role === "profe" && isTeacher) {
    adminMenu.hidden = true;
    renderContent(
      `
      <h3>Hola profe ${user.name}</h3>
      <p>Entrás con foco en <strong>${user.focus}</strong>.</p>
      <div class="actions">
        <a href="teacher-dashboard.html">Ir al dashboard docente</a>
      </div>
    `,
    );
    return;
  }

  if (user.role === "admin" && !isTeacher) {
    switchAdminTab("general");
    openAdminPanel(user.name);
    renderContent(
      `
      <h3>Panel administrativo activado</h3>
      <p>Bienvenida, ${user.name}. Debajo del ingreso ya tenés el menú con:</p>
      <p><span class="pill">Dashboard general</span> <span class="pill">Usuarios por roles</span> <span class="pill">Calendario</span> <span class="pill">Clases y horarios</span></p>
    `,
    );
    return;
  }

  renderContent(
    `
    <h3>Ingreso no válido</h3>
    <p>Revisá el formato del DNI según tu rol.</p>
  `,
  );
});

closeModal.addEventListener("click", hideModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});
