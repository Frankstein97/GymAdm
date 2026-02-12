const roomsContainer = document.getElementById("rooms-container");
const attendanceCards = document.getElementById("attendance-cards");
const totalIncome = document.getElementById("total-income");
const dateText = document.getElementById("date-text");
const timeText = document.getElementById("time-text");
const tempText = document.getElementById("temp-text");

const classesByRoom = window.GymData.storage.loadClasses();

const renderRooms = (now) => {
  roomsContainer.innerHTML = "";

  Object.keys(classesByRoom).forEach((roomName) => {
    const roomTimeline = classesByRoom[roomName] || [];
    const currentHour = now.getHours();
    const ordered = [...roomTimeline.slice(currentHour), ...roomTimeline.slice(0, currentHour)].map((entry) => ({ ...entry, roomName }));

    const article = document.createElement("article");
    article.className = "room";
    article.innerHTML = `<h3>${roomName}</h3><div class="timeline"></div>`;
    const timelineElement = article.querySelector(".timeline");

    ordered.forEach((entry, idx) => {
      const hour = document.createElement("div");
      hour.className = `hour ${idx === 0 ? "current" : ""}`;
      hour.textContent = `${String(entry.hour).padStart(2, "0")}:00`;

      const clazz = document.createElement("div");
      clazz.className = `clazz ${idx === 0 ? "current" : ""}`;
      clazz.textContent = entry.className;

      timelineElement.append(hour, clazz);
    });

    roomsContainer.append(article);
  });
};

const renderAttendance = (now) => {
  attendanceCards.innerHTML = "";

  Object.keys(classesByRoom).forEach((roomName) => {
    const active = window.GymData.getActiveClass(roomName, now);
    const attendees = window.GymData.getAttendeesForClass(roomName, now);
    const capacity = active?.capacity || 1;
    const percentage = Math.round((attendees / capacity) * 100);

    const card = document.createElement("article");
    card.className = "box";
    card.innerHTML = `
      <p>${roomName.toUpperCase()}</p>
      <p>${active ? active.className.toUpperCase() : "SIN CLASE"}</p>
      <strong>${percentage} %</strong>
      <p>${attendees} asistentes</p>
    `;
    attendanceCards.append(card);
  });
};

const renderIncome = (now) => {
  totalIncome.textContent = `${window.GymData.getUniqueDailyIncome(now)} Usuarios`;
};

const renderDateTime = (date) => {
  const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(date);
  const day = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date);
  const hour = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);

  dateText.textContent = dateFormat;
  timeText.textContent = `${day[0].toUpperCase()}${day.slice(1)}: ${hour}hs`;
};

const syncTime = async () => {
  try {
    const response = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=America/Argentina/Buenos_Aires");
    const data = await response.json();
    return new Date(data.dateTime);
  } catch {
    return new Date();
  }
};

const syncTemperature = async () => {
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m");
    const data = await response.json();
    tempText.textContent = `${Math.round(data.current.temperature_2m)}°`;
  } catch {
    tempText.textContent = "--°";
  }
};

const refresh = async () => {
  const now = await syncTime();
  renderDateTime(now);
  renderRooms(now);
  renderAttendance(now);
  renderIncome(now);
  syncTemperature();
};

refresh();
setInterval(refresh, 60000);
