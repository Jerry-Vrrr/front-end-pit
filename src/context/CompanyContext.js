import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const COMPANY_MAPPING = {
  "475663645": "Apricot",
  "432770919": "Brock",
  "754688700": "Brown Chiari",
  "707808192": "Conger",
  "196651924": "CPJ",
  "408997789": "Crowell",
  "788957891": "Greenstein Pittari",
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
  const [entriesLast24Hours, setEntriesLast24Hours] = useState({});
  const [gravityFormEntries, setGravityFormEntries] = useState([]);
  const [allCalls, setAllCalls] = useState({});

  // Memoized function to fetch all company data
  const fetchAllCompaniesData = useCallback(async () => {
    try {
      await Promise.all([
        Promise.all(Object.keys(COMPANY_MAPPING).map(async (companyId) => {
          try {
            await fetchCallData(companyId);
          } catch (error) {
            console.error(`Error fetching data for company ID ${companyId}:`, error);
          }
        })),
        fetchGravityFormsData()
      ]);
    } catch (error) {
      console.error('Error fetching data for all companies:', error);
    }
  }, []); // Use useCallback to memoize

  const fetchCallData = async (companyId) => {
    try {
      const response = await axios.get(`https://apricot-pit-api.onrender.com/api/v1/call_rail_data?company_id=${companyId}`);
      const calls = response.data;

      // Sort calls by start_time in descending order
      calls.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentCalls = calls.filter(call => new Date(call.start_time) >= thirtyDaysAgo);
      setTotalCalls(prev => ({ ...prev, [companyId]: recentCalls.length }));

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
      const recent24HourCalls = calls.filter(call => new Date(call.start_time) >= twentyFourHoursAgo);
      setCallsLast24Hours(prev => ({ ...prev, [companyId]: recent24HourCalls.length }));

      const previous30DaysCalls = calls.filter(call => new Date(call.start_time) < thirtyDaysAgo);
      const previous30DaysCount = previous30DaysCalls.length;
      setTrend30Days(prev => ({ ...prev, [companyId]: recentCalls.length > previous30DaysCount ? 'trend-up' : 'trend-down' }));

      const previous24HoursCalls = calls.filter(call => new Date(call.start_time) < twentyFourHoursAgo);
      const previous24HoursCount = previous24HoursCalls.length;
      setTrend24Hours(prev => ({ ...prev, [companyId]: recent24HourCalls.length > previous24HoursCount ? 'trend-up' : 'trend-down' }));

      // Store all sorted calls data for this company in the allCalls state
      setAllCalls(prev => ({ ...prev, [companyId]: calls }));

    } catch (error) {
      console.error('Error fetching the call data for company:', error);
    }
  };

  const fetchGravityFormsData = async () => {
    try {
      const response = await axios.get('https://apricot-pit-api.onrender.com/api/v1/gravity_forms/entries');
      const entries = response.data;

      // Sort entries by date_created in descending order
      entries.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));

      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

      const newEntries = {};
      entries.forEach(entry => {
        const companyId = entry.company_id;
        if (new Date(entry.date_created) >= twentyFourHoursAgo) {
          if (!newEntries[companyId]) {
            newEntries[companyId] = 0;
          }
          newEntries[companyId]++;
        }
      });

      setEntriesLast24Hours(newEntries);
      setGravityFormEntries(entries);
    } catch (error) {
      console.error('Error fetching Gravity Forms data:', error);
    }
  };

  useEffect(() => {
    fetchAllCompaniesData(); // Fetch data for all companies on mount
  }, [fetchAllCompaniesData]); // Add fetchAllCompaniesData to the dependency array

  return (
    <CompanyContext.Provider value={{
      COMPANY_MAPPING,
      totalCalls,
      allCalls,
      callsLast24Hours,
      trend24Hours,
      trend30Days,
      entriesLast24Hours,
      gravityFormEntries,
      selectedCompany,
      setSelectedCompany // Ensure this is provided in the context
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
