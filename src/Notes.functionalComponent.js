import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { destroyNote, createNote } from './store';

const Notes = ({ auth, notes, destroy, create })=> {

  const [text, setText] = useState('');

  const handleChange = (ev) => {
    // console.log('HOOKS HOOKS ONCHANGE !!!', ev.target.name, ev.target.value)
    setText(ev.target.value);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // console.log({ text });
    create({ text });
  };

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
        <input type='text' placeholder='Create A New Note Here' name='text' value={text} onChange={handleChange} />
        <input type='button' value='Create' onClick={handleSubmit} />
      </div>
    </div>
  );
};

const mapDispatch = (dispatch) => {
  return {
    destroy: (note) => {
      dispatch(destroyNote(note));
    },
    create: (note) => dispatch(createNote(note))
  }
}

export default connect(state => state, mapDispatch)(Notes);
