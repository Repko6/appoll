import { Redirect, Route, Switch } from 'react-router-dom'
import { PollAdd } from './PollAdd';
import { PollEdit } from './PollEdit';
import { PollScore } from './PollScore';
import { PollList } from './PollList';

function Content() {
    return (
        <section className="content">
            <Switch>
                <Route exact path="/edit" component={PollList} />
                <Route exact path="/add" component={PollAdd} />
                <Route exact path="/score" component={PollScore} />
                <Route exact path="/edit/:pollId" component={PollEdit} />
                <Redirect to="/" />
            </Switch>
        </section>
    );
}

export default Content;