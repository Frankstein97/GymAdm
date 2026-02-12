const weeklyCalendar = document.getElementById("weekly-calendar");
const classesByRoom = window.GymData.storage.loadClasses();

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const buildDayCard = (day) => {
  const card = document.createElement("article");
  card.className = "day-card";
  card.innerHTML = `<h3>${day}</h3><div class="day-content"></div>`;
  const content = card.querySelector(".day-content");

  Object.entries(classesByRoom).forEach(([room, classes]) => {
    const roomBlock = document.createElement("div");
    roomBlock.className = "room-chip-wrap";
    roomBlock.innerHTML = `<strong>${room}</strong>`;

    classes.slice(0, 8).forEach((entry) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = `${String(entry.hour).padStart(2, "0")}:00 ${entry.className}`;
      roomBlock.append(chip);
    });

    content.append(roomBlock);
  });

  return card;
};

days.forEach((day) => weeklyCalendar.append(buildDayCard(day)));
