// Redefined website configurations based on User's explicit parameters
// Features 10 customized classy websites with distinct color codes and glassmorphism.
export const defaultTemplates = {
  coaching: {
    businessType: 'coaching',
    theme: {
      name: 'NextRank Institute',
      primary: '#D4AF37', // Shimmering Gold
      secondary: '#2A2A2A', // Warm Gray Highlight
      accent: '#D4AF37', // Accent Gold Glow
      background: '#0B0B0B', // Matte Black Canvas
      textColor: '#FFFFFF', // Soft White Text
      glassmorphism: true,
      fontFamily: 'Space Grotesk',
      borderRadius: '3xl'
    },
    hero: {
      title: "NextRank",
      subtitle: "Sanskardhani's Premier Smart Glass Education Platform. Jabalpur's leading AI-powered interactive ecosystem for IIT-JEE, NEET, and Class 6th-12th Scholars with live conceptual diagnostics, real-time biometric parent nodes, and adaptive board preparation tracks.",
      ctaText: "Enroll Now",
      ctaLink: "#dynamic_modules",
      bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Madan Mahal",
        interactiveEffect: "electronic_grid"
      }
    },
    navigation: {
      logoText: "NextRank Institute",
      links: [
        { label: "Classroom Hub", href: "#home" },
        { label: "Dashboard Portal", href: "#dynamic_modules" },
        { label: "Test Features", href: "#features" },
        { label: "Our Story", href: "#about" },
        { label: "Admission Desk", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "Glass Education Pro Standards",
        subtitle: "Integrated student utilities designed for unmatched academic clarity.",
        visible: true,
        order: 1,
        content: [
          { icon: "📝", title: "Adaptive MCQ Test Series", desc: "Adaptive dynamic mock exams tracking student percentiles, response speeds, and physics concepts." },
          { icon: "📅", title: "Biometric RFID Parent Logs", desc: "Digital RFID gate check-ins logged instantly to parent nodes with real-time SMS checkpoints." },
          { icon: "📊", title: "AI Rank Percentile Predictor", desc: "Deep-learning rank forecasting simulators charting rank targets based on conceptual mocks scorecards." }
        ]
      },
      {
        id: "stats",
        type: "stats",
        title: "Apex Achievers",
        subtitle: "Verifiable board examination ranks representing NextRank's elite coaching standards.",
        visible: true,
        order: 2,
        content: [
          { number: "99.6%", label: "Jabalpur Board Topper - AIR 12" },
          { number: "99.2%", label: "NEET Top Medical Score - AIR 28" },
          { number: "1,500+", label: "IIT-JEE / NEET Credentials Logged" }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Bridging Science & Success",
        subtitle: "Our Academic Mission",
        visible: true,
        order: 3,
        content: {
          text: "NextRank Institute is Sanskardhani's premier science and commerce prep node for students up to Class 12th. Guided by expert mentors, our classroom structures combine traditional curriculum with state-of-the-art interactive digital notes. We focus on building a strong foundation, encouraging competitive problem solving, and generating real-time academic logs for parents.",
          image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 NextRank Institute. Raising scholastic benchmarks in Jabalpur.",
      socials: [
        { platform: "youtube", url: "#" },
        { platform: "instagram", url: "#" }
      ]
    },
    seo: {
      metaTitle: "NextRank Institute - Best Classes up to 12th in Jabalpur",
      metaDescription: "Step into NextRank Institute, Jabalpur's leading class 12th academy featuring online tests and result analytics.",
      keywords: ["coaching up to 12th jabalpur", "NextRank institute", "best science tuition jabalpur"]
    }
  },
  ecommerce: {
    businessType: 'ecommerce',
    theme: {
      name: 'Libaas Luxury Commerce',
      primary: '#f59e0b', // Antique Gold
      secondary: '#818cf8', // Lavender
      accent: '#fbbf24', // Shimmering Gold Accent
      background: '#0c0a09', // Deep Obsidian Black
      textColor: '#faf5ff', // Pale Lavender White
      glassmorphism: true,
      fontFamily: 'Outfit',
      borderRadius: 'xl'
    },
    hero: {
      title: "Luxury Liquid Commerce by Libaas",
      subtitle: "Experience absolute wardrobe couture. Explore highly animated product cards, interactive wishlist caches, AI-driven style suggestions, and a smart, seamless glass checkout gateway.",
      ctaText: "Browse Couture",
      ctaLink: "#couture",
      bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Narmada River",
        interactiveEffect: "canvas_ripples"
      }
    },
    navigation: {
      logoText: "Libaas",
      links: [
        { label: "Couture Collection", href: "#home" },
        { label: "Shop Libaas", href: "#dynamic_modules" },
        { label: "Smart Features", href: "#features" },
        { label: "Libaas Vision", href: "#about" },
        { label: "Inquire", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "High-End E-Commerce Standards",
        subtitle: "Intelligent digital shopping workflows configured for premium shoppers.",
        visible: true,
        order: 1,
        content: [
          { icon: "🧠", title: "AI Style Recommendation", desc: "Custom style selectors recommend matching clothing designs based on color codes and season context." },
          { icon: "🛍️", title: "Animated Product Grid", desc: "Premium product cards displaying full liquid hover transforms, size options, and direct cart add triggers." },
          { icon: "💳", title: "Smart Checkout Link", desc: "Highly secure checkouts optimized for mobile-first transactions with dynamic payment trackers." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Woven in Elegance",
        subtitle: "Libaas Signature Heritage",
        visible: true,
        order: 2,
        content: {
          text: "Libaas represents the peak of Indian premium startup design. We combine traditional embroidery methods with contemporary global silhouettes to create gorgeous, sustainable wardrobe couture. Partnering with indigenous organic silk weavers in Central MP, our collections bring beautiful, local craft styles to global digital shoppers through liquid-fast digital pipelines.",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 Libaas. Luxury wardrobe curated in Sanskardhani.",
      socials: [
        { platform: "instagram", url: "#" },
        { platform: "facebook", url: "#" }
      ]
    },
    seo: {
      metaTitle: "Libaas - Premium Indian Designer Couture Store",
      metaDescription: "Discover Libaas, the luxury liquid e-commerce store presenting rich traditional-modern fusion designer clothes.",
      keywords: ["Libaas clothing", "luxury store jabalpur", "designer suits MP"]
    }
  },
  real_estate: {
    businessType: 'real_estate',
    theme: {
      name: 'AashiyanaX Luxury UI',
      primary: '#b45309', // Classic Amber Gold
      secondary: '#1e3a8a', // Dark Navy Blue
      accent: '#fbbf24', // Amber Accent
      background: '#020617', // Matte Black-Navy Midnight
      textColor: '#f8fafc', // Pristine White
      glassmorphism: true,
      fontFamily: 'Outfit',
      borderRadius: 'xl'
    },
    hero: {
      title: "Luxury Property Glass UI Portal by AashiyanaX",
      subtitle: "Discover high-premium houses, custom plots, and modern duplexes. Explore simulated virtual 3D tours, interactive region maps, smart filters, and book consultation sessions instantly.",
      ctaText: "Open Property Finder",
      ctaLink: "#properties",
      bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Narmada River",
        interactiveEffect: "canvas_ripples"
      }
    },
    navigation: {
      logoText: "AashiyanaX",
      links: [
        { label: "Elite Estates", href: "#home" },
        { label: "Property Search", href: "#dynamic_modules" },
        { label: "UI Features", href: "#features" },
        { label: "Our Story", href: "#about" },
        { label: "Consult Agent", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "AashiyanaX Smart Utilities",
        subtitle: "Luxury buying engineered with absolute digital transparency.",
        visible: true,
        order: 1,
        content: [
          { icon: "📽️", title: "Simulated Virtual Tours", desc: "Walk through premium riverfront duplex layouts virtually using interactive 3D blueprints." },
          { icon: "🗺️", title: "Interactive Regional Map", desc: "Locate properties near Tilwara Ghat, Vijay Nagar, or Bhedaghat bypass bypass routes instantly." },
          { icon: "📞", title: "Agent Consultation Slots", desc: "Schedule instant consulting sessions and track agent status real-time from the dashboard." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Architecting Cozy Havens",
        subtitle: "About AashiyanaX Developers",
        visible: true,
        order: 2,
        content: {
          text: "AashiyanaX Developers has revolutionized residential real estate in central India. Taking inspiration from Jabalpur's unshakeable Madan Mahal balance rocks, we construct highly premium architectural structures that merge raw security with sleek glass aesthetic layouts. Our projects feature green energy systems, direct water recyclers, and pristine river views.",
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 AashiyanaX. Making smart homes accessible in Sanskardhani.",
      socials: [
        { platform: "linkedin", url: "#" },
        { platform: "twitter", url: "#" }
      ]
    },
    seo: {
      metaTitle: "AashiyanaX - Best Real Estate Property Finder",
      metaDescription: "Find luxury duplexes, flats, and plots for sale in Jabalpur with AashiyanaX's luxury glass property UI.",
      keywords: ["properties in jabalpur", "plots near tilwara ghat", "AashiyanaX estate"]
    }
  },
  hospital: {
    businessType: 'hospital',
    theme: {
      name: 'AarogyaCare Healing Frost',
      primary: '#06b6d4', // Glacier Aqua
      secondary: '#10b981', // Clean Mint Green
      accent: '#38bdf8', // Ice Blue Accent
      background: '#030f12', // Sanitary Healing Mint Black
      textColor: '#f0fdfa', // Fresh Teal White
      glassmorphism: true,
      fontFamily: 'Inter',
      borderRadius: 'xl'
    },
    hero: {
      title: "Healing Frost UI - Smart Care Portal by AarogyaCare",
      subtitle: "Welcome to AarogyaCare Clinic. Register dynamic clinical appointments, consult expert doctors, download detailed health reports, and access 24/7 rapid emergency support feeds.",
      ctaText: "Book Appointment Now",
      ctaLink: "#booking",
      bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Narmada River",
        interactiveEffect: "canvas_ripples"
      }
    },
    navigation: {
      logoText: "AarogyaCare",
      links: [
        { label: "Care Gateway", href: "#home" },
        { label: "Clinical Booking", href: "#dynamic_modules" },
        { label: "Frost Features", href: "#features" },
        { label: "Our Story", href: "#about" },
        { label: "Emergency Contact", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "Care Innovation and Comfort",
        subtitle: "Healing Frost UI designed to deliver medical operations with microsecond-latency security.",
        visible: true,
        order: 1,
        content: [
          { icon: "🩺", title: "Health Report Node", desc: "Download clinical checkup sheets, MRI files, and lab telemetry directly from a secured digital chest." },
          { icon: "📅", title: "Appointment Calendar", desc: "Self-booking calendar showing real-time doctor availability slots and patient queue counters." },
          { icon: "🚑", title: "Emergency Support Dispatch", desc: "Direct hotline and GPS ambulance transit system routed across Jabalpur city boundaries." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "A Sanctuary of Health",
        subtitle: "Serving Jabalpur with trust since 2015",
        visible: true,
        order: 2,
        content: {
          text: "AarogyaCare was established in Sanskardhani to deliver premium multi-specialty clinical health services in central India. Headed by board-certified physicians, our clinic incorporates zero-emission energy systems, clean oxygenation loops, and advanced diagnostics to maintain high recovery percentages and compassionate patient rehabilitation.",
          image: "https://images.unsplash.com/photo-1586773860418-d3b3de97e963?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 AarogyaCare. Your trusted health shield in MP.",
      socials: [
        { platform: "facebook", url: "#" },
        { platform: "twitter", url: "#" }
      ]
    },
    seo: {
      metaTitle: "AarogyaCare - Best Medical Clinic in Jabalpur",
      metaDescription: "Schedule your clinical appointment at AarogyaCare clinic, featuring diagnostic labs and emergency ambulance systems.",
      keywords: ["best hospital jabalpur", "aarogyacare clinic", "doctor appointment jabalpur"]
    }
  },
  cafe: {
    businessType: 'cafe',
    theme: {
      name: 'Cafe Aura Coffee Glass Lounge',
      primary: '#b45309', // Roasted Brown
      secondary: '#ea580c', // Warm Orange
      accent: '#f59e0b', // Soft Cream Gold
      background: '#0d0705', // Roasted Coffee Bean Black
      textColor: '#fdf8f6', // Warm Cream White
      glassmorphism: true,
      fontFamily: 'Outfit',
      borderRadius: '2xl'
    },
    hero: {
      title: "Cafe Aura - Coffee Glass Lounge Experience",
      subtitle: "Relax in our glassmorphic coffee retreat. Savor artisanal micro-batch roasted brews, reserve river-view dining tables, explore live music schedules, and order food online instantly.",
      ctaText: "Reserve Table Online",
      ctaLink: "#booking",
      bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Bhedaghat",
        interactiveEffect: "misty_parallax"
      }
    },
    navigation: {
      logoText: "Cafe Aura",
      links: [
        { label: "Aura Vibe", href: "#home" },
        { label: "Cafe Menu", href: "#dynamic_modules" },
        { label: "Reservation Details", href: "#features" },
        { label: "Brew Story", href: "#about" },
        { label: "Dine In", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "Aura Coffee Lounging",
        subtitle: "Every cup roasted to perfection, celebrating native Indian spice integrations.",
        visible: true,
        order: 1,
        content: [
          { icon: "🌅", title: "Online reservations", desc: "Reserve tables overlooking the gorges, complete with digital preview grids." },
          { icon: "☕", title: "Coffee Menu Showcase", desc: "Locally-roasted single-origin coffees, organic teas, and custom chocolate lava shells." },
          { icon: "🎵", title: "Live Music Sessions", desc: "Unplugged acoustic performances by regional Sanskardhani artists every weekend." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Our Roasting History",
        subtitle: "Crafting cozy moments since 2018",
        visible: true,
        order: 2,
        content: {
          text: "Cafe Aura represents the peak of relaxing coffee spaces. Partnering with indigenous growers in Central India, we procure high-grade organic coffee beans and blend them in-house daily. Our elegant glass lounge provides natural light, high-end acoustical configurations for unplugged nights, and clean local ingredients.",
          image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 Cafe Aura. Crafted in Jabalpur. Vibe with flavor.",
      socials: [
        { platform: "instagram", url: "#" },
        { platform: "facebook", url: "#" }
      ]
    },
    seo: {
      metaTitle: "Cafe Aura - Best Coffee Glass Lounge in Jabalpur",
      metaDescription: "Unwind at Cafe Aura, offering single-origin coffees, live acoustic music, and riverfront reservations.",
      keywords: ["best cafe jabalpur", "cafe aura coffee lounge", "table reservation jabalpur"]
    }
  },
  startup: {
    businessType: 'startup',
    theme: {
      name: 'NexaTech Hub Future Tech Glass',
      primary: '#3b82f6', // Cyber Neon Blue
      secondary: '#a855f7', // Tech Purple
      accent: '#06b6d4', // Cyan Accent
      background: '#030014', // Extreme Deep Tech Obsidian Black
      textColor: '#f1f5f9', // Futuristic Silver White
      glassmorphism: true,
      fontFamily: 'Space Grotesk',
      borderRadius: '2xl'
    },
    hero: {
      title: "NexaTech Hub - Future Tech Glass Incubator",
      subtitle: "Accelerate digital operations from central India. Access advanced AI integrations dashboard, explore product demos, check team showcases, and monitor live network statistics.",
      ctaText: "Open AI Integrations",
      ctaLink: "#ai-console",
      bgImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Madan Mahal Fort",
        interactiveEffect: "neon_grids"
      }
    },
    navigation: {
      logoText: "NexaTech Hub",
      links: [
        { label: "Smart Hub", href: "#home" },
        { label: "AI Dashboard", href: "#dynamic_modules" },
        { label: "Core Perks", href: "#features" },
        { label: "Tech Vision", href: "#about" },
        { label: "Collab Terminal", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "Future Tech Glass Assets",
        subtitle: "SaaS accelerators configured to deploy enterprise nodes instantly.",
        visible: true,
        order: 1,
        content: [
          { icon: "🤖", title: "AI Integrations Module", desc: "Embed conversational models and data parsers directly into your standard codebase pipeline." },
          { icon: "📊", title: "Live Network Stats", desc: "Track system concurrency, container load ratios, and Bargi dam green hydro grid power flow." },
          { icon: "📽️", title: "Product Demos Sandbox", desc: "Interactive sandboxes displaying real-time UI code examples for young MP tech teams." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Incubating Digital Giants",
        subtitle: "NexaTech Hub Architecture",
        visible: true,
        order: 2,
        content: {
          text: "NexaTech Hub was founded to accelerate technology startups in Madhya Pradesh. We provide co-working spaces, seed capital advisories, and direct developer sandbox frameworks. Our mission is to raise high-concurrency SaaS companies utilizing low-latency digital containers and eco-sustainable green grids in central India.",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 NexaTech Hub. Orchestrating SaaS from central India.",
      socials: [
        { platform: "linkedin", url: "#" },
        { platform: "github", url: "#" }
      ]
    },
    seo: {
      metaTitle: "NexaTech Hub - Premium Tech Incubator in Jabalpur",
      metaDescription: "Deploy startups fast at NexaTech Hub. Access AI sandboxes, coworking grids, and seed integrations.",
      keywords: ["startups jabalpur", "NexaTech hub", "AI tech incubator MP"]
    }
  },
  gym: {
    businessType: 'gym',
    theme: {
      name: 'FlexArena Power Glass Fitness',
      primary: '#ef4444', // Intense Red
      secondary: '#3b82f6', // Electric Blue
      accent: '#f97316', // energy Orange
      background: '#040404', // Carbon Carbon Black
      textColor: '#ffffff', // Absolute High-Contrast White
      glassmorphism: false,
      fontFamily: 'Space Grotesk',
      borderRadius: '3xl'
    },
    hero: {
      title: "FlexArena - Power Glass Fitness Training",
      subtitle: "Unleash extreme athletic potential. Calculate dynamic target calories on our BMI tracker, build workout schedules, choose membership modules, and book elite personal trainers.",
      ctaText: "Open BMI Tracker",
      ctaLink: "#bmi-planner",
      bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Marble Rocks",
        interactiveEffect: "glowing_grids"
      }
    },
    navigation: {
      logoText: "FlexArena",
      links: [
        { label: "The Arena", href: "#home" },
        { label: "Fitness Portal", href: "#dynamic_modules" },
        { label: "Arena Perks", href: "#features" },
        { label: "Trainer Rosters", href: "#about" },
        { label: "Enlist Now", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "Power Glass Fitness Perks",
        subtitle: "Uncompromising physical training assets engineered to break personal limits.",
        visible: true,
        order: 1,
        content: [
          { icon: "📋", title: "Targeted Workout Plans", desc: "Build tailored programs tracking barbell volume, recovery periods, and conditioning schedules." },
          { icon: "📊", title: "Interactive BMI Tracker", desc: "Input physical weight parameters to generate active metabolic metabolic targets." },
          { icon: "🏋️", title: "Trainer Booking Console", desc: "Schedule 1-on-1 coaching runs directly under certified powerlifters." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "The Iron Philosophy",
        subtitle: "FlexArena Athletic Standard",
        visible: true,
        order: 2,
        content: {
          text: "FlexArena was established with a singular focus: to elevate physical preparedness standards in central India. We run on the structural rule that strength is the master quality of well-being. Our custom 12,000 sq ft facility provides high-grade mechanical steel rigs, biometric telemetry tools, and organic pre/post shake bars.",
          image: "https://images.unsplash.com/photo-1549060263-237a4cd50a04?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 FlexArena. Conquer your physical boundaries.",
      socials: [
        { platform: "youtube", url: "#" },
        { platform: "instagram", url: "#" }
      ]
    },
    seo: {
      metaTitle: "FlexArena - Premium Gym & Fitness Center",
      metaDescription: "Break fitness benchmarks at FlexArena Gym. Access weightlifting zones, trainers booking, and BMI trackers.",
      keywords: ["gym in jabalpur", "flexarena fitness", "powerlifting gym MP"]
    }
  },
  tourism: {
    businessType: 'tourism',
    theme: {
      name: 'ExploreAura SkyGlass Explorer',
      primary: '#0284c7', // Sky Blue
      secondary: '#f97316', // Sunset Orange
      accent: '#38bdf8', // Light Blue Accent
      background: '#051026', // Dusk Navy Blue
      textColor: '#f0f9ff', // Sky White
      glassmorphism: true,
      fontFamily: 'Outfit',
      borderRadius: 'xl'
    },
    hero: {
      title: "ExploreAura - SkyGlass Explorer Expeditions",
      subtitle: "Voyage down the white marble gorges under starlit skies. Access customized AI itineraries, evaluate tour costs on our budget planner, and book luxury riverfront stays instantly.",
      ctaText: "Open AI Itinerary",
      ctaLink: "#itinerary",
      bgImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Bhedaghat",
        interactiveEffect: "misty_parallax"
      }
    },
    navigation: {
      logoText: "ExploreAura",
      links: [
        { label: "Sky Canopy", href: "#home" },
        { label: "Expeditions", href: "#dynamic_modules" },
        { label: "Trip Features", href: "#features" },
        { label: "Travel Heritage", href: "#about" },
        { label: "Secure Ticket", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "SkyGlass Travel Perks",
        subtitle: "Adventure packages directed by native historians for uncompromised travel memory creation.",
        visible: true,
        order: 1,
        content: [
          { icon: "🗺️", title: "AI Travel Itinerary", desc: "Construct fully customized weekend travel agendas based on weather telemetry parameters." },
          { icon: "💰", title: "Travel Budget Calculator", desc: "Forecast transit costs, cottage rates, and boating ticket prices in real-time." },
          { icon: "🏨", title: "Luxury Hotel Booking", desc: "Select direct bookings at eco-resorts positioned beautifully near Narmada gorges." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Guardians of the Wilderness",
        subtitle: "About ExploreAura Travels",
        visible: true,
        order: 2,
        content: {
          text: "ExploreAura was launched to highlight Central India's geological wonders. We orchestrate carbon-neutral excursions, Moonlight boat trips in Bhedaghat, and tiger reserve safaris that give back directly to local forest tribes and protect biodiversity.",
          image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 ExploreAura. Voyage through Sanskardhani's nature.",
      socials: [
        { platform: "instagram", url: "#" },
        { platform: "youtube", url: "#" }
      ]
    },
    seo: {
      metaTitle: "ExploreAura - Bhedaghat Boating & Travel Planner",
      metaDescription: "Register for guided Moonlight tours and safaris in Madhya Pradesh with ExploreAura's SkyGlass platform.",
      keywords: ["jabalpur tourism", "exploreaura travel", "moonlight boat bhedaghat"]
    }
  },
  cybersecurity: {
    businessType: 'cybersecurity',
    theme: {
      name: 'ThreatZero Cyber Matrix Glass',
      primary: '#22c55e', // Cyber Matrix Neon Green
      secondary: '#06b6d4', // Cyan Laser
      accent: '#10b981', // Clean Emerald Green
      background: '#020804', // Matrix Obsidian Dark Green-Black
      textColor: '#ecfdf5', // Soft Mint Green White
      glassmorphism: true,
      fontFamily: 'Space Grotesk',
      borderRadius: '2xl'
    },
    hero: {
      title: "ThreatZero - Cyber Matrix Glass Awareness Platform",
      subtitle: "Welcome to the ultimate security shield. Monitor live simulated network attacks, participate in interactive cyber quizzes, read actionable security tips, and keep protocols locked.",
      ctaText: "Open Security Sandbox",
      ctaLink: "#security-hub",
      bgImage: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Madan Mahal Fort",
        interactiveEffect: "electronic_grid"
      }
    },
    navigation: {
      logoText: "ThreatZero",
      links: [
        { label: "Firewall Node", href: "#home" },
        { label: "Security Sandbox", href: "#dynamic_modules" },
        { label: "Shield Perks", href: "#features" },
        { label: "Our Protocol", href: "#about" },
        { label: "Report Incident", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "Cyber Matrix Glass Perks",
        subtitle: "Defense grids engineered to evaluate and protect digital network assets.",
        visible: true,
        order: 1,
        content: [
          { icon: "🛡️", title: "Live Simulated Attack map", desc: "Interact with live simulations displaying simulated network attack blocks caught by modern firewalls." },
          { icon: "🧩", title: "Interactive Security Quizzes", desc: "Test your cybersecurity posture on phishing filters, hash functions, and network security concepts." },
          { icon: "💡", title: "Actionable Security Tips", desc: "Crucial micro-lessons detailing password management, multi-factor setups, and safe browsing behaviors." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Constructing Zero-Trust Grids",
        subtitle: "ThreatZero Mission",
        visible: true,
        order: 2,
        content: {
          text: "ThreatZero was created to protect regional startups and developers against cyber threats. Based in Jabalpur, we develop lightweight security sandboxes, multi-factor plugins, and automated pen-testing APIs to verify operational security.",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 ThreatZero. Keeping digital assets secure.",
      socials: [
        { platform: "github", url: "#" },
        { platform: "twitter", url: "#" }
      ]
    },
    seo: {
      metaTitle: "ThreatZero - Cybersecurity Awareness Platform",
      metaDescription: "Strengthen your digital firewall with ThreatZero's live network attack simulations and quizzes.",
      keywords: ["threatzero cyber awareness", "cybersecurity quiz", "live network simulator MP"]
    }
  },
  career: {
    businessType: 'career',
    theme: {
      name: 'JobSphere FutureHire Glass',
      primary: '#2563eb', // Royal Cobalt Blue
      secondary: '#7c3aed', // Premium Violet Purple
      accent: '#3b82f6', // Soft Electric Blue
      background: '#050714', // Pristine Space Dark Blue
      textColor: '#f5f3ff', // Soft Purple Tint White
      glassmorphism: true,
      fontFamily: 'Space Grotesk',
      borderRadius: '2xl'
    },
    hero: {
      title: "JobSphere - FutureHire Glass Job Portal",
      subtitle: "Welcome to the future of employment in central India. Analyze your resume rating, participate in conversational AI mock interviews, track skill progress, and discover premium internships.",
      ctaText: "Launch Resume Analyzer",
      ctaLink: "#career-sandbox",
      bgImage: "https://images.unsplash.com/photo-1521737711867-e3b904737c88?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Madan Mahal Fort",
        interactiveEffect: "neon_grids"
      }
    },
    navigation: {
      logoText: "JobSphere",
      links: [
        { label: "Career Core", href: "#home" },
        { label: "Placement Sandbox", href: "#dynamic_modules" },
        { label: "JobSphere Perks", href: "#features" },
        { label: "Placement Vision", href: "#about" },
        { label: "Post Internship", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "features",
        type: "features",
        title: "FutureHire Glass Perks",
        subtitle: "Employment discovery assets designed to connect talent with high-margin remote startups.",
        visible: true,
        order: 1,
        content: [
          { icon: "📄", title: "Smart Resume Analyzer", desc: "Upload or copy text to receive instant ratings, keyword densities, and visual suggestion logs." },
          { icon: "🎙️", title: "AI Conversational Mock Interview", desc: "Participate in micro-interviews matching target startup requirements." },
          { icon: "🎯", title: "Dynamic Skill Tracking", desc: "Track certifications, mock project progress, and competitive developer scores." }
        ]
      },
      {
        id: "about",
        type: "about",
        title: "Empowering Sanskardhani's Youth",
        subtitle: "JobSphere Recruitment Vision",
        visible: true,
        order: 2,
        content: {
          text: "JobSphere was launched in Jabalpur to connect regional graduates with high-growth remote startup tech firms. We provide dynamic sandboxes, resume rating engines, and skill tracking systems to help local coders secure top placements.",
          image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop"
        }
      }
    ],
    footer: {
      text: "© 2026 JobSphere. Bridging talent and technology.",
      socials: [
        { platform: "linkedin", url: "#" },
        { platform: "twitter", url: "#" }
      ]
    },
    seo: {
      metaTitle: "JobSphere - AI-Powered Job & Internship Finder",
      metaDescription: "Accelerate your career with JobSphere's resume analyzer, AI interviews, and placement trackers.",
      keywords: ["jobs in jabalpur", "jobsphere career portal", "internships finder MP"]
    }
  }
};
