const usersBody = document.querySelector("#users-table tbody");
const userForm = document.getElementById("user-form");
const userIdInput = document.getElementById("user-id");
const userNameInput = document.getElementById("user-name");
const userRoleInput = document.getElementById("user-role");

let users = window.GymData.storage.loadUsers();

const render = () => {
  usersBody.innerHTML = "";
  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.role}</td><td><button data-edit="${user.id}">Editar</button> <button data-del="${user.id}">Eliminar</button></td>`;
    usersBody.append(tr);
  });
};

usersBody.addEventListener("click", (event) => {
  const editId = event.target.dataset.edit;
  const delId = event.target.dataset.del;

  if (editId) {
    const user = users.find((u) => u.id === editId);
    userIdInput.value = user.id;
    userNameInput.value = user.name;
    userRoleInput.value = user.role;
  }

  if (delId) {
    users = users.filter((u) => u.id !== delId);
    window.GymData.storage.saveUsers(users);
    render();
  }
});

userForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = { id: userIdInput.value.trim(), name: userNameInput.value.trim(), role: userRoleInput.value, createdAt: new Date().toISOString() };

  const idx = users.findIndex((u) => u.id === payload.id);
  if (idx >= 0) users[idx] = { ...users[idx], ...payload };
  else users.unshift(payload);

  window.GymData.storage.saveUsers(users);
  userForm.reset();
  render();
});

render();
