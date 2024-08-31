import React from 'react';
import withAuth from './withAuth';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  );
};

export default withAuth(Dashboard);