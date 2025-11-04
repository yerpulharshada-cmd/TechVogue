import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PLANS = {
  entrepreneur: {
    free: {
      name: 'Free',
      price: 0,
      yearlyPrice: 0,
      features: [
        'Basic profile creation (1 project only)',
        'Upload pitch deck (PDF, max 5MB)',
        'Limited visibility',
        'View investor profiles (basic info only)',
        'Community forum access',
        'Email support (72-hour response)',
        '"Free User" badge on profile'
      ]
    },
    pro: {
      name: 'Pro',
      price: 999,
      yearlyPrice: 9990,
      features: [
        'Unlimited projects',
        'Enhanced search visibility',
        'Direct messaging (50 messages/month)',
        'Basic analytics dashboard',
        'Milestone tracker (up to 10 milestones)',
        'Pitch deck templates',
        'Video pitch upload (3 minutes max)',
        'Priority email support (24-hour response)',
        'Export contact list of interested investors',
        'Basic legal document templates'
      ]
    },
    premium: {
      name: 'Premium',
      price: 2999,
      yearlyPrice: 29990,
      features: [
        'Featured homepage listing',
        'AI-powered investor matching',
        'Advanced analytics',
        'Unlimited messaging',
        'Unlimited milestones',
        'Professional pitch deck review',
        'Legal document bundle',
        'Priority badge',
        'Dedicated account manager',
        'Monthly investor networking events',
        'Profile verification badge',
        'Custom subdomain'
      ]
    }
  },
  investor: {
    free: {
      name: 'Free',
      price: 0,
      yearlyPrice: 0,
      features: [
        'Browse startup profiles (limited filters)',
        'Save up to 5 startups to watchlist',
        'View public pitch decks',
        'Basic search (industry, location only)',
        'Community forum access'
      ]
    },
    pro: {
      name: 'Pro',
      price: 1999,
      yearlyPrice: 19990,
      features: [
        'Advanced search filters',
        'Unlimited saved startups',
        'Portfolio tracking dashboard',
        'Deal flow email alerts',
        'Direct messaging (30 messages/month)',
        'Access to financial data',
        'Investment history tracking',
        'Export startup data to CSV',
        'Comparison tool',
        'Priority email support'
      ]
    },
    premium: {
      name: 'Premium',
      price: 4999,
      yearlyPrice: 49990,
      features: [
        'Priority access to new deals',
        'AI-powered startup recommendations',
        'Due diligence reports',
        'Unlimited messaging',
        'Verified investor badge',
        'Direct phone line with entrepreneurs',
        'Quarterly market trend reports',
        'Co-investment opportunities',
        'Exclusive investor-only events',
        'API access',
        'Dedicated relationship manager'
      ]
    }
  },
  freelancer: {
    free: {
      name: 'Free',
      price: 0,
      yearlyPrice: 0,
      features: [
        'Basic profile creation',
        'Portfolio showcase (3 projects)',
        'Apply to 5 projects/month',
        'View startup profiles',
        'Hourly rate display'
      ]
    },
    pro: {
      name: 'Pro',
      price: 499,
      yearlyPrice: 4990,
      features: [
        'Unlimited project applications',
        'Portfolio showcase (unlimited)',
        'Verified freelancer badge',
        'Priority in search results',
        'Skill assessment tests',
        'Client testimonials section',
        'Basic project management tools',
        'Enhanced profile',
        'Apply for Premium Only projects',
        'Response rate analytics'
      ]
    },
    premium: {
      name: 'Premium',
      price: 1499,
      yearlyPrice: 14990,
      features: [
        'Featured freelancer listing',
        'AI-powered project matching',
        'Access to exclusive high-value projects',
        'Contract templates bundle',
        'Escrow payment protection',
        'Dedicated support',
        'Personal branding consultation',
        'Early access to new startups',
        'Portfolio website builder',
        'Advanced analytics',
        'Priority badge in all listings'
      ]
    }
  }
};

export default function Pricing() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('entrepreneur');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planType) => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
        toast.error('Please login to subscribe');
        navigate('/auth');
        return;
      }

      // Update user subscription in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            subscription: {
              plan: planType,
              type: userType,
              billingPeriod,
              startDate: new Date().toISOString(),
              // Add 30 days for monthly, 365 for yearly
              endDate: new Date(Date.now() + (billingPeriod === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
            }
          };
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify({
        ...currentUser,
        subscription: {
          plan: planType,
          type: userType,
          billingPeriod,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + (billingPeriod === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
        }
      }));

      toast.success('Subscription updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setUserType('entrepreneur')}
            className={`px-4 py-2 rounded-md ${
              userType === 'entrepreneur'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Entrepreneur
          </button>
          <button
            onClick={() => setUserType('investor')}
            className={`px-4 py-2 rounded-md ${
              userType === 'investor'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Investor
          </button>
          <button
            onClick={() => setUserType('freelancer')}
            className={`px-4 py-2 rounded-md ${
              userType === 'freelancer'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Freelancer
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative">
            <div className="flex items-center space-x-3">
              <span className={billingPeriod === 'monthly' ? 'text-brand-600' : 'text-gray-500'}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                style={{ backgroundColor: billingPeriod === 'yearly' ? '#4F46E5' : '#E5E7EB' }}
              >
                <span
                  className={`translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingPeriod === 'yearly' ? 'translate-x-5' : ''
                  }`}
                />
              </button>
              <span className={billingPeriod === 'yearly' ? 'text-brand-600' : 'text-gray-500'}>
                Yearly (Save 17%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {Object.entries(PLANS[userType]).map(([planType, plan]) => (
            <div
              key={planType}
              className="rounded-lg shadow-lg bg-white overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-4xl font-extrabold text-gray-900">
                  ₹{billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice}
                  <span className="text-base font-medium text-gray-500">
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(planType)}
                  disabled={loading}
                  className={`mt-8 w-full rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm ${
                    planType === 'free'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : planType === 'premium'
                      ? 'bg-brand-600 hover:bg-brand-700'
                      : 'bg-brand-500 hover:bg-brand-600'
                  } focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : planType === 'free' ? 'Get Started' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}