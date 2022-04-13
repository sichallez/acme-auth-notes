import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { destroyNote, createNote } from './store';

class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(ev) {
    // console.log('EV EV EV EV!!!', ev.target.name, ev.target.value);
    this.setState({
      [ev.target.name]: ev.target.value 
    })
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const newNote = this.state.text;
    this.props.create({ text: newNote });
  }

  render() {
    const { auth, notes, destroy } = this.props;
    const { text } = this.state;
    const { handleChange, handleSubmit } = this;
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
    )
  }
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
