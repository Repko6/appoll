import './App.css';
import { Redirect, Route, Switch } from 'react-router-dom'
import { Navbar } from './app/Navbar';
import { PollAdd } from './app/PollAdd';
import { PollEdit } from './app/PollEdit';
import { PollScore } from './app/PollScore';
import { PollList } from './app/PollList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Ankete
        </p>
      </header>
      <Navbar />
      <Switch>
          <Route exact path="/list" component={PollList} />
          <Route exact path="/add" component={PollAdd} />
          <Route exact path="/score" component={PollScore} />
          <Route exact path="/edit/:pollId" component={PollEdit} />
          <Redirect to="/" />
        </Switch>
    </div>
  );
}

export default App;
