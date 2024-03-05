// Initialize a variable to keep track of the current Pokemon ID
let currentPokemonId = null;

// When the DOM is fully loaded...
document.addEventListener("DOMContentLoaded", () => {
  // Define the maximum number of Pokemons (649 in this case)
  const MAX_POKEMONS = 649;

  // Get the Pokemon ID from the URL query parameter
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  // Check if the ID is within valid range
  if (id < 1 || id > MAX_POKEMONS) {
    // Redirect to the index page if the ID is invalid
    return (window.location.href = "./index.html");
  }

  // Set the current Pokemon ID
  currentPokemonId = id;

  // Load Pokemon details
  loadPokemon(id);
});

// Function to load Pokemon data
async function loadPokemon(id) {
  try {
    // Fetch data for the Pokemon and its species
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);

    // Clear the abilities wrapper
    const abilitiesWrapper = document.querySelector(
      ".pokemon-detail-wrap .pokemon-detail.move"
    );
    abilitiesWrapper.innerHTML = "";

    // Display Pokemon details
    if (currentPokemonId === id) {
      displayPokemonDetails(pokemon);

      // Get the English flavor text for the Pokemon
      const flavorText = getEnglishFlavorText(pokemonSpecies);
      document.querySelector(".body3-fonts.pokemon-description").textContent =
        flavorText;

      // Set up navigation arrows
      const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) =>
        document.querySelector(sel)
      );
      leftArrow.removeEventListener("click", navigatePokemon);
      rightArrow.removeEventListener("click", navigatePokemon);

      if (id !== 1) {
        leftArrow.addEventListener("click", () => {
          navigatePokemon(id - 1);
        });
      }
      if (id !== 151) {
        rightArrow.addEventListener("click", () => {
          navigatePokemon(id + 1);
        });
      }

      // Update the browser history with the current Pokemon ID
      window.history.pushState({}, "", `./detail.html?id=${id}`);
    }

    return true;
  } catch (error) {
    // Handle errors during data fetching
    console.error("An error occurred while fetching Pokemon data:", error);
    return false;
  }
}

// Function to navigate to a different Pokemon
async function navigatePokemon(id) {
  currentPokemonId = id;
  await loadPokemon(id);
};

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  dark: "#EE99AC",
};

// Set styles for one or more DOM elements
function setElementStyles(elements, cssProperty, value) {
  elements.forEach((element) => {
    element.style[cssProperty] = value;
  });
}

// Convert a hexadecimal color code to an RGBA string
function rgbaFromHex(hexColor) {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ].join(", ");
}

// Set background color and border color based on Pokemon type
function setTypeBackgroundColor(pokemon) {
  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType];

  if (!color) {
    console.warn(`Color not defined for type: ${mainType}`);
    return;
  }

  // Set background and border color for the main detail element
  const detailMainElement = document.querySelector(".detail-main");
  setElementStyles([detailMainElement], "backgroundColor", color);
  setElementStyles([detailMainElement], "borderColor", color);

  // Set background color for power-related elements
  setElementStyles(
    document.querySelectorAll(".power-wrapper > p"),
    "backgroundColor",
    color
  );

  // Set text color for stats
  setElementStyles(
    document.querySelectorAll(".stats-wrap p.stats"),
    "color",
    color
  );

  // Customize progress bar colors
  setElementStyles(
    document.querySelectorAll(".stats-wrap .progress-bar"),
    "color",
    color
  );

  // Create a style tag to adjust progress bar appearance
  const rgbaColor = rgbaFromHex(color);
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColor}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${color};
    }
  `;
  document.head.appendChild(styleTag);
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Create and append an HTML element to a parent element
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

// Display Pokemon details on the page
function displayPokemonDetails(pokemon) {
  const { name, id, types, weight, height, abilities } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  // Set the page title to the capitalized Pokemon name
  document.querySelector("title").textContent = capitalizePokemonName;

  // Add the Pokemon's name as a class to the main detail element
  const detailMainElement = document.querySelector(".detail-main");
  detailMainElement.classList.add(name.toLowerCase());

  // Display the Pokemon's name and ID
  document.querySelector(".name-wrap .name").textContent =
    capitalizePokemonName;
  document.querySelector(".pokemon-id-wrap .body2-fonts").textContent =
    `#${String(id).padStart(3, "0")}`;

  // Set the image source and alt text
  const imageElement = document.querySelector(".detail-img-wrapper img");
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;

  // Display the Pokemon's types
  const typeWrapper = document.querySelector(".power-wrapper");
  typeWrapper.innerHTML = "";
  types.forEach(({ type }) => {
    createAndAppendElement(typeWrapper, "p", {
      className: `body3-fonts type ${type.name}`,
      textContent: type.name,
    });
  });

  // Display the Pokemon's weight and height
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight"
  ).textContent = `${weight / 10}kg`;
  document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height"
  ).textContent = `${height / 10}m`;

  // Display the Pokemon's abilities
  const abilitiesWrapper = document.querySelector(
    ".pokemon-detail-wrap .pokemon-detail.move"
  );

  // Display abilities of the Pokemon
abilities.forEach(({ ability }) => {
  createAndAppendElement(abilitiesWrapper, "p", {
    className: "body3-fonts",
    textContent: ability.name,
  });
});

// Clear the existing stats wrapper
const statsWrapper = document.querySelector(".stats-wrapper");
statsWrapper.innerHTML = "";

// Map stat names to their display abbreviations
const statNameMapping = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

// Display individual stats
stats.forEach(({ stat, base_stat }) => {
  const statDiv = document.createElement("div");
  statDiv.className = "stats-wrap";
  statsWrapper.appendChild(statDiv);

  // Display stat name (e.g., HP, ATK) and value
  createAndAppendElement(statDiv, "p", {
    className: "body3-fonts stats",
    textContent: statNameMapping[stat.name],
  });
  createAndAppendElement(statDiv, "p", {
    className: "body3-fonts",
    textContent: String(base_stat).padStart(3, "0"),
  });

  // Create a progress bar for the stat
  createAndAppendElement(statDiv, "progress", {
    className: "progress-bar",
    value: base_stat,
    max: 100,
  });
});

// Set background color based on Pokemon type
setTypeBackgroundColor(pokemon);
}

// Get the English flavor text for the Pokemon
function getEnglishFlavorText(pokemonSpecies) {
  for (let entry of pokemonSpecies.flavor_text_entries) {
    if (entry.language.name === "en") {
      // Replace any form feed characters with spaces
      let flavor = entry.flavor_text.replace(/\f/g, " ");
      return flavor;
    }
  }
  return "";
}
