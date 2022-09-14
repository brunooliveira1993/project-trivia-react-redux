import md5 from 'crypto-js/md5';

const RANKING = 'ranking';

if (!JSON.parse(localStorage.getItem(RANKING))) {
  localStorage.setItem(RANKING, JSON.stringify([]));
}

export const readingRank = () => JSON.parse(localStorage.getItem(RANKING));

export const savePlayer = (player) => localStorage
  .setItem(RANKING, JSON.stringify(player));

export const getGravatarImg = (email) => {
  const hash = md5(email).toString();
  return `https://www.gravatar.com/avatar/${hash}`;
};

export const filteredPlayer = (playerObj) => {
  const url = getGravatarImg(playerObj.gravatarEmail);
  return {
    name: playerObj.name,
    score: playerObj.score,
    picture: url,
  };
};

export const saveToLocalStorage = (playerObj) => {
  if (!JSON.parse(localStorage.getItem(RANKING))) {
    localStorage.setItem(RANKING, JSON.stringify([]));
  }

  const player = filteredPlayer(playerObj);

  const rank = readingRank();
  savePlayer([...rank, player]);
};
