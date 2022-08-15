import * as React from 'react';
import {ReactQueryConfigProvider} from 'react-query';
import {AuthProvider} from './auth-context.exercise';
import {BrowserRouter as Router} from 'react-router-dom';

const queryConfig = {
  retry(failureCount, error) {
    if (error.status === 404) return false
    else return failureCount < 2;
  },
  useErrorBoundary: true,
  refetchAllOnWindowFocus: false,
}

function AppProviders({children}) {
 return (
   <ReactQueryConfigProvider config={queryConfig}>
     <Router>
       <AuthProvider>
         {children}
       </AuthProvider>
     </Router>
   </ReactQueryConfigProvider>
 )
}

export {AppProviders}