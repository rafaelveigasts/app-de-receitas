import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import '../styles/searchbar.css';

const notFound = 'Sinto muito, não encontramos nenhuma receita para esses filtros.';

export default function SearchBar() {
  const location = useLocation();
  const history = useHistory();
  const {
    dataSearchMeals,
    dataSearchDrinks,
    setDataSearchMeals,
    setDataSearchDrinks,
    setIsSearch,
    isSearch,
  } = useAppContext();
  const [search, setSearch] = useState('');
  const [searchParameters, setSearchParameters] = useState('');

  const isMeals = location.pathname === '/comidas';
  const isDrinks = location.pathname === '/bebidas';
  const isMealsOrDrinks = isMeals || !isDrinks;

  function handleChange({ target: { value } }) {
    setSearchParameters(value);
  }

  async function sendRequisition(url) {
    const baseURL = isMealsOrDrinks
      ? 'https://www.themealdb.com/api/json/v1/1/'
      : 'https://www.thecocktaildb.com/api/json/v1/1/';

    try {
      const response = await fetch(`${baseURL}${url}`);
      const json = await response.json();
      if (json.meals === null || json.drinks === null) return global.alert(notFound);
      if (isMealsOrDrinks) setDataSearchMeals(json.meals);
      else setDataSearchDrinks(json.drinks);
    } catch (error) {
      console.error(error);
      global.alert(notFound);
    }
    setIsSearch(!isSearch);
    setSearch('');
    setSearchParameters('');
  }

  useEffect(() => {
    if (dataSearchMeals && dataSearchMeals.length === 1) {
      history.push(`/comidas/${dataSearchMeals[0].idMeal}`);
    }
    if (dataSearchDrinks && dataSearchDrinks.length === 1) {
      history.push(`/bebidas/${dataSearchDrinks[0].idDrink}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSearchMeals, dataSearchDrinks]);

  function handleSubmitSearch(e) {
    e.preventDefault();

    if (search === '' && searchParameters !== '') {
      return global.alert('Preencha o campo de busca');
    }

    if (search !== '') {
      switch (searchParameters) {
      case 'ingredient':
        return sendRequisition(`filter.php?i=${search}`);
      case 'name':
        return sendRequisition(`search.php?s=${search}`);
      case 'firstLetter':
        if (search.length > 1) {
          return global.alert('Sua busca deve conter somente 1 (um) caracter');
        }
        return sendRequisition(`search.php?f=${search}`);
      default:
        return null;
      }
    }

    return global.alert('Selecione um dos filtros');
  }

  return (
    <form className="container-search">
      <input
        type="text"
        placeholder="Faça sua busca..."
        value={ search }
        onChange={ (e) => setSearch(e.target.value) }
        data-testid="search-input"
      />
      <div className="container-radios">
        <label htmlFor="ingredient">
          <input
            type="radio"
            name="search"
            id="ingredient"
            value="ingredient"
            checked={ searchParameters === 'ingredient' }
            onChange={ (e) => handleChange(e) }
            data-testid="ingredient-search-radio"
          />
          Ingrediente
        </label>
        <label htmlFor="name">
          <input
            type="radio"
            name="search"
            id="name"
            value="name"
            checked={ searchParameters === 'name' }
            onChange={ (e) => handleChange(e) }
            data-testid="name-search-radio"
          />
          Nome
        </label>
        <label htmlFor="firstLetter">
          <input
            type="radio"
            name="search"
            id="firstLetter"
            value="firstLetter"
            checked={ searchParameters === 'firstLetter' }
            onChange={ (e) => handleChange(e) }
            data-testid="first-letter-search-radio"
          />
          Primeira letra
        </label>
      </div>
      <button
        type="submit"
        data-testid="exec-search-btn"
        onClick={ (e) => handleSubmitSearch(e) }
      >
        Buscar
      </button>
    </form>
  );
}
