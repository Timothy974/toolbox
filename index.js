/***** clock widget *****/
clock();

function clock() {

   const date = new Date();

   const hours = ((date.getHours() + 11) % 12 + 1);
   const minutes = date.getMinutes();
   const seconds = date.getSeconds();

   const hourDeg = hours * 30;
   const minuteDeg = minutes * 6;
   const secondDeg = seconds * 6;

   document.querySelector(".hours").style.transform = `rotate(${hourDeg}deg)`;
   document.querySelector(".minutes").style.transform = `rotate(${minuteDeg}deg)`;
   document.querySelector(".seconds").style.transform = `rotate(${secondDeg}deg)`;
}

setInterval(clock, 1000);

/***** Weather widget *****/

const weatherIcons = {
   "Rain": "wi wi-day-rain",
   "Clouds": "wi wi-day-cloudy",
   "Clear": "wi wi-day-sunny",
   "Snow": "wi wi-day-snow",
   "Mist": "wi wi-day-fog",
   "Drizzle": "wi wi-day-sleet",

}

const weatherPic = {
   "Rain": "./img/rain.jpg",
   "Clouds": "./img/clouds.jpg",
   "Clear": "./img/sunny.jpg",
   "Snow": "./img/snow.jpg",
   "Mist": "./img/mist.jpg",
   "Drizzle": "./img/rain.jpg",
}

function weatherWidget(withIP = true) {

   let ipApiKey = '59a0317d6bdf413ea5fb95aae60d92c1';
   let openWeatherApiKey = '60f959e6d7f0da264048bfbe76f1585e';
   let city = document.querySelector('#ville').textContent;

   if (withIP) {

      fetch('https://api.ipgeolocation.io/ipgeo?apiKey=' + ipApiKey)
         .then(resultat => resultat.json())
         .then(json => {
            let lat = json.latitude;
            let lon = json.longitude;

            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&lang=fr&units=metric&appid=' + openWeatherApiKey)
               .then(resultat => resultat.json())
               .then(json => {
                  displayWeatherInfo(json)
               })
         })
   } else {
      fetch('https://nominatim.openstreetmap.org/search?q=' + city + '&format=geojson')
         .then(resultat => resultat.json())
         .then(json => {
            let lat = json.features[0].geometry.coordinates[1];
            let lon = json.features[0].geometry.coordinates[0];

            fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&lang=fr&units=metric&appid=' + openWeatherApiKey)
               .then(resultat => resultat.json())
               .then(json => {
                  displayWeatherInfo(json)
               })

         })
   }

}

function displayWeatherInfo(data) {
   const name = data.name;
   const temperature = data.main.temp;
   const conditions = data.weather[0].main;
   const descripion = data.weather[0].description;

   document.querySelector('#ville').textContent = name;
   document.querySelector('#temperature').textContent = Math.round(temperature);
   document.querySelector('#conditions').textContent = descripion;
   document.querySelector('i.wi').className = weatherIcons[conditions];
   document.querySelector('header').style.background = `url(${weatherPic[conditions]}) no-repeat center/cover`;

}

const ville = document.querySelector('#ville');

ville.addEventListener('click', () => {
   ville.contentEditable = true;
})

ville.addEventListener('keydown', (e) => {
   if (e.keyCode === 13) {
      e.preventDefault();
      ville.contentEditable = false;

      weatherWidget(false);
   }
})

weatherWidget();


/***** CALCULATOR WIDGET *****/

const touches = [...document.querySelectorAll('.button')];
const listeKeycode = touches.map(touche => touche.dataset.key);
const screen = document.querySelector('.screen');

document.addEventListener('keydown', (e) => {
   const valeur = e.keyCode.toString();
   calculer(valeur);
})

document.addEventListener('click', (e) => {
   const valeur = e.target.dataset.key;
   calculer(valeur);
})

