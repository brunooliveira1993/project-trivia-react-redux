export const getTriviaApi = async () => {
  const response = await fetch('https://opentdb.com/api_token.php?command=request');
  const json = await response.json();
  return json.token;
};

export const getQuestionsAPI = async (token) => {
  const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
