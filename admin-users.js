const usersBody = document.querySelector("#users-table tbody");
const logoutUsers = document.getElementById("logout");

window.GymData.users.forEach((user) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.role}</td>`;
  usersBody.append(tr);
});

logoutUsers.addEventListener("click", () => {
  sessionStorage.removeItem("gymadm-session");
});
