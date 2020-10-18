import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
} from 'react-router-dom';
import DocList from './DocList';
import CardGroups from './CardGroups';

import '../App.scss';

function App() {
  return (
    <>
      <Router>
        <div className='App'>
          <header className='header'>
            <ul className='header__nav'>
              <NavLink exact={true} className='header__nav-link' to='/'>
                <li className='header__nav-list'>List</li>
              </NavLink>
              <NavLink className='header__nav-link' to='/cards'>
                <li className='header__nav-list'>Cards</li>
              </NavLink>
            </ul>

            <h1 className='header__title'>English - German Vocabulary</h1>
          </header>
          <div className='home'>
            <p>
              Click on <strong>List</strong> in order to add, update or remove
              vocabularies.
            </p>
            <p>
              Click on <strong>Cards</strong> to test you vocabulary.
            </p>
          </div>
          <div>
            <Switch>
              <Route exact path='/' component={DocList} />
              <Route path='/cards' component={CardGroups} />
            </Switch>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
