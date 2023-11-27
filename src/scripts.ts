import axios from 'axios';

// Search inputos ievadītie dati
const countryName = document.querySelector<HTMLInputElement>('input[name=country-name]');
const capitalName = document.querySelector<HTMLInputElement>('input[name=capital-name]');
const currencyName = document.querySelector<HTMLInputElement>('input[name=currency-name]');
const languageName = document.querySelector<HTMLInputElement>('input[name=language-name]');

const tBody = document.querySelector<HTMLTableSectionElement>('tbody');

// Pogas
const loadMoreButton = document.querySelector<HTMLButtonElement>('.load-more__button');
const searchButton = document.querySelector<HTMLButtonElement>('.search__button');
const sortButton = document.querySelectorAll<HTMLTableColElement>('.table-head');

// Lai sakotnēji rādītu 20 ierakstus
let limit = 20;
// Ieliek mainīgajā tagadējo secību
let currentSortOrder = 'asc';

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

  // Dabū datus no db un uzzimē tos
  getTable() {
    axios.get<Country[]>(`http://localhost:3004/countries?_start=0&_limit=${limit}`).then((response) => {
      const responseData = response.data;
      this.drawTable(responseData, tBody);
    });
    return this;
  }

  // Uzzimē tabulu
  drawTable(data: Country[], targetBody: HTMLElement) {
    tBody.innerHTML = '';
    data.forEach((element) => {
      const {
        name, capital, currency, language, code,
      } = element;
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
  }

  // Ielāde vēl valstis
  loadMoreCountries() {
    this.getTable();
  }

  // Izdzēš visas rindas
  deleteAllRows() {
    const rows = document.querySelectorAll('tr');
    rows.forEach((row) => {
      if (!row.className) {
        row.remove();
      }
    });
  }

  // Meklē pēc search ievadītiem datiem, izdzēš rindas un uzzimē no jauna tabulu
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
        this.drawTable(result, tBody);
      });
  }

  // Sortē tabulas datus un uzzimē tabulu tādā secībā kā ir izvēlēts
  sortData(sortBy: string) {
    // Pārbauda vai tagadējā sortēšanas kārtība ir asc, ja ne, tad liek desc
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    axios.get(`http://localhost:3004/countries?_sort=${sortBy}&_order=${currentSortOrder}&_start=0&_limit=${limit}`).then((response) => {
      const sortedData = response.data;

      this.drawTable(sortedData, tBody);
    });
  }
}

const country = new Country().getTable();
loadMoreButton.addEventListener('click', () => {
  limit += 20;

  country.loadMoreCountries();
});
searchButton.addEventListener('click', () => {
  country.search();
});
sortButton[1].addEventListener('click', () => country.sortData('name'));
sortButton[2].addEventListener('click', () => country.sortData('capital'));
sortButton[3].addEventListener('click', () => country.sortData('currency.name'));
sortButton[4].addEventListener('click', () => country.sortData('language.name'));
