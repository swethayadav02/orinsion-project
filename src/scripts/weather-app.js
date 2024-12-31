const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = 'c99bfa4389f65ae3292cad5af6f613d7'

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != '') {
        updateweatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityInput.value.trim() != '' 
        
    ) 
    {
        updateweatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    const response =  await fetch(apiUrl)
    
    return response.json()
}
function getweatherIcon(id) {
      if (id <= 232) return 't2.png'
      if (id <= 314) return 'drizzle.png'
      if (id <= 531) return 'r1.png'
      if (id <= 622) return 'snow.png'
      if (id <= 721) return 'su1.jpeg'
      if (id <= 804) return 'cloud.png'
      else return 'sunnycloud.png'

}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digits',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}


async function updateweatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: speed
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + ' %'
    windValueTxt.textContent = speed + ' M/s'

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `public/images/${getweatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)

}
async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''

    forecastsData.list.forEach(forecastweather => {
        if (forecastweather.dt_txt.includes(timeTaken) &&
             !forecastweather.dt_txt.includes(todayDate)){
            updateForecastsItems(forecastweather)
        }
    })   
}
function updateForecastsItems(weatherData){
   console.log(weatherData)
   const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
   } = weatherData

   const dateTaken = new Date(date)
   const dateOption = {
    day: '2-digit',
    month: 'short',

}
   const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

   const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="public/images/${getweatherIcon(id)}" class="forecast-item img">
            <h5 class="forecast item temp">${Math.round(temp)} °C</h5>     
        </div>
   `

   forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
     [weatherInfoSection, searchCitySection, notFoundSection]
     .forEach(section => section.style.display = 'none')

     section.style.display = 'flex'
}