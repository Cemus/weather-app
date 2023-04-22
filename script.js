import { key } from "./clef.mjs";

let langue = "fr";

function Language() {
  const french = document.getElementById("french");
  const english = document.getElementById("english");
  french.addEventListener("click", () => {
    langue = "fr";
    toHtml();
  });
  english.addEventListener("click", () => {
    langue = "en";
    toHtml();
  });
}

const searchBar = document.getElementById("search");
searchBar.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    toHtml(searchBar.value);
    searchBar.blur();
  }
});

Language();
toHtml();

async function fetchData(search) {
  search === undefined ? (search = "auto:ip") : (search = search);
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${search}&lang=${langue}`,
      {
        mode: "cors",
      }
    );
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    fetchData(undefined);
  }
}

async function toHtml(search) {
  const searchWrapper = document.getElementsByClassName("input-wrapper")[0];
  const data = await fetchData(search);
  const container = document.getElementById("container");
  let feel, humidity, wind;
  switch (langue) {
    case "en":
      feel = "Feels like :";
      humidity = "Humidity :";
      wind = "Wind :";
      break;
    case "fr":
      feel = "Ressenti :";
      humidity = "Humidité :";
      wind = "Vent :";
      break;
  }

  try {
    if (data !== undefined) {
      searchWrapper.classList.remove("error");
      searchBar.classList.remove("error");
      container.children[0].src = data.current.condition.icon;
      container.children[0].alt = data.current.condition.text;
      container.children[1].textContent = data.location.name;
      container.children[2].textContent = `${data.current.temp_c} °C`;
      container.children[3].textContent = data.current.condition.text;
      //!!! Modifier la langue de feel humid et wind
      container.children[4].children[0].textContent = `${feel} ${data.current.feelslike_c} °C`;
      container.children[4].children[1].textContent = `${humidity}  ${data.current.humidity} %`;
      container.children[4].children[2].textContent = `${wind}  ${data.current.wind_kph} km/h`;
    }
  } catch (err) {
    searchWrapper.classList.add("error");
    searchBar.classList.add("error");
    switch (langue) {
      case "en":
        console.log("test");
        searchWrapper.setAttribute(
          "data-content",
          "No matching location found!"
        );
        break;
      case "fr":
        console.log("test");
        searchWrapper.setAttribute("data-content", "Aucun lieu trouvé !");
        console.log("test2");
        break;
    }

    console.log(window.getComputedStyle(error, "::after").content);
  }
}
