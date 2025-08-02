import React, { useState } from 'react';
import { Tabs } from 'antd';
import { MainPage } from './MainPage';

const { TabPane } = Tabs;

export const SuperstoreDashboardDashboard = () => {
  const [activeTab, setActiveTab] = useState('0');
  
  return (
    <div className="dashboard-container">
      <h1>Superstore Dashboard</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Main" key="{i}">
          <MainPage />
        </TabPane>
      </Tabs>
    </div>
  );
};
