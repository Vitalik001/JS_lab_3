function debounce(fn, duration = 300) {
  let timeoutId;

  return (...args) => {
    const afterTimeout = () => {
      clearTimeout(timeoutId);
      fn(...args);
    };

    clearTimeout(timeoutId);

    timeoutId = setTimeout(afterTimeout, duration);
  };
}

function show(id, text) {
  const element = document.getElementById(id);

  const textContent = document.createTextNode(text);
  element.replaceChildren(textContent);
}

function showTime(timeString) {
  show("time-element", timeString);
}

function showTemperature(temperatureString) {
  show("temperature-element", temperatureString);
}

function onCityChange(fn) {
  const element = document.getElementById("city-input");
  const debouncedFn = debounce(fn);

  element.addEventListener("input", (event) => debouncedFn(event.target.value));
}

// YOUR CODE HERE
update_time = () => {
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  showTime(time);
};

const intervalId = setInterval(() => {
  update_time();
}, 1000);
// clearInterval(intervalId);

function cityHandler(response) {
  response
    .then((res) => res.json())
    .then((data) => {
      fetch_temperature(
        data["results"][0]["latitude"],
        data["results"][0]["longitude"]
      );
    })
    .catch((error) => showTemperature("cannot identiffy"));
}

function temperatureHandler(response) {
  response
    .then((res) => res.json())
    .then((data) => {
      console.log(data["current_weather"]["temperature"]);
      onCityChange(showTemperature(data["current_weather"]["temperature"]));
    })
    .catch((error) => showTemperature("cannot identiffy"));
}

function fetch_city(city) {
  const response = fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=` +
      city +
      `&language=en&count=1&format=json`
  );
  cityHandler(response);
}

function fetch_temperature(latitude, longitude) {
  const response = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=` +
      latitude +
      `&longitude=` +
      longitude +
      `&current_weather=true`
  );
  temperatureHandler(response);
}

onCityChange(fetch_city);
