import React, { useState } from 'react';
import { Tabs } from 'antd';
import { MainPage } from './MainPage';

const { TabPane } = Tabs;

export const WebTrafficDashboardDigitalMarketingVOTDDashboard = () => {
  const [activeTab, setActiveTab] = useState('0');
  
  return (
    <div className="dashboard-container">
      <h1>Web Traffic Dashboard _ Digital Marketing _ VOTD</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Main" key="{i}">
          <MainPage />
        </TabPane>
      </Tabs>
    </div>
  );
};
