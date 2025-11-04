// Function to check if a user's subscription is active and has access to a feature
export const checkSubscriptionAccess = (subscription, feature) => {
  // If no subscription is required for the feature
  if (!feature.requiresSubscription) {
    return true;
  }

  // If feature requires subscription but user has none
  if (!subscription) {
    return false;
  }

  const today = new Date();
  const endDate = new Date(subscription.endDate);

  // Check if subscription has expired
  if (today > endDate) {
    return false;
  }

  const featureAccess = {
    entrepreneur: {
      free: [
        'basic_profile',
        'single_project',
        'basic_pitch_deck',
        'basic_search',
        'community_access',
        'basic_support'
      ],
      pro: [
        'unlimited_projects',
        'enhanced_visibility',
        'direct_messaging',
        'basic_analytics',
        'milestone_tracking',
        'pitch_templates',
        'video_pitch',
        'priority_support',
        'contact_export',
        'basic_legal_docs'
      ],
      premium: [
        'featured_listing',
        'ai_matching',
        'advanced_analytics',
        'unlimited_messaging',
        'unlimited_milestones',
        'pitch_review',
        'legal_bundle',
        'priority_badge',
        'account_manager',
        'investor_events',
        'verification_badge',
        'custom_domain'
      ]
    },
    investor: {
      free: [
        'basic_browse',
        'limited_watchlist',
        'public_pitch_decks',
        'basic_search',
        'community_access'
      ],
      pro: [
        'advanced_filters',
        'unlimited_saves',
        'portfolio_tracking',
        'deal_alerts',
        'direct_messaging',
        'financial_data',
        'investment_history',
        'data_export',
        'comparison_tool',
        'priority_support'
      ],
      premium: [
        'priority_access',
        'ai_recommendations',
        'due_diligence',
        'unlimited_messaging',
        'verified_badge',
        'direct_calls',
        'market_reports',
        'syndicate_access',
        'exclusive_events',
        'api_access',
        'relationship_manager'
      ]
    },
    freelancer: {
      free: [
        'basic_profile',
        'limited_portfolio',
        'limited_applications',
        'basic_search',
        'hourly_rate'
      ],
      pro: [
        'unlimited_applications',
        'unlimited_portfolio',
        'verified_badge',
        'search_priority',
        'skill_tests',
        'testimonials',
        'project_tools',
        'enhanced_profile',
        'premium_projects',
        'analytics'
      ],
      premium: [
        'featured_listing',
        'ai_matching',
        'exclusive_projects',
        'contract_templates',
        'escrow_protection',
        'dedicated_support',
        'branding_consultation',
        'early_access',
        'portfolio_website',
        'advanced_analytics',
        'priority_badge'
      ]
    }
  };

  // Get allowed features for user's subscription type and plan
  const allowedFeatures = [
    ...featureAccess[subscription.type].free,
    ...(subscription.plan === 'pro' ? featureAccess[subscription.type].pro : []),
    ...(subscription.plan === 'premium' ? [
      ...featureAccess[subscription.type].pro,
      ...featureAccess[subscription.type].premium
    ] : [])
  ];

  return allowedFeatures.includes(feature.name);
};

// Example features configuration
export const FEATURES = {
  // Entrepreneur Features
  CREATE_UNLIMITED_PROJECTS: {
    name: 'unlimited_projects',
    requiresSubscription: true,
    minimumPlan: 'pro',
    userType: 'entrepreneur'
  },
  UPLOAD_VIDEO_PITCH: {
    name: 'video_pitch',
    requiresSubscription: true,
    minimumPlan: 'pro',
    userType: 'entrepreneur'
  },
  ACCESS_AI_MATCHING: {
    name: 'ai_matching',
    requiresSubscription: true,
    minimumPlan: 'premium',
    userType: 'entrepreneur'
  },

  // Investor Features
  VIEW_FINANCIAL_DATA: {
    name: 'financial_data',
    requiresSubscription: true,
    minimumPlan: 'pro',
    userType: 'investor'
  },
  ACCESS_DUE_DILIGENCE: {
    name: 'due_diligence',
    requiresSubscription: true,
    minimumPlan: 'premium',
    userType: 'investor'
  },
  USE_COMPARISON_TOOL: {
    name: 'comparison_tool',
    requiresSubscription: true,
    minimumPlan: 'pro',
    userType: 'investor'
  },

  // Freelancer Features
  APPLY_UNLIMITED_PROJECTS: {
    name: 'unlimited_applications',
    requiresSubscription: true,
    minimumPlan: 'pro',
    userType: 'freelancer'
  },
  ACCESS_EXCLUSIVE_PROJECTS: {
    name: 'exclusive_projects',
    requiresSubscription: true,
    minimumPlan: 'premium',
    userType: 'freelancer'
  },
  USE_ESCROW_PROTECTION: {
    name: 'escrow_protection',
    requiresSubscription: true,
    minimumPlan: 'premium',
    userType: 'freelancer'
  }
};