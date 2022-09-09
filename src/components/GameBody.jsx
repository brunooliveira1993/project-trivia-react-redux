import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { correctAnswerAction } from '../store/actions';

const ERROR_TOKEN_RESPONSE = 3;
const FULL_TIMER = 30;
const ONE_SECOND = 1000;

class GameBody extends Component {
  state = {
    token: {},
    questions: {},
    questionNumber: 0,
    correct: '',
    wrong: '',
    isAnswered: false,
    timer: FULL_TIMER,
    shuffled: [],
  };

  componentDidMount() {
    this.setState({
      token: localStorage.getItem('token'),
    }, async () => {
      const { token } = this.state;
      const { history } = this.props;
      const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.response_code === ERROR_TOKEN_RESPONSE) {
        localStorage.clear();
        history.push('/');
      }
      this.setState({
        questions: data,
      });
      this.randomizeAnswers();
    });
    this.intervalID = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer > 0 ? prevState.timer - 1 : 0,
      }));
    }, ONE_SECOND);
  }

  componentDidUpdate() {
    const { timer } = this.state;
    if (timer === 0) clearInterval(this.intervalID);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  randomArrayShuffle = (array) => {
    let temporaryValue = '';
    let randomIndex = 0;
    const arr = [];
    while (array.length > arr.length) {
      randomIndex = Math.floor(Math.random() * array.length);
      temporaryValue = array[randomIndex];
      if (!arr.includes(temporaryValue)) {
        arr.push(temporaryValue);
      }
    }
    return arr;
  };

  randomizeAnswers = () => {
    const { questions, questionNumber } = this.state;
    const { results } = questions;
    const current = results ? results[questionNumber] : null;
    let answers = [];
    if (results) {
      answers = [current.correct_answer, ...current.incorrect_answers];
      this.setState({
        shuffled: this.randomArrayShuffle(answers),
      });
    }
  };

  onAnswerClick = (answer) => {
    const { dispatch } = this.props;
    const { questions: { results }, questionNumber } = this.state;
    const current = results ? results[questionNumber] : null;
    this.setState({
      isAnswered: true,
      correct: 'correct-answer',
      wrong: 'wrong-answer',
    });
    if (current.correct_answer === answer) dispatch(correctAnswerAction());
    clearInterval(this.intervalID);
  };

  render() {
    const { questions, questionNumber,
      isAnswered, correct, wrong, timer, shuffled } = this.state;

    const { results } = questions;
    const current = results ? results[questionNumber] : null;

    let wrongNum = 0;

    return (
      <div>
        { results && (
          <div>
            <h3 data-testid="question-category">{current.category}</h3>
            <h4 data-testid="question-text">{current.question}</h4>
            <div data-testid="answer-options">
              {shuffled.map((answer, index) => {
                if (answer !== current.correct_answer) wrongNum += 1;
                return (
                  <button
                    className={ isAnswered && answer === current.correct_answer
                      ? correct : wrong }
                    data-testid={ answer === current.correct_answer
                      ? 'correct-answer' : `wrong-answer-${wrongNum - 1}` }
                    key={ index }
                    type="button"
                    onClick={ () => this.onAnswerClick(answer) }
                    disabled={ timer === 0 }
                  >
                    {answer}
                  </button>
                );
              })}

            </div>
            <h2>{timer}</h2>
          </div>
        )}
      </div>
    );
  }
}

GameBody.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(GameBody);
