import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from '../App'
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import mockQuestions from "./helpers/mockQuestions";
import mockError from "./helpers/mockError";

const initialState = {
    player: {
      name: 'Lucas',
      assertions: 0,
      score: 0,
      gravatarEmail: 'tryber@trybe.com'
    }
  }

  const token = 'd0ceb6c7522d6c040730c68931197789d4c3cc1053fbde65737c7d52a57a164a';

  describe('', () => {

    it('tests information on the screen and clicking right answer changes the score.', async () => {

        jest.spyOn(global, 'fetch');
        global.fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockQuestions),
        });

        const { store } = renderWithRouterAndRedux(<App />, initialState, '/game');

        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        const name = screen.getByRole('heading', { name: /lucas/i, level: 2 })
        expect(name).toBeInTheDocument();
        const email = screen.getByRole('heading', { name: /tryber@trybe.com/i, level: 2 })
        expect(email).toBeInTheDocument();
    
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    
        const difficulty = screen.getByText('easy')
        expect(difficulty).toBeInTheDocument();
        const category = screen.getByRole('heading', { name: /Science & Nature/i, level: 3 })
        expect(category).toBeInTheDocument();
        const question = screen.getByRole('heading', { name: /How many bones are in the human body/i, level: 4 })
        expect(question).toBeInTheDocument();
        const timer = screen.getByRole('heading', { name: '30', level: 2 })
        expect(timer).toBeInTheDocument();
    
        const correctAnswer = screen.getByTestId('correct-answer')
        expect(correctAnswer).toBeDefined();
    
        const wrongAnswers = screen.getAllByTestId(/wrong-answer-/i)
        expect(wrongAnswers).toHaveLength(3)
    
        userEvent.click(correctAnswer)
    
        expect(correctAnswer).toHaveClass('correct-answer');
    
        wrongAnswers.forEach((wrong) => {
          expect(wrong).toHaveClass('wrong-answer')
        })
    
        const { player } = store.getState()
    
        expect(player.assertions).toEqual(1)
        expect(player.score).toEqual(40)
        
        const score = screen.getByTestId('header-score')
        expect(score).toHaveTextContent('40')
    
        const nextBtn = screen.getByRole('button', { name: 'Next' })
        expect(nextBtn).toBeInTheDocument();
      })

      it('click next button, display next question', async () => {
        jest.spyOn(global, 'fetch');
        global.fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockQuestions),
        });
    
        const { store } = renderWithRouterAndRedux(<App />, initialState, '/game');
    
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    
        const correctAnswer = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer);
    
        const nextBtn = screen.getByRole('button', { name: 'Next' });
        userEvent.click(nextBtn);
        const difficulty = screen.getByText('easy');
        expect(difficulty).toBeInTheDocument();
        const category = screen.getByRole('heading', { name: 'Entertainment: Music', level: 3 });
        expect(category).toBeInTheDocument();
        const question = screen.getByRole('heading', { name: /A Saxophone is a brass instrument/i, level: 4 });
        expect(question).toBeInTheDocument();
        const timer = screen.getByRole('heading', { name: '30', level: 2 });
        expect(timer).toBeInTheDocument();
    
        expect(nextBtn).not.toBeInTheDocument();
    
        const newCorrectAnswer = screen.getByTestId('correct-answer');
        expect(newCorrectAnswer).not.toHaveClass('correct-answer');
    
        const wrongAnswers = screen.getAllByTestId(/wrong-answer-/i)
    
        wrongAnswers.forEach((wrong) => {
          expect(wrong).not.toHaveClass('wrong-answer')
        });
      });

      it('test if the last question goes to the feedback page', async () => {
        jest.spyOn(global, 'fetch');
        global.fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockQuestions),
        });
    
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
    
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    
        const timer = screen.getByRole('heading', { name: '30', level: 2 });
        expect(timer).toBeInTheDocument();
    
        await waitFor(() => expect(screen.getByText('28')).toBeInTheDocument(), { timeout: 10000 });
    
        const correctAnswer1 = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer1);
        const nextBtn1 = screen.getByRole('button', { name: 'Next' });
        userEvent.click(nextBtn1);
    
        const correctAnswer2 = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer2);
        const nextBtn2 = screen.getByRole('button', { name: 'Next' });
        userEvent.click(nextBtn2);
    
        const correctAnswer3 = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer3);
        const nextBtn3 = screen.getByRole('button', { name: 'Next' });
        userEvent.click(nextBtn3);
    
        const correctAnswer4 = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer4);
        const nextBtn4 = screen.getByRole('button', { name: 'Next' });
        userEvent.click(nextBtn4);
    
        const correctAnswer5 = screen.getByTestId('correct-answer');
        userEvent.click(correctAnswer5);
        const nextBtn5 = screen.getByRole('button', { name: 'Next' });
        userEvent.click(nextBtn5);
    
        expect(history.location.pathname).toBe('/feedback')
      })
    
      jest.setTimeout(32000);

      it('test if buttons deactivate after time runs out', async () => {
        jest.spyOn(global, 'fetch');
        global.fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockQuestions),
        });
    
        renderWithRouterAndRedux(<App />, initialState, '/game');
    
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    
        const correctAnswer = screen.getByTestId('correct-answer')
        const wrongAnswers = screen.getAllByTestId(/wrong-answer-/i)
    
        await waitFor(() => expect(correctAnswer).toBeDisabled(), { timeout: 32000 })
        wrongAnswers.forEach((wrong) => {
          expect(wrong).toBeDisabled()
        })
    
        const nextBtn = screen.getByRole('button', { name: 'Next' })
        expect(nextBtn).toBeInTheDocument();
      })

      it('checks if the token is valid or null, if null returns the Login page', async () => {
        jest.spyOn(global, 'fetch');
        global.fetch.mockResolvedValue({
          json: jest.fn().mockResolvedValue(mockError),
        });
    
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
    
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    
        const token = localStorage.getItem('token');
    
        expect(token).toBeNull();
    
        expect(history.location.pathname).toBe('/')
      })
    
    })


  