const classesBody = document.querySelector("#classes-table tbody");
const logoutClasses = document.getElementById("logout");

Object.entries(window.GymData.calendarByRoom).forEach(([room, classes]) => {
  classes.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${entry.className}</td><td>${room}</td><td>${entry.capacity}</td><td>${entry.attendees}</td>`;
    classesBody.append(tr);
  });
});

logoutClasses.addEventListener("click", () => {
  sessionStorage.removeItem("gymadm-session");
});
