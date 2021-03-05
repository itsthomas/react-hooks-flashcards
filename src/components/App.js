import { useState, useCallback, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
} from 'react-router-dom';
import DocList from './DocList';
import CardGroups from './CardGroups';
import Auth from './Auth';
import LogoutButton from './Auth/LogoutButton';
import {fireAuth} from '../firebase';
import '../App.scss';

function App() {
  const [user, setUser] = useState('');

  const onceUserUpdated = useCallback((user) => {
    setUser(user);
  }, []);

  const handleLogout = () => {
    fireAuth.auth().signOut();
  }

 
  const authListener = () => {
    fireAuth.auth().onAuthStateChanged(user => {
      if(user){
        setUser(user);
      } else {
        setUser('')
      }
    })
  }

  useEffect(() => {
    authListener()
  }, [])


  return (
     user !== '' ? (
      <Router>
        <div className='App'>
          <header className='header'> 
            <LogoutButton handleLogout={handleLogout}/>
            <h1 className='header__title'>English - German Vocabulary</h1>
            <div className='greeting'>
              Click on <strong>List</strong> in order to add, update or delete
              vocabularies.<br />
              Click on <strong>Cards</strong> to test you vocabulary.
          </div>
            <ul className='header__nav'>
              <NavLink exact={true} className='header__nav-link' to='/'>
                <li className='header__nav-list'>List</li>
              </NavLink>
              <NavLink className='header__nav-link' to='/cards'>
                <li className='header__nav-list'>Cards</li>
              </NavLink>
            </ul>
          </header>

          <main role='main'>
            <Switch>
              <Route exact path='/' component={DocList} />
              <Route path='/cards' component={CardGroups} />
            </Switch>
          </main>
        </div>
      </Router>
    ): (
      <Auth onceUserUpdated={onceUserUpdated} />
    )
  )

}

export default App;
