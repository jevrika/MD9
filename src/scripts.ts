import axios from 'axios';

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

const tBody = document.querySelector<HTMLElement>('tbody');
const loadMoreButton = document.querySelector<HTMLButtonElement>('.load-more__button');
let currentIndex = 0;

function loadMoreCountries() {
  axios.get<Country[]>('http://localhost:3004/countries').then((response) => {
    const next20Countries = response.data.slice(currentIndex, currentIndex + 20);

    next20Countries.forEach((element, index) => {
      const { name, capital, currency, language } = element;
      const row = document.createElement('tr');

      const num = document.createElement('th');
      num.innerText = String(currentIndex + index + 1);

      const nameCell = document.createElement('td');
      nameCell.innerText = name;

      const capitalCell = document.createElement('td');
      capitalCell.innerText = capital;

      const currencyName = currency.name;
      const currencyCell = document.createElement('td');
      currencyCell.innerText = currencyName;

      const languageName = language.name;
      const languageCell = document.createElement('td');
      languageCell.innerText = languageName;

      row.appendChild(num);
      row.appendChild(nameCell);
      row.appendChild(capitalCell);
      row.appendChild(currencyCell);
      row.appendChild(languageCell);

      tBody.appendChild(row);
    });

    currentIndex += 20;

    // Disable the button if there are no more countries to load
    if (currentIndex >= response.data.length) {
      loadMoreButton.disabled = true;
    }
  });
}

loadMoreButton.addEventListener('click', loadMoreCountries);
