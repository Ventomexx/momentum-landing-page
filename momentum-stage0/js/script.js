console.log('***Треки могут некоторое время подгружаться, залиты на github***\n\nЧасы и календарь +15\nПриветствие +10\nСмена фонового изображения +20\nВиджет погоды +15\nВиджет цитата дня +10\nАудиоплеер +15\nПродвинутый аудиоплеер +17\n\n Total 102/150');
import playList from './playList.js';
const time = document.querySelector('.time');
const dateBY = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const inputName = document.querySelector('.name');
const body = document.body;
const slideNext = document.querySelector('.slide-next');
const SlidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const musicList = document.querySelector('.play-list');
const playBtn = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');
const ul = document.querySelector('.play-list');
const progressBar = document.getElementById('audioProgress');
const timerStart = document.querySelector('.timer-start');
const timerEnd = document.querySelector('.timer-end');
const trackName = document.querySelector('.track-name');
const volume = document.getElementById('soundVolume');
const volumeIco = document.querySelector('.volume');

// Time and date
function showTime () {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  const options = {weekday: 'long', month: 'long', day: 'numeric'};
  const currentDate = date.toLocaleDateString('en-En', options);
  dateBY.textContent = currentDate;
  time.textContent = currentTime;
  showGreeting()
}
setInterval(showTime, 1000);
// Greeting
let showGreeting = () => {
  greeting.textContent = `Good ${getTimeOfDay()}`;
}
let getTimeOfDay = () => {
  const date = new Date();
  const hours = date.getHours() / 6;
  let greetingTime = 'day';
  if (hours < 1) {greetingTime = 'night'}
  else if (hours < 2) {greetingTime = 'morning'}
  else if (hours < 3) {greetingTime = 'afternoon'}
  else {greetingTime = 'evening'}
  return greetingTime;
}
function setLocalStorage() {
  localStorage.setItem('name', inputName.value);
  localStorage.setItem('cityname', city.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if(localStorage.getItem('cityname')) {
    city.value = localStorage.getItem('cityname');
  }
  else {city.placeholder = 'Minsk'; city.textContent = 'Minsk';}
  if(localStorage.getItem('name')) {
    inputName.value = localStorage.getItem('name');
  }
  else inputName.placeholder = 'young Padawan'
}
window.addEventListener('load', function() {
  getLocalStorage();
});
// Set backgroundImage
function getRandom() {let rand = 0.5 + Math.random() * 20; return Math.round(rand)};
let randomNum = getRandom();
let setBg = () => {
  let bgNum = randomNum.toString().padStart(2,'0');
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/Ventomexx/momentumImages/assets/images/${getTimeOfDay()}/${bgNum}.jpg`;
  img.onload = () => {      
  body.style.backgroundImage = `url(${img.src})`;
  }; 
}
setBg()
let getSlideNext = () => {
  randomNum === 20 ? randomNum = 1 : randomNum += 1;
  setBg();
}
let getSlidePrev = () => {
  randomNum === 1 ? randomNum = 20 : randomNum -= 1;
  setBg();
}
slideNext.addEventListener('click', getSlideNext)
SlidePrev.addEventListener('click', getSlidePrev)
// Weather API
city.textContent = localStorage.getItem('cityname');
async function getWeather() {
  city.textContent === '' ? city.textContent = 'Minsk' : city.textContent;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=af886daea123e8c567fb87694cbf8767&units=metric`;
  try {
  const res = await fetch(url);
  const data = await res.json(); 
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.floor(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
  humidity.textContent = `Humidity: ${data.main.humidity} %`;
} catch (error) {
  weatherIcon.className = 'weather-icon owf';
  temperature.textContent = '';
  weatherDescription.textContent = 'Enter valid city name';
  wind.textContent = '';
  humidity.textContent = '';
}
}
getWeather()

function setCity(event) {
  if (event.code === 'Enter' || event.code === 'NumpadEnter') {   
    city.textContent = event.target.value;
    getWeather();
    city.blur();
  }
}
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
// Quotes API
let iQuotes = Math.floor(getRandom() / 2);
  async function getQuotes() {  
    const quotes = 'https://raw.githubusercontent.com/Ventomexx/funnyQuotes/971833ff2c60196a307f96c70964430a11bc25ed/quotes.json';
    const res = await fetch(quotes);
    const dataQuotes = await res.json();
    iQuotes > 8 ? iQuotes = 0 : iQuotes++;
    quote.textContent = dataQuotes[iQuotes].quote;
    author.textContent = dataQuotes[iQuotes].author;
  }
  getQuotes()
  changeQuote.onclick = () => getQuotes();
// Audio player
  let isPlay = false;
  let playNum = 0;
  const audio = new Audio();

  function playAudio(pauseTime = 0) {
    audio.src = playList[playNum].src;
    trackName.innerHTML = playList[playNum].title;
    if (isPlay) {
      audio.pause();
      audio.currentTime = pauseTime; 
      isPlay = false;
      playBtn.classList.remove('pause');
    } else {
    audio.currentTime = pauseTime;  
    isPlay=true;
    playBtn.classList.add('pause');
    musicList.childNodes.forEach (item => {item.classList.remove('item-active')})
    musicList.childNodes[playNum].classList.add('item-active');
    audio.play();
  }
  };
  playBtn.onclick = () => { 
    let pauseTime = audio.currentTime; 
    playAudio(pauseTime);
  }

  playList.forEach(el => {
    const li = document.createElement('li');
    ul.append(li);
    li.classList.add('play-item');
    li.textContent = el.title;
  });
  playNextBtn.onclick = () => {
    isPlay = false;
    playNum < (playList.length - 1) ? playNum += 1 : playNum = 0;
    playAudio();
  };
  playPrevBtn.onclick = () => {
    isPlay = false;
    playNum > 0 ? playNum -= 1 : playNum = playList.length - 1;
    playAudio();
  };
  audio.addEventListener('ended', function() {
    isPlay = false;
    playNum < (playList.length - 1) ? playNum += 1 : playNum = 0;
    playAudio();
  });

  // Update the progress bar.
  const handleProgress = () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    timerStart.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    const minutesEnd = Math.floor(audio.duration / 60);
    const secondsEnd = Math.floor(audio.duration % 60);
    timerEnd.innerHTML = `${minutesEnd.toString().padStart(2, "0")}:${secondsEnd.toString().padStart(2, "0")}`
  };
  audio.addEventListener('timeupdate', handleProgress);
  
  progressBar.addEventListener("click", (e) => {
    const percent = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = percent * audio.duration;
  });
  audio.addEventListener("input", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;
  });
 
  // Volume
  volume.addEventListener('input', function() {
    audio.volume = volume.value;
  });
  
  volumeIco.onclick = () => {
    volumeIco.classList.toggle('mute');
    if (audio.volume === 0) {audio.volume = volume.value}
    else {audio.volume = 0;}
  }
  