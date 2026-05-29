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
        { label: "Courses & Mentors", href: "#courses" },
        { label: "Our Story", href: "#about" },
        { label: "Admission Desk", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "courses",
        type: "courses",
        title: "Classroom Programs & Courses",
        subtitle: "Highly targeted preparation structures built for maximum scholastic results.",
        visible: true,
        order: 1,
        content: [
          { id: "jee", name: "IIT-JEE Elite Prep", duration: "2 Years", fees: "₹1,25,000", faculty: "Er. Amit Agrawal (IIT Delhi)", target: "JEE Advanced Aspirants" },
          { id: "neet", name: "NEET Medical Star", duration: "2 Years", fees: "₹1,20,000", faculty: "Dr. Priya Nair (AIIMS Delhi)", target: "Pre-Medical Scholars" },
          { id: "board", name: "Class 11-12 Board Prep", duration: "1 Year", fees: "₹85,000", faculty: "Dr. S. K. Verma (IIT Kanpur)", target: "Board Excellence" }
        ]
      },
      {
        id: "faculty",
        type: "faculty",
        title: "Distinguished Mentors Panel",
        subtitle: "Learn from Sanskardhani's top-tier concepts coaches and Ph.D. scholars.",
        visible: true,
        order: 2,
        content: [
          { name: "Dr. S. K. Verma", subject: "Physics Expert", exp: "15 Yrs Experience", qual: "Ph.D. IIT Kanpur", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
          { name: "Prof. Ritu Kapoor", subject: "Chemistry Expert", exp: "12 Yrs Experience", qual: "M.Sc. BITS Pilani", image: "https://images.unsplash.com/photo-1580894732444-8fecef2271da?q=80&w=400" },
          { name: "Er. Amit Agrawal", subject: "Mathematics Mentor", exp: "10 Yrs Experience", qual: "B.Tech. IIT Delhi", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" }
        ]
      },
      {
        id: "results",
        type: "results",
        title: "Scholastic Ranks & Results",
        subtitle: "Outstanding board achievements and competitive exam milestones.",
        visible: true,
        order: 3,
        content: [
          { number: "AIR 12", label: "JEE Topper 2025", desc: "Aarav Sharma - 99.6% marks" },
          { number: "AIR 28", label: "NEET Medical Topper", desc: "Ananya Patel - 710/720 score" },
          { number: "1500+", label: "Successful IIT/NEET Admits", desc: "Over 8 years of pedagogical trust" }
        ]
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
      title: "Luxury Liquid Couture by Libaas",
      subtitle: "Experience absolute wardrobe elegance. Explore highly animated product catalogs, interactive wishlist caches, AI-driven style suggestions, and a smart, seamless glass checkout gateway.",
      ctaText: "Browse Couture",
      ctaLink: "#products",
      bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Narmada River",
        interactiveEffect: "canvas_ripples"
      }
    },
    navigation: {
      logoText: "Libaas",
      links: [
        { label: "Couture Collections", href: "#home" },
        { label: "Our Products", href: "#products" },
        { label: "Active Offers", href: "#offers" },
        { label: "Contact Us", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "products",
        type: "products",
        title: "Exclusive Wardrobe Couture",
        subtitle: "Discover modern traditional fusions woven with absolute craftsmanship.",
        visible: true,
        order: 1,
        content: [
          { id: "p1", name: "Royal Banarasi Silk Sherwani", price: "₹45,000", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800", rating: "4.9" },
          { id: "p2", name: "Premium Organza Silk Lehenga", price: "₹85,000", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800", rating: "5.0" },
          { id: "p3", name: "Handcrafted Lucknowi Kurta Set", price: "₹18,500", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800", rating: "4.8" }
        ]
      },
      {
        id: "offers",
        type: "offers",
        title: "Seasonal Couture Events",
        subtitle: "Claim luxury promo nodes and secure direct artisan booking options.",
        visible: true,
        order: 2,
        content: [
          { promo: "SILK30", discount: "30% OFF", desc: "Flat 30% discount on Banarasi Couture collections.", code: "NEXUSSILK30" },
          { promo: "FESTIVE15", discount: "15% OFF", desc: "Artisan weavers special festive discount.", code: "NEXUSFESTIVE" }
        ]
      },
      {
        id: "categories",
        type: "categories",
        title: "Curated Couture Categories",
        subtitle: "Explore highly-premium luxury segments for special occasions.",
        visible: true,
        order: 3,
        content: [
          { name: "Sherwani Collections", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400", count: "12 Designs" },
          { name: "Silk Couture Lehengas", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400", count: "8 Designs" },
          { name: "Kurtas & Tunics", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400", count: "24 Designs" }
        ]
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
      subtitle: "Discover high-premium houses, custom plots, and modern duplexes nearTilwara Ghat and Narmada river coordinates. Explore simulated virtual 3D tours and schedule consulting sessions instantly.",
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
        { label: "Properties Grid", href: "#properties" },
        { label: "Key Regions", href: "#regions" },
        { label: "Consult Agent", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "properties",
        type: "properties",
        title: "Elite Gated Properties",
        subtitle: "Luxury buying engineered with absolute digital transparency and riverfront sights.",
        visible: true,
        order: 1,
        content: [
          { id: "r1", name: "Tilwara Riverfront Duplex", price: "₹1.4 Crore", type: "Duplex Villa", size: "4 BHK - 3200 sqft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800" },
          { id: "r2", name: "Vijay Nagar Penthouse Suite", price: "₹95 Lakhs", type: "Penthouse", size: "3 BHK - 2400 sqft", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800" },
          { id: "r3", name: "Bhedaghat Bypass Green Acres", price: "₹65 Lakhs", type: "Plot Complex", size: "1800 sqft plot", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800" }
        ]
      },
      {
        id: "regions",
        type: "regions",
        title: "Key Jabalpur Regions",
        subtitle: "Select your target neighborhood with active growth indices.",
        visible: true,
        order: 2,
        content: [
          { name: "Tilwara Ghat Sector", desc: "Serene riverfront views, close to green bypass networks.", growth: "+14% Annual" },
          { name: "Vijay Nagar Hub", desc: "Commercial core with active metro routes and shopping nodes.", growth: "+18% Annual" },
          { name: "Bhedaghat Bypass", desc: "Pristine nature coordinates, excellent for premium resorts.", growth: "+11% Annual" }
        ]
      },
      {
        id: "agents",
        type: "agents",
        title: "Elite Developers Panel",
        subtitle: "Meet our professional advisors waiting to manage your investment logs.",
        visible: true,
        order: 3,
        content: [
          { name: "Megha Choudhary", role: "Chief Executive Agent", exp: "10 Yrs Experience", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
          { name: "Ramesh Patel", role: "Senior Land Coordinator", exp: "14 Yrs Experience", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" }
        ]
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
      ctaLink: "#dynamic_modules",
      bgImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Tilwara Ghat",
        interactiveEffect: "electronic_grid"
      }
    },
    navigation: {
      logoText: "AarogyaCare",
      links: [
        { label: "Care Gateway", href: "#home" },
        { label: "Clinical Booking", href: "#dynamic_modules" },
        { label: "Frost Services", href: "#services" },
        { label: "Our Doctors", href: "#doctors" }
      ]
    },
    sections: [
      {
        id: "services",
        type: "services",
        title: " Frost Clinical Specialities",
        subtitle: "Specialized diagnostics and surgeries delivered with high efficiency.",
        visible: true,
        order: 1,
        content: [
          { icon: "🩺", name: "Cardiology & Surgery", desc: "Advanced cardiac diagnostics, bypass simulations, and structural health logs." },
          { icon: "🔬", name: "Full Body MRI Diagnostics", desc: "High-resolution full-body scan telemetry with quick laboratory report vaults." },
          { icon: "🚑", name: "Emergency Dispatch 24/7", desc: "Direct GPS ambulance dispatch tracking across Jabalpur municipal zones." }
        ]
      },
      {
        id: "doctors",
        type: "doctors",
        title: "Distinguished Physicians",
        subtitle: "Meet our board-certified medical personnel ready to evaluate your care logs.",
        visible: true,
        order: 2,
        content: [
          { name: "Dr. Priya Nair", specialty: "MD Cardiology", exp: "12 Yrs Exp", qual: "AIIMS Delhi Scholar", image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=400" },
          { name: "Dr. S. K. Verma", specialty: "Senior Pathologist", exp: "18 Yrs Exp", qual: "Ph.D. IIT Kanpur Bio-Sci", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" }
        ]
      },
      {
        id: "appointments",
        type: "appointments",
        title: "Active Appointment Checkpoint",
        subtitle: "Direct schedule portal for instant outpatient token allocation.",
        visible: true,
        order: 3,
        content: [
          { time: "09:00 AM - 12:00 PM", status: "AVAILABLE", slots: "4 Slots left" },
          { time: "02:00 PM - 05:00 PM", status: "LIMITED", slots: "1 Slot left" },
          { time: "06:00 PM - 08:00 PM", status: "FULL", slots: "0 Slots left" }
        ]
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
      ctaLink: "#dynamic_modules",
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
        { label: "Our Menu", href: "#menu" },
        { label: "Acoustic Nights", href: "#gigs" },
        { label: "Dine In", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "menu",
        type: "menu",
        title: "Artisanal Coffee & Bakeries",
        subtitle: "Single-origin beans roasted in Sanskardhani daily.",
        visible: true,
        order: 1,
        content: [
          { name: "Single-Origin Pour Over", price: "₹280", category: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400" },
          { name: "Organic Spiced Cardamom Chai", price: "₹180", category: "Tea", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400" },
          { name: "Gourmet Lava Fudge Shell", price: "₹340", category: "Bakery", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400" }
        ]
      },
      {
        id: "gigs",
        type: "gigs",
        title: "Moonlight Acoustic Gigs",
        subtitle: "Relax with live unplugged rhythms by regional Jabalpur artists.",
        visible: true,
        order: 2,
        content: [
          { name: "Sufi Fusion Night", date: "Friday Evening", timing: "07:30 PM", artist: "Sanskardhani Swar Group" },
          { name: "Unplugged Acoustic Hits", date: "Saturday Night", timing: "08:00 PM", artist: "Er. Amit & Friends" }
        ]
      },
      {
        id: "gallery",
        type: "gallery",
        title: "Glass Lounge Gallery",
        subtitle: "Pristine visual spaces tailored for deep conceptual work.",
        visible: true,
        order: 3,
        content: [
          { caption: "Bhedaghat Riverside Balcony", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400" },
          { caption: "Artisanal Espresso Deck", image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400" }
        ]
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
      ctaLink: "#dynamic_modules",
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
        { label: "Incubator Tracks", href: "#programs" },
        { label: "Advisors Panel", href: "#mentors" },
        { label: "Collab Terminal", href: "#contact" }
      ]
    },
    sections: [
      {
        id: "programs",
        type: "programs",
        title: "Startup Accelerator Programs",
        subtitle: "Accelerating local Jabalpur SaaS nodes into global enterprises.",
        visible: true,
        order: 1,
        content: [
          { name: "Incubation cohort 2026", duration: "6 Months", equity: "3% Commitment", cap: "10 Startups limit" },
          { name: "VC Seed Pitch Day", duration: "1 Day Track", equity: "None", cap: "Direct Investor access" }
        ]
      },
      {
        id: "mentors",
        type: "mentors",
        title: "Seasoned Tech Advisors",
        subtitle: "Learn directly from programmers and venture capitalists.",
        visible: true,
        order: 2,
        content: [
          { name: "Er. Amit Agrawal", role: "Distributed Systems Lead", exp: "15 Yrs Experience", qual: "B.Tech. IIT Delhi" },
          { name: "Megha Choudhary", role: "Venture Deal Partner", exp: "10 Yrs Experience", qual: "MBA Wharton" }
        ]
      },
      {
        id: "showcase",
        type: "showcase",
        title: "Sanskardhani Showcase",
        subtitle: "Active dynamic SaaS applications compiled on our edge cloud.",
        visible: true,
        order: 3,
        content: [
          { company: "ThreatZero security", slogan: "Mitigating cyber hacks.", status: "LIVE ON EDGE" },
          { company: "NextRank Academy", slogan: "Conceptual RFID education.", status: "ACTIVE SEED" }
        ]
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
      ctaLink: "#dynamic_modules",
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
        { label: "Workout Tracks", href: "#workouts" },
        { label: "Elite Coaches", href: "#trainers" },
        { label: "Memberships", href: "#plans" }
      ]
    },
    sections: [
      {
        id: "workouts",
        type: "workouts",
        title: "Targeted Athletic Workouts",
        subtitle: "Power glass training plans customized to break physical targets.",
        visible: true,
        order: 1,
        content: [
          { name: "Powerlifting Hypertrophy", frequency: "4 Days/Wk", focus: "Barbell Squat / Bench / Deadlift", load: "High Intensity" },
          { name: "Conditioning & Agility", frequency: "3 Days/Wk", focus: "Sprint intervals & Kettlebell load", load: "Moderate Intensity" }
        ]
      },
      {
        id: "trainers",
        type: "trainers",
        title: "Elite Coaching Roster",
        subtitle: "Work directly under certified biomechanics specialists.",
        visible: true,
        order: 2,
        content: [
          { name: "Vikram Singh", role: "Head Biomechanics Coach", exp: "12 Yrs Coach", certs: "IPF Powerlifter AIR 5" },
          { name: "Riya Sen", role: "Calisthenics Lead", exp: "8 Yrs Coach", certs: "Advanced Gymnast Expert" }
        ]
      },
      {
        id: "plans",
        type: "plans",
        title: "Flexible Arena Memberships",
        subtitle: "Select your tier and unlock our premium iron facility.",
        visible: true,
        order: 3,
        content: [
          { tier: "Silver Pass", price: "₹1,500/Mo", perks: "Gym floor access, RFID lock room" },
          { tier: "Gold Premium", price: "₹2,500/Mo", perks: "Gym floor, 2 personal training sessions/Mo" },
          { tier: "Platinum Elite", price: "₹4,500/Mo", perks: "Unlimited coaching, customized pre-workouts" }
        ]
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
      subtitle: "Voyage down the white marble gorges under starlit skies in Bhedaghat. Access customized AI itineraries, evaluate tour costs on our budget planner, and book luxury riverfront stays instantly.",
      ctaText: "Open Travel Console",
      ctaLink: "#dynamic_modules",
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
        { label: "Trip Packages", href: "#packages" },
        { label: "Riverside Stays", href: "#stays" },
        { label: "Itineraries", href: "#itineraries" }
      ]
    },
    sections: [
      {
        id: "packages",
        type: "packages",
        title: "Marble Gorges Expeditions",
        subtitle: "Adventure trips directed by native Bhedaghat historians.",
        visible: true,
        order: 1,
        content: [
          { name: "Moonlight Boat Boating Trip", price: "₹800/Person", timing: "06:00 PM - 09:00 PM", highlight: "Full Moon gorges reflection" },
          { name: "Kanha Tiger Reserve Safari", price: "₹4,200/Jeep", timing: "05:00 AM Departure", highlight: "Spotting wild tigers" }
        ]
      },
      {
        id: "stays",
        type: "stays",
        title: "SkyGlass Luxury Stays",
        subtitle: "Reserve carbon-neutral eco-cottages overlooking the Tilwara River gorges.",
        visible: true,
        order: 2,
        content: [
          { hotel: "SkyGlass Riverside Cottage", rate: "₹4,500/Night", location: "Tilwara Ghat Bypass", rating: "4.9 Stars" },
          { hotel: "Marble Rocks Sunset Cabin", rate: "₹3,800/Night", location: "Bhedaghat Gorges Edge", rating: "4.8 Stars" }
        ]
      },
      {
        id: "itineraries",
        type: "itineraries",
        title: "Active AI Travel Itineraries",
        subtitle: "Pre-planned conceptual travel grids suited to local Jabalpur weather.",
        visible: true,
        order: 3,
        content: [
          { title: "1-Day Bhedaghat Special", route: "Marble Rocks boating -> Dhuandhar Falls -> Tilwara Lunch", duration: "10 Hours" },
          { title: "2-Day Jabalpur Heritage", route: "Madan Mahal Fort -> Balancing Rocks -> Tilwara Ghat -> Bhedaghat Sunset", duration: "36 Hours" }
        ]
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
      title: "ThreatZero - Cyber Matrix Glass Shield",
      subtitle: "Welcome to the ultimate security shield. Monitor live simulated network attacks, participate in interactive cyber quizzes, read actionable security tips, and keep protocols locked.",
      ctaText: "Open Security Sandbox",
      ctaLink: "#dynamic_modules",
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
        { label: "Interactive Quizzes", href: "#quizzes" },
        { label: "Security Tips", href: "#tips" },
        { label: "Threat Simulator", href: "#dynamic_modules" }
      ]
    },
    sections: [
      {
        id: "quizzes",
        type: "quizzes",
        title: "Interactive Security Quizzes",
        subtitle: "Audit your network hygiene and phish filtering concepts.",
        visible: true,
        order: 1,
        content: [
          { q: "What is salt encryption coordinates?", options: ["Random strings added to hash", "A password database bypass", "Network load balancer key"], correct: 0 },
          { q: "How does DDoS attack manifest on API?", options: ["Extreme request concurrency packet overload", "Database SQL code injections", " RFID check-in leaks"], correct: 0 }
        ]
      },
      {
        id: "tips",
        type: "tips",
        title: "Actionable Security Tips",
        subtitle: "Zero-Trust lessons configured to keep server assets firewalled.",
        visible: true,
        order: 2,
        content: [
          { title: "Enforce Factor-10 password salts", desc: "Audit and enforce random alphanumeric salts before storing hashes in JSON fallback desks." },
          { title: "Route traffic through edge firewalls", desc: "Filter concurrent request pipelines near Tilwara and Bhedaghat edge servers." }
        ]
      },
      {
        id: "threats",
        type: "threats",
        title: "Active Threat Simulation Logs",
        subtitle: "Realtime network intrusion attempts mitigated by ThreatZero matrix.",
        visible: true,
        order: 3,
        content: [
          { time: "10:42 AM", threat: "Brute Force SSH Attack", source: "IP 182.28.12.92", action: "BLOCKED" },
          { time: "10:45 AM", threat: "SQL Injection query", source: "IP 45.82.91.82", action: "MITIGATED" }
        ]
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
      ctaLink: "#dynamic_modules",
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
        { label: "Internship Postings", href: "#internships" },
        { label: "Skill Tracks", href: "#skills" },
        { label: "Success Stories", href: "#success" }
      ]
    },
    sections: [
      {
        id: "internships",
        type: "internships",
        title: "Active Remote Internships",
        subtitle: "Connect with high-margin technology startups looking for Sanskardhani talent.",
        visible: true,
        order: 1,
        content: [
          { id: "i1", title: "AI Agent Orchestrator Intern", stipend: "₹25,000/Mo", company: "SmartEngine AI", location: "Remote - MP" },
          { id: "i2", title: "Cybermatrix Defense Operator", stipend: "₹22,000/Mo", company: "ThreatZero Security", location: "Hybrid - Jabalpur" },
          { id: "i3", title: "Luxury Commerce Frontend Lead", stipend: "₹30,000/Mo", company: "Libaas Clothing", location: "Remote" }
        ]
      },
      {
        id: "skills",
        type: "skills",
        title: "Target Skill Track Index",
        subtitle: "Audit certifications required to pass the AI Mock Interview desk.",
        visible: true,
        order: 2,
        content: [
          { name: "MERN Stack Compilation", duration: "12 Modules", level: "Intermediate" },
          { name: "Vector Database Analytics", duration: "8 Modules", level: "Advanced" }
        ]
      },
      {
        id: "success",
        type: "success",
        title: "Placement Success Ledger",
        subtitle: "Sanskardhani graduates placed in global startup nodes.",
        visible: true,
        order: 3,
        content: [
          { student: "Ramesh Patel", placed: "ThreatZero security", package: "₹12 Lakhs LPA", feedback: "Mock interviews prepared me perfectly for tech rounds!" },
          { student: "Ananya Patel", placed: "SmartEngine AI", package: "₹18 Lakhs LPA", feedback: "Resume rating index saved my time!" }
        ]
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
  },
  smartengine: {
    businessType: 'smartengine',
    theme: {
      name: 'SmartEngine AI flagship',
      primary: '#6366f1', // Neon Blue/Indigo
      secondary: '#a855f7', // Neon Purple
      accent: '#00f5ff', // Neon Cyan
      background: '#030014', // Extreme Deep Tech Obsidian Black
      textColor: '#f1f5f9', // Silver White
      glassmorphism: true,
      fontFamily: 'Space Grotesk',
      borderRadius: '2xl'
    },
    hero: {
      title: "SmartEngine AI Flagship Console",
      subtitle: "The world-class autonomous AI engineering ecosystem. Spin up self-optimizing server microservices, orchestrate intelligent LLM agent swarms, and visual real-time vector logs with microsecond execution speeds.",
      ctaText: "Launch Command console",
      ctaLink: "#dynamic_modules",
      bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
      jabalpurBranding: {
        landmark: "Marble Gorges",
        interactiveEffect: "electric_grid"
      }
    },
    navigation: {
      logoText: "SmartEngine",
      links: [
        { label: "AI Console", href: "#home" },
        { label: "Autonomous telemetry", href: "#analytics" },
        { label: "Agent Swarms", href: "#workflows" }
      ]
    },
    sections: [
      {
        id: "analytics",
        type: "analytics",
        title: "Autonomous Agent Telemetry",
        subtitle: "Edge latency and token computations mapped across local servers.",
        visible: true,
        order: 1,
        content: [
          { label: "Tilwara Edge Node", load: "42% CPU Load", activeAgents: "12 swarms active" },
          { label: "Bhedaghat Core Processor", load: "18% CPU Load", activeAgents: "8 swarms active" }
        ]
      },
      {
        id: "workflows",
        type: "workflows",
        title: "Active AI Swarm Workflows",
        subtitle: "Self-healing distributed microservices running pen-tests and code refactors.",
        visible: true,
        order: 2,
        content: [
          { task: "Auto-audit Bcrypt Salts", efficiency: "99.8% Perfect", uptime: "99.99% Uptime" },
          { task: "Vector Database tuning", efficiency: "94.2% Match Index", uptime: "100% Uptime" }
        ]
      }
    ],
    footer: {
      text: "© 2026 SmartEngine. Orchestrating dynamic MERN ecosystems.",
      socials: [
        { platform: "youtube", url: "#" },
        { platform: "instagram", url: "#" }
      ]
    },
    seo: {
      metaTitle: "SmartEngine - Autonomous MERN Portal Engine",
      metaDescription: "Centralized dynamic portal generator powered by MERN.",
      keywords: ["smartengine MERN", "autonomous SaaS MP"]
    }
  }
};
