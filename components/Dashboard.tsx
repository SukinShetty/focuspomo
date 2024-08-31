'use client';

import React from 'react';
import withAuth from './withAuth';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content */}
    </div>
  );
};

export default withAuth(Dashboard);