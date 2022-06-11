import React from 'react'
import { Switch, Route } from 'react-router-dom'

const Routing = ({ routes }) => {

    return (
       <Switch>
          {
              routes.map(item =>
                  <Route
                     key={new Date().getTime()} {...item}
                  />
              )
          }
      </Switch>
    );
};

export default Routing;
