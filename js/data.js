/**
 * Istanbul Cinema Tourism — Application Data
 * All narrative, location, and film data embedded as JSON-style objects.
 */

const APP_DATA = {

  // ─── NARRATIVES ──────────────────────────────────────────────────────────────
  narratives: [
    {
      id: "espionage",
      title: "Espionage & Pursuit",
      subtitle: "Action-Driven Cinematic Journey",
      description: "Follow the footsteps of spies and fugitives through Istanbul's most thrilling locations. This narrative reconstructs the city as a stage for high-stakes pursuit, clandestine meetings, and dramatic confrontations drawn from five iconic films.",
      theme: "spy",
      chapters: ["Surveillance", "Escape", "Hideouts", "Confrontation"],
      accentColor: "#4a8bb5",
      icon: "◈"
    },
    {
      id: "timeline",
      title: "Istanbul Through Time in Cinema",
      subtitle: "Analytical Comparative Journey",
      description: "Trace how Istanbul has been depicted on screen from the Cold War era to the digital age. This narrative examines the same streets, monuments, and bazaars across six decades of filmmaking, revealing how the city's cinematic identity evolved.",
      theme: "historical",
      chapters: ["1960s", "2012", "2016"],
      accentColor: "#c9a55a",
      icon: "◇"
    }
  ],

  // ─── NARRATIVE 1: ESPIONAGE & PURSUIT ────────────────────────────────────────
  espionageLocations: [
    {
      id: "grand-bazaar-skyfall",
      name: "Grand Bazaar",
      coordinates: [41.0107, 28.9681],
      chapter: "Surveillance",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "The Bazaar Chase",
      filmTag: "SKYFALL (2012)",
      quote: "The labyrinth never reveals all its exits at once.",
      description: "The opening sequence of Skyfall explodes through the Grand Bazaar's labyrinthine corridors. Bond pursues a stolen hard drive through thousands of stalls — motorcycles weaving between merchants and tourists, through sixty-one covered streets and over 4,000 shops. The market's chaotic geography becomes a perfect surveillance nightmare: all exits compromised, all sightlines contested.",
      narrativeNote: "In espionage tradecraft, crowded markets are preferred for clandestine handoffs. The bazaar's noise and density make electronic surveillance nearly impossible — a lesson not lost on the screenwriters. The scene exploits the market's genuine disorienting quality: even locals get lost here."
    },
    {
      id: "spice-bazaar",
      name: "Spice Bazaar",
      coordinates: [41.0165, 28.9704],
      chapter: "Surveillance",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Surveillance Sequence",
      filmTag: "TAKEN 2 (2012)",
      quote: "In a city of spices, every scent tells a story.",
      description: "In Taken 2, the Spice Bazaar (Mısır Çarşısı) serves as the entry point for Bryan Mills' methodical surveillance of his surroundings. The market's tight arcaded halls — dense with cumin, saffron, and dried chilis — provide natural cover for observation. Mills maps every exit instinctively. The scene captures the bazaar's ancient function: a place where secrets travel alongside the merchandise.",
      narrativeNote: "The Spice Bazaar, built in 1664, was historically an intelligence hub as much as a trading post. Merchants dealing in exotic goods also dealt in information — a tradition cinema has never forgotten. The bazaar's L-shaped plan provides natural sight-line divisions ideal for covert observation."
    },
    {
      id: "eminonu-square",
      name: "Eminönü Square",
      coordinates: [41.0168, 28.9742],
      chapter: "Escape",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Waterfront Escape",
      filmTag: "TAKEN 2 (2012)",
      quote: "Where land meets water, rules become negotiable.",
      description: "Eminönü's ferry terminal and waterfront become a key escape node in Taken 2. The square sits at the confluence of the Golden Horn and the Bosphorus — the city's ancient maritime crossroads. For a fugitive, the water offers options that streets cannot: multiple vessels, multiple destinations, and jurisdictional ambiguity that blurs pursuit.",
      narrativeNote: "Istanbul's waterways have always defined its strategic value. The city's dual-continent position means its waterfronts are simultaneously entry and exit points — a geographic fact that spy fiction has exploited since the Cold War. No city in Europe offers as many escape vectors from a single square."
    },
    {
      id: "galata-bridge",
      name: "Galata Bridge",
      coordinates: [41.0173, 28.9738],
      chapter: "Escape",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Bridge Crossing",
      filmTag: "TAKEN 2 (2012)",
      quote: "Every crossing is a decision point.",
      description: "The Galata Bridge — spanning the Golden Horn between Eminönü and Karaköy — is one of cinema's most loaded urban crossings. In Taken 2, it functions as a liminal space: the moment of transition between danger and temporary safety. Hundreds of fishermen line its railings daily, indifferent to the action unfolding below them. The bridge is both witness and obstacle.",
      narrativeNote: "The bridge has been rebuilt multiple times since the Byzantine era. Its current form (opened 1994) has two levels — traffic above, restaurants below. This vertical division creates spatial ambiguity ideal for action cinematography: multiple story planes occupying the same structure simultaneously."
    },
    {
      id: "karakoy",
      name: "Karaköy",
      coordinates: [41.0226, 28.9743],
      chapter: "Hideouts",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "The Safe House",
      filmTag: "SKYFALL (2012)",
      quote: "The safest house is the one no one is looking for.",
      description: "Karaköy — Istanbul's historic port district — appears in Skyfall as a place of dangerous rendezvous and temporary refuge. Its warehouses, narrow maritime streets, and proximity to the Bosphorus make it ideal spy-fiction territory. The district's dual identity — gentrifying by day, shadowed by night — mirrors the film's central tension between institutional loyalty and personal survival.",
      narrativeNote: "During the Cold War, Karaköy's actual port was documented as a hub for intelligence activity. The proximity of shipping companies, transit points, and foreign embassies created a genuine geography of covert operations that Skyfall acknowledges cinematically. The district's current gentrification adds a layer of irony to its continued use as a cinematic danger zone."
    },
    {
      id: "topkapi-palace",
      name: "Topkapi Palace",
      coordinates: [41.0115, 28.9836],
      chapter: "Hideouts",
      film: "Topkapi",
      year: 1964,
      director: "Jules Dassin",
      scene: "The Heist",
      filmTag: "TOPKAPI (1964)",
      quote: "Power never fully surrenders its secrets.",
      description: "Jules Dassin's Topkapi (1964) is built entirely around this palace — the 600-year Ottoman seat of power becomes both target and antagonist. A team of thieves must penetrate its layered security to steal a jeweled dagger from the Imperial Treasury. The palace's geography — its four courtyards, towers, and suspended skylight — is treated as a puzzle to be solved. Every architectural feature is an obstacle or an opportunity.",
      narrativeNote: "Topkapi predates Ocean's Eleven by nearly four decades and essentially invented the modern heist genre's architectural obsession. Dassin treated the palace as a character — its weight, age, and accumulated history bearing down on every decision the thieves make. The film is remarkable for its documentary reverence for the real location."
    },
    {
      id: "sirkeci-station",
      name: "Sirkeci Railway Station",
      coordinates: [41.0133, 28.9782],
      chapter: "Confrontation",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "The Orient Express Departure",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      quote: "Some journeys begin here. Others end.",
      description: "Sirkeci was the legendary terminus of the Orient Express — the most mythologized train in history. In From Russia with Love, Bond boards here for Venice, carrying stolen Soviet cipher equipment and a defecting cryptographer. The station's Moorish-influenced architecture (designed by August Jachmund, 1890) creates an atmosphere of imperial transition: East becoming West, one ticket at a time.",
      narrativeNote: "The Orient Express ran from Paris to Istanbul from 1883 to 2009, and Sirkeci was always its final destination. Its last departure in 2009 closed a chapter in European history. The station now functions as a railway museum — an apt fate for a building that existed precisely at the intersection of espionage and civilization."
    },
    {
      id: "basilica-cistern",
      name: "Basilica Cistern",
      coordinates: [41.0083, 28.9783],
      chapter: "Confrontation",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "The Final Confrontation",
      filmTag: "INFERNO (2016)",
      quote: "Beneath the city, the oldest secrets wait.",
      description: "The Basilica Cistern — Yerebatan Sarayı, the 'Sunken Palace' — provides the dramatic climax of Inferno. Robert Langdon races through its forest of 336 columns, lit by haunting amber light, as floodwaters rise around a bioweapon. Built by Emperor Justinian in 532 AD, the cistern's underground cathedral becomes a stage for humanity's survival. Its Medusa column bases — placed upside-down, faces averted — watch it all from below.",
      narrativeNote: "The cistern was rediscovered in 1545 when residents were drawing water through holes in their floors. Its Byzantine engineering — a cathedral-sized underground reservoir sustaining an entire imperial city — has made it one of Istanbul's most evocative filming locations. Inferno recognized what others had missed: underground Istanbul is as cinematically rich as its skyline."
    }
  ],

  // ─── NARRATIVE 2: ISTANBUL THROUGH TIME IN CINEMA ────────────────────────────
  timelineLocations: [
    {
      id: "hagia-sophia-1963",
      name: "Hagia Sophia",
      coordinates: [41.0086, 28.9802],
      chapter: "1960s",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "The Secret Meeting",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      quote: "A thousand years of prayer leaves a residue.",
      description: "Hagia Sophia appears in From Russia with Love as a site of clandestine meeting — its vast interior providing cover in plain sight. In 1963, the building was a secular museum (converted under Atatürk in 1934), its Byzantine mosaics newly restored. The film treats it as atmospheric prop: ancient, magnificent, faintly threatening. Its Byzantine geometry provides perfect sightlines for surveillance — and for cinema.",
      narrativeNote: "In 1963, Hagia Sophia's status as a secular museum was central to its Cold War symbolism — a monument to Ottoman-Islamic heritage deliberately secularized, caught between identities. Its reconversion to a mosque in 2020 has changed its symbolic weight enormously, reminding us that locations exist in political time as well as physical space."
    },
    {
      id: "grand-bazaar-1963",
      name: "Grand Bazaar",
      coordinates: [41.0107, 28.9681],
      chapter: "1960s",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "The Market Sequence",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      quote: "Some places outlast every story told about them.",
      description: "The Grand Bazaar appears in From Russia with Love as an exotic, mysterious space — a labyrinth of commerce and conspiracy. Terence Young's camera treats it with aesthetic reverence, lingering on the interplay of light and shadow, of merchant and customer. This is a full decade before Istanbul's tourist boom; the bazaar functions here as genuine exoticism for Western audiences who had never seen it.",
      narrativeNote: "Compare this sequence to Skyfall's treatment of the same location 49 years later: in 1963, the bazaar is atmospheric texture; in 2012, it's a kinetic action space. The physical structure barely changed — the same Ottoman arches, the same warren of corridors — but cinema's relationship to it transformed completely."
    },
    {
      id: "topkapi-palace-1964",
      name: "Topkapi Palace",
      coordinates: [41.0115, 28.9836],
      chapter: "1960s",
      film: "Topkapi",
      year: 1964,
      director: "Jules Dassin",
      scene: "The Palace as Protagonist",
      filmTag: "TOPKAPI (1964)",
      quote: "Some buildings remember everything.",
      description: "In 1964's Topkapi, the palace is simultaneously historical relic and active threat. Jules Dassin's camera lingers on Ottoman architecture with documentary reverence — this was a time when Istanbul's imperial heritage was rarely seen in Western cinema. The film helped define a cinematic image of Istanbul as a place of ancient power and modern intrigue that persists to this day.",
      narrativeNote: "Topkapi was among the first major Western productions to film extensively at this location. Its influence on how Istanbul's Ottoman heritage is portrayed in cinema cannot be overstated — it established the visual grammar still in use sixty years later. Every subsequent heist film set in Istanbul owes something to Dassin's 1964 film."
    },
    {
      id: "grand-bazaar-2012",
      name: "Grand Bazaar",
      coordinates: [41.0107, 28.9681],
      chapter: "2012",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "49 Years Later",
      filmTag: "SKYFALL (2012)",
      quote: "The same corridors, an entirely different century.",
      description: "Skyfall returns to the Grand Bazaar 49 years after From Russia with Love, but the treatment has transformed. What was atmospheric and contemplative in 1963 is now kinetic and explosive. The bazaar is no longer exotic mystery — it's an action arena, its geometry weaponized for pursuit. The merchants and tourists are now extras in an international production, barely distinguishable from the spectacle around them.",
      narrativeNote: "The evolution from From Russia with Love (1963) to Skyfall (2012) in this single location encapsulates the shift in how Western cinema relates to Istanbul. The city moved from exotic Other to familiar international backdrop. The bazaar itself didn't change — the cameras around it did."
    },
    {
      id: "istiklal-avenue",
      name: "İstiklal Avenue",
      coordinates: [41.0333, 28.9778],
      chapter: "2012",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Modern City",
      filmTag: "TAKEN 2 (2012)",
      quote: "The modern city never quite forgets its older self.",
      description: "İstiklal Avenue — Istanbul's great pedestrian boulevard — appears in Taken 2 as an emblem of contemporary Istanbul. Crowded with shoppers, tourists, and tram lines, it presents a city fully integrated into global modernity. This is an Istanbul that earlier films simply didn't depict: prosperous, cosmopolitan, almost European. The film uses it as contrast to the danger lurking in older, narrower streets below.",
      narrativeNote: "İstiklal Avenue's appearance in 2012 Western cinema marked a clear shift in how Istanbul was perceived internationally — no longer primarily exotic backdrop but a recognizable global city with familiar urban dynamics. The avenue's appearance in both action and fashion photography during this period signals Istanbul's arrival as a tier-one global destination."
    },
    {
      id: "hagia-sophia-2016",
      name: "Hagia Sophia",
      coordinates: [41.0086, 28.9802],
      chapter: "2016",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "The Landmark Revisited",
      filmTag: "INFERNO (2016)",
      quote: "The same stone, a different century.",
      description: "Inferno returns to Hagia Sophia 53 years after From Russia with Love, but treats it entirely differently: now it's a tourist destination, photographed through smartphones, contextualized by audio guides. Ron Howard's camera moves through crowds rather than empty spaces. The same building — the same overwhelming scale — reads as entirely different. Istanbul's relationship to its own history had changed, and cinema registered the shift.",
      narrativeNote: "The comparison between the 1963 and 2016 treatments of Hagia Sophia may be the clearest single illustration of how Istanbul's global image evolved — from Cold War mystique to accessible heritage destination. The building gained millions of visitors between these two films. Its second conversion (to mosque, 2020) has since changed the equation again."
    },
    {
      id: "hippodrome",
      name: "Hippodrome of Constantinople",
      coordinates: [41.0052, 28.9765],
      chapter: "2016",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "The Historical Palimpsest",
      filmTag: "INFERNO (2016)",
      quote: "Every square meter conceals another century.",
      description: "Inferno uses the Hippodrome — today Sultanahmet Square — as a meditation on historical layering. The ancient Roman chariot-racing circuit now hosts tourists photographing the Egyptian Obelisk and the Serpent Column. Robert Langdon's narration engages with these monuments directly, linking Dante's Inferno to Byzantine history. The scene treats Istanbul not as backdrop but as text — a city that must be read and interpreted.",
      narrativeNote: "The Hippodrome was once the social and political center of Constantinople — capable of holding 100,000 spectators. Its transformation into a public square tracks the entire arc of the city's history from Rome through Byzantium through the Ottomans to the Republic. Using it as a setting for a story about decoding hidden messages is almost too perfect."
    }
  ],

  // ─── MAP LOCATIONS (ALL UNIQUE LOCATIONS WITH COORDINATES) ───────────────────
  mapLocations: [
    { id: "grand-bazaar",     name: "Grand Bazaar",                  coordinates: [41.0107, 28.9681], films: ["Skyfall", "From Russia with Love"], narratives: ["espionage", "timeline"] },
    { id: "spice-bazaar",     name: "Spice Bazaar",                  coordinates: [41.0165, 28.9704], films: ["Taken 2"],                         narratives: ["espionage"] },
    { id: "eminonu",          name: "Eminönü Square",                coordinates: [41.0168, 28.9742], films: ["Taken 2"],                         narratives: ["espionage"] },
    { id: "galata-bridge",    name: "Galata Bridge",                 coordinates: [41.0173, 28.9738], films: ["Taken 2"],                         narratives: ["espionage"] },
    { id: "karakoy",          name: "Karaköy",                       coordinates: [41.0226, 28.9743], films: ["Skyfall"],                         narratives: ["espionage"] },
    { id: "topkapi",          name: "Topkapi Palace",                coordinates: [41.0115, 28.9836], films: ["Topkapi", "Skyfall"],              narratives: ["espionage", "timeline"] },
    { id: "sirkeci",          name: "Sirkeci Railway Station",       coordinates: [41.0133, 28.9782], films: ["From Russia with Love"],           narratives: ["espionage", "timeline"] },
    { id: "basilica-cistern", name: "Basilica Cistern",              coordinates: [41.0083, 28.9783], films: ["Inferno"],                         narratives: ["espionage", "timeline"] },
    { id: "hagia-sophia",     name: "Hagia Sophia",                  coordinates: [41.0086, 28.9802], films: ["From Russia with Love","Inferno"], narratives: ["timeline"] },
    { id: "istiklal",         name: "İstiklal Avenue",               coordinates: [41.0333, 28.9778], films: ["Taken 2"],                         narratives: ["timeline"] },
    { id: "hippodrome",       name: "Hippodrome of Constantinople",  coordinates: [41.0052, 28.9765], films: ["Inferno"],                         narratives: ["timeline"] }
  ],

  // ─── FILMS ────────────────────────────────────────────────────────────────────
  films: [
    {
      id: "from-russia-with-love",
      title: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      genre: "Spy / Action",
      synopsis: "The second James Bond film, set largely in Istanbul during the height of the Cold War. A Soviet cipher machine becomes the MacGuffin for a deadly game between British intelligence and the criminal organization SPECTRE.",
      istanbulRole: "Istanbul appears as a city of dual loyalties — NATO ally, Eastern threshold. The city's geography and atmosphere are central to the espionage plot, treated with a documentary curiosity rare in Hollywood productions of the era.",
      legacy: "Established Istanbul as the premier spy-film location and created many of the tropes subsequent films would follow. Nearly every international production set in Istanbul since 1963 owes something to Terence Young's vision of the city."
    },
    {
      id: "topkapi",
      title: "Topkapi",
      year: 1964,
      director: "Jules Dassin",
      genre: "Heist / Comedy-Thriller",
      synopsis: "A team of thieves plans an elaborate heist to steal a jeweled dagger from the Topkapi Palace Treasury. Based on Eric Ambler's novel 'The Light of Day,' the film balances comic characterization with genuine architectural tension.",
      istanbulRole: "Istanbul is the entire subject — not merely backdrop but structural logic. The city's Ottoman heritage is simultaneously obstacle, motive, and atmosphere. The film is essentially a love letter to the palace.",
      legacy: "Invented many conventions of the modern heist genre and established Topkapi Palace as a cinematic landmark. Inspired the Mission: Impossible franchise's approach to institutional theft."
    },
    {
      id: "taken-2",
      title: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      genre: "Action Thriller",
      synopsis: "Bryan Mills and his family are targeted for revenge by the father of a kidnapper Mills killed in Paris. The pursuit unfolds across Istanbul's historic streets, bridges, and rooftops.",
      istanbulRole: "Istanbul is used primarily as action geography — bazaars, bridges, and rooftops as obstacle courses. The city's topography (hills, waterways, dense urban fabric) is exploited for kinetic cinema rather than cultural atmosphere.",
      legacy: "Brought Istanbul to a new generation of viewers and contributed to a significant surge in tourism following the film's release. Demonstrated that the city could serve contemporary action-cinema needs as effectively as its more contemplative uses."
    },
    {
      id: "skyfall",
      title: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      genre: "Spy / Action",
      synopsis: "The 23rd James Bond film opens with an extraordinary chase through Istanbul before moving to London and Scotland. Bond investigates a cyberterrorist who has obtained a list of undercover NATO agents.",
      istanbulRole: "The Grand Bazaar and Karaköy sequences establish the film's kinetic visual language. Istanbul appears briefly but memorably in the opening act — a compressed, high-intensity sequence that compresses the city into pure sensation.",
      legacy: "Skyfall's Istanbul sequence is considered one of the finest action openings in Bond history. The motorcycle chase across the Grand Bazaar's rooftops became an iconic image of contemporary Istanbul in global cinema."
    },
    {
      id: "inferno",
      title: "Inferno",
      year: 2016,
      director: "Ron Howard",
      genre: "Mystery Thriller",
      synopsis: "Harvard professor Robert Langdon races through Istanbul, Florence, and Venice to prevent a bioterrorism plot, following clues hidden within Dante's Inferno.",
      istanbulRole: "The film's climax is entirely set in Istanbul. The Hagia Sophia, Basilica Cistern, and Hippodrome are central to Langdon's investigation — treated as readable texts rather than atmospheric props.",
      legacy: "Inferno represents the most recent major production to use Istanbul extensively and introduced the city's Byzantine underground to a wide global audience. It signals a new phase: Istanbul's hidden, ancient layers becoming as cinematically significant as its skyline."
    }
  ],

  // ─── TEAM / ABOUT ─────────────────────────────────────────────────────────────
  team: [
    {
      name: "Project Team",
      role: "Digital Humanities & Digital Knowledge",
      institution: "University of Bologna",
      supervisor: "Prof. Fabio Vitali",
      course: "Information Modeling and Web Technologies"
    }
  ]

};
