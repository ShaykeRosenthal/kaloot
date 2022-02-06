import logo from './logo.svg';
import './App.css';
import { Router, Switch, Route } from 'react-router';
import { Link } from 'react-router-dom'
import history from './history';
import Home from './pages/HomePage/HomePage'
import Login from './pages/LoginPage/LoginPage'
import EditBaloot from './pages/EditBalootPage/EditBalootPage'
import CreateBaloot from './pages/CreateBalootPage/CreateBalootPage'
import PlayBaloot from './pages/PlayBalootPage/PlayBalootPage'
import Favorites from './pages/FavoritesPage/FavoritesPage'
import JoinBaloot from './pages/JoinBalootPage/JoinBalootPage'
import MyBalootsPage from './pages/MyBalootsPage/MyBalootsPage';
import SearchPage from './pages/SearchPage/SearchPage'
import NavBar from './cmps/NavBar/NavBar';

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <NavBar />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/create" component={CreateBaloot} exact />
          <Route path="/favorites" component={Favorites} exact />
          <Route path="/my baloots" component={MyBalootsPage} exact />
          <Route path="/search" component={SearchPage} exact />
          <Route path="/join/:id" component={JoinBaloot} />
          <Route path="/join/" component={JoinBaloot} />
          <Route path="/edit/:id" component={EditBaloot} exact />
          <Route path="/play/:id" component={PlayBaloot} exact />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
