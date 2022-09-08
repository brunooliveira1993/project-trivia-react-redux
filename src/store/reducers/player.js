import { USER_LOGIN, API_FAIL, API_REQUEST } from '../actions';


const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

const playerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case USER_LOGIN: return {
    ...state,
    name: action.payload.name,
    gravatarEmail: action.payload.email,
    token: action.trivia,
  };
  case API_REQUEST: return {
    ...state,
    loading: true,
  };
  case API_FAIL: return {
    ...state,
  };
  default:
    return state;
  }
};

export default playerReducer;
