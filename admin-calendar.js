const calendarBody = document.querySelector("#calendar-table tbody");
const logoutCalendar = document.getElementById("logout");

Object.entries(window.GymData.calendarByRoom).forEach(([room, classes]) => {
  classes.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${room}</td><td>${entry.hour}:00</td><td>${entry.className}</td><td>${entry.coach}</td>`;
    calendarBody.append(tr);
  });
});

logoutCalendar.addEventListener("click", () => {
  sessionStorage.removeItem("gymadm-session");
});
