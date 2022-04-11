import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const LOAD_NOTES = 'LOAD_NOTES';
const SET_AUTH = 'SET_AUTH';

// Reducers
const notes = (state = [], action)=> {
  switch (action.type) {
    case LOAD_NOTES:
      state = [...state, ...action.notes];
    default:
      state = state;
  };
  return state;
};

const auth = (state = {}, action)=> {
  if(action.type === 'SET_AUTH'){
    return action.auth;
  }
  return state;
};

// Action Creators
const logout = ()=> {
  window.localStorage.removeItem('token');
  return {
    type: 'SET_AUTH',
    auth: {}
  };
};

const signIn = (credentials)=> {
  return async(dispatch)=> {
    let response = await axios.post('/api/auth', credentials);
    const { token } = response.data;
    window.localStorage.setItem('token', token);
    return dispatch(attemptLogin());
  }
};
const attemptLogin = ()=> {
  return async(dispatch)=> {
    const token = window.localStorage.getItem('token');
    // console.log('ATTEMPT LOG', token);
    if(token){
      const response = await axios.get('/api/auth', {
        headers: {
          authorization: token
        }
      });
      dispatch({ type: 'SET_AUTH', auth: response.data });
    }
  }
}

const fetchNotes = () => {
  return async(dispatch) => {
    const token = window.localStorage.getItem('token');
    // console.log('FETCH FETCH FETCH LOG', token);
    if (token) {
      const response = await axios.get('/api/notes', {
        headers: {
          authorization: token
        }
      });
      // console.log(response.data);
      const userNotes = response.data;
      // console.log('USER NOTES NOTES NOTES', userNotes);
      dispatch({
        type: LOAD_NOTES,
        notes: userNotes
      });
    }
  };
};

const destroyNote = (note) => {
  return async(dispatch) => {
    await axios.delete(`/api/notes/${note.id}`)
  }
};

// Store
const store = createStore(
  combineReducers({
    auth,
    notes
  }),
  applyMiddleware(thunk, logger)
);

export { attemptLogin, signIn, logout, fetchNotes };

export default store;
