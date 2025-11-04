import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/session';
import { api } from '../lib/api';
import AIRecommendations from '../components/AIRecommendations';
import { toast } from 'react-hot-toast';

const StartupProfile = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [startupName, setStartupName] = useState('');
  const [domain, setDomain] = useState('');
  const [idea, setIdea] = useState('');
  const [cin, setCin] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    try {
      if (!user) {
        toast.error('Please log in first');
        navigate('/auth');
        return;
      }

      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]');
      const me = profiles.find(p => p.userId === user.id);
      if (me) {
        setStartupName(me.startupName || '');
        setDomain(me.domain || '');
        setIdea(me.ideaSummary || '');
        setCin(me.cin || '');
        setVerificationStatus(me.mcaVerification || null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  async function verifyMCA() {
    if (!cin || !startupName) {
      toast.error('Please enter CIN and Startup Name');
      return;
    }
    setVerifying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResponse = {
        status: 'verified',
        companyName: startupName,
        registrationDate: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString()
      };
      setVerificationStatus(mockResponse);
      toast.success('Startup verified successfully via MCA!');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  }

  const save = () => {
    if (!user) {
      toast.error('Please log in');
      navigate('/auth');
      return;
    }

    if (!startupName || !domain) {
      toast.error('Please fill in startup name and domain');
      return;
    }
    
    // If CIN is provided but not verified, warn user
    if (cin && (!verificationStatus || verificationStatus.status !== 'verified')) {
      const proceed = window.confirm('CIN not verified. Do you want to save without verification?');
      if (!proceed) return;
    }
    
    try {
      const profiles = JSON.parse(localStorage.getItem('entrepreneurProfiles') || '[]');
      const idx = profiles.findIndex(p => p.userId === user.id);
      const profile = {
        ...(idx >= 0 ? profiles[idx] : {}),
        userId: user.id,
        startupName,
        domain,
        ideaSummary: idea,
        cin: cin || undefined,
        mcaVerification: verificationStatus
      };

      if (idx >= 0) profiles[idx] = profile;
      else profiles.push(profile);

      localStorage.setItem('entrepreneurProfiles', JSON.stringify(profiles));
      toast.success('Profile saved successfully!');
      navigate('/entrepreneurs');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save profile');
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">Startup Profile</h2>
            <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Startup Name</label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="Enter your startup name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domain/Industry</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. FinTech, HealthTech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Idea</label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Describe your business idea"
                />
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-2 text-lg font-semibold">MCA Verification (CIN)</h3>
                <p className="mb-3 text-sm text-gray-600">
                  Verify your startup using Company Identification Number (CIN) from MCA datasets
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CIN Number</label>
                    <input
                      type="text"
                      value={cin}
                      onChange={(e) => setCin(e.target.value.toUpperCase())}
                      maxLength={21}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="U72900XX2020PTC123456"
                    />
                    <p className="mt-1 text-xs text-gray-500">Format: U72900XX2020PTC123456</p>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={verifyMCA}
                      disabled={verifying || !cin || !startupName}
                      className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                    >
                      {verifying ? 'Verifying...' : 'Verify CIN'}
                    </button>
                  </div>
                </div>
                {verificationStatus && (
                  <div
                    className={`mt-3 rounded-md p-3 ${
                      verificationStatus.status === 'verified'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    <div className="font-medium">Status: {verificationStatus.status}</div>
                    {verificationStatus.status === 'verified' && (
                      <div className="mt-1 text-sm">
                        <div>Company: {verificationStatus.companyName}</div>
                        <div>Registration Date: {verificationStatus.registrationDate}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/entrepreneurs')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <AIRecommendations />
        </div>
      </div>
    </div>
  );
}

export default StartupProfile;