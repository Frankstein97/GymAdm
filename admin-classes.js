const classesBody = document.querySelector("#classes-table tbody");
const classForm = document.getElementById("class-form");
const roomInput = document.getElementById("class-room");
const hourInput = document.getElementById("class-hour");
const nameInput = document.getElementById("class-name");
const coachInput = document.getElementById("class-coach");
const capacityInput = document.getElementById("class-capacity");

let classesByRoom = window.GymData.storage.loadClasses();

const normalizeRoom = (room) => classesByRoom[room].sort((a, b) => a.hour - b.hour);

const renderClasses = () => {
  classesBody.innerHTML = "";

  Object.entries(classesByRoom).forEach(([room, classes]) => {
    classes.forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${room}</td><td>${entry.hour}:00</td><td>${entry.className}</td><td>${entry.coach}</td><td>${entry.capacity}</td><td><button data-edit="${room}|${entry.hour}">Editar</button> <button data-del="${room}|${entry.hour}">Eliminar</button></td>`;
      classesBody.append(tr);
    });
  });
};

classesBody.addEventListener("click", (event) => {
  const editKey = event.target.dataset.edit;
  const delKey = event.target.dataset.del;

  if (editKey) {
    const [room, hour] = editKey.split("|");
    const item = classesByRoom[room].find((entry) => String(entry.hour) === hour);
    roomInput.value = room;
    hourInput.value = item.hour;
    nameInput.value = item.className;
    coachInput.value = item.coach;
    capacityInput.value = item.capacity;
  }

  if (delKey) {
    const [room, hour] = delKey.split("|");
    classesByRoom[room] = classesByRoom[room].filter((entry) => String(entry.hour) !== hour);
    window.GymData.storage.saveClasses(classesByRoom);
    renderClasses();
  }
});

classForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const room = roomInput.value;
  const hour = Number(hourInput.value);
  const payload = { hour, className: nameInput.value.trim(), coach: coachInput.value.trim(), capacity: Number(capacityInput.value) };

  const idx = classesByRoom[room].findIndex((entry) => entry.hour === hour);
  if (idx >= 0) classesByRoom[room][idx] = payload;
  else classesByRoom[room].push(payload);

  normalizeRoom(room);
  window.GymData.storage.saveClasses(classesByRoom);
  classForm.reset();
  renderClasses();
});

renderClasses();
