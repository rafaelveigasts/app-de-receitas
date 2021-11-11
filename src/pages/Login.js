import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login() {
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
  });
  const [disabled, setDisabled] = useState(true);
  const { email, password } = loginState;

  const handleChange = (value, id) => {
    setLoginState({
      ...loginState,
      [id]: value,
    });
  };

  const validateEmailAndPassword = () => {
    const regexEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+?$/i;
    const minLength = 7;
    const validation = !(regexEmail.test(email)
      && (password.length >= minLength));
    setDisabled(validation);
  };

  const saveInLocalStorage = () => {
    localStorage.setItem('user', JSON.stringify({ email }));
    localStorage.setItem('mealsToken', JSON.stringify(1));
    localStorage.setItem('cocktailsToken', JSON.stringify(1));
  };

  const doneRecipes = [
    {
      id: '52771',
      type: 'comida',
      area: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: '',
      name: 'Spicy Arrabiata Penne',
      image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
      doneDate: '23/06/2020',
      tags: ['Pasta', 'Curry'],
    },
    {
      id: '178319',
      type: 'bebida',
      area: '',
      category: 'Cocktail',
      alcoholicOrNot: 'Alcoholic',
      name: 'Aquamarine',
      image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
      doneDate: '23/06/2020',
      tags: [],
    },
  ];

  localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));

  useEffect(() => {
    validateEmailAndPassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  return (
    <form>
      <label htmlFor="email">
        E-mail:
        <input
          id="email"
          type="email"
          data-testid="email-input"
          value={ email }
          onChange={ ({ target: { value, id } }) => handleChange(value, id) }
          placeholder="Insira seu e-mail"
        />
      </label>
      <label htmlFor="password">
        Senha:
        <input
          id="password"
          type="password"
          data-testid="password-input"
          value={ password }
          onChange={ ({ target: { value, id } }) => handleChange(value, id) }
          placeholder="Insira sua senha"
        />
      </label>
      <Link to="/comidas">
        <Button
          variant="success"
          data-testid="login-submit-btn"
          disabled={ disabled }
          onClick={ saveInLocalStorage }
        >
          Entrar
        </Button>
      </Link>
    </form>
  );
}

export default Login;
