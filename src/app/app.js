import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    const initialSession = supabase.auth.session();
    setSession(initialSession);

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Show a loading state while checking the session
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's no session, show login and signup
  if (!session) {
    return (
      <div>
        <h1>Welcome to My App</h1>
        <Login />
        <SignUp />
      </div>
    );
  }

  // Add a return statement for when there is a session
  return (
    <div>
      <h1>Welcome, {session.user.email}</h1>
      {/* Add your authenticated app content here */}
    </div>
  );
}

export default App;
