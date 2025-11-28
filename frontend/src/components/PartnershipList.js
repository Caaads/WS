import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const PartnershipList = () => {
  const [partnerships, setPartnerships] = useState([]);

  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const response = await axiosInstance.get('partnerships/'); // Django endpoint
        setPartnerships(response.data);
      } catch (error) {
        console.error('Error fetching partnerships:', error);
      }
    };

    fetchPartnerships();
  }, []);

  return (
    <div>
      <h1>OSA Partnerships</h1>
      <ul>
        {partnerships.map((p) => (
          <li key={p.id}>{p.name} - {p.department}</li>
        ))}
      </ul>
    </div>
  );
};

export default PartnershipList;
