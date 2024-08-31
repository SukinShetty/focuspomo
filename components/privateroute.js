import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { supabase } from './supabase';

function PrivateRoute({ component: Component, ...rest }) {
  const session = supabase.auth.session();

  return (
    <Route
      {...rest}
      render={(props) =>
        session ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;