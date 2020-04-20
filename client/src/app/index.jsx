import React, { Suspense, lazy } from 'react';
import { Switch, Router } from 'react-router';
import { Route } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import reduxCatch from 'redux-catch';
import { saveErrorLog } from './utils/log';

import rootReducer from './reducers/rootReducer.js';
import withTracker from './withTracker.jsx';
import LoadingMessage from './components/GenericLoader/LoadingMessage.jsx';
import history from './utils/history';

import './styles/Draft.css';
import './styles/reactGrid.css';
import './styles/reactResize.css';

function errorHandler(error, getState, lastAction, dispatch) {
  saveErrorLog(error, getState, lastAction, 'ERROR');
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunk,
      reduxCatch(errorHandler)
    )
  )
);

const LazyLoadedApp = lazy(() => (
  import('./components/App/App.jsx')
));

const LazyLoadedDashboard = lazy(() => (
  import('./components/Dashboard/Dashboard.jsx')
));

const LazyLoadedPaymentPage = lazy(() => (
  import('./components/Payment/PaymentPage.jsx')
));

const LazyLoadedPaymentProfile = lazy(() => (
  import('./components/Profile/Profile.jsx')
));

const LazyLoadedPage404 = lazy(() => (
  import('./components/Page404/Page404.jsx')
));


class Main extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Suspense fallback={<LoadingMessage />}>
            <Switch>
              <Route exact path="/" component={withTracker(LazyLoadedApp)} />
              <Route path="/pebl/:id" component={withTracker(LazyLoadedApp)} />
              <Route path="/reset" component={withTracker(LazyLoadedApp)} />
              <Route path="/confirmation" component={withTracker(LazyLoadedApp)} />
              <Route path="/dashboard/:userName/folder/:folderShortId" component={withTracker(LazyLoadedDashboard)} />
              <Route path="/dashboard/" component={withTracker(LazyLoadedDashboard)} />
              <Route path="/payment/" component={withTracker(LazyLoadedPaymentPage)} />
              <Route
                path="/profile/:userName/folder/:folderShortId"
                component={withTracker(LazyLoadedPaymentProfile)}
              />
              <Route path="/profile/:userName" component={withTracker(LazyLoadedPaymentProfile)} />
              <Route path="*" component={withTracker(LazyLoadedPage404)} />
            </Switch>
          </Suspense>
        </Router>
      </Provider>
    );
  }
}

render(<Main />, document.getElementById('app'));
