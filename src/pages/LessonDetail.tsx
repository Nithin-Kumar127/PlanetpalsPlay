import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, X, Lightbulb, Award, ChevronLeft, ChevronRight, BookOpen, Brain, Target, Zap, Globe, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface LessonCard {
  id: number;
  type: 'concept' | 'example' | 'analogy' | 'quiz';
  title: string;
  content: string;
  points?: string[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  icon: any;
}

interface Lesson {
  id: string;
  title: string;
  difficulty: string;
  xp: number;
  description: string;
  cards: LessonCard[];
}

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [cardProgress, setCardProgress] = useState<boolean[]>([]);

  const lessons: Record<string, Lesson> = {
    // CLIMATE BASICS LESSONS (1-5)
    "1": {
      id: "1",
      title: "What is Climate Change?",
      difficulty: "Easy",
      xp: 50,
      description: "Understanding the basics of climate change and its causes",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Climate vs Weather',
          content: 'Climate change refers to long-term shifts in temperatures and weather patterns on Earth. Understanding the difference between weather and climate is crucial.',
          points: [
            'Weather is what you experience day-to-day (rain, sunshine, snow)',
            'Climate is the average weather over 30+ years',
            'Weather changes daily, climate changes over decades',
            'Current climate change is happening faster than natural changes'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'analogy',
          title: 'Weather vs Climate Analogy',
          content: 'Think of weather and climate like your daily outfit versus your entire wardrobe.',
          points: [
            'Weather = The outfit you choose today (short-term)',
            'Climate = Your entire wardrobe collection (long-term)',
            'One rainy day doesn\'t change the climate',
            'Just like one outfit doesn\'t define your style'
          ],
          icon: Lightbulb
        },
        {
          id: 3,
          type: 'concept',
          title: 'Main Causes',
          content: 'Human activities have become the primary driver of climate change since the 1800s.',
          points: [
            'Burning fossil fuels (coal, oil, gas) for energy',
            'Deforestation reducing CO2 absorption',
            'Industrial processes releasing greenhouse gases',
            'Agriculture and livestock producing methane'
          ],
          icon: Target
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Test Your Knowledge',
          content: 'Let\'s check your understanding of climate change basics.',
          quiz: {
            question: 'What is the main difference between weather and climate?',
            options: [
              'There is no difference between them',
              'Weather is long-term, climate is short-term',
              'Climate is the long-term average of weather patterns',
              'Weather only happens in winter'
            ],
            correct: 2,
            explanation: 'Climate is indeed the long-term average of weather patterns, typically measured over 30 years or more, while weather refers to short-term atmospheric conditions.'
          },
          icon: Brain
        }
      ]
    },
    "2": {
      id: "2",
      title: "The Greenhouse Effect",
      difficulty: "Easy",
      xp: 75,
      description: "Learn how greenhouse gases trap heat in our atmosphere",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'How the Greenhouse Effect Works',
          content: 'The greenhouse effect is a natural process that warms Earth\'s surface and makes life possible.',
          points: [
            'Sunlight enters our atmosphere and reaches Earth',
            'Earth\'s surface absorbs energy and warms up',
            'Warm Earth radiates heat back toward space',
            'Greenhouse gases trap some heat, warming the atmosphere'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'analogy',
          title: 'The Car Window Analogy',
          content: 'The greenhouse effect works like a car parked in the sun.',
          points: [
            'Sun\'s rays enter through car windows (atmosphere)',
            'Interior surfaces absorb the heat and warm up',
            'Heat gets trapped inside the car',
            'Car becomes much hotter than outside temperature'
          ],
          icon: Lightbulb
        },
        {
          id: 3,
          type: 'concept',
          title: 'Key Greenhouse Gases',
          content: 'Different gases contribute to the greenhouse effect in various ways.',
          points: [
            'Carbon Dioxide (CO₂) - Primary gas from human activities',
            'Methane (CH₄) - More potent, from agriculture and leaks',
            'Water Vapor (H₂O) - Most abundant, acts as feedback',
            'Nitrous Oxide (N₂O) - From fertilizers and fossil fuels'
          ],
          icon: Target
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Greenhouse Effect Quiz',
          content: 'Test your understanding of the greenhouse effect.',
          quiz: {
            question: 'Is the natural greenhouse effect harmful to Earth?',
            options: [
              'Yes, it\'s always harmful to the environment',
              'No, it\'s essential for keeping Earth warm enough for life',
              'It only became harmful when humans appeared',
              'It only affects the polar ice caps'
            ],
            correct: 1,
            explanation: 'The natural greenhouse effect is essential for life on Earth! Without it, our planet would be too cold to support most life forms. The problem is the enhanced greenhouse effect from human activities.'
          },
          icon: Brain
        }
      ]
    },
    "3": {
      id: "3",
      title: "Carbon Footprint Basics",
      difficulty: "Medium",
      xp: 100,
      description: "Understanding your personal impact on climate change",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What is a Carbon Footprint?',
          content: 'A carbon footprint measures the total greenhouse gases generated by your actions.',
          points: [
            'Includes all greenhouse gases, not just CO₂',
            'Measured in CO₂ equivalent units',
            'Covers both direct and indirect emissions',
            'Helps identify areas for improvement'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Direct vs Indirect Emissions',
          content: 'Understanding the two types of emissions in your carbon footprint.',
          points: [
            'Direct: Emissions you control (car exhaust, home heating)',
            'Indirect: Emissions from products/services you use',
            'Indirect often larger than direct emissions',
            'Both types matter for total impact'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Main Footprint Components',
          content: 'The biggest contributors to your personal carbon footprint.',
          points: [
            'Home Energy: Electricity, heating, cooling (25-30%)',
            'Transportation: Cars, flights, public transport (20-25%)',
            'Food: Production, processing, transport (15-20%)',
            'Consumption: Goods, services, manufacturing (20-25%)'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Carbon Footprint Quiz',
          content: 'Test your knowledge about carbon footprints.',
          quiz: {
            question: 'The emissions from the power plant generating your electricity are:',
            options: [
              'Direct emissions from your activities',
              'Indirect emissions from your electricity use',
              'Not part of your carbon footprint',
              'Only counted if you own the power plant'
            ],
            correct: 1,
            explanation: 'These are indirect emissions because while you don\'t directly control the power plant, your electricity consumption drives the demand for power generation.'
          },
          icon: Brain
        }
      ]
    },
    "4": {
      id: "4",
      title: "Global Temperature Trends",
      difficulty: "Medium",
      xp: 125,
      description: "Understanding how scientists measure and track global temperature changes",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'How We Measure Global Temperature',
          content: 'Scientists use a global network of instruments to track Earth\'s temperature with remarkable precision.',
          points: [
            'Weather stations on land measure air temperature daily',
            'Ocean buoys and ships measure sea surface temperatures',
            'Satellites provide global coverage from space',
            'Data is combined to calculate global average temperature'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Understanding Proxy Data',
          content: 'To understand past climates, scientists use indirect evidence called proxy data.',
          points: [
            'Ice cores from glaciers contain ancient atmospheric gases',
            'Tree rings show growth patterns affected by temperature',
            'Coral reefs record ocean temperature in their structure',
            'Sediment layers preserve climate information over millennia'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'The Temperature Record',
          content: 'The data shows clear evidence of unprecedented warming in recent decades.',
          points: [
            'Global average temperature has risen 1.1°C since late 1800s',
            'The last decade was the warmest on record',
            '19 of the 20 warmest years have occurred since 2000',
            'Warming rate has accelerated: 0.18°C per decade since 1981'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'concept',
          title: 'The Keeling Curve',
          content: 'This famous graph tracks atmospheric CO₂ levels since 1958, showing the direct link to temperature.',
          points: [
            'Shows steady increase in atmospheric CO₂ concentration',
            'Seasonal "sawtooth" pattern from plant growth cycles',
            'CO₂ levels have risen from 315 ppm to over 420 ppm',
            'Directly correlates with global temperature increases'
          ],
          icon: Target
        },
        {
          id: 5,
          type: 'quiz',
          title: 'Temperature Trends Quiz',
          content: 'Test your understanding of global temperature measurement and trends.',
          quiz: {
            question: 'What does "proxy data" like ice cores help scientists understand?',
            options: [
              'Predict next week\'s weather forecast',
              'Understand what climate was like thousands of years ago',
              'Measure today\'s exact ocean temperature',
              'Control current atmospheric conditions'
            ],
            correct: 1,
            explanation: 'Proxy data like ice cores, tree rings, and coral reefs help scientists reconstruct past climates, giving us a long-term perspective on current climate change that extends far beyond our modern instrument records.'
          },
          icon: Brain
        }
      ]
    },
    "5": {
      id: "5",
      title: "Ice Caps and Sea Levels",
      difficulty: "Hard",
      xp: 150,
      description: "Learn how melting ice and thermal expansion cause sea level rise",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Two Main Causes of Sea Level Rise',
          content: 'Rising sea levels result from two primary physical processes caused by global warming.',
          points: [
            'Thermal expansion: Warmer water takes up more space',
            'Melting land ice: Glaciers and ice sheets add water to oceans',
            'Thermal expansion accounts for about 50% of current rise',
            'Ice melt contribution is accelerating as warming continues'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'analogy',
          title: 'Land Ice vs Sea Ice',
          content: 'Understanding the difference between land ice and sea ice is crucial for sea level impacts.',
          points: [
            'Land ice = Ice cubes on a table that fall into your glass',
            'Sea ice = Ice cubes already floating in your glass',
            'When land ice melts, it adds new water (raises sea level)',
            'When sea ice melts, water level stays the same (Archimedes\' Principle)'
          ],
          icon: Lightbulb
        },
        {
          id: 3,
          type: 'concept',
          title: 'The Albedo Effect Feedback Loop',
          content: 'Ice loss creates a dangerous positive feedback loop that accelerates warming.',
          points: [
            'Ice is white and reflects sunlight back to space (high albedo)',
            'Dark ocean/land absorbs more heat (low albedo)',
            'Less ice → more absorption → more warming → less ice',
            'This feedback loop accelerates both warming and ice loss'
          ],
          icon: Target
        },
        {
          id: 4,
          type: 'example',
          title: 'Real-World Impacts',
          content: 'Sea level rise is already affecting communities and ecosystems worldwide.',
          points: [
            'Global sea level has risen 21-24 cm since 1880',
            'Current rate: 3.3 mm per year and accelerating',
            'Coastal flooding during high tides and storms increases',
            'Small island nations face existential threats'
          ],
          icon: Lightbulb
        },
        {
          id: 5,
          type: 'quiz',
          title: 'Sea Level Rise Quiz',
          content: 'Test your knowledge about ice caps and sea level rise.',
          quiz: {
            question: 'Which contributes MORE to current sea level rise?',
            options: [
              'Melting Arctic sea ice floating in the ocean',
              'Thermal expansion of warming ocean water',
              'Increased rainfall over the oceans',
              'Underwater volcanic activity'
            ],
            correct: 1,
            explanation: 'Thermal expansion of warming ocean water is currently the largest single contributor to sea level rise, accounting for about 50% of the total rise. As water warms, it expands and takes up more space.'
          },
          icon: Brain
        }
      ]
    },

    // RENEWABLE ENERGY LESSONS (6-10)
    "6": {
      id: "6",
      title: "Solar Power Fundamentals",
      difficulty: "Easy",
      xp: 75,
      description: "How solar panels convert sunlight into electricity",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'How Solar Panels Work',
          content: 'Solar panels use the photovoltaic effect to convert sunlight directly into electricity.',
          points: [
            'Solar cells are made of silicon, a semiconductor material',
            'When sunlight hits the cell, it knocks electrons loose',
            'This creates an electric current (DC electricity)',
            'An inverter converts DC to AC for home use'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'analogy',
          title: 'Solar Cells Like Leaves',
          content: 'Solar panels work similarly to how plants capture sunlight.',
          points: [
            'Plants use chlorophyll to capture sunlight for photosynthesis',
            'Solar cells use silicon to capture sunlight for electricity',
            'Both convert light energy into usable energy',
            'Both are more efficient with direct sunlight'
          ],
          icon: Lightbulb
        },
        {
          id: 3,
          type: 'example',
          title: 'Types of Solar Technology',
          content: 'Different solar technologies serve different purposes.',
          points: [
            'Photovoltaic (PV): Converts light directly to electricity',
            'Solar thermal: Uses sun\'s heat to warm water',
            'Concentrated solar power: Uses mirrors to focus sunlight',
            'Solar calculators: Small PV cells for low-power devices'
          ],
          icon: Zap
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Solar Power Quiz',
          content: 'Test your understanding of solar energy.',
          quiz: {
            question: 'What is the photovoltaic effect?',
            options: [
              'Using mirrors to concentrate sunlight',
              'Converting sunlight directly into electricity',
              'Heating water with solar energy',
              'Storing solar energy in batteries'
            ],
            correct: 1,
            explanation: 'The photovoltaic effect is the process where certain materials (like silicon) generate electricity when exposed to light. This is how solar panels work!'
          },
          icon: Brain
        }
      ]
    },
    "7": {
      id: "7",
      title: "Wind Energy Systems",
      difficulty: "Medium",
      xp: 100,
      description: "Understanding how wind turbines generate clean electricity",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'How Wind Turbines Work',
          content: 'Wind turbines convert the kinetic energy of moving air into electrical energy.',
          points: [
            'Wind turns the large rotor blades (aerodynamic lift)',
            'Rotor connects to a gearbox that increases rotation speed',
            'High-speed rotation drives an electrical generator',
            'Transformer converts electricity to grid voltage'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Wind Turbine Components',
          content: 'Modern wind turbines are sophisticated machines with many parts.',
          points: [
            'Rotor blades: Capture wind energy (usually 3 blades)',
            'Nacelle: Houses gearbox, generator, and controls',
            'Tower: Elevates turbine to catch stronger winds',
            'Foundation: Anchors the entire structure safely'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Wind Farm Benefits',
          content: 'Wind farms provide multiple advantages for communities and environment.',
          points: [
            'Clean electricity with no fuel costs',
            'Land can still be used for farming underneath',
            'Creates jobs in manufacturing and maintenance',
            'Reduces dependence on fossil fuel imports'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Wind Energy Quiz',
          content: 'Test your knowledge about wind power.',
          quiz: {
            question: 'Why do most wind turbines have exactly 3 blades?',
            options: [
              'It\'s the cheapest option to manufacture',
              'Three blades provide the best balance of efficiency and stability',
              'More blades would be too heavy',
              'It\'s just a design tradition'
            ],
            correct: 1,
            explanation: 'Three blades provide the optimal balance between energy capture efficiency, structural stability, and cost. Fewer blades are less efficient, while more blades create turbulence and add unnecessary weight and cost.'
          },
          icon: Brain
        }
      ]
    },
    "8": {
      id: "8",
      title: "Hydroelectric Power",
      difficulty: "Medium",
      xp: 125,
      description: "How flowing water generates renewable electricity",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'How Hydroelectric Dams Work',
          content: 'Hydroelectric power harnesses the energy of flowing water to generate electricity.',
          points: [
            'Dam creates a reservoir, storing water at high elevation',
            'Water flows through intake into penstock (large pipe)',
            'High-pressure water spins turbine blades',
            'Turbine drives generator to produce electricity'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Types of Hydroelectric Systems',
          content: 'Different hydroelectric systems work in various environments.',
          points: [
            'Large dams: Major rivers, high power output',
            'Run-of-river: Small diversions, minimal environmental impact',
            'Pumped storage: Acts like a giant battery for the grid',
            'Micro-hydro: Small streams, local community power'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Hydroelectric Advantages',
          content: 'Hydroelectric power offers unique benefits among renewable sources.',
          points: [
            'Very long lifespan: Dams can operate for 50-100+ years',
            'Reliable power: Water flow is more predictable than wind/sun',
            'Flood control: Dams help manage seasonal flooding',
            'Recreation: Reservoirs provide boating, fishing opportunities'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Hydroelectric Quiz',
          content: 'Test your understanding of hydroelectric power.',
          quiz: {
            question: 'What is "pumped storage" hydroelectricity?',
            options: [
              'Pumping water uphill when electricity is cheap, generating power when needed',
              'Using pumps to increase water pressure in the penstock',
              'Storing electricity directly in water molecules',
              'Pumping water from one reservoir to another'
            ],
            correct: 0,
            explanation: 'Pumped storage acts like a giant battery. When electricity demand is low (and cheap), excess power pumps water uphill to an upper reservoir. When demand is high, water flows back down through generators, producing electricity on demand.'
          },
          icon: Brain
        }
      ]
    },
    "9": {
      id: "9",
      title: "Geothermal Energy",
      difficulty: "Hard",
      xp: 150,
      description: "Tapping into Earth's internal heat for clean energy",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Earth\'s Internal Heat',
          content: 'Geothermal energy comes from the natural heat stored inside our planet.',
          points: [
            'Earth\'s core temperature: over 5,000°C (hotter than sun\'s surface)',
            'Heat comes from radioactive decay and leftover formation energy',
            'Geothermal gradient: temperature increases with depth',
            'Some areas have heat closer to surface (hot springs, geysers)'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Geothermal Power Plants',
          content: 'Different types of geothermal plants work with different underground conditions.',
          points: [
            'Dry steam: Direct use of underground steam (rare)',
            'Flash steam: Hot water flashes to steam at surface',
            'Binary cycle: Heat transfer fluid with lower boiling point',
            'Enhanced systems: Inject water into hot dry rock'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Geothermal Applications',
          content: 'Geothermal energy has many uses beyond electricity generation.',
          points: [
            'Electricity generation: Large power plants',
            'Direct heating: Buildings, greenhouses, aquaculture',
            'Heat pumps: Efficient heating/cooling for homes',
            'Industrial processes: Food drying, mineral extraction'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Geothermal Quiz',
          content: 'Test your knowledge about geothermal energy.',
          quiz: {
            question: 'Why is geothermal energy considered "baseload" power?',
            options: [
              'It only works during the day',
              'It provides consistent power 24/7 regardless of weather',
              'It requires the least maintenance',
              'It\'s the cheapest form of renewable energy'
            ],
            correct: 1,
            explanation: 'Geothermal energy is "baseload" because Earth\'s internal heat is constant and reliable. Unlike solar or wind, geothermal plants can generate electricity 24 hours a day, 365 days a year, regardless of weather conditions.'
          },
          icon: Brain
        }
      ]
    },
    "10": {
      id: "10",
      title: "Energy Storage Solutions",
      difficulty: "Hard",
      xp: 200,
      description: "How we store renewable energy for when the sun doesn't shine and wind doesn't blow",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Why Energy Storage Matters',
          content: 'Renewable energy sources are intermittent, making storage crucial for a reliable grid.',
          points: [
            'Solar only works during daylight hours',
            'Wind power varies with weather conditions',
            'Electricity demand doesn\'t match renewable generation',
            'Storage enables 24/7 clean energy supply'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Types of Energy Storage',
          content: 'Different storage technologies serve different needs and timescales.',
          points: [
            'Batteries: Chemical storage (lithium-ion, flow batteries)',
            'Pumped hydro: Gravitational potential energy storage',
            'Compressed air: Mechanical energy storage in caverns',
            'Thermal storage: Heat stored in molten salt or rocks'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Battery Technology Advances',
          content: 'Battery technology is rapidly improving, making renewable energy more viable.',
          points: [
            'Lithium-ion costs dropped 90% from 2010-2020',
            'Grid-scale batteries can respond in milliseconds',
            'Home batteries enable energy independence',
            'Electric vehicle batteries can support the grid'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Energy Storage Quiz',
          content: 'Test your understanding of energy storage systems.',
          quiz: {
            question: 'What is the main advantage of pumped hydro storage over batteries?',
            options: [
              'It\'s much cheaper to build',
              'It can store energy for much longer periods',
              'It responds faster to grid demands',
              'It works better in all climates'
            ],
            correct: 1,
            explanation: 'Pumped hydro can store energy for weeks or months with minimal loss, while batteries typically store energy for hours to days. This makes pumped hydro ideal for seasonal energy storage and long-term grid stability.'
          },
          icon: Brain
        }
      ]
    },

    // WASTE MANAGEMENT LESSONS (11-15)
    "11": {
      id: "11",
      title: "The 3 R's: Reduce, Reuse, Recycle",
      difficulty: "Easy",
      xp: 50,
      description: "The fundamental principles of waste management",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'The Waste Hierarchy',
          content: 'The 3 R\'s are listed in order of priority - Reduce first, then Reuse, then Recycle.',
          points: [
            'Reduce: Use less, buy less, waste less',
            'Reuse: Find new purposes for items before discarding',
            'Recycle: Process materials into new products',
            'Each step is more effective than the next'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'example',
          title: 'Reduce in Daily Life',
          content: 'Reducing consumption is the most effective way to minimize waste.',
          points: [
            'Buy only what you need, avoid impulse purchases',
            'Choose products with minimal packaging',
            'Use digital receipts instead of paper',
            'Repair items instead of replacing them'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Creative Reuse Ideas',
          content: 'Reusing items gives them a second life before they become waste.',
          points: [
            'Glass jars become storage containers',
            'Old t-shirts become cleaning rags',
            'Cardboard boxes become organizers',
            'Plastic bottles become planters'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: '3 R\'s Quiz',
          content: 'Test your understanding of the waste hierarchy.',
          quiz: {
            question: 'Why is "Reduce" more important than "Recycle"?',
            options: [
              'Reducing is easier than recycling',
              'Recycling doesn\'t actually work',
              'Reducing prevents waste from being created in the first place',
              'Recycling is too expensive'
            ],
            correct: 2,
            explanation: 'Reducing is most effective because it prevents waste from being created at all. Recycling, while important, still requires energy and resources to process materials, and not all materials can be recycled indefinitely.'
          },
          icon: Brain
        }
      ]
    },
    "12": {
      id: "12",
      title: "Composting at Home",
      difficulty: "Easy",
      xp: 75,
      description: "Turn kitchen scraps into nutrient-rich soil",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What is Composting?',
          content: 'Composting is nature\'s way of recycling organic matter into nutrient-rich soil amendment.',
          points: [
            'Microorganisms break down organic waste',
            'Process creates heat, killing harmful bacteria',
            'Result is dark, crumbly, earth-smelling compost',
            'Compost improves soil health and plant growth'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'What Can Be Composted?',
          content: 'Understanding what materials work best in your compost pile.',
          points: [
            'Greens: Fruit/vegetable scraps, coffee grounds, fresh grass',
            'Browns: Dry leaves, paper, cardboard, wood chips',
            'Avoid: Meat, dairy, oils, pet waste, diseased plants',
            'Balance: Mix roughly equal parts greens and browns'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Simple Composting Methods',
          content: 'Different composting approaches for different living situations.',
          points: [
            'Backyard pile: Simple heap of organic materials',
            'Bin system: Contained composting in plastic or wood bins',
            'Tumbler: Rotating container for faster composting',
            'Vermicomposting: Using worms in small spaces'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Composting Quiz',
          content: 'Test your composting knowledge.',
          quiz: {
            question: 'What happens if you add too many "green" materials to compost?',
            options: [
              'It composts faster',
              'It becomes smelly and slimy',
              'It attracts more beneficial insects',
              'Nothing, greens are always good'
            ],
            correct: 1,
            explanation: 'Too many nitrogen-rich "green" materials without enough carbon-rich "browns" creates anaerobic conditions, leading to bad smells and slimy texture. A balanced mix is essential for healthy composting.'
          },
          icon: Brain
        }
      ]
    },
    "13": {
      id: "13",
      title: "Plastic Pollution Solutions",
      difficulty: "Medium",
      xp: 100,
      description: "Understanding and addressing the plastic crisis",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'The Plastic Problem',
          content: 'Plastic pollution has become one of the most pressing environmental challenges.',
          points: [
            'Only 9% of all plastic ever made has been recycled',
            'Plastic takes 400-1000 years to decompose',
            'Microplastics found in food, water, and human bodies',
            '8 million tons of plastic enter oceans annually'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Types of Plastic',
          content: 'Understanding plastic recycling codes helps make better choices.',
          points: [
            '#1 PET: Water bottles, easily recyclable',
            '#2 HDPE: Milk jugs, detergent bottles, recyclable',
            '#3-7: Various plastics, limited recycling options',
            'Look for recycling symbols on plastic products'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Plastic Alternatives',
          content: 'Many sustainable alternatives to single-use plastics exist.',
          points: [
            'Reusable bags instead of plastic shopping bags',
            'Stainless steel or glass water bottles',
            'Bamboo or metal straws',
            'Beeswax wraps instead of plastic wrap'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Plastic Pollution Quiz',
          content: 'Test your knowledge about plastic pollution.',
          quiz: {
            question: 'What are microplastics?',
            options: [
              'Very small plastic products like bottle caps',
              'Plastic particles smaller than 5mm from breakdown of larger plastics',
              'Plastic made from microscopic materials',
              'Biodegradable plastic alternatives'
            ],
            correct: 1,
            explanation: 'Microplastics are tiny plastic particles (less than 5mm) that result from the breakdown of larger plastic items. They\'re found throughout the environment and food chain, including in drinking water and seafood.'
          },
          icon: Brain
        }
      ]
    },
    "14": {
      id: "14",
      title: "Circular Economy Principles",
      difficulty: "Hard",
      xp: 150,
      description: "Moving from linear 'take-make-waste' to circular systems",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Linear vs Circular Economy',
          content: 'The circular economy reimagines how we design, make, and use products.',
          points: [
            'Linear: Take → Make → Waste (current system)',
            'Circular: Design out waste, keep products in use',
            'Materials circulate in closed loops',
            'Waste becomes input for new products'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Circular Design Principles',
          content: 'Products designed for circularity follow specific principles.',
          points: [
            'Design for durability and repairability',
            'Use renewable or recyclable materials',
            'Modular design allows component replacement',
            'Product-as-a-service models (leasing vs buying)'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Circular Economy Examples',
          content: 'Real-world examples of circular economy in action.',
          points: [
            'Patagonia: Repair, reuse, and recycling programs',
            'Interface carpets: Take-back and recycling programs',
            'Fairphone: Modular, repairable smartphone design',
            'Car sharing: Multiple users per vehicle'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Circular Economy Quiz',
          content: 'Test your understanding of circular economy principles.',
          quiz: {
            question: 'What is the main goal of a circular economy?',
            options: [
              'To recycle more materials',
              'To eliminate waste and keep materials in productive use',
              'To reduce manufacturing costs',
              'To create more jobs in recycling'
            ],
            correct: 1,
            explanation: 'The circular economy aims to eliminate waste by design and keep materials in productive use for as long as possible. It\'s about creating closed-loop systems where waste from one process becomes input for another.'
          },
          icon: Brain
        }
      ]
    },
    "15": {
      id: "15",
      title: "Zero Waste Lifestyle",
      difficulty: "Hard",
      xp: 200,
      description: "Practical steps toward minimizing personal waste",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What is Zero Waste?',
          content: 'Zero waste is a philosophy that encourages redesigning resource life cycles.',
          points: [
            'Goal: Send nothing to landfill or incineration',
            'Focus on prevention rather than end-of-pipe solutions',
            'Mimics natural cycles where waste becomes food',
            'Practical goal: Minimize waste as much as possible'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'The 5 R\'s of Zero Waste',
          content: 'An expanded framework building on the traditional 3 R\'s.',
          points: [
            'Refuse: Say no to things you don\'t need',
            'Reduce: Minimize what you do need',
            'Reuse: Repurpose items creatively',
            'Recycle: Process materials responsibly',
            'Rot: Compost organic waste'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Zero Waste Swaps',
          content: 'Simple substitutions that dramatically reduce waste.',
          points: [
            'Cloth napkins instead of paper napkins',
            'Safety razor instead of disposable razors',
            'Bar soap instead of liquid soap in plastic',
            'Bulk shopping with reusable containers'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Zero Waste Quiz',
          content: 'Test your zero waste knowledge.',
          quiz: {
            question: 'What is the first and most important "R" in zero waste?',
            options: [
              'Recycle - processing materials properly',
              'Reduce - using less of everything',
              'Refuse - saying no to unnecessary items',
              'Reuse - finding new purposes for items'
            ],
            correct: 2,
            explanation: 'Refuse is the most important R because it prevents waste from entering your life in the first place. By refusing unnecessary items (like plastic bags, promotional items, or excessive packaging), you eliminate waste at the source.'
          },
          icon: Brain
        }
      ]
    },

    // ECOSYSTEM PROTECTION LESSONS (16-20)
    "16": {
      id: "16",
      title: "Biodiversity Basics",
      difficulty: "Medium",
      xp: 100,
      description: "Understanding the variety of life on Earth and why it matters",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What is Biodiversity?',
          content: 'Biodiversity refers to the variety of life on Earth at all levels.',
          points: [
            'Species diversity: Different types of plants, animals, microorganisms',
            'Genetic diversity: Variation within species populations',
            'Ecosystem diversity: Different habitats and communities',
            'All levels are interconnected and important'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Why Biodiversity Matters',
          content: 'Biodiversity provides essential services that support all life on Earth.',
          points: [
            'Ecosystem services: Clean air, water, climate regulation',
            'Food security: Crop pollination, genetic resources',
            'Medicine: Many drugs derived from natural compounds',
            'Economic value: Tourism, agriculture, fisheries'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Biodiversity Hotspots',
          content: 'Some regions contain exceptionally high biodiversity and need special protection.',
          points: [
            'Western Ghats (India): 7,402 endemic species',
            'Amazon Rainforest: 10% of world\'s biodiversity',
            'Madagascar: 90% of species found nowhere else',
            'Coral reefs: 25% of marine species in <1% of ocean'
          ],
          icon: Globe
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Biodiversity Quiz',
          content: 'Test your understanding of biodiversity.',
          quiz: {
            question: 'What percentage of Earth\'s species have scientists discovered and named?',
            options: [
              'About 90% - we know most species',
              'About 50% - we\'re halfway done',
              'About 20% - most species remain unknown',
              'About 5% - we\'ve barely started'
            ],
            correct: 2,
            explanation: 'Scientists estimate they\'ve discovered and named only about 20% of Earth\'s species. Millions of species, especially insects, microorganisms, and deep-sea creatures, remain unknown to science.'
          },
          icon: Brain
        }
      ]
    },
    "17": {
      id: "17",
      title: "Forest Conservation",
      difficulty: "Medium",
      xp: 125,
      description: "Protecting Earth's lungs and biodiversity treasures",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Why Forests Matter',
          content: 'Forests provide crucial services for climate, biodiversity, and human wellbeing.',
          points: [
            'Carbon storage: Trees absorb CO₂ from atmosphere',
            'Oxygen production: Photosynthesis releases oxygen',
            'Water cycle: Forests influence rainfall patterns',
            'Biodiversity: Home to 80% of terrestrial species'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Threats to Forests',
          content: 'Multiple human activities threaten forest ecosystems worldwide.',
          points: [
            'Deforestation: Clearing for agriculture, development',
            'Logging: Harvesting trees faster than regrowth',
            'Climate change: Droughts, fires, pest outbreaks',
            'Fragmentation: Breaking large forests into small pieces'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Forest Conservation Strategies',
          content: 'Various approaches help protect and restore forest ecosystems.',
          points: [
            'Protected areas: National parks and reserves',
            'Sustainable forestry: Selective harvesting practices',
            'Reforestation: Planting trees in deforested areas',
            'Community management: Local people as forest guardians'
          ],
          icon: Leaf
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Forest Conservation Quiz',
          content: 'Test your knowledge about forest protection.',
          quiz: {
            question: 'What is the difference between reforestation and afforestation?',
            options: [
              'There is no difference, they mean the same thing',
              'Reforestation replants cleared forests, afforestation creates new forests',
              'Afforestation is faster than reforestation',
              'Reforestation uses native species, afforestation uses any species'
            ],
            correct: 1,
            explanation: 'Reforestation means replanting trees in areas that were previously forested but have been cleared. Afforestation means creating new forests in areas that weren\'t previously forested, like grasslands or agricultural land.'
          },
          icon: Brain
        }
      ]
    },
    "18": {
      id: "18",
      title: "Ocean Protection",
      difficulty: "Hard",
      xp: 150,
      description: "Safeguarding marine ecosystems and ocean health",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Ocean Ecosystem Services',
          content: 'Oceans provide essential services that support life on Earth.',
          points: [
            'Climate regulation: Absorb heat and CO₂',
            'Oxygen production: Marine plants produce 50% of oxygen',
            'Food source: Protein for billions of people',
            'Weather patterns: Drive global water cycle'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Major Ocean Threats',
          content: 'Human activities pose multiple threats to ocean health.',
          points: [
            'Pollution: Plastic, chemicals, oil spills',
            'Overfishing: Depleting fish populations',
            'Ocean acidification: CO₂ absorption lowers pH',
            'Coastal development: Destroying marine habitats'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Marine Protected Areas',
          content: 'Ocean conservation through protected zones and sustainable practices.',
          points: [
            'No-take zones: Complete fishing bans in critical areas',
            'Marine reserves: Limited human activities allowed',
            'Sustainable fishing: Quotas and seasonal restrictions',
            'Coral restoration: Replanting damaged reef systems'
          ],
          icon: Globe
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Ocean Protection Quiz',
          content: 'Test your understanding of marine conservation.',
          quiz: {
            question: 'What is ocean acidification?',
            options: [
              'Pollution making oceans more acidic',
              'CO₂ absorption making seawater more acidic',
              'Industrial waste dumping in oceans',
              'Natural process that has always occurred'
            ],
            correct: 1,
            explanation: 'Ocean acidification occurs when oceans absorb excess CO₂ from the atmosphere. The CO₂ reacts with seawater to form carbonic acid, lowering the ocean\'s pH and making it more acidic. This harms marine life, especially shell-forming organisms.'
          },
          icon: Brain
        }
      ]
    },
    "19": {
      id: "19",
      title: "Wildlife Corridors",
      difficulty: "Hard",
      xp: 175,
      description: "Connecting fragmented habitats for wildlife movement",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What are Wildlife Corridors?',
          content: 'Wildlife corridors are strips of habitat connecting larger protected areas.',
          points: [
            'Allow animals to move between habitat patches',
            'Enable genetic exchange between populations',
            'Provide access to seasonal resources',
            'Reduce human-wildlife conflict'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Why Corridors are Needed',
          content: 'Habitat fragmentation creates isolated patches that threaten wildlife survival.',
          points: [
            'Roads and development divide habitats',
            'Small populations face genetic problems',
            'Animals need large territories for survival',
            'Climate change requires species migration'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Corridor Success Stories',
          content: 'Wildlife corridors around the world show conservation success.',
          points: [
            'Banff National Park: Wildlife overpasses over highways',
            'Yellowstone to Yukon: 3,200 km corridor for large mammals',
            'European green belts: Connecting protected areas',
            'Urban corridors: Green spaces linking city parks'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Wildlife Corridors Quiz',
          content: 'Test your knowledge about habitat connectivity.',
          quiz: {
            question: 'What is the main benefit of wildlife overpasses over highways?',
            options: [
              'They look nice and improve tourism',
              'They reduce vehicle accidents and allow safe animal crossing',
              'They provide shade for the highway',
              'They are cheaper than building tunnels'
            ],
            correct: 1,
            explanation: 'Wildlife overpasses serve a dual purpose: they dramatically reduce vehicle-animal collisions (saving human lives and money) while allowing animals to safely cross highways to access habitat on both sides, maintaining genetic diversity and population health.'
          },
          icon: Brain
        }
      ]
    },
    "20": {
      id: "20",
      title: "Sustainable Agriculture",
      difficulty: "Hard",
      xp: 200,
      description: "Farming practices that protect ecosystems while feeding the world",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What is Sustainable Agriculture?',
          content: 'Farming methods that meet current food needs without compromising future generations.',
          points: [
            'Maintains soil health and fertility',
            'Conserves water and reduces pollution',
            'Supports biodiversity and ecosystem services',
            'Provides economic viability for farmers'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Sustainable Farming Practices',
          content: 'Specific techniques that promote environmental and economic sustainability.',
          points: [
            'Crop rotation: Different crops each season',
            'Cover crops: Plants grown to protect soil',
            'Integrated pest management: Natural pest control',
            'Precision agriculture: Technology-guided resource use'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Benefits of Sustainable Agriculture',
          content: 'Sustainable farming provides multiple environmental and social benefits.',
          points: [
            'Soil conservation: Prevents erosion and degradation',
            'Water quality: Reduces agricultural runoff',
            'Carbon sequestration: Soil stores atmospheric CO₂',
            'Pollinator support: Habitat for bees and butterflies'
          ],
          icon: Leaf
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Sustainable Agriculture Quiz',
          content: 'Test your understanding of sustainable farming.',
          quiz: {
            question: 'What is crop rotation and why is it beneficial?',
            options: [
              'Rotating crops during the day for better sunlight',
              'Growing different crops in sequence to improve soil health',
              'Moving crops to different fields each year',
              'Harvesting crops in a rotating pattern'
            ],
            correct: 1,
            explanation: 'Crop rotation means growing different types of crops in the same field in sequential seasons. This practice improves soil health, reduces pest and disease problems, and can increase yields while reducing the need for fertilizers and pesticides.'
          },
          icon: Brain
        }
      ]
    }
  };

  const lesson = lessons[lessonId as string];
  
  useEffect(() => {
    if (lesson) {
      setCardProgress(new Array(lesson.cards.length).fill(false));
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentCardData = lesson.cards[currentCard];
  const progress = ((currentCard + 1) / lesson.cards.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentCardData.quiz) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentCardData.quiz.correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: "Great job understanding the concept!",
      });
    } else {
      toast({
        title: "Not quite right 🤔",
        description: "Review the explanation and keep learning!",
        variant: "destructive",
      });
    }

    // Mark card as completed
    setCardProgress(prev => {
      const newProgress = [...prev];
      newProgress[currentCard] = true;
      return newProgress;
    });
  };

  const handleNextCard = () => {
    if (currentCard < lesson.cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeLessonAndUnlockNext();
    }
  };

  const completeLessonAndUnlockNext = () => {
    // Mark current lesson as completed
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    const lessonIdNum = parseInt(lessonId as string);
    
    if (!completedLessons.includes(lessonIdNum)) {
      completedLessons.push(lessonIdNum);
      localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
    }
    
    setLessonCompleted(true);
    
    const maxLesson = 20; // Total number of lessons
    toast({
      title: "Lesson Complete! 🌱",
      description: `You earned ${lesson.xp} XP! ${lessonIdNum < maxLesson ? 'Next lesson unlocked!' : 'All lessons completed!'}`,
    });
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const markCardComplete = () => {
    setCardProgress(prev => {
      const newProgress = [...prev];
      newProgress[currentCard] = true;
      return newProgress;
    });
  };

  if (lessonCompleted) {
    const quizCards = lesson.cards.filter(c => c.type === 'quiz').length;
    const finalScore = quizCards > 0 ? Math.round((correctAnswers / quizCards) * 100) : 100;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Lesson Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-3xl font-bold text-success">{finalScore}%</p>
              <p className="text-muted-foreground">Understanding Score</p>
            </div>
            <div>
              <p className="text-xl font-semibold">+{lesson.xp} XP</p>
              <p className="text-sm text-muted-foreground">Experience Points Earned</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Cards Completed: {cardProgress.filter(Boolean).length}/{lesson.cards.length}</p>
              <p>Quiz Questions: {correctAnswers}/{quizCards}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => navigate("/")} className="flex-1">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case "concept": return "bg-blue-500";
      case "example": return "bg-green-500";
      case "analogy": return "bg-purple-500";
      case "quiz": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Lesson
            </Button>
            <div className="text-center">
              <h1 className="font-semibold">{lesson.title}</h1>
              <p className="text-sm opacity-80">Card {currentCard + 1} of {lesson.cards.length}</p>
            </div>
            <Badge className={getDifficultyColor(lesson.difficulty)}>
              {lesson.difficulty}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
        </div>
      </div>

      {/* Card Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="min-h-[500px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${getCardTypeColor(currentCardData.type)} text-white flex items-center justify-center`}>
                  <currentCardData.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentCardData.title}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {currentCardData.type.charAt(0).toUpperCase() + currentCardData.type.slice(1)}
                  </Badge>
                </div>
              </div>
              {cardProgress[currentCard] && (
                <CheckCircle className="h-6 w-6 text-success" />
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-lg text-muted-foreground">
              {currentCardData.content}
            </div>

            {currentCardData.points && (
              <div className="space-y-3">
                {currentCardData.points.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-nature-primary text-white flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="flex-1">{point}</p>
                  </div>
                ))}
              </div>
            )}

            {currentCardData.type === 'quiz' && currentCardData.quiz && (
              <div className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-semibold mb-3">{currentCardData.quiz.question}</h3>
                  <div className="space-y-3">
                    {currentCardData.quiz.options.map((option, index) => {
                      let buttonClass = "w-full text-left p-4 border-2 transition-all duration-200 ";
                      
                      if (!showResult) {
                        buttonClass += selectedAnswer === index 
                          ? "border-nature-primary bg-nature-primary/10" 
                          : "border-border hover:border-nature-primary/50";
                      } else {
                        if (index === currentCardData.quiz!.correct) {
                          buttonClass += "border-success bg-success/10 text-success";
                        } else if (selectedAnswer === index && index !== currentCardData.quiz!.correct) {
                          buttonClass += "border-destructive bg-destructive/10 text-destructive";
                        } else {
                          buttonClass += "border-border opacity-50";
                        }
                      }

                      return (
                        <button
                          key={index}
                          className={buttonClass}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(65 + index)}
                            </div>
                            {option}
                            {showResult && index === currentCardData.quiz!.correct && (
                              <CheckCircle className="ml-auto h-5 w-5" />
                            )}
                            {showResult && selectedAnswer === index && index !== currentCardData.quiz!.correct && (
                              <X className="ml-auto h-5 w-5" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showResult && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-nature-primary mt-1" />
                        <div>
                          <p className="font-medium mb-1">Explanation</p>
                          <p className="text-sm text-muted-foreground">{currentCardData.quiz.explanation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevCard}
                disabled={currentCard === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {lesson.cards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentCard
                        ? 'bg-nature-primary'
                        : cardProgress[index]
                        ? 'bg-success'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {currentCardData.type === 'quiz' ? (
                !showResult ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextCard}>
                    {currentCard < lesson.cards.length - 1 ? "Next Card" : "Complete Lesson"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )
              ) : (
                <Button 
                  onClick={() => {
                    if (!cardProgress[currentCard]) {
                      markCardComplete();
                    }
                    handleNextCard();
                  }}
                >
                  {currentCard < lesson.cards.length - 1 ? "Next Card" : "Complete Lesson"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonDetail;