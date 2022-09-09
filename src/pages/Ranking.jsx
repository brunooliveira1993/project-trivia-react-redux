import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { readingRank } from '../services/helpers';

class Ranking extends Component {
  render() {
    const rankArr = readingRank();
    rankArr.sort((a, b) => b.score - a.score);
    return (
      <div data-testid="ranking-title">
        <table>
          <thead className="table-head">
            <tr>
              <th>.</th>
              <th>Nome</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {rankArr.map((player, index) => (
              <tr key={ index }>
                <td>
                  <img
                    src={ player.picture }
                    alt={ `${player.gravatarEmail} gravatar profile` }
                  />
                </td>
                <td data-testid={ `player-name-${index}` }>{player.name}</td>
                <td data-testid={ `player-score-${index}` }>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/">
          <button data-testid="btn-go-home" type="button">Home</button>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.player,
});

export default connect(mapStateToProps)(Ranking);
