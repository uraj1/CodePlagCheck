import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { ActivityType } from '../types';
// import React from 'react';

interface ActivityContextType {
  activities: ActivityType[];
  recordActivity: (activity: ActivityType) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  
  const recordActivity = async (activity: ActivityType) => {
    setActivities(prev => [...prev, activity]);
    
    // Send activity data to backend
    try {
      await axios.post('http://localhost:8000/api/activity/log', activity);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };
  
  const clearActivities = () => {
    setActivities([]);
  };
  
  return (
    <ActivityContext.Provider value={{ activities, recordActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};