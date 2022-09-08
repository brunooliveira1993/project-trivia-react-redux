export const getTriviaApi = async () => {
  const response = await fetch('https://opentdb.com/api_token.php?command=request');
  const json = await response.json();
  return json.token;
};

export const USER_LOGIN = 'USER_LOGIN';
export const API_REQUEST = 'API_REQUEST';
export const API_FAIL = 'API_FAIL';

export const sendEmailInfo = (payload, trivia) => ({
  type: USER_LOGIN,
  payload,
  trivia,
});

const receiveApiFail = (erro) => ({
  type: API_FAIL,
  erro,
});

const apiRequestInfo = () => ({
  type: API_REQUEST,
});

export const getQuestionsFromApi = (payload) => async (dispatch) => {
  dispatch(apiRequestInfo());
  try {
    const response = await getTriviaApi();
    dispatch(sendEmailInfo(payload, response));
  } catch (error) {
    dispatch(receiveApiFail(error));
  }
};
