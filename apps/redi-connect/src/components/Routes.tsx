import { Route, Switch, Redirect } from 'react-router-dom'
import { allRoutes } from '../routes/index'

import { PrivateRoute } from './PrivateRoute'

export function Routes () {
  return (
    <div className="routes">
      <Switch>
        {allRoutes.map(({ requiresLoggedIn, exact, path, component }, i) =>
          requiresLoggedIn ? (
            <PrivateRoute
              {...{ component, exact, path }}
              key={i}
            />
          ) : (
            <Route
              {...{ component, exact, path }}
              key={i}
            />
          )
        )}
        <Redirect to="/front/home" />
      </Switch>
    </div>
  );
}
