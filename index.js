const api = {
  key: 'c3669e7653cc454d38746e64c9ece6c8',
  geo: 'https://api.openweathermap.org/geo/1.0/direct',
  weather: 'https://api.openweathermap.org/data/2.5/weather'
};

const input = document.getElementById('input');
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') getGeo(input.value);
});


async function getGeo(query) {
  const res = await fetch(`${api.geo}?q=${query}&limit=1&appid=${api.key}`);
  const data = await res.json();

  if (!data.length) {
    alert('City not found');
    return;
  }

  const { lat, lon, name, country } = data[0];
  getWeather(lat, lon, name, country);
}


async function getWeather(lat, lon, city, country) {
  const res = await fetch(
    `${api.weather}?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`
  );
  const data = await res.json();

  displayWeather(data, city, country);
  updateBackground(data.weather[0].main.toLowerCase());
}


function displayWeather(data, city, country) {
  document.getElementById('city').innerText = `${city}, ${country}`;
  document.getElementById('temperature').innerHTML =
    `${Math.round(data.main.temp)}°c`;
  document.getElementById('feelsLike').innerText =
    `Feels like ${Math.round(data.main.feels_like)}°c`;
  document.getElementById('conditions').innerText =
    data.weather[0].main;
  document.getElementById('variation').innerText =
    `Min ${Math.round(data.main.temp_min)}° / Max ${Math.round(data.main.temp_max)}°`;

  setDate();
}


function setDate() {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  document.getElementById('date').innerText =
    `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

setDate();


function updateBackground(type) {
  const bg = document.getElementById('start-background');

  const images = {
    cloud: 'https://images.unsplash.com/photo-1495756111155-45cb19b8aeee',
    rain: 'https://images.unsplash.com/photo-1518803194621-27188ba362c9',
    snow: 'https://images.unsplash.com/photo-1475156366402-ffdc49dd371f',
    clear: 'https://images.unsplash.com/photo-1558002308-ec9ca5532caa'
  };

  let image = images.clear;

  if (type.includes('cloud')) image = images.cloud;
  else if (type.includes('rain') || type.includes('drizzle') || type.includes('thunderstorm')) image = images.rain;
  else if (type.includes('snow')) image = images.snow;

  bg.style.opacity = '0';

  setTimeout(() => {
    bg.style.backgroundImage = `url('${image}')`;
    bg.style.opacity = '1';
  }, 800);
}