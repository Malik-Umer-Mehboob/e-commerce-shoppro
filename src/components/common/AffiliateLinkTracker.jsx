import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AffiliateLinkTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref') || params.get('aff');
    
    if (ref) {
      // The backend middleware handles the tracking click and cookie setting
      // But we can also set it in localStorage for easier access in frontend
      localStorage.setItem('affiliate_code', ref);
    }
  }, [location]);

  return null;
};

export default AffiliateLinkTracker;
