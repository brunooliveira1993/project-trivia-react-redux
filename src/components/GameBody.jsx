import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { correctAnswerAction } from '../store/actions';
import { getQuestionsAPI } from '../services/fetchAPI';

const ERROR_TOKEN_RESPONSE = 3;
const FULL_TIMER = 30;
const ONE_SECOND = 1000;
const LAST_QUESTION_NUMBER = 4;

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
    isNextVisible: false,
    questionAnswered: false,
  };

  componentDidMount() {
    this.setState({
      token: localStorage.getItem('token'),
    }, async () => {
      const { token } = this.state;
      const { history } = this.props;
      const data = await getQuestionsAPI(token);
      if (data.response_code === ERROR_TOKEN_RESPONSE) {
        localStorage.clear();
        history.push('/');
      }
      this.setState({
        questions: data,
      });
      this.randomizeAnswers();
    });
    this.intervalTimer();
    // this.intervalID = setInterval(() => {
    //   this.setState((prevState) => ({
    //     timer: prevState.timer > 0 ? prevState.timer - 1 : 0,
    //   }));
    // }, ONE_SECOND);
  }

  componentDidUpdate() {
    const { timer } = this.state;
    if (timer === 0) clearInterval(this.intervalID);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  intervalTimer = () => {
    this.intervalID = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer > 0 ? prevState.timer - 1 : 0,
      }));
    }, ONE_SECOND);
  };

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
      isNextVisible: true,
    }, () => {
      const { questionAnswered } = this.state;
      if (current.correct_answer === answer && !questionAnswered) {
        dispatch(correctAnswerAction());
      }
      // if (questionNumber === LAST_QUESTION_NUMBER) history.push('/feedback');
      this.setState({ questionAnswered: true });
      clearInterval(this.intervalID);
    });
  };

  nextQuestion = () => {
    const { history } = this.props;
    const { questionNumber } = this.state;
    if (questionNumber === LAST_QUESTION_NUMBER) history.push('/feedback');
    this.setState((prevState) => ({
      questionNumber: prevState.questionNumber + 1,
      correct: '',
      wrong: '',
      questionAnswered: false,
      timer: FULL_TIMER,
    }), () => {
      this.randomizeAnswers();
      this.intervalTimer();
    });
  };

  render() {
    const { questions, questionNumber, isNextVisible,
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
            { isNextVisible && (
              <button
                data-testid="btn-next"
                type="button"
                onClick={ this.nextQuestion }
              >
                Next
              </button>)}
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
