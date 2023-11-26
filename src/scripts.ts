import axios from 'axios';

let limit = 20;

type Country = {
  name: string;
  code: string;
  capital: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  language: {
    code: string;
    name: string;
  };
};
// Search inputos ievadītie dati
const countryName = document.querySelector<HTMLInputElement>('input[name=country-name]');
const capitalName = document.querySelector<HTMLInputElement>('input[name=capital-name]');
const currencyName = document.querySelector<HTMLInputElement>('input[name=currency-name]');
const languageName = document.querySelector<HTMLInputElement>('input[name=language-name]');

const tBody = document.querySelector<HTMLElement>('tbody');
const loadMoreButton = document.querySelector<HTMLButtonElement>('.load-more__button');
const searchButton = document.querySelector<HTMLButtonElement>('.search__button');
const sortButton = document.querySelectorAll<HTMLElement>('.table-head');

function loadMoreCountries() {
  axios.get<Country[]>(`http://localhost:3004/countries?_start=0&_limit=${limit}`).then((response) => {
    response.data.forEach((element) => {
      const { name, capital, currency, language } = element;
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.innerText = name;

      const capitalCell = document.createElement('td');
      capitalCell.innerText = capital;

      const currencyCell = document.createElement('td');
      // currency?.symbol ? pārbauda vai currency ir definēts un tāds ir,
      // tad pārbauda vai ir definēts symbol, ja ir true, tad izvada abus
      // divus, ja ne, tad tikai currency name
      currencyCell.innerText = currency?.symbol ? `${currency.symbol} - ${currency.name}` : `${currency.name}`;

      const languageCell = document.createElement('td');
      languageCell.innerText = language.name;

      row.appendChild(nameCell);
      row.appendChild(capitalCell);
      row.appendChild(currencyCell);
      row.appendChild(languageCell);

      tBody.appendChild(row);
    });
  });
  limit += 20;
}

function searchTable() {
  const countryNameInput = countryName.value;

  const capitalNameInput = capitalName.value;

  const currencyNameInput = currencyName.value;

  const languageNameInput = languageName.value;

  const rows = document.querySelectorAll('tr');
  rows.forEach((row) => {
    if (!row.className) {
      row.remove();
    }
  });
  axios
    .get<Country[]>(`http://localhost:3004/countries?name_like=${countryNameInput}&capital_like=${capitalNameInput}&currency.name_like=${currencyNameInput}&language.name_like=${languageNameInput}`)
    .then((response) => {
      const result = response.data;
      for (let i = 0; i < result.length; i += 1) {
        const element = result[i];
        const { name, capital, currency, language } = element;

        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.innerText = name;

        const capitalCell = document.createElement('td');
        capitalCell.innerText = capital;

        const currencyCell = document.createElement('td');
        currencyCell.innerText = currency.name;

        const languageCell = document.createElement('td');
        languageCell.innerText = language.name;

        row.appendChild(nameCell);
        row.appendChild(capitalCell);
        row.appendChild(currencyCell);
        row.appendChild(languageCell);
        tBody.appendChild(row);
      }
    });
}
let sortedData;
let currentSortOrder = 'desc';
const sortData = (sortBy: string) => {
  currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
  axios.get(`http://localhost:3004/countries?_sort=${sortBy}&_order=${currentSortOrder}&_start=0&_limit=${limit - 20}`).then((response) => {
    sortedData = response.data;

    const rows = document.querySelectorAll('tr');
    rows.forEach((row) => {
      if (!row.className) {
        row.remove();
      }
    });

    for (let i = 0; i < sortedData.length; i += 1) {
      const element = sortedData[i];
      const { name, capital, currency, language } = element;

      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.innerText = name;

      const capitalCell = document.createElement('td');
      capitalCell.innerText = capital;

      const currencyCell = document.createElement('td');
      currencyCell.innerText = `${currency.name} ${currency.symbol}`;

      const languageCell = document.createElement('td');
      languageCell.innerText = language.name;

      row.appendChild(nameCell);
      row.appendChild(capitalCell);
      row.appendChild(currencyCell);
      row.appendChild(languageCell);
      tBody.appendChild(row);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  loadMoreCountries();
});

searchButton.addEventListener('click', searchTable);
loadMoreButton.addEventListener('click', loadMoreCountries);

sortButton[0].addEventListener('click', () => sortData('name'));
sortButton[1].addEventListener('click', () => sortData('capital'));
sortButton[2].addEventListener('click', () => sortData('currency.name'));
sortButton[3].addEventListener('click', () => sortData('language.name'));
