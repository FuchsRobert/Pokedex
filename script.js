let currentPokemon;


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/togepi';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log('Loaded pokemon', currentPokemon);
    renderPokemonInfo();
}


function renderPokemonInfo() {
    document.getElementById('pokedexNumber').innerHTML = currentPokemon['game_indices'][0]['game_index'];
    let name = currentPokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('pokemonName').innerHTML = formattedName;
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['front_default'];
    let type = currentPokemon['types'][0]['type']['name'];
    let formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('pokemonType').innerHTML = formattedType;
    document.getElementById('pokemonHeight').innerHTML = (currentPokemon['height'] / 10).toLocaleString() + " m";
    document.getElementById('pokemonWeight').innerHTML = (currentPokemon['weight'] / 10).toLocaleString() + " kg";
    let abilities = currentPokemon['abilities'].map(function(ability) {
        let abilityName = ability['ability']['name'];
        return abilityName.charAt(0).toUpperCase() + abilityName.slice(1);
    });
    let abilitiesText = abilities.join(', ');
    document.getElementById('pokemonAbility').innerHTML = abilitiesText;
}