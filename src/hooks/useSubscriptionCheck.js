import { useState, useEffect } from 'react';
import { checkSubscriptionAccess } from '../utils/subscription';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const useSubscriptionCheck = (feature) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const access = checkSubscriptionAccess(currentUser.subscription, feature);
      setHasAccess(access);
      setLoading(false);
    };

    checkAccess();
  }, [feature]);

  const requireSubscription = (action) => {
    if (loading) return;

    if (hasAccess) {
      action();
    } else {
      toast.error('This feature requires a subscription upgrade');
      navigate('/pricing');
    }
  };

  return { hasAccess, loading, requireSubscription };
};