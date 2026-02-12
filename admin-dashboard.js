const roomsContainer = document.getElementById("rooms-container");
const attendanceCards = document.getElementById("attendance-cards");
const totalIncome = document.getElementById("total-income");
const dateText = document.getElementById("date-text");
const timeText = document.getElementById("time-text");
const tempText = document.getElementById("temp-text");
const logout = document.getElementById("logout");

const renderRooms = () => {
  roomsContainer.innerHTML = "";

  Object.entries(window.GymData.calendarByRoom).forEach(([roomName, classes]) => {
    const article = document.createElement("article");
    article.className = "room";

    const title = document.createElement("h3");
    title.textContent = roomName;

    const timeline = document.createElement("div");
    timeline.className = "timeline";

    classes.forEach((entry) => {
      const hour = document.createElement("div");
      hour.className = "hour";
      hour.textContent = `${entry.hour}:00`;

      const clazz = document.createElement("div");
      clazz.className = "clazz";
      clazz.textContent = entry.className;

      timeline.append(hour, clazz);
    });

    article.append(title, timeline);
    roomsContainer.append(article);
  });
};

const renderAttendance = () => {
  attendanceCards.innerHTML = "";

  Object.keys(window.GymData.calendarByRoom).forEach((roomName) => {
    const active = window.GymData.getActiveClass(roomName, new Date());

    const card = document.createElement("article");
    card.className = "box";

    const percentage = active ? Math.round((active.attendees / active.capacity) * 100) : 0;
    const className = active ? active.className.toUpperCase() : "SIN CLASE ACTIVA";

    card.innerHTML = `<p>${roomName.toUpperCase()}</p><p>${className}</p><strong>${percentage} %</strong><p>DE ASISTENCIA</p>`;
    attendanceCards.append(card);
  });
};

const renderDailyIncome = () => {
  const count = window.GymData.getDailyIncome(new Date());
  totalIncome.textContent = `${count} Alumnos`;
};

const renderDateTime = (date) => {
  const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(date);
  const day = new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date);
  const hour = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);

  dateText.textContent = dateFormat;
  timeText.textContent = `${day[0].toUpperCase()}${day.slice(1)}: ${hour}hs`;
};

const syncClock = async () => {
  try {
    const response = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=America/Argentina/Buenos_Aires");
    const data = await response.json();
    const date = new Date(data.dateTime);
    renderDateTime(date);
  } catch {
    renderDateTime(new Date());
  }
};

const syncTemperature = async () => {
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.6037&longitude=-58.3816&current=temperature_2m");
    const data = await response.json();
    tempText.textContent = `${Math.round(data.current.temperature_2m)}°`;
  } catch {
    tempText.textContent = "22°";
  }
};

logout.addEventListener("click", () => {
  sessionStorage.removeItem("gymadm-session");
});

renderRooms();
renderAttendance();
renderDailyIncome();
syncClock();
syncTemperature();
setInterval(() => {
  renderAttendance();
  renderDailyIncome();
  syncClock();
}, 60000);