const calculer = (valeur) => {
   if (listeKeycode.includes(valeur)) {
      switch (valeur) {
         case '8':
            screen.textContent = "";
            break;
         case '13':
            const calcul = eval(screen.textContent);
            screen.textContent = calcul;
            break;
         default:
            const indexKeycode = listeKeycode.indexOf(valeur);
            const touche = touches[indexKeycode];
            screen.textContent += touche.innerHTML;
      }
   }
}

window.addEventListener('error', (e) => {
   alert("une erreur est survenue lors du calcul : " + e.message);
})

/***** PASSWORD GENERATOR *****/
const passwordOutput = document.querySelector('#password-output');
const dataLowercase = "azertyuiopqsdfghjklmwxcvbn".split('');
const dataUppercase = "AZERTYUIOPQSDFGHJKLMWXCVBN".split('');
const dataNumbers = "0123456789".split('');
const dataSymbols = "?;.:/!§<>&@^".split('');

function generatePassword() {

   const data = [].concat(
      lowercase.checked ? dataLowercase : [],
      uppercase.checked ? dataUppercase : [],
      numbers.checked ? dataNumbers : [],
      symbols.checked ? dataSymbols : [],

   );

   let passwordLength = parseInt(document.querySelector('#display-password-length').value);
   let newPassword = '';

   if (data.length === 0) {
      passwordOutput.innerHTML = "Générateur de MDP";
      alert('Veuillez sélectionner des critères');
      return;
   }

   for (let i = 0; i < passwordLength; i++) {
      newPassword += data[Math.floor(Math.random() * data.length)];
   }

   passwordOutput.value = newPassword;

   passwordOutput.select();
   document.execCommand('copy');
   generateButton.innerHTML = "Copié !";
   setTimeout(() => {
      generateButton.innerHTML = "GENERATE"
   }, 2500)
}

/***** MONEY CONVERTER *****/

const selectBox = document.querySelector('select');
const valDepart = document.querySelector('#valeur-depart');
const tauxComparaison = document.querySelector('.taux-de-comparaison');
const resultatsAffichage = document.querySelector('.resultats');

let options = [];
let valeurSelect;
let tauxEnCours;
let exchangeRateApiKey = '903b9211b50b6232372a09b5cb6c708c';
valDepart.value = 1;

fetch("http://api.exchangeratesapi.io/v1/latest?access_key=" + exchangeRateApiKey)
   .then(response => response.json())
   .then(data => {
      console.log(data);
      for (const property in data.rates) {
         options.push(`<option>${property}</option>`)
      }

      selectBox.innerHTML = options.join('');
      valeurSelect = selectBox.value;
      APICall(valeurSelect);
   })

async function APICall(val) {

   const resultatsApi = await fetch("http://api.exchangeratesapi.io/v1/latest?access_key=" + exchangeRateApiKey + `&symbols=${val}`)
   const resultats = await resultatsApi.json();

   valeurSelect = val;
   tauxEnCours = resultats.rates[valeurSelect];
   resultatsAffichage.innerText = `1 euro = ${tauxEnCours.toFixed(2)} ${valeurSelect}`;
   tauxComparaison.innerHTML = `Taux en cours : ${tauxEnCours.toFixed(2)}`;



}

valDepart.addEventListener('input', (e) => {

   if (e.target.value.length === 0) {
      resultatsAffichage.innerText = `0 euro = 0 ${valeurSelect}`
   } else {
      let conversionFinale = e.target.value * tauxEnCours;
      resultatsAffichage.innerText = `${e.target.value} euro = ${conversionFinale.toFixed(2)} ${valeurSelect}`
   }
})

selectBox.addEventListener('input', (e) => {
   APICall(e.target.value);
})

/***** KEYCODE GENERATOR *****/

const keyPressed = document.querySelector('.keyPressed');
const keyCode = document.querySelector('.keyCode');


document.addEventListener('keypress', (e) => {
   const keyCodeP = e.keyCode;
   const key = e.key;

   keyPressed.textContent = key;
   keyCode.textContent = keyCodeP;

})