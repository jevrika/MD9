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

axios.get<Country[]>('http://localhost:3004/countries').then((response) => {
  response.data.forEach((element, index) => {
    const {
      name, capital, currency, language,
    } = element;
    const row = document.createElement('tr');

    const num = document.createElement('th');
    num.innerText = String(index + 1);

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
});
