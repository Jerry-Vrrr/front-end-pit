import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const COMPANY_MAPPING = {
  "475663645": "Apricot",
  "432770919": "Brock",
  "754688700": "Brown Chiari",
  "707808192": "Conger",
  "196651924": "CPJ",
  "408997789": "Crowell",
  "788957891": "GM",
  "435195417": "Greenberg",
  "294642214": "KLAW",
  "533921350": "Kohan Bablove",
  "316384868": "Lewis",
  "612344072": "Lopez Humphries",
  "595022144": "Mahoney",
  "258732157": "Money",
  "427975086": "Rozas",
  "847306783": "Trust"
};

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState("475663645"); // Default to first company
  const [totalCalls, setTotalCalls] = useState({});
  const [callsLast24Hours, setCallsLast24Hours] = useState({});
  const [trend24Hours, setTrend24Hours] = useState({});
  const [trend30Days, setTrend30Days] = useState({});

  const fetchCallData = async (companyId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/call_rail_data?company_id=${companyId}`);
      const calls = response.data;

      // Filter calls from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCalls = calls.filter(call => new Date(call.start_time) >= thirtyDaysAgo);
      setTotalCalls(prev => ({ ...prev, [companyId]: recentCalls.length }));

      // Filter calls from the last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

      const recent24HourCalls = calls.filter(call => new Date(call.start_time) >= twentyFourHoursAgo);
      setCallsLast24Hours(prev => ({ ...prev, [companyId]: recent24HourCalls.length }));

      // Calculate trends
      const previousThirtyDaysAgo = new Date();
      previousThirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const previous30DaysCalls = calls.filter(call => new Date(call.start_time) >= previousThirtyDaysAgo && new Date(call.start_time) < thirtyDaysAgo);
      const previous30DaysCount = previous30DaysCalls.length;
      setTrend30Days(prev => ({ ...prev, [companyId]: recentCalls.length > previous30DaysCount ? 'up' : 'down' }));

      const previous24HoursAgo = new Date();
      previous24HoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
      const previous24HoursCalls = calls.filter(call => new Date(call.start_time) >= previous24HoursAgo && new Date(call.start_time) < twentyFourHoursAgo);
      const previous24HoursCount = previous24HoursCalls.length;
      setTrend24Hours(prev => ({ ...prev, [companyId]: recent24HourCalls.length > previous24HoursCount ? 'up' : 'down' }));
    } catch (error) {
      console.error('Error fetching the call data', error);
    }
  };

  useEffect(() => {
    fetchCallData(selectedCompany);
  }, [selectedCompany]);

  return (
    <CompanyContext.Provider value={{ 
      selectedCompany, 
      setSelectedCompany, 
      COMPANY_MAPPING, 
      totalCalls, 
      callsLast24Hours,
      trend24Hours,
      trend30Days,
      setTrend24Hours, 
      setTrend30Days 
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
