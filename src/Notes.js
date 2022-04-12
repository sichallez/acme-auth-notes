import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { destroyNote } from './store';

const Notes = ({ auth, notes, destroy })=> {
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        <h2>{auth.username}</h2>
        <ul>
          {notes.map(note => <li key={note.id}>
              {note.text}
              <button className='deleteNote' onClick={() => destroy(note)}>DELETE</button>
            </li>)}
        </ul>
      </div>
    </div>
  );
};

const mapDispatch = (dispatch) => {
  return {
    destroy: (note) => {
      dispatch(destroyNote(note));
    }
  }
}

export default connect(state => state, mapDispatch)(Notes);
