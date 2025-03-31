import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';  // Correct import path for your context

const Welcome = () => {
  const { user } = useAuth();  // Access user data from AuthContext

  useEffect(() => {
    console.log("Current user:", user);  // Log user to ensure it is set correctly
  }, [user]);

  return (
    <div className="background-image">
      <div className="welcome-message">
        <h1>Welcome, {user ? user.email : 'Guest'}!</h1>
      </div>
    </div>
  );
};

export default Welcome;
