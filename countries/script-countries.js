async function searchCountry() {
  const searchInputValue = document.querySelector("#search_input").value;

  try {
      const countryResponse = await fetch(
          `https://restcountries.com/v3.1/name/${searchInputValue}`
      );
      const countryData = await countryResponse.json();

      if (countryData.status === 404) {
          displayErrorMessage(
              "Country not found. Please enter a valid country name."
          );
      } else {
          const country = countryData[0];
          const region = country.region;

          const regionResponse = await fetch(
              `https://restcountries.com/v3.1/region/${region}`
          );
          const regionData = await regionResponse.json();

          displayCountryDetails(country, regionData);
      }
  } catch (error) {
      console.error("Error fetching country data:", error);
      displayErrorMessage(
          "An error occurred. Please try again, Input Valid Countries.");
  }
}

function displayErrorMessage(message) {
  const detailsContainer = document.querySelector("#country_details");
  detailsContainer.innerHTML =`<p class="error-message">${message}</p>`;

    const otherCountriesContainer = 
        document.querySelector("#other_countries");
    otherCountriesContainer.classList.add("hide");
}

function displayCountryDetails(country, otherCountries) {
    const detailsContainer = document.querySelector("#country_details");
    detailsContainer.innerHTML = 
      `<h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="${country.name.common} Flag" />
      <p>Region: ${country.region}</p>
      <p>Capital: ${country.capital}</p>
      <p>Population: ${country.population}</p>
      <p>Area: ${country.area} square km</p>
      <p>Language: ${Object.values(country.languages).join(", ")}</p>`;
  
    const otherCountriesContainer = 
        document.querySelector("#other_countries");
  
    otherCountriesContainer.classList.remove("hide");
    
    otherCountriesContainer.innerHTML = 
        "<h2>Other Countries in the Region</h2>";

  otherCountries.forEach((otherCountry) => {
    if (otherCountry.name.common) {
      const countryCard = document.createElement("div");
      countryCard.classList.add("country-card");

      countryCard.innerHTML = `<img src="${otherCountry.flags.png}" 
                alt="${otherCountry.name.common} Flag" />
               <p>${otherCountry.name.common}</p>`;

      otherCountriesContainer.appendChild(countryCard);
    }
  });
}
