import { useEffect, useState } from 'react';
import { useSubscriptionCheck } from '../hooks/useSubscriptionCheck';
import { FEATURES } from '../utils/subscription';
import { FaLightbulb, FaChartLine, FaHandshake } from 'react-icons/fa';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasAccess } = useSubscriptionCheck(FEATURES.ACCESS_AI_MATCHING);
  
  console.log('AI Recommendations component rendered, hasAccess:', hasAccess);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !hasAccess) {
          setLoading(false);
          return;
        }

        // Simulate AI recommendations based on user type
        const mockRecommendations = {
          entrepreneur: [
            {
              title: 'Perfect Investor Match',
              description: 'Based on your startup\'s industry and growth stage',
              icon: <FaHandshake className="text-2xl" />,
              matches: [
                { name: 'Tech Growth Fund', compatibility: '95%', focus: 'SaaS, AI/ML' },
                { name: 'Green Ventures', compatibility: '88%', focus: 'Sustainability' }
              ]
            },
            {
              title: 'Growth Opportunities',
              description: 'Market trends and expansion suggestions',
              icon: <FaChartLine className="text-2xl" />,
              insights: [
                'Consider expanding to Southeast Asian markets',
                'Potential for B2B partnerships in healthcare sector'
              ]
            }
          ],
          investor: [
            {
              title: 'Startup Recommendations',
              description: 'Matches based on your investment criteria',
              icon: <FaLightbulb className="text-2xl" />,
              matches: [
                { name: 'EcoTech Solutions', sector: 'CleanTech', growth: '+45% MoM' },
                { name: 'HealthAI', sector: 'HealthTech', growth: '+28% MoM' }
              ]
            }
          ],
          freelancer: [
            {
              title: 'Project Matches',
              description: 'Based on your skills and experience',
              icon: <FaHandshake className="text-2xl" />,
              matches: [
                { title: 'UI/UX Redesign', budget: '₹80,000', duration: '2 months' },
                { title: 'Mobile App Development', budget: '₹1,50,000', duration: '3 months' }
              ]
            }
          ]
        };

        setRecommendations(mockRecommendations[currentUser.type] || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [hasAccess]);

  if (!hasAccess) {
    return (
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
        <p className="mt-2 text-sm text-gray-600">
          Upgrade to Premium to access personalized AI recommendations
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          <div className="h-20 rounded bg-gray-200"></div>
          <div className="h-20 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <div key={index} className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-brand-100 p-2 text-brand-600">
                {rec.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{rec.title}</h3>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            {rec.matches && (
              <div className="space-y-3">
                {rec.matches.map((match, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{match.name || match.title}</span>
                      {match.compatibility && (
                        <span className="text-sm font-medium text-green-600">{match.compatibility}</span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {match.focus && <div>Focus: {match.focus}</div>}
                      {match.sector && <div>Sector: {match.sector}</div>}
                      {match.growth && <div>Growth: {match.growth}</div>}
                      {match.budget && <div>Budget: {match.budget}</div>}
                      {match.duration && <div>Duration: {match.duration}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {rec.insights && (
              <ul className="list-inside list-disc space-y-2 text-gray-700">
                {rec.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}