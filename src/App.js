import React from 'react';
import './App.css';
import { withRouter } from 'react-router-dom';
import Main from './components/main'

function App(props) {
  const { history } = props;
  return (
    <div className="App">
      <button onClick={()=> history.push('/locallive')}>live</button>
      <button onClick={()=> history.push('/watchlive')}>watch</button>
      <Main></Main>
    </div>
  );
}

export default withRouter(App);
