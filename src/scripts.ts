import axios from 'axios';

type Country = {
  name: string;
  code: string;
  capital:string;
  currency: {
    code:string
    name:string
    symbol:string
  }
  language: {
    code:string
    name:string
  }
}

axios.get<Country[]>(' http://localhost:3004/countries').then((response) => {
  response.data.forEach((element) => {
    console.log(element.currency.symbol);
  });
});
