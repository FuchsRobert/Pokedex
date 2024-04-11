async function searchPokemon(){
    let pokemonName = document.querySelector('.inputfield').value.toLowerCase();
    let pokemonData = await fetchPokemonData(pokemonName);
    if(pokemonData) {
        createPopup(pokemonData);
    } else {
        alert("Pokemon nicht gefunden!");
    }
}


async function fetchPokemonData(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(url);
    let data = await response.json();
    return data;
}