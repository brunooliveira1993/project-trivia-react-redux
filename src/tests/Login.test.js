import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from '../App'
import Login from "../pages/Login";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";

describe('Login page tests', () => {
  it('renders all components', () => {
    renderWithRouterAndRedux(<Login />);

    // const logo = screen.getByAltText('logo');
    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const loginBtn = screen.getByTestId('btn-play');
    const settingsBtn = screen.getByTestId('btn-settings');

    // expect(logo).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
    expect(settingsBtn).toBeInTheDocument();
  })

  it('validates inputs and tests play button', async () => {
    const { history, store } = renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const loginBtn = screen.getByTestId('btn-play');

    expect(loginBtn).toBeDisabled();
    userEvent.type(emailInput, 'tryber@trybe.com');
    userEvent.type(nameInput, 'Braddock');
    expect(loginBtn).not.toBeDisabled();

    userEvent.click(loginBtn);

    await waitFor(() => expect(history.location.pathname).toBe('/game'))

    const redux = store.getState()
    console.log(redux);
  })
  
  it('tests settings button', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const settingsBtn = screen.getByTestId('btn-settings');
    userEvent.click(settingsBtn);
    expect(history.location.pathname).toBe('/settings');
  })
})