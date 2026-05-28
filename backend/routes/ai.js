import express from 'express';
import { verifyAdmin } from './auth.js';

const router = express.Router();

// 1. AI Slogan & Content Generator (Aligned with user's exact 10 websites)
router.post('/generate-content', verifyAdmin, async (req, res) => {
  const { businessType, prompt } = req.body;
  if (!businessType) {
    return res.status(400).json({ success: false, message: 'Missing businessType context.' });
  }

  const basePrompt = prompt || 'premium high-fidelity glass experience';

  const contentDatabase = {
    coaching: {
      slogans: [
        "Uncompromised Class 12th boards preparation at NextRank.",
        "Sculpting academic champions with the clarity of glass structures.",
        "Your dynamic gateway to high scores in competitive boards."
      ],
      heroTitle: "Accelerate Boards Prep at NextRank Institute",
      heroSubtitle: `Experience India's ultimate Glass Education Pro platform. Configured around "${basePrompt}", offering online mock tests, digital notes uploads, real-time attendance, and result analytics.`,
      features: [
        { icon: "📝", title: "Online Board Tests", desc: "Adaptive test series evaluating Class 12th concept physics logs dynamically." },
        { icon: "📊", title: "Interactive Analytics", desc: "Sleek data grids charting rank shifts and weak areas to double speed." }
      ]
    },
    ecommerce: {
      slogans: [
        "Libaas - Luxury wardrobe woven in liquid elegance.",
        "Experience digital designer couture with absolute liquid flows.",
        "Woven under traditional MP silk methods for global shoppers."
      ],
      heroTitle: "Luxury Liquid Couture Collection by Libaas",
      heroSubtitle: `Explore our state-of-the-art catalog. Enabled with "${basePrompt}", presenting animated product frames, wishlist cache trackers, and secure smart checkout gateways.`,
      features: [
        { icon: "🛍️", title: "Liquid Hover Cards", desc: "Highly animated cards presenting instant sizes, pricing, and buy triggers." },
        { icon: "🧠", title: "AI Style Suggester", desc: "Cognitive recommendations matching selected seasonal context real-time." }
      ]
    },
    real_estate: {
      slogans: [
        "AashiyanaX - Find your haven under absolute visual clarity.",
        "Luxury duplexes and plots configured in high-end glass UI.",
        "Secure your riverfront villa coordinates near Tilwara shores."
      ],
      heroTitle: "Luxury Property Glass UI Portal by AashiyanaX",
      heroSubtitle: `Browse premium estates and smart plots. Sculpted using "${basePrompt}", bringing simulated virtual 3D tours, interactive map canvases, and agent schedules booking drawers.`,
      features: [
        { icon: "📽️", title: "3D Virtual Tours", desc: "Walk through riverfront duplexes virtually via interactive structural blueprints." },
        { icon: "🗺️", title: "Interactive maps", desc: "Locate properties in Vijay Nagar or Tilwara Ghat instantly on our custom canvas grids." }
      ]
    },
    hospital: {
      slogans: [
        "AarogyaCare - Healing Frost clinic systems for central India.",
        "Redefining healthcare diagnostics with uncompromised care.",
        "Compassionate recovery and diagnostic security in Sanskardhani."
      ],
      heroTitle: "AarogyaCare Healing Frost Multi-Specialty Clinic",
      heroSubtitle: `Schedule consults, track queues, download lab sheets. Engineered around "${basePrompt}", featuring emergency support sirens, doctor profiles, and real-time medical reports.`,
      features: [
        { icon: "🩺", title: "Report Downloads Vault", desc: "Download clinical health report sheets and CT files directly from a secured database chest." },
        { icon: "🚑", title: "EMT Vehicle Dispatch", desc: "GPS-synchronized ambulance fleets stationed across Jabalpur districts for rapid response." }
      ]
    },
    cafe: {
      slogans: [
        "Cafe Aura - Coffee Glass Lounge experience floating over Bhedaghat.",
        "Where fresh roasted arabica meets cozy acoustic music.",
        "Gourmet fusion plates crafted for cozy coffee loungers."
      ],
      heroTitle: "Cafe Aura Coffee Glass Lounge & Dine-in Deck",
      heroSubtitle: `Savor micro-roasted coffees and organic teas. Inspired by "${basePrompt}", offering table booking calendar widgets, food ordering, and live unplugged music events.`,
      features: [
        { icon: "🌅", title: "Lounge Table Reservation", desc: "Reserve glassmorphic deck tables overlooking the river streams instantly." },
        { icon: "🎵", title: "Acoustic Music Nights", desc: "Live unplugged music events featuring regional artists every weekend." }
      ]
    },
    startup: {
      slogans: [
        "NexaTech Hub - Incubating Future Tech Glass startups in MP.",
        "Deploy enterprise SaaS nodes under green hydroelectric grids.",
        "Silicon Valley standards, built in the heart of Sanskardhani."
      ],
      heroTitle: "NexaTech Hub Technology Acceleration Incubator",
      heroSubtitle: `Deploy dynamic sandboxes fast. Powered by "${basePrompt}", offering conversational AI integrations, team showcases, product demos, and live server resource tracking.`,
      features: [
        { icon: "🤖", title: "AI Integration Sandboxes", desc: "Compile LLM prompt scripts and model variables in under 15ms." },
        { icon: "📊", title: "Hydropower Edge Stats", desc: "Track system concurrency and container load ratios on our live dashboard grid." }
      ]
    },
    gym: {
      slogans: [
        "FlexArena - Power Glass Fitness training sandbox.",
        "Conquer your physical limits under volcanic strength rigs.",
        "Calculate active daily calorie targets on FlexArena tracker."
      ],
      heroTitle: "FlexArena Biomechanical Power Gym & Fitness Club",
      heroSubtitle: `Unleash extreme athletic potential. Calibrated using "${basePrompt}", featuring workout plans builders, BMI calculators, trainer bookings, and membership portals.`,
      features: [
        { icon: "📊", title: "Interactive BMI tracker", desc: "Input physical weight parameters to generate active metabolic targets." },
        { icon: "🏋️", title: "Barbell Coaching Console", desc: "Book 1-on-1 coaching runs directly under certified powerlifters." }
      ]
    },
    tourism: {
      slogans: [
        "ExploreAura - SkyGlass explorer travel planners.",
        "Voyage down moonlit marble rocks canyons in Jabalpur.",
        "AI-customized weekend itineraries crafted for you."
      ],
      heroTitle: "ExploreAura SkyGlass Guided Expeditions",
      heroSubtitle: `Embark on breathtaking journeys. Inspired by "${basePrompt}", offering AI itinerary generators, trip budget calculators, hotel bookings, and interactive maps.`,
      features: [
        { icon: "🗺️", title: "AI Travel Itinerary", desc: "Construct fully customized weekend travel agendas based on weather telemetry parameters." },
        { icon: "💰", title: "Travel Budget Evaluator", desc: "Forecast transit costs, cottage rates, and boating ticket prices in real-time." }
      ]
    },
    cybersecurity: {
      slogans: [
        "ThreatZero - Cyber Matrix Glass security firewall.",
        "Monitor simulated network attack parameters real-time.",
        "Zero-Trust cybersecurity awareness built for young MP developers."
      ],
      heroTitle: "ThreatZero Zero-Trust Cybersecurity Command",
      heroSubtitle: `Keep protocols locked. Configured using "${basePrompt}", featuring interactive cyber quizzes, real-time threat monitoring screens, and security tips logs.`,
      features: [
        { icon: "🛡️", title: "Simulated Attack Map", desc: "Interact with live simulations displaying simulated network attack blocks caught by firewalls." },
        { icon: "🧩", title: "Security Quiz Sandbox", desc: "Test your cybersecurity posture on phishing filters and password encryption." }
      ]
    },
    career: {
      slogans: [
        "JobSphere - FutureHire Glass job discovery portal.",
        "Analyze resume quality grades, prepare for AI mock interviews.",
        "Connect with high-margin remote startups from central India."
      ],
      heroTitle: "JobSphere AI-Powered Job & Internship Finder",
      heroSubtitle: `Step into remote tech careers. Backed by "${basePrompt}", presenting resume parsers, skill logs trackers, and conversational AI mock interviews.`,
      features: [
        { icon: "📄", title: "Resume Parser Rating", desc: "Upload bio text to receive instant ratings, keyword densities, and visual suggestion logs." },
        { icon: "🎙️", title: "AI Mock Interviews", desc: "Participate in micro-interviews matching target startup requirements." }
      ]
    }
  };

  const config = contentDatabase[businessType] || contentDatabase.coaching;
  
  const slogan = config.slogans[Math.floor(Math.random() * config.slogans.length)];
  const result = {
    slogan,
    heroTitle: config.heroTitle,
    heroSubtitle: config.heroSubtitle,
    features: config.features
  };

  return res.json({
    success: true,
    data: result,
    message: "AI Content dynamically generated based on prompt."
  });
});

// 2. AI Theme Suggestion Engine (Aligned with user's exact 10 websites)
router.post('/suggest-theme', verifyAdmin, async (req, res) => {
  const { businessType, styleMode } = req.body; // styleMode: 'futuristic' | 'elegant'
  
  const themeDatabase = {
    coaching: {
      futuristic: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4', background: '#050a18', textColor: '#f8fafc', fontFamily: 'Space Grotesk', glassmorphism: true },
      elegant: { primary: '#1d4ed8', secondary: '#7c3aed', accent: '#22d3ee', background: '#090514', textColor: '#f1f5f9', fontFamily: 'Inter', glassmorphism: true }
    },
    ecommerce: {
      futuristic: { primary: '#f59e0b', secondary: '#818cf8', accent: '#fbbf24', background: '#0c0a09', textColor: '#faf5ff', fontFamily: 'Outfit', glassmorphism: true },
      elegant: { primary: '#d97706', secondary: '#6366f1', accent: '#fbbf24', background: '#0c0402', textColor: '#fff7ed', fontFamily: 'Outfit', glassmorphism: true }
    },
    real_estate: {
      futuristic: { primary: '#b45309', secondary: '#1e3a8a', accent: '#fbbf24', background: '#020617', textColor: '#f8fafc', fontFamily: 'Outfit', glassmorphism: true },
      elegant: { primary: '#d97706', secondary: '#172554', accent: '#f59e0b', background: '#020617', textColor: '#fffdf5', fontFamily: 'Outfit', glassmorphism: true }
    },
    hospital: {
      futuristic: { primary: '#06b6d4', secondary: '#10b981', accent: '#38bdf8', background: '#030f12', textColor: '#f0fdfa', fontFamily: 'Inter', glassmorphism: true },
      elegant: { primary: '#0891b2', secondary: '#047857', accent: '#06b6d4', background: '#061512', textColor: '#ecfeff', fontFamily: 'Inter', glassmorphism: true }
    },
    cafe: {
      futuristic: { primary: '#b45309', secondary: '#ea580c', accent: '#f59e0b', background: '#0d0705', textColor: '#fdf8f6', fontFamily: 'Outfit', glassmorphism: true },
      elegant: { primary: '#7c2d12', secondary: '#c2410c', accent: '#f59e0b', background: '#0c0604', textColor: '#fffbeb', fontFamily: 'Outfit', glassmorphism: true }
    },
    startup: {
      futuristic: { primary: '#3b82f6', secondary: '#a855f7', accent: '#06b6d4', background: '#030014', textColor: '#f1f5f9', fontFamily: 'Space Grotesk', glassmorphism: true },
      elegant: { primary: '#2563eb', secondary: '#7c3aed', accent: '#06b6d4', background: '#04081c', textColor: '#f8fafc', fontFamily: 'Inter', glassmorphism: true }
    },
    gym: {
      futuristic: { primary: '#ef4444', secondary: '#3b82f6', accent: '#f97316', background: '#040404', textColor: '#ffffff', fontFamily: 'Space Grotesk', glassmorphism: false },
      elegant: { primary: '#dc2626', secondary: '#1d4ed8', accent: '#f97316', background: '#0a0a0a', textColor: '#f5f5f5', fontFamily: 'Space Grotesk', glassmorphism: true }
    },
    tourism: {
      futuristic: { primary: '#0284c7', secondary: '#f97316', accent: '#38bdf8', background: '#051026', textColor: '#f0f9ff', fontFamily: 'Outfit', glassmorphism: true },
      elegant: { primary: '#0369a1', secondary: '#c2410c', accent: '#38bdf8', background: '#050c18', textColor: '#f0f9ff', fontFamily: 'Outfit', glassmorphism: true }
    },
    cybersecurity: {
      futuristic: { primary: '#22c55e', secondary: '#06b6d4', accent: '#10b981', background: '#020804', textColor: '#ecfdf5', fontFamily: 'Space Grotesk', glassmorphism: true },
      elegant: { primary: '#15803d', secondary: '#0891b2', accent: '#10b981', background: '#030e06', textColor: '#ecfdf5', fontFamily: 'Inter', glassmorphism: true }
    },
    career: {
      futuristic: { primary: '#2563eb', secondary: '#7c3aed', accent: '#3b82f6', background: '#050714', textColor: '#f5f3ff', fontFamily: 'Space Grotesk', glassmorphism: true },
      elegant: { primary: '#1d4ed8', secondary: '#6d28d9', accent: '#3b82f6', background: '#04050e', textColor: '#fdfcff', fontFamily: 'Inter', glassmorphism: true }
    }
  };

  const bType = businessType || 'coaching';
  const mode = styleMode || 'futuristic';
  
  const suggestions = themeDatabase[bType] || themeDatabase.coaching;
  const theme = suggestions[mode] || suggestions.futuristic;

  return res.json({
    success: true,
    theme,
    message: `Suggested premium "${mode}" palette for ${bType.toUpperCase()}.`
  });
});

// 3. AI Local Chatbot Assistant (Dynamic based on active website context)
router.post('/chatbot', async (req, res) => {
  const { message, businessType } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const userQuery = message.toLowerCase();
  const context = businessType || 'coaching';

  let reply = "";

  const landmarkContext = {
    bhedaghat: "Bhedaghat is home to the stunning Marble Rocks and Dhuandhar Falls, where the Narmada river carving through the stone creates an aesthetic steam spray.",
    rocks: "The Marble Rocks rise over 100 feet on either side of the Narmada River in Bhedaghat, shimmering in absolute white, cream, and dark volcanic veins.",
    narmada: "The sacred Narmada River is the lifeline of Jabalpur, providing continuous clean hydropower and beautiful riverfront scenic views at Tilwara Ghat.",
    fort: "Madan Mahal Fort, built in the 11th century by Gonds, sits on a colossal balance-rock hill, standing as an unshakeable guardian of Jabalpur history."
  };

  let jabalpurRef = "";
  if (userQuery.includes('bhedaghat')) jabalpurRef = landmarkContext.bhedaghat;
  else if (userQuery.includes('marble') || userQuery.includes('rocks')) jabalpurRef = landmarkContext.rocks;
  else if (userQuery.includes('narmada') || userQuery.includes('river')) jabalpurRef = landmarkContext.narmada;
  else if (userQuery.includes('fort') || userQuery.includes('madan') || userQuery.includes('mahal')) jabalpurRef = landmarkContext.fort;

  if (context === 'coaching') {
    if (userQuery.includes('fee') || userQuery.includes('cost') || userQuery.includes('price')) {
      reply = "At NextRank Institute, Class 12th board prep fees are ₹85,000/yr for IIT-JEE Advanced classes, ₹60,000 for NEET Elite sprint, and ₹1,20,000 for UPSC Integrated prep.";
    } else if (userQuery.includes('test') || userQuery.includes('quiz') || userQuery.includes('dashboard')) {
      reply = "Our Glass Education Pro panel includes real-time Attendance checkers, a secure Online Test Series sandbox (launchable on screen), and student Marks Analytics.";
    } else {
      reply = "Welcome to NextRank Institute support! Ask me about Class 10/12th board mock tests, notes upload lists, or custom student dashboard widgets.";
    }
  } 
  
  else if (context === 'ecommerce') {
    if (userQuery.includes('price') || userQuery.includes('wishlist') || prodKeywordCheck(userQuery)) {
      reply = "Libaas collection features: Sateen Tuxedo (₹65,000), Organza Lehenga (₹85,000), and Linen Saffron Kurta (₹12,500). Tap the heart icons to cache products into your Wishlist.";
    } else {
      reply = "Greetings from Libaas! Ask me about size fits, AI-driven style suggestions, organic silk weaving from central India, or test our smart checkout simulator.";
    }
  } 
  
  else if (context === 'real_estate') {
    reply = "Welcome to AashiyanaX support. We are currently highlighting 'The Aashiyana Duplex' (Vijay Nagar, ₹1.8 Crores) and 'Riverfront Crest Villa' (Tilwara, ₹2.6 Crores). Click 'Launch 3D Tour' to preview blueprints virtually.";
  } 
  
  else if (context === 'hospital') {
    reply = "AarogyaCare Support online. Click 'Emergency Support' to trigger simulated WebSocket sirens across Jabalpur. You can also download your clinical health report sheet on screen.";
  } 
  
  else if (context === 'cafe') {
    reply = "Cafe Aura Coffee Lounge active. Reserve coffee tables online, examine our gourmet showcase menu (Aura Espresso ₹180, Saffron Frappe ₹260), or check our acoustic live music schedules.";
  } 
  
  else if (context === 'startup') {
    reply = "NexaTech Hub Future Tech Glass console active. You can run mock AI compilation prompts in the Sandbox console on screen, or check our live hydropower resource load ratios.";
  } 
  
  else if (context === 'gym') {
    reply = "FlexArena Strength Trainer active. Use the BMI Target tracker on screen to input weight metrics, or book one of our certified powerlifting coaches.";
  }

  else if (context === 'tourism') {
    reply = "ExploreAura SkyGlass Explorer terminal. Type your tourist spot in the AI Itinerary Generator box on screen (e.g. Bhedaghat) to compile optimized weekend travel agendas instantly.";
  }

  else if (context === 'cybersecurity') {
    reply = "ThreatZero Cybersecurity Command active. We monitor simulated network attacks in real-time on your dashboard. Take our interactive security quiz on screen to test your knowledge.";
  }

  else if (context === 'career') {
    reply = "JobSphere FutureHire Job Portal online. Paste your bio inside the Smart Resume Analyzer on screen to get scored, or click 'Start AI Mock Interview' to test technical Q&A prompts.";
  }

  else {
    reply = "I am the Jabalpur SmartEngine virtual advisor. How can I assist you with your business needs today?";
  }

  if (jabalpurRef) {
    reply = `${jabalpurRef} Specifically for this query: ${reply}`;
  }

  return res.json({
    success: true,
    reply,
    timestamp: new Date()
  });
});

function prodKeywordCheck(str) {
  return str.includes('suit') || str.includes('clothes') || str.includes('wear') || str.includes('silk') || str.includes('kurta');
}

// 4. AI SEO Evaluator Suggestions (Aligned with 10 websites)
router.post('/seo-evaluator', verifyAdmin, async (req, res) => {
  const { title, description, keywords, businessType } = req.body;
  if (!businessType) {
    return res.status(400).json({ success: false, message: 'Missing businessType.' });
  }

  let score = 75;
  const suggestions = [];

  if (title && title.length > 30 && title.length < 60) score += 10;
  else suggestions.push("Optimize title character count between 30 and 60 for better Google SERP fitting.");

  if (description && description.length > 110 && description.length < 160) score += 10;
  else suggestions.push("Keep meta descriptions within 110-160 characters to optimize mobile-first listings.");

  const recommendedKeywords = {
    coaching: ["coaching up to 12th jabalpur", "NextRank Institute physics", "best science classes vijay nagar"],
    ecommerce: ["Libaas traditional clothing", "luxury store jabalpur", "designer clothes store MP"],
    real_estate: ["plots for sale jabalpur", "AashiyanaX duplex", "tilwara ghat properties AashiyanaX"],
    hospital: ["aarogyacare clinic jabalpur", "best hospital vijay nagar", "doctor booking aarogyacare"],
    cafe: ["cafe aura coffee lounge", "acoustic music cafe jabalpur", "table reservation cafe aura"],
    startup: ["nexatech hub incubator", "SaaS startups MP", "nexatech hub coworking"],
    gym: ["flexarena gym jabalpur", "powerlifting flexarena", "personal trainer flexarena pricing"],
    tourism: ["exploreaura bhedaghat boating", "ai travel planner MP", "exploreaura hotel booking"],
    cybersecurity: ["threatzero cyber awareness", "cybersecurity quizzes jabalpur", "live network simulator threatzero"],
    career: ["jobsphere career portal", "internships finder MP", "jobsphere resume analyzer"]
  };

  if (score > 100) score = 100;

  return res.json({
    success: true,
    score,
    suggestions: suggestions.length > 0 ? suggestions : ["All SEO configurations optimized! Landing page is fully ready for deployment."],
    recommendedKeywords: recommendedKeywords[businessType] || recommendedKeywords.coaching
  });
});

export default router;
