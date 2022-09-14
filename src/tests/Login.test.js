import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from '../App'
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import firstQuestionMock from "./helpers/firstQuestionMock";


const token = '4582831fa651c14bdb5b2ac3d915e439b7482fdc80731353aa2f213070a1978a';

describe('Login page tests', () => {
  it('renders all components', () => {
    renderWithRouterAndRedux(<App />);

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
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(firstQuestionMock),
    });

    renderWithRouterAndRedux(<App />);

    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const loginBtn = screen.getByTestId('btn-play');

    expect(loginBtn).toBeDisabled();
    userEvent.type(emailInput, 'tryber@trybe.com');
    userEvent.type(nameInput, 'Braddock');
    expect(loginBtn).not.toBeDisabled();

    userEvent.click(loginBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
  })
  
  it('tests settings button', () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const settingsBtn = screen.getByTestId('btn-settings');
    userEvent.click(settingsBtn);
    expect(history.location.pathname).toBe('/settings');
  })

  it('tests if Game is rendered', () => {
    const initialState = {
      player: {
        name: 'Braddock',
        assertions: 0,
        score: 0,
        gravatarEmail: 'trybe@trybe.com'
      }
    }
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');

    expect(history.location.pathname).toBe('/game');
  })
})