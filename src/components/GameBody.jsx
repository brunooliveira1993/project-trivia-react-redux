import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ERROR_TOKEN_RESPONSE = 3;

class GameBody extends Component {
  state = {
    token: {},
    questions: {},
    questionNumber: 0,
  };

  componentDidMount() {
    this.setState({
      // token: JSON.parse(localStorage.getItem('token')),
    }, async () => {
      // const { token } = this.state;
      const { history } = this.props;
      const token = '5bae1b29a8b8ca437fc1871b3d9862a15ce408c3d547cd95354d9a66fcc6ce22';
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
    });
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

  render() {
    const { questions, questionNumber } = this.state;
    const { results } = questions;
    const current = results ? results[questionNumber] : null;
    let answers = [];
    let shuffled = [];
    if (results) {
      answers = [current.correct_answer, ...current.incorrect_answers];
      shuffled = this.randomArrayShuffle(answers);
    }
    console.log(answers);
    console.log(shuffled);

    return (
      <div>
        { results && (
          <div>
            <h3 data-testid="question-category">{current.category}</h3>
            <h4 data-testid="question-text">{current.question}</h4>
            <div data-testid="answer-options">
              {shuffled.map((answer, index) => (
                <button
                  data-testid={ answer === current.correct_answer
                    ? 'correct-answer' : `wrong-answer-${index - 1}` }
                  key={ index }
                  type="button"
                >
                  {answer}
                </button>
              ))}

            </div>
          </div>
        ) }
      </div>
    );
  }
}

GameBody.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(GameBody);
