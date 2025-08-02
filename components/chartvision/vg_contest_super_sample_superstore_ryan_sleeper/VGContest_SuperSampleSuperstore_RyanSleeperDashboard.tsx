import React, { useState } from 'react';
import { Tabs } from 'antd';
import { MainPage } from './MainPage';

const { TabPane } = Tabs;

export const VGContestSuperSampleSuperstoreRyanSleeperDashboard = () => {
  const [activeTab, setActiveTab] = useState('0');
  
  return (
    <div className="dashboard-container">
      <h1>VG Contest_Super Sample Superstore_Ryan Sleeper</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Main" key="{i}">
          <MainPage />
        </TabPane>
      </Tabs>
    </div>
  );
};
