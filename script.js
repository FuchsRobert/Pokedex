let currentPokemon;
let currentBatch = 1;
cardIndex = 1;
let popupVisible = false;


async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}


async function fetchPokemonNames(startIndex, endIndex) {
  let url = `https://pokeapi.co/api/v2/pokemon/?limit=${
    endIndex - startIndex + 1
  }&offset=${startIndex - 1}`;
  let response = await fetch(url);
  let data = await response.json();
  let pokemonNames = data.results.map((pokemon) => pokemon.name);
  return pokemonNames;
}


async function fetchPokemonData(pokemonName) {
  let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  let response = await fetch(url);
  let data = await response.json();
  return data;
}


document
  .getElementById("loadMoreButton")
  .addEventListener("click", async function () {
    currentBatch++;
    await loadPokemon();
  });


async function loadPokemon() {
  let startIndex = (currentBatch - 1) * 40 + 1;
  let endIndex = currentBatch * 40;
  let pokemonNames = await fetchPokemonNames(startIndex, endIndex);

  for (let i = 0; i < pokemonNames.length; i++) {
    let pokemonName = pokemonNames[i];
    let pokemonData = await fetchPokemonData(pokemonName);
    createCard(pokemonData);
  }
}


function createCard(pokemonData) {
  let cardHtml = `<div class="card ${
    pokemonData.types[0].type.name
  }" onclick="showPokemonDetails('${pokemonData.name}')">
        <div class="imageContainer"><img class="card-img-top img-fluid rounded-start" src="${
          pokemonData.sprites.other["official-artwork"].front_default
        }" alt="Pokemon Image"></div>
        <div class="card-body">
            <div class="pokedex-number-container">
                <p>#</p>
                <p>${pokemonData.id}</p>
            </div>
            <h5 class="card-title">${pokemonData.name}</h5>
            <p class="card-text">${pokemonData.types
              .map((type) => type.type.name)
              .join(", ")}</p>
        </div>
    </div>`;

  document.getElementById("card").insertAdjacentHTML("beforeend", cardHtml);
}


function renderPokemonInfo(currentPokemon, index) {
  document.getElementById(`pokedexNumber${index}`).innerHTML =
    currentPokemon["game_indices"][4]["game_index"];
  let name = currentPokemon["name"];
  let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  document.getElementById(`pokemonName-${index}`).innerHTML = formattedName;
  document.getElementById(`pokemonImg-${index}`).src =
    currentPokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let type = currentPokemon["types"][0]["type"]["name"];
  let formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  document.getElementById(`pokemonType-${index}`).innerHTML = formattedType;

  let cardElement = document.getElementById(`card-${index}`);
  cardElement.classList.add(type);
}

document.addEventListener("DOMContentLoaded", function () {
  loadPokemon();
});

//*Popup*/

async function showPokemonDetails(pokemonName) {
  fetchPokemonData(pokemonName)
    .then((pokemonData) => {
      currentPokemon = pokemonData;
      currentPokemonIndex = pokemonData.id;
      createPopup(pokemonData);
    })
    .catch((error) => console.error("Fehler beim Laden der Pokémondaten:", error));
}


function createPopup(pokemonData) {
  let popupHtml = `<div id="popup" class="popup ${
    pokemonData.types[0].type.name
  }">
        <div class="popup-content">
            <span class="close" onclick="closePopup()">&times;</span>
            <div class="pokemon-details">
                <h2>${pokemonData.name}</h2>
                <img src="${
                  pokemonData.sprites.other["official-artwork"].front_default
                }" alt="${pokemonData.name}">
                <p><b>Gewicht:</b> ${pokemonData.weight}</p>
                <p><b>Größe:</b> ${pokemonData.height}</p>
                <p><b>Abilities:</b> ${pokemonData.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}</p>
                <p><b>Stats:</b></p>
                <ul>
                    ${pokemonData.stats
                      .map(
                        (stat) =>
                          `<li>${stat.stat.name}: ${stat.base_stat}</li>`
                      )
                      .join("")}
                </ul>
            </div>
            <div class="navigation">
            <span class="arrow left" onclick="loadPreviousPokemon()">❮</span>
            <span class="arrow right" onclick="loadNextPokemon()">❯</span>
        </div>
        
        </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", popupHtml);
  popupVisible = true;

  document.addEventListener("click", outsideClickListener);
  document.body.classList.add('popup-open');
}


function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.remove();
    popupVisible = false;

    document.removeEventListener("click", outsideClickListener);
  }
  document.body.classList.remove('popup-open');
}


function outsideClickListener(event) {
  const popup = document.getElementById("popup");
  const clickedElement = event.target;
  if (
    popupVisible &&
    popup &&
    !popup.contains(clickedElement) &&
    clickedElement.className !== "close"
  ) {
    closePopup();
  }
}


function loadPreviousPokemon() {
  if (currentPokemonIndex > 1) {
    const previousPokemonIndex = currentPokemonIndex - 1;
    fetchPokemonData(previousPokemonIndex)
      .then((pokemonData) => {
        currentPokemon = pokemonData;
        currentPokemonIndex = previousPokemonIndex;
        updatePopup(pokemonData);
      })
      .catch((error) => console.error("Error fetching Pokemon data:", error));
  }
}


function loadNextPokemon() {
  const nextPokemonIndex = currentPokemonIndex + 1;
  fetchPokemonData(nextPokemonIndex)
    .then((pokemonData) => {
      currentPokemon = pokemonData;
      currentPokemonIndex = nextPokemonIndex;
      updatePopup(pokemonData);
    })
    .catch((error) => console.error("Error fetching Pokemon data:", error));
}


function updatePopup(pokemonData) {
  let type = pokemonData.types[0].type.name;
  let popup = document.getElementById("popup");
  let popupContent = popup.querySelector(".popup-content");

  popupContent.innerHTML = `
        <span class="close" onclick="closePopup()">&times;</span>
        <h2>${pokemonData.name}</h2>
        <img src="${
          pokemonData.sprites.other["official-artwork"].front_default
        }" alt="${pokemonData.name}">
        <p><b>Gewicht:</b> ${pokemonData.weight}</p>
        <p><b>Größe:</b> ${pokemonData.height}</p>
        <p><b>Abilities:</b> ${pokemonData.abilities
          .map((ability) => ability.ability.name)
          .join(", ")}</p>
        <p><b>Status:</b></p>
        <ul>
            ${pokemonData.stats
              .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
              .join("")}
        </ul>
        <div class="navigation">
            <span class="arrow left" onclick="loadPreviousPokemon()">❮</span>
            <span class="arrow right" onclick="loadNextPokemon()">❯</span>
        </div>
    `;

  popup.className = `popup ${type}`;
}
