import axios from 'axios';

// Search inputos ievadītie dati
const countryName = document.querySelector<HTMLInputElement>('input[name=country-name]');
const capitalName = document.querySelector<HTMLInputElement>('input[name=capital-name]');
const currencyName = document.querySelector<HTMLInputElement>('input[name=currency-name]');
const languageName = document.querySelector<HTMLInputElement>('input[name=language-name]');

const tBody = document.querySelector<HTMLElement>('tbody');

const loadMoreButton = document.querySelector<HTMLButtonElement>('.load-more__button');
const searchButton = document.querySelector<HTMLButtonElement>('.search__button');
const sortButton = document.querySelectorAll<HTMLElement>('.table-head');

let limit = 20;
let sortedData;
let currentSortOrder = 'desc';

class Country {
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

  data: Country[];

  getTable() {
    axios.get<Country[]>(`http://localhost:3004/countries?_start=0&_limit=${limit}`).then((response) => {
      this.data = response.data;
      this.draw(this.data, tBody);
    });
    return this;
  }

  draw(data: Country[], targetBody: HTMLElement) {
    tBody.innerHTML = '';
    data.forEach((element) => {
      const { name, capital, currency, language, code } = element;
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.innerText = name;

      const flagCell = document.createElement('td');
      flagCell.innerHTML = `<img class="flag-image" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icons/7.0.2/flags/1x1/${code.toLowerCase()}.svg"  alt="Flag Image"> `;

      const capitalCell = document.createElement('td');
      capitalCell.innerText = capital;

      const currencyCell = document.createElement('td');
      currencyCell.innerText = currency?.symbol ? `${currency.symbol} - ${currency.name}` : `${currency.name}`;

      const languageCell = document.createElement('td');
      languageCell.innerText = language.name;

      row.appendChild(flagCell);
      row.appendChild(nameCell);
      row.appendChild(capitalCell);
      row.appendChild(currencyCell);
      row.appendChild(languageCell);

      targetBody.appendChild(row);
    });
    limit += 20;
  }

  loadMoreCountries() {
    this.getTable();
  }

  deleteAllRows() {
    const rows = document.querySelectorAll('tr');
    rows.forEach((row) => {
      if (!row.className) {
        row.remove();
      }
    });
  }

  search() {
    const countryNameInput = countryName.value;
    const capitalNameInput = capitalName.value;
    const currencyNameInput = currencyName.value;
    const languageNameInput = languageName.value;
    this.deleteAllRows();
    axios
      .get<Country[]>(`http://localhost:3004/countries?name_like=${countryNameInput}&capital_like=${capitalNameInput}&currency.name_like=${currencyNameInput}&language.name_like=${languageNameInput}`)
      .then((response) => {
        const result = response.data;
        this.draw(result, tBody);
      });
  }

  sortData(sortBy: string) {
    currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
    axios.get(`http://localhost:3004/countries?_sort=${sortBy}&_order=${currentSortOrder}&_start=0&_limit=${limit - 20}`).then((response) => {
      sortedData = response.data;

      this.deleteAllRows();

      this.draw(sortedData, tBody);
    });
  }
}

const country = new Country().getTable();

loadMoreButton.addEventListener('click', () => {
  country.loadMoreCountries();
});
searchButton.addEventListener('click', () => {
  country.search();
});

sortButton[1].addEventListener('click', () => country.sortData('name'));
sortButton[2].addEventListener('click', () => country.sortData('capital'));
sortButton[3].addEventListener('click', () => country.sortData('currency.name'));
sortButton[4].addEventListener('click', () => country.sortData('language.name'));
