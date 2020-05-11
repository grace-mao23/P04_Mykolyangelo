// Variables
let countryList = null;

// Load Data
const searchLoadData = (callback) => {
  const query = `
  {
    allCountries {
      countryName
      countryCode
    }
  }
  `;
  d3.json('/graphql', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query })
  })
    .then(({ data: { allCountries } }) => callback(allCountries));
};

// Search function
const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const search = (data, fragment, list) => {
  const filtered = data.filter(
    ({ countryName }) => countryName.toLowerCase().includes(fragment.toLowerCase())
  ).slice(0, 10);

  let first = document.createElement("li");
  first.innerHTML = "Search Result";
  first.className = "subheading";

  list.appendChild(first);

  list.style.background = '#fafafa';

  filtered.forEach(({ countryCode, countryName }) => {
    let item = document.createElement("li");
    let link = document.createElement("a");

    link.href = `/country/${countryCode}`;
    link.innerHTML = `${countryName}`

    item.appendChild(link);
    list.appendChild(item);
  });
};

document.getElementById("searchCountry").addEventListener(
  'keydown',
  debounce(function () {
    let list = document.getElementById("searchResult");
    let fc = list.firstChild;

    while (fc) {
      list.removeChild(fc);
      fc = list.firstChild;
    }

    let inputValue = document.getElementById("searchCountry").value;


    if (!countryList) {
      searchLoadData(function (allCountries) {
        countryList = allCountries;
        search(countryList, inputValue, list);
      });
    } else {
      search(countryList, inputValue, list);
    }
  }, 450)
);