import { Redirect, Route, Switch } from 'react-router-dom'
import { PollEdit } from './PollEdit';
import { PollScore } from './PollScore';
import { PollList } from './PollList';

function Content({onChangeBreadcrumb}) {
    return (
        <section className="content">
            <Switch>
                <Route exact path="/edit" render={(props) => {onChangeBreadcrumb('Uređivanje'); return <PollList {...props} />}} />
                <Route exact path="/score" render={(props) => {onChangeBreadcrumb('Rezultati'); return <PollScore {...props} />}} />
                <Route exact path="/edit/:pollId" render={(props) => (<PollEdit {...props} onChangePollName={onChangeBreadcrumb} />)} />
                <Redirect to="/edit" />
            </Switch>
        </section>
    );
}

export default Content;