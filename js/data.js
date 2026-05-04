/**
 * Istanbul Cinema Tourism — Application Data
 *
 * Data model:
 *   - narratives[]            : narrative definitions + chapter intros
 *   - espionageLocations[]    : 8 locations for Narrative 1
 *   - timelineLocations[]     : 7 locations for Narrative 2
 *   - mapLocations[]          : unique physical locations (11)
 *   - films[]                 : 5 films with external source URLs
 *
 * Per-location metadata fields:
 *   - camera      : exact shot location + camera orientation (PDF p.8)
 *   - images      : location photo + film still with captions
 *   - texts       : length × competence × tone grid (PDF p.15)
 *                   { brief: young/intro, mid: adult/average, long: scholar/advanced }
 *   - quote       : short atmospheric pull-quote
 *   - narrativeNote: editorial/craft annotation
 *
 * Metadata vocabulary: Schema.org (Place, Movie, CreativeWork).
 * JSON-LD blocks are injected per page — see app.js → App.injectJSONLD().
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
      icon: "◈",
      chapterIntros: {
        "Surveillance": "Every spy story begins with observation. In this opening chapter, we join Bond and Bryan Mills as they learn Istanbul the way intelligence operatives always have: by studying its crowds, mapping its exits, and memorizing its rhythms. The Grand and Spice Bazaars become the first classroom.",
        "Escape":       "Once observation becomes action, the city's geography turns hostile. The Golden Horn carves Istanbul into two halves, and for any fugitive this waterfront is both barrier and opportunity. Taken 2's frantic escape sequence reads these spaces as a pursuer's nightmare — and a victim's lifeline.",
        "Hideouts":     "Spies don't hide in plain sight — they hide in history. Karaköy's port warehouses and Topkapi's ceremonial chambers both offer something the modern city cannot: rooms that were always designed with secrecy in mind. Here the narrative pauses; the action gathers breath.",
        "Confrontation":"All pursuits end at a threshold. Sirkeci Station was where the Orient Express delivered spies to their fates for 126 years; the Basilica Cistern has kept Byzantine secrets since 532 AD. In this final chapter, two buildings built for entirely different purposes become stages for the same cinematic ritual."
      }
    },
    {
      id: "timeline",
      title: "Istanbul Through Time in Cinema",
      subtitle: "Analytical Comparative Journey",
      description: "Trace how Istanbul has been depicted on screen from the Cold War era to the digital age. This narrative examines the same streets, monuments, and bazaars across six decades of filmmaking, revealing how the city's cinematic identity evolved.",
      theme: "historical",
      chapters: ["1960s", "2012", "2016"],
      accentColor: "#c9a55a",
      icon: "◇",
      chapterIntros: {
        "1960s": "In 1963–64, Istanbul arrived in global cinema not as a character but as an atmosphere: mysterious, slightly foreign, documented with reverence by directors who had never filmed there before. From Russia with Love and Topkapi established a visual grammar — domes, bazaars, minarets — still in circulation today.",
        "2012":  "Half a century later, Istanbul returns to the screen transformed. Skyfall and Taken 2 — released mere weeks apart in 2012 — treat the same streets as kinetic action geography. Where the 1960s camera lingered, the 2012 camera chases. The buildings are unchanged; the gaze is not.",
        "2016":  "Inferno (2016) closes the arc. Hagia Sophia, seen here for the third time in this narrative, is now a tourist destination with audio guides and smartphones. The Hippodrome, once a chariot circuit for 100,000 Byzantines, is now a public square. Cinema no longer presents Istanbul as exotic — it presents it as a text to be decoded."
      }
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
      camera: {
        facing: "NE → central hall",
        elevation: "Street level; rooftop for finale",
        focalLength: "24mm wide (chase); 35mm (inserts)",
        shotType: "Steadicam tracking + aerial drone",
        angleNote: "Best shot point: Nuruosmaniye Gate (east entrance). The opening tracking shot follows Bond NE into the Kalpakçılar Caddesi corridor."
      },
      images: {
        primary: { src: "img/locations/grand-bazaar.jpg", alt: "Grand Bazaar Nuruosmaniye entrance", caption: "Nuruosmaniye Gate — primary shooting location, facing NE" },
        film:    { src: "img/films/skyfall-bazaar.jpg",   alt: "Still from Skyfall bazaar chase",    caption: "Skyfall (2012), dir. Sam Mendes — opening motorcycle sequence" }
      },
      quote: "The labyrinth never reveals all its exits at once.",
      texts: {
        brief: "James Bond races through the world's oldest covered market on a motorcycle — 4,000 shops, 61 streets, nowhere to hide. The Grand Bazaar becomes an impossible chase arena in Skyfall's opening minutes.",
        mid:   "Skyfall (2012) opens with a seven-minute chase sequence that explodes through the Grand Bazaar's labyrinthine corridors. Bond pursues a stolen hard drive through thousands of stalls — motorcycles weaving between merchants and tourists, tearing through sixty-one covered streets. Director Sam Mendes obtained special permission to reconfigure actual merchant stalls for the shoot. The market's chaotic geography becomes a perfect surveillance nightmare: every exit compromised, every sightline contested. The scene exploits the bazaar's genuine disorienting quality — even locals get lost in this 15th-century Ottoman warren of over 31,000 square meters.",
        long:  "The opening sequence of Skyfall (2012) is perhaps the most consequential use of the Grand Bazaar in global cinema since From Russia with Love half a century earlier. Sam Mendes — working with second-unit director Alexander Witt and cinematographer Roger Deakins — staged a motorcycle pursuit that deliberately refused the glossy artifice of studio reconstruction. Production negotiated with the Kapalıçarşı's merchant associations for over eighteen months; individual shop owners were compensated and their stalls re-dressed. The 61 covered streets and 4,000+ shops of the 15th-century market, originally commissioned by Sultan Mehmed II, form an improvisational space whose architectural logic is genuinely bewildering: locals still get lost inside. In espionage tradecraft, crowded markets are classically preferred for clandestine handoffs precisely because the density of bodies and the cacophony of commerce make electronic surveillance nearly impossible — a lesson the screenwriters (Neal Purvis, Robert Wade, John Logan) exploit thematically throughout the sequence. The chase culminates on the bazaar's rooftops, shot from a helicopter, and then on the Nuruosmaniye Bridge — a staging choice that reintroduces the labyrinth's invisible vertical dimension. The scene's formal brilliance lies in its refusal of establishing shots: the audience, like Bond, is never permitted a full map of the space."
      },
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
      camera: {
        facing: "W → interior arcade",
        elevation: "Street + first-floor balcony",
        focalLength: "50mm (POV); 85mm (face close-ups)",
        shotType: "Handheld POV tracking",
        angleNote: "Best shot point: L-shaped intersection near the main Hamidiye Gate. The scene uses Mills' first-person perspective to map the arcade."
      },
      images: {
        primary: { src: "img/locations/spice-bazaar.jpg", alt: "Spice Bazaar interior arcade", caption: "Interior arcade, Hamidiye Gate entrance" },
        film:    { src: "img/films/taken2-spicebazaar.jpg", alt: "Still from Taken 2 Spice Bazaar", caption: "Taken 2 (2012), dir. Olivier Megaton" }
      },
      quote: "In a city of spices, every scent tells a story.",
      texts: {
        brief: "Bryan Mills scans the Spice Bazaar's narrow arcades in Taken 2, memorizing exits the way only a retired spy knows how. Every merchant stall becomes potential cover.",
        mid:   "In Taken 2 (2012), the Spice Bazaar — Mısır Çarşısı — serves as the entry point for Bryan Mills' methodical surveillance of his surroundings. The market's tight arcaded halls, dense with cumin, saffron, and dried chilis, provide natural cover for observation. Director Olivier Megaton films Liam Neeson's face in close-up as he maps every exit instinctively. Built in 1664 as the endowment of the New Mosque, the bazaar's L-shaped plan provides natural sight-line divisions ideal for covert observation — a fact the scene exploits with quiet confidence.",
        long:  "The Spice Bazaar, completed in 1664 as the waqf (religious endowment) of Turhan Sultan's New Mosque (Yeni Camii) complex, was built on the foundations of an even older Byzantine spice market. Its L-shaped plan — 88 vaulted bays arranged along two perpendicular arcades — was not an aesthetic choice but a commercial one: the inner corners allowed for segregated trade in volatile goods, while the two entrances at Eminönü and Tahmis streets enabled continuous merchant access. Olivier Megaton's use of the space in Taken 2 (2012) is remarkable for what it refuses to do. There is no explanatory panning shot, no tourist-board wide angle. Instead, the camera adopts Bryan Mills' first-person vigilance, cataloguing shelves of sumac and kekik alongside security cameras and exit vectors. The scene acknowledges a quiet historical truth: for four centuries, the Egyptian Bazaar (as it was originally known, due to its Cairo-sourced spices) was as much an intelligence hub as a trading post. Merchants dealing in exotic commodities also dealt in the information that travelled with them — Ottoman, Venetian, Genoese, and later British consular agents all frequented these corridors. Mills' paranoid cartography is therefore not paranoid at all; it is the appropriate mode of attention for this particular architecture."
      },
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
      camera: {
        facing: "N → Galata, NE → ferry piers",
        elevation: "Street + rooftop (ferry terminal)",
        focalLength: "28mm (wide establishing); 135mm (compression)",
        shotType: "Crane + handheld chase",
        angleNote: "Best shot point: in front of Yeni Camii steps, facing the ferry piers. The square's openness forces the pursuit into legibility."
      },
      images: {
        primary: { src: "img/locations/eminonu-square.jpg", alt: "Eminönü Square with ferry terminal", caption: "Eminönü Square, facing NE toward the ferry piers" },
        film:    { src: "img/films/taken2-eminonu.jpg",     alt: "Still from Taken 2 Eminönü sequence", caption: "Taken 2 (2012) — the waterfront escape" }
      },
      quote: "Where land meets water, rules become negotiable.",
      texts: {
        brief: "Eminönü's ferry piers are the city's oldest escape route. In Taken 2, Bryan Mills uses them exactly the way smugglers have used them for 500 years: multiple vessels, multiple destinations, jurisdiction blurred.",
        mid:   "Eminönü's ferry terminal and waterfront become a key escape node in Taken 2 (2012). The square sits at the confluence of the Golden Horn and the Bosphorus — the city's ancient maritime crossroads since Byzantium. For a fugitive, the water offers options that streets cannot: multiple vessels, multiple destinations, and jurisdictional ambiguity that blurs pursuit. Olivier Megaton shoots the sequence with characteristic rapid cutting, but the geography remains legible: Yeni Camii to the left, Galata Bridge straight ahead, piers stretching to the right. Istanbul's dual-continent position means its waterfronts are simultaneously entry and exit points — a geographic fact that spy fiction has exploited since the Cold War.",
        long:  "Eminönü — 'eminate' or principal revenue office — has been the commercial hinge of Istanbul since the Byzantine period, when the adjacent Neorion harbor served as the empire's primary customs station. The present-day square was extensively remodelled in the early 20th century; the ferry terminals that dominate its waterfront were constructed between 1913 and 1958 by various administrations responding to the relentless growth of Istanbul's commuter traffic across the Bosphorus. Olivier Megaton's use of the square in Taken 2 (2012) exploits what might be called its 'honest geography': unlike the bazaar sequences, which thrive on disorientation, the waterfront sequence requires legibility. The camera repeatedly returns to the same three anchors — the New Mosque (1664) to the west, the Galata Bridge to the north, the ferry piers stretching east — because a chase across open water demands spatial clarity. Strategically, Eminönü has been an escape vector for every regime that has controlled Constantinople/Istanbul. Byzantine admirals kept auxiliary fleets in its small harbor precisely because the confluence of Golden Horn and Bosphorus permits departure in three directions; Ottoman customs records document centuries of successful fugitive departures via hired caique (light rowing boat), many of them from positions now occupied by the municipal ferry piers. The film's debt to this history is silent but present: Mills' tactical intuition here is geographically sound in a way that stretches back a thousand years. No other single square in Europe offers as many escape vectors."
      },
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
      camera: {
        facing: "N (Eminönü → Karaköy); reverse shots look S",
        elevation: "Upper deck (490m long); lower deck for insert shots",
        focalLength: "18mm ultra-wide (vertical bridge geometry); 200mm tele (fisherman foreground)",
        shotType: "Tracking car-mount + tripod fisherman inserts",
        angleNote: "Best shot point: midspan upper deck, facing N. The bridge's two-level architecture permits unusual vertical compositions."
      },
      images: {
        primary: { src: "img/locations/galata-bridge.jpg", alt: "Galata Bridge upper deck with fishermen", caption: "Galata Bridge upper deck, looking north toward Karaköy" },
        film:    { src: "img/films/taken2-bridge.jpg",     alt: "Still from Taken 2 bridge crossing",   caption: "Taken 2 (2012) — the Galata crossing" }
      },
      quote: "Every crossing is a decision point.",
      texts: {
        brief: "The Galata Bridge has two levels — cars above, restaurants below, fishermen everywhere. Taken 2 treats it as a liminal space between danger and safety, between old Istanbul and new.",
        mid:   "The Galata Bridge — spanning the Golden Horn between Eminönü and Karaköy — is one of cinema's most loaded urban crossings. In Taken 2 (2012) it functions as a liminal space: the moment of transition between danger and temporary safety. The current structure, opened in 1994, has two levels — traffic above, restaurants below — creating a vertical division that generates spatial ambiguity ideal for action cinematography. Hundreds of fishermen line its railings daily, indifferent to the action unfolding around them. The bridge is both witness and obstacle.",
        long:  "The Galata Bridge in its present form is the fifth bridge to occupy this crossing, which has spanned the Golden Horn since the Byzantine era. The current structure — 490 meters long, opened in December 1994 after its predecessor burned in a 1992 accident — is a 'bascule bridge' with a central drawbridge section that opens nightly for larger vessels. Its most distinctive feature, exploited beautifully by Olivier Megaton's cinematographer Romain Lacourbas, is its unusual two-level design: the upper deck carries six lanes of traffic and a tram line, while the lower deck houses an arcade of restaurants and cafés open to the water. This vertical division produces something cinematographers rarely get: multiple story planes occupying the same structural envelope simultaneously. In Taken 2 (2012) the bridge becomes genuinely liminal in the anthropological sense — Bryan Mills' transition from one side to the other marks not only a geographic crossing but a narrative one, from the historic peninsula of Sultanahmet (Ottoman/Byzantine) to the European quarter of Galata/Karaköy (Genoese/modern). The fishermen that line the railings at all hours (a contemporary phenomenon dating to post-1994, when the new bridge's low walls first permitted informal angling) function visually as indifferent witnesses: they do not react to the chase. This indifference is the point. For Mills and his pursuers, the bridge is a crisis; for everyone else on it, it is Tuesday. Cinematic Istanbul has rarely been this honest about how cities actually process spectacular violence."
      },
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
      camera: {
        facing: "S (toward Golden Horn); N (into backstreets)",
        elevation: "Street + rooftop chase; crane for warehouse interiors",
        focalLength: "35mm (warehouse); 85mm (alley compression)",
        shotType: "Handheld urban chase + static interior",
        angleNote: "Best shot point: Karaköy Rıhtım (waterfront quay), looking S toward the Galata Bridge. The district's warehouses face the water."
      },
      images: {
        primary: { src: "img/locations/karakoy.jpg", alt: "Karaköy waterfront warehouses", caption: "Karaköy waterfront, looking south toward the Galata Bridge" },
        film:    { src: "img/films/skyfall-karakoy.jpg", alt: "Still from Skyfall Karaköy sequence", caption: "Skyfall (2012) — the chase continuation" }
      },
      quote: "The safest house is the one no one is looking for.",
      texts: {
        brief: "Karaköy is Istanbul's old port — warehouses, narrow alleys, a century of dock workers. Skyfall uses it as the city's shadow version: the part of Istanbul the guidebooks never quite mention.",
        mid:   "Karaköy — Istanbul's historic port district — appears in Skyfall (2012) as a place of dangerous rendezvous and temporary refuge. Its warehouses, narrow maritime streets, and proximity to the Bosphorus make it ideal spy-fiction territory. The district's dual identity — gentrifying by day, shadowed by night — mirrors the film's central tension between institutional loyalty and personal survival. During the Cold War, Karaköy's actual port was documented as a hub for genuine intelligence activity: the proximity of shipping companies, transit points, and foreign embassies created an authentic geography of covert operations that the film's production quietly acknowledges.",
        long:  "Karaköy, historically known as 'Galata' until the mid-20th century, has been Istanbul's principal maritime commercial district since the Genoese colony was established here in 1267. The present urban fabric — a dense grid of 19th-century warehouses, port buildings, and wharfside offices — largely dates to the 1880–1920 expansion when the district served as Istanbul's primary international port. Its current reputation as both a gentrifying cultural quarter (with the reopened Istanbul Modern museum) and a working-class transit hub (with the Karaköy/Yenikapı metro interchange and extensive ferry services) produces a visual palimpsest that cinematographer Roger Deakins exploits throughout the Skyfall (2012) sequence. The scene's most distinctive choice is architectural: Deakins repeatedly frames action against brick warehouse facades that date to the Ottoman Imperial Maritime Administration — buildings whose original function was precisely the monitoring of foreign shipping. During the Cold War period (particularly 1947–1962) Karaköy housed significant NATO and Turkish intelligence infrastructure; declassified CIA reports from the era specifically note the district's 'high density of cover-identity merchant companies' along what is now Kemeraltı Caddesi. Sam Mendes's engagement with this history is not explicit, but the film's choice to locate Bond's temporary refuge precisely in these streets — rather than the more picturesque Sultanahmet or Beyoğlu quarters — reflects a research-grade awareness of Istanbul's actual espionage geography. Like many of the best cinematic uses of the city, the location's meaning exceeds what the camera acknowledges."
      },
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
      camera: {
        facing: "E → Treasury chamber; N → skylight for drop shot",
        elevation: "Interior + skylight (custom rigging 15m above floor)",
        focalLength: "18mm (architectural establishing); 50mm (performance); 135mm (dagger close-up)",
        shotType: "Crane + wire rig (legendary suspended shot)",
        angleNote: "Best shot point: Second courtyard, entering the Treasury. The skylight drop shot pioneered in this film reshaped heist cinema."
      },
      images: {
        primary: { src: "img/locations/topkapi-palace.jpg", alt: "Topkapi Palace second courtyard", caption: "Topkapi Palace — second courtyard, facing E" },
        film:    { src: "img/films/topkapi-treasury.jpg",   alt: "Still from Topkapi treasury scene", caption: "Topkapi (1964), dir. Jules Dassin — the dagger heist" }
      },
      quote: "Power never fully surrenders its secrets.",
      texts: {
        brief: "A thief dangles on a wire above a museum floor to steal a jewelled dagger. Jules Dassin invented the modern heist scene here in 1964 — every Mission: Impossible descends from this shot.",
        mid:   "Jules Dassin's Topkapi (1964) is built entirely around this palace — the 600-year Ottoman seat of power becomes both target and antagonist. A team of thieves must penetrate its layered security to steal a jeweled dagger from the Imperial Treasury. The palace's geography — its four courtyards, towers, and the now-legendary suspended skylight drop — is treated as a puzzle to be solved. Every architectural feature is an obstacle or an opportunity. Topkapi predates Ocean's Eleven by nearly four decades and essentially invented the modern heist genre's architectural obsession.",
        long:  "Topkapı Sarayı ('Cannon Gate Palace') served as the principal residence and administrative headquarters of Ottoman sultans from 1465 until 1856, when Dolmabahçe Palace across the Bosphorus replaced it. Its layout — four successive courtyards organized along an east-west processional axis, with increasing levels of access restriction — was engineered as a physical encoding of imperial hierarchy: the First Courtyard (Court of the Janissaries) was public; the Fourth (Sofa-i Hümâyûn) was reserved for the Sultan. Jules Dassin's 1964 film, adapted from Eric Ambler's novel The Light of Day, was the first major international production to film extensively inside the palace, which had been converted to a museum only in 1924 under Atatürk's reforms. Dassin — working with cinematographer Henri Alekan (Wings of Desire) — treated the palace as a character rather than a backdrop. The famous 'dangling thief' sequence, in which Elizabeth Lipp is lowered on a wire through a skylight to avoid pressure-sensitive floor plates below, was shot over eleven days with custom rigging suspended fifteen meters above the Treasury chamber. The shot's formal influence is incalculable: the Mission: Impossible franchise's 1996 vault sequence is nearly a direct homage; Ocean's Eleven, Entrapment, and countless others trace their architectural grammar back to these eleven days in 1964. What distinguishes Topkapi from its descendants is its documentary reverence. Dassin spent two months simply observing the palace before filming began; the weight and age of the Ottoman imperial fabric bears down on every narrative decision his thieves make. In the final analysis, the film is a love letter to the building it depicts robbing."
      },
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
      camera: {
        facing: "W → platform; E → Moorish facade",
        elevation: "Platform + mezzanine balcony",
        focalLength: "32mm (atmosphere); 75mm (Bond + Tania)",
        shotType: "Dolly along platform + static Moorish arch framing",
        angleNote: "Best shot point: Platform 1, under the wrought-iron canopy, facing the Moorish entrance arch. Young frames Bond against Jachmund's 1890 facade."
      },
      images: {
        primary: { src: "img/locations/sirkeci-station.jpg", alt: "Sirkeci Railway Station Moorish facade", caption: "Sirkeci Station — Moorish revival facade (August Jachmund, 1890)" },
        film:    { src: "img/films/frwl-sirkeci.jpg",        alt: "Still from From Russia with Love at Sirkeci", caption: "From Russia with Love (1963), dir. Terence Young" }
      },
      quote: "Some journeys begin here. Others end.",
      texts: {
        brief: "Sirkeci was the Orient Express's final stop for 126 years. Bond boards here in From Russia with Love, carrying stolen Soviet cipher equipment. The station's Moorish arches still look like espionage itself.",
        mid:   "Sirkeci was the legendary terminus of the Orient Express — the most mythologized train in history. In From Russia with Love (1963), Bond boards here for Venice, carrying stolen Soviet cipher equipment and a defecting cryptographer. The station's Moorish-influenced architecture — designed by the German architect August Jachmund in 1890 — creates an atmosphere of imperial transition: East becoming West, one ticket at a time. The Orient Express ran from Paris to Istanbul from 1883 to 2009, and Sirkeci was always its final destination. Its last departure in 2009 closed a chapter in European history.",
        long:  "Sirkeci Railway Station (Sirkeci Garı) was designed by the German architect August Jachmund and opened on 3 November 1890 as the Istanbul terminus of the Rumeli Railway — the final link in the Orient Express network that connected Paris to the Ottoman capital. Jachmund's design is a crucial document of late-19th-century Ottoman revivalism: a European rail station wrapped in a 'Moorish' architectural vocabulary (pointed arches, polychrome masonry, rose window) that simultaneously claims modernity and declares Ottoman identity. The Orient Express would operate in some form from 1883 to 2009 — a 126-year run that made Sirkeci one of the most symbolically charged rail terminals in the world, associated variously with diplomatic espionage, European luxury tourism, and interwar refugee movement. Agatha Christie conceived of Murder on the Orient Express while staying at the adjacent Pera Palace Hotel. In From Russia with Love (1963), Terence Young — working with cinematographer Ted Moore — treats the station's atmosphere with unusual reverence for a Bond film. The Sirkeci sequence is remarkable for its refusal of action; it is a film of glances and timetables, where Bond's threat assessment must navigate not bullets but bureaucracy. The station still functions as a suburban rail terminus (though the international services ceased in 2009); part of its interior now houses the Istanbul Railway Museum. Its continued operational life gives it a quality rare in Istanbul's heavily touristified monuments: it remains a working building, occupied by commuters whose indifference to its history is itself a historical fact. For the generation of espionage cinema that followed From Russia with Love — up through Tinker, Tailor, Soldier, Spy — Sirkeci became a visual synecdoche for the Cold War threshold between blocs."
      },
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
      camera: {
        facing: "SW (into column forest); close-up N on Medusa heads",
        elevation: "Below grade (-9m); boardwalk level",
        focalLength: "14mm ultra-wide (column forest scale); 100mm macro (Medusa)",
        shotType: "Steadicam tracking through water + static atmospheric",
        angleNote: "Best shot point: Central boardwalk, two-thirds into the chamber, facing SW. The Medusa columns are at the far NW corner."
      },
      images: {
        primary: { src: "img/locations/basilica-cistern.jpg", alt: "Basilica Cistern column forest", caption: "Basilica Cistern — column forest (336 columns, 532 AD)" },
        film:    { src: "img/films/inferno-cistern.jpg",      alt: "Still from Inferno Basilica Cistern climax", caption: "Inferno (2016), dir. Ron Howard — the final confrontation" }
      },
      quote: "Beneath the city, the oldest secrets wait.",
      texts: {
        brief: "Robert Langdon races through 336 Byzantine columns as floodwaters rise. The Basilica Cistern — built by Emperor Justinian in 532 AD — is the underground cathedral where Inferno's plot finally surfaces.",
        mid:   "The Basilica Cistern — Yerebatan Sarayı, the 'Sunken Palace' — provides the dramatic climax of Inferno (2016). Robert Langdon races through its forest of 336 columns, lit by haunting amber light, as floodwaters rise around a bioweapon. Built by Emperor Justinian in 532 AD, the cistern's underground cathedral becomes a stage for humanity's survival. Its Medusa column bases — placed upside-down and on their sides, faces averted — watch it all from below. Ron Howard's production exploited the genuine engineering of the space, which has sustained imperial Constantinople and now modern Istanbul for nearly 1,500 years.",
        long:  "The Basilica Cistern (Yerebatan Sarnıcı), constructed under Byzantine Emperor Justinian I in 532 AD, is the largest of the estimated 500 ancient cisterns lying beneath Istanbul. Its dimensions are cathedral-scale: 138 metres by 65 metres, with a storage capacity of 80,000 cubic metres of water, supported by 336 marble columns arranged in twelve rows of 28. The columns themselves are architectural spolia — recycled from earlier Roman and Hellenistic temples across the Empire — which accounts for their stylistic heterogeneity (Ionic, Corinthian, and Doric capitals all appear, sometimes within the same row). The two most famous columns, in the northwest corner, rest on blocks carved with the head of Medusa: one inverted, one on its side. Scholarly consensus holds these to be architectural recycling rather than deliberate symbolism, but their visual power is undiminished. The cistern was effectively lost to Ottoman-era memory until 1545, when the French scholar Petrus Gyllius — investigating rumors that local residents were drawing water and occasionally fishing through holes in their floors — rediscovered the structure during a research visit. Ron Howard's use of the space in Inferno (2016), adapted from the third Robert Langdon novel by Dan Brown, builds on a 1963 precedent from From Russia with Love, which filmed a brief scene here. But where Terence Young used the cistern as atmosphere, Howard uses it as narrative climax: the film's bioweapon plot culminates in these chambers, with Langdon racing against flooding water that is itself a reference to the cistern's original function. The scene's visual vocabulary — golden amber uplighting, slow rippling reflections, cathedral-scale proportions — draws directly from the actual lighting rig installed by the Istanbul Metropolitan Municipality in 1987 for the monument's tourist reopening. Howard's production added minimal supplementary lighting, a choice that paid off: the cistern reads on screen as genuinely vast and genuinely ancient, because it is."
      },
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
      camera: {
        facing: "E → apse; up → main dome",
        elevation: "Ground floor + gallery (upper level)",
        focalLength: "25mm (scale); 85mm (Bond's gaze)",
        shotType: "Slow dolly + static architectural",
        angleNote: "Best shot point: Beneath the main dome, facing E toward the mihrab/altar axis. In 1963 the building was a secular museum; the mosaics were newly restored."
      },
      images: {
        primary: { src: "img/locations/hagia-sophia.jpg",    alt: "Hagia Sophia interior, main dome",  caption: "Hagia Sophia interior — main dome (Anthemius & Isidore, 537 AD)" },
        film:    { src: "img/films/frwl-hagiasophia.jpg",    alt: "Still from From Russia with Love at Hagia Sophia", caption: "From Russia with Love (1963), dir. Terence Young" }
      },
      quote: "A thousand years of prayer leaves a residue.",
      texts: {
        brief: "Hagia Sophia in 1963: a secular museum, newly-restored mosaics, Bond meeting a defector in its vast echoing nave. Cold-war cinema at its most atmospheric.",
        mid:   "Hagia Sophia appears in From Russia with Love (1963) as a site of clandestine meeting — its vast interior providing cover in plain sight. In 1963, the building was a secular museum, having been converted under Atatürk in 1934, its Byzantine mosaics newly restored. Terence Young treats it as atmospheric prop: ancient, magnificent, faintly threatening. Its Byzantine geometry provides perfect sightlines for surveillance — and for cinema. The building's status as a secular museum was central to its Cold War symbolism: a monument to Ottoman-Islamic heritage deliberately secularized, caught between identities.",
        long:  "Hagia Sophia (Ἁγία Σοφία, 'Holy Wisdom') was dedicated on 27 December 537 AD as the cathedral of the Byzantine Empire, replacing an earlier church destroyed in the Nika Riots of 532. Designed by the mathematicians Anthemius of Tralles and Isidore of Miletus for Emperor Justinian, it stood as the largest interior space in the world for nearly a thousand years, and remains one of the most consequential buildings in architectural history. Its central dome — 31.25m in diameter, suspended on four pendentives in a structural system that had no precedent at this scale — appears almost to float. The building served as the principal Orthodox cathedral until 1453, briefly as a Roman Catholic cathedral under Latin occupation (1204–1261), then as an imperial Ottoman mosque (1453–1934), then as a state museum (1934–2020), and since July 2020 again as a mosque. Terence Young's use of the building in From Russia with Love (1963) catches it at a particular moment of symbolic volatility. Under the secularist reforms of the early Turkish Republic, Atatürk had ordered the whitewashed Byzantine mosaics uncovered and restored (work supervised by American Byzantinist Thomas Whittemore from 1931 onwards); by 1963 the restoration was essentially complete. For Young's production, the building's simultaneous operational status as 'cultural heritage site' and 'architectural monument of the fallen Byzantine Empire' was strategically useful: the Cold War's ideological geography could be mapped onto Hagia Sophia's actual geography. East (apse, Byzantine mosaics) versus West (entrance, European architectural influence). Secular (1963 museum status) versus religious (building's primary historical function). The sequence films Bond arriving in the southwestern vestibule, ascending via the original imperial ramp to the upper gallery, and observing his contact from behind the 13th-century Deësis mosaic. The choreography is precise because the sightlines available in this building are genuine products of its 6th-century design intent. The scene is a master class in letting architecture do narrative work — something cinema would largely forget, for Istanbul at least, until Inferno (2016) returned here."
      },
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
      camera: {
        facing: "Variable; emphasis on overhead dome lighting",
        elevation: "Ground level only (no roof access in 1963)",
        focalLength: "32mm + 50mm (atmospheric)",
        shotType: "Static tripod + slow dolly — no handheld",
        angleNote: "Best shot point: Kalpakçılar Caddesi central intersection, facing merchant arcades. 1963's shooting style is contemplative — the direct opposite of Skyfall's 2012 kinetic treatment."
      },
      images: {
        primary: { src: "img/locations/grand-bazaar-1963.jpg", alt: "Grand Bazaar interior in period style", caption: "Grand Bazaar interior arcade — 1963 visual grammar" },
        film:    { src: "img/films/frwl-grandbazaar.jpg",      alt: "Still from From Russia with Love bazaar", caption: "From Russia with Love (1963) — atmospheric market scene" }
      },
      quote: "Some places outlast every story told about them.",
      texts: {
        brief: "In 1963, the Grand Bazaar was exotic atmosphere — Bond watches merchants and light. No motorcycles. No chase. Just the bazaar being itself for an audience that had never seen it.",
        mid:   "The Grand Bazaar appears in From Russia with Love (1963) as an exotic, mysterious space — a labyrinth of commerce and conspiracy. Terence Young's camera treats it with aesthetic reverence, lingering on the interplay of light and shadow, of merchant and customer. This is a full decade before Istanbul's tourist boom; the bazaar functions here as genuine exoticism for Western audiences who had never seen it. Compare this sequence to Skyfall's treatment of the same location 49 years later: in 1963, the bazaar is atmospheric texture; in 2012, it's a kinetic action space. The physical structure barely changed — the same Ottoman arches, the same warren of corridors — but cinema's relationship to it transformed completely.",
        long:  "The Grand Bazaar's appearance in From Russia with Love (1963) is the first time Western cinema used this location with full access and sustained attention, establishing a visual grammar that would dominate international depictions of Istanbul for the next two decades. Terence Young — a former military officer who had served with British Intelligence during the Second World War — brought to the production a strong conviction that authentic location shooting was essential to the Bond franchise's emerging identity. His cinematographer, Ted Moore, shot the bazaar sequences in available light where possible, supplementing only with minimal tungsten fill. The resulting imagery has an almost documentary quality: the merchants are mostly real merchants, the light is genuine afternoon sun filtered through 15th-century skylights, the tone is contemplative rather than kinetic. This was a deliberate aesthetic choice with political implications. In 1963, Turkey was a relatively new NATO member (1952), still processing the economic and cultural aftermath of the 1960 military coup. For Western audiences, Istanbul was barely imaginable as a concrete place — it existed more as an idea of the 'mysterious East' than as a working modern city. Young's treatment of the Grand Bazaar negotiates this carefully: the location is exotic enough to be cinematically rewarding, but the film refuses outright Orientalist caricature. Merchants are shown as professionals; commerce is shown as serious; the bazaar's architectural logic is treated with respect. The contrast with Skyfall's 2012 treatment of the same location is the clearest available demonstration of how cinematic Istanbul has changed in half a century. The physical bazaar is largely unchanged — same 61 streets, same Ottoman vaulting, essentially the same merchant families. But in 1963 the camera treats it as a cathedral; in 2012 the camera treats it as an obstacle course. The buildings didn't move; the gaze did."
      },
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
      camera: {
        facing: "W (across courtyards); E (into Treasury)",
        elevation: "Multiple; pioneering use of overhead rigs",
        focalLength: "24mm (palatial scale); 50mm (human); 135mm (jeweled dagger close-ups)",
        shotType: "Dolly + crane + suspended skylight rig",
        angleNote: "Best shot point: Gate of Felicity (between third and fourth courtyards), facing E toward the Treasury. Dassin's shooting plan moves progressively deeper into the palace — mirroring the thieves' penetration."
      },
      images: {
        primary: { src: "img/locations/topkapi-palace.jpg", alt: "Topkapi Palace second courtyard", caption: "Topkapi — second courtyard gate" },
        film:    { src: "img/films/topkapi-palace-1964.jpg", alt: "Still from Topkapi courtyard",   caption: "Topkapi (1964), dir. Jules Dassin" }
      },
      quote: "Some buildings remember everything.",
      texts: {
        brief: "In 1964, Topkapi Palace had just opened to Western cameras. Jules Dassin filmed it like a character — not a backdrop. Every subsequent Istanbul heist film owes him something.",
        mid:   "In 1964's Topkapi, the palace is simultaneously historical relic and active threat. Jules Dassin's camera lingers on Ottoman architecture with documentary reverence — this was a time when Istanbul's imperial heritage was rarely seen in Western cinema. The film helped define a cinematic image of Istanbul as a place of ancient power and modern intrigue that persists to this day. Topkapi was among the first major Western productions to film extensively at this location. Its influence on how Istanbul's Ottoman heritage is portrayed in cinema cannot be overstated — it established the visual grammar still in use sixty years later.",
        long:  "Jules Dassin's Topkapi (1964) stands as one of the most significant early engagements between Hollywood and Turkish cultural heritage. Dassin — blacklisted in Hollywood during the McCarthy era and working from European exile — had already pioneered location-authentic heist cinematography in Rififi (1955), set in Paris. Topkapi extends that aesthetic to Istanbul. Production began in spring 1963 and required more than four months of negotiation with the Turkish Ministry of Culture and Tourism before the palace's curatorial staff would allow filming inside the Imperial Treasury. The negotiations, documented in papers now held at the BFI archive, were ultimately successful because Dassin personally committed to documentary standards: no props would be added; no surface would be modified; all lighting would be supplementary only; every object shown on camera would be genuine. The result has genuine art-historical value. For viewers, Topkapi (1964) functions simultaneously as a heist comedy and as one of the clearest extant filmic records of the palace's Treasury as it appeared in the early 1960s, before subsequent renovations (particularly the 1995–2005 museological redesign) altered lighting and display conventions. The specific artefact at the center of the plot — the Topkapı Hançeri, a jewelled dagger made in 1747 as a diplomatic gift from Sultan Mahmud I to Nadir Shah of Persia — was on display in the Treasury when Dassin filmed there; its provenance in the film tracks its genuine curatorial history. Dassin treated the palace as a character because, in an important sense, it is. Its four courtyards articulate a spatial logic of Ottoman sovereignty; its layered security systems (gates, chambers, locks) are historical artefacts in themselves, not props. The influence on subsequent cinema has been enormous: Mission: Impossible (1996), Ocean's Eleven (2001), Entrapment (1999), and innumerable television series derive their heist-architectural grammar from this film. Every subsequent Istanbul-set heist — up through the Kate Mara-led MGM reboot currently in development — owes Dassin something."
      },
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
      camera: {
        facing: "NE corridor (Bond's chase line); aerial N for rooftop",
        elevation: "Street + rooftop + helicopter aerial",
        focalLength: "14mm (GoPro mounts); 24mm (motorcycle); 85mm (Bond close-ups)",
        shotType: "Motorcycle-mount + aerial drone + Steadicam",
        angleNote: "Best shot point: Same Nuruosmaniye Gate as 1963, but the angle is now kinetic, not contemplative. Deakins reframes the bazaar as motion."
      },
      images: {
        primary: { src: "img/locations/grand-bazaar-rooftop.jpg", alt: "Grand Bazaar rooftop view", caption: "Grand Bazaar rooftop — Skyfall's iconic chase finale" },
        film:    { src: "img/films/skyfall-bazaar-rooftop.jpg",   alt: "Still from Skyfall rooftop chase",   caption: "Skyfall (2012) — the rooftop motorcycle finale" }
      },
      quote: "The same corridors, an entirely different century.",
      texts: {
        brief: "Same building, 49 years later, opposite aesthetic. What was contemplative in 1963 is kinetic in 2012. The bazaar's walls didn't move — the cameras did.",
        mid:   "Skyfall (2012) returns to the Grand Bazaar 49 years after From Russia with Love, but the treatment has transformed. What was atmospheric and contemplative in 1963 is now kinetic and explosive. The bazaar is no longer exotic mystery — it's an action arena, its geometry weaponized for pursuit. The merchants and tourists are now extras in an international production, barely distinguishable from the spectacle around them. The evolution from 1963 to 2012 in this single location encapsulates the shift in how Western cinema relates to Istanbul: from exotic Other to familiar international backdrop.",
        long:  "Skyfall (2012) — the twenty-third Eon Productions Bond film, directed by Sam Mendes, shot by Roger Deakins — returns to the Grand Bazaar almost exactly 49 years after Terence Young's From Russia with Love. The physical bazaar has changed remarkably little in that interval: minor electrical modernizations, improved fire suppression, an expanded tourist infrastructure, but the Ottoman vaulting, merchant guild organization, and essential spatial logic remain 15th-century. What has changed decisively is how international cinema sees the space. The comparison is genuinely illuminating: Young's 1963 treatment is atmospheric, contemplative, shot in available light with minimal camera movement; Mendes's 2012 treatment is kinetic, adrenalized, shot with motorcycle-mount cameras, aerial drones, and the full apparatus of contemporary blockbuster action filmmaking. In 1963, the bazaar is presented to Western audiences as a site of genuine otherness — exotic in a non-pejorative sense, simply foreign to most viewers' experience. In 2012, the bazaar is presented as a familiar international location available for action-genre exploitation, no more culturally specific than a Barcelona parade route or a Marrakesh souk. This shift is not solely cinematic; it reflects genuine changes in Istanbul's status (NATO ally in 1963, candidate EU member in 2012), in its tourist infrastructure (roughly 100,000 foreign visitors annually in 1963 vs. approximately 11.6 million in 2012), and in Western audiences' mediated familiarity with the space. For the comparative viewer, the 1963/2012 pairing offers a near-controlled experiment: same location, same architectural envelope, same essential social function, but radically different cinematographic conventions and cultural-political assumptions. What the bazaar 'means' in each film is a direct function of the historical moment looking at it. The building is a constant; the gaze is not."
      },
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
      camera: {
        facing: "S (down Istiklal from Taksim)",
        elevation: "Street + tram-mount",
        focalLength: "35mm dominant (pedestrian scale)",
        shotType: "Handheld crowd tracking + Steadicam",
        angleNote: "Best shot point: Taksim end of Istiklal, facing S. The historic red tram appears in frame as a contemporary Istanbul signifier."
      },
      images: {
        primary: { src: "img/locations/istiklal-avenue.jpg", alt: "İstiklal Avenue with historic tram", caption: "İstiklal Avenue — Taksim end, facing S with historic tram" },
        film:    { src: "img/films/taken2-istiklal.jpg",     alt: "Still from Taken 2 İstiklal sequence", caption: "Taken 2 (2012) — contemporary Istanbul modernity" }
      },
      quote: "The modern city never quite forgets its older self.",
      texts: {
        brief: "Istiklal is Istanbul's main pedestrian avenue — three million visitors a day, a historic red tram, global chain stores. Taken 2 uses it as proof: this city is contemporary, familiar, European.",
        mid:   "İstiklal Avenue — Istanbul's great pedestrian boulevard — appears in Taken 2 (2012) as an emblem of contemporary Istanbul. Crowded with shoppers, tourists, and tram lines, it presents a city fully integrated into global modernity. This is an Istanbul that earlier films simply didn't depict: prosperous, cosmopolitan, almost European. The film uses it as contrast to the danger lurking in older, narrower streets below. İstiklal's appearance in 2012 Western cinema marked a clear shift in how Istanbul was perceived internationally — no longer primarily exotic backdrop but a recognizable global city with familiar urban dynamics.",
        long:  "İstiklal Caddesi ('Independence Avenue'), originally known as the Grande Rue de Péra, runs 1.4 kilometres from Taksim Square in the north to the Galata Tower vicinity in the south. It is the principal pedestrian thoroughfare of the Beyoğlu district and the historic heart of 19th-century European Istanbul: the embassies of Britain, France, Russia, Sweden, and the Netherlands all operated from mansions along or just off its route. Current pedestrian traffic is estimated at three million visitors on peak days, making it one of the most intensively used urban public spaces in Europe. Its inclusion in Taken 2 (2012) was a conscious narrative choice with clear cultural-political implications. Olivier Megaton and his production staff selected Istiklal specifically because it presents an Istanbul that previous decades of Western espionage cinema had systematically underrepresented: modern, cosmopolitan, economically integrated into global consumer capitalism (McDonald's, Mango, Marks & Spencer all have Istiklal storefronts), and recognizably 'European' in ways that earlier films' focus on Ottoman monuments had tended to obscure. The historic red tram — technically a heritage tram restored in 1990 on a line originally operating 1869–1961 — appears prominently in the sequence as a visual shorthand for Istanbul's coexistent modernity and historical depth. The tram is important because it is both of these things at once: it is a working piece of urban infrastructure (you can buy a ticket and ride it) and a restored heritage object. Megaton's cinematographer Romain Lacourbas frames it repeatedly at the beginning and end of the Istiklal sequence. The implicit argument is: this Istanbul, the one tourists immediately recognize, is the Istanbul in which contemporary action cinema can happen — without the Orientalist distance that still inflects Skyfall's nearly-simultaneous bazaar sequences. Istanbul's arrival as a tier-one global city in international media consciousness dates roughly to this period (2010–2014): Taken 2's Istiklal sequence is part of the visual evidence."
      },
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
      camera: {
        facing: "E → apse, with Islamic calligraphic roundels visible",
        elevation: "Ground floor + upper gallery",
        focalLength: "16mm wide (full interior); 35mm (tourist crowds); 85mm (Langdon detective shots)",
        shotType: "Steadicam + static contemplative",
        angleNote: "Best shot point: Beneath main dome, facing E — identical anchor to the 1963 FRWL scene. Howard deliberately echoes Young's framing."
      },
      images: {
        primary: { src: "img/locations/hagia-sophia-interior.jpg", alt: "Hagia Sophia interior with tourists", caption: "Hagia Sophia interior — tourist era (before 2020 reconversion)" },
        film:    { src: "img/films/inferno-hagiasophia.jpg",       alt: "Still from Inferno Hagia Sophia scene", caption: "Inferno (2016), dir. Ron Howard" }
      },
      quote: "The same stone, a different century.",
      texts: {
        brief: "Inferno returns to Hagia Sophia 53 years after Bond. Now it's tourists with smartphones and audio guides. Same dome, different century, entirely different culture of looking.",
        mid:   "Inferno (2016) returns to Hagia Sophia 53 years after From Russia with Love, but treats it entirely differently: now it's a tourist destination, photographed through smartphones, contextualized by audio guides. Ron Howard's camera moves through crowds rather than empty spaces. The same building — the same overwhelming scale — reads as entirely different. Istanbul's relationship to its own history had changed, and cinema registered the shift. The comparison between the 1963 and 2016 treatments may be the clearest single illustration of how Istanbul's global image evolved — from Cold War mystique to accessible heritage destination.",
        long:  "The return of Hagia Sophia to international cinema in Inferno (2016) — 53 years after From Russia with Love (1963) — provides one of this project's most instructive comparative moments. The physical space is unchanged: Justinian's dome still spans 31.25 metres, the 13th-century Deësis mosaic remains in the upper south gallery, the Ottoman-era calligraphic roundels still hang at the pendentives. What has changed is the culture of attention surrounding the building. In 1963, Hagia Sophia received approximately 300,000 visitors annually — a mixture of Turkish school groups, art-historical specialists, and a small tourist contingent. By 2016, annual visitor counts exceeded 3.4 million. Ron Howard's cinematographer Salvatore Totino — reading this demographic reality — explicitly frames the building as a tourist destination rather than a monumental presence. Langdon moves through dense crowds; smartphones appear in virtually every interior shot; audio-guide cables are visible on multiple background characters. The building itself is treated less as sacred space than as text: Langdon is there specifically to decode Dante's inscriptions and the architectural clues they reference. This interpretive approach reflects a broader cinematic shift from the 1960s to the 2010s: where earlier spy films used architecturally significant sites as atmosphere, more recent 'intellectual thriller' cinema uses them as information systems. The building's subsequent 2020 reconversion to active mosque status — following a Turkish State Council ruling that annulled the 1934 secularization — has made Inferno's 2016 sequences unintentionally archival. We see on screen a version of the building that no longer quite exists: visitors could formerly access all areas including the main floor during open hours; since 2020 active prayer requires the main floor to be cleared at regular intervals. The film's sequence is therefore an unexpectedly important historical record. The contrast with From Russia with Love's 1963 treatment reveals the full arc: from Cold War mystique to accessible heritage destination to (after 2020) renewed religious site. The building has been a constant; its symbolic valence has completed an entire cycle in our lifetime."
      },
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
      camera: {
        facing: "N → Egyptian Obelisk; S → Serpent Column",
        elevation: "Ground level; brief aerial for square overview",
        focalLength: "50mm dominant; 200mm tele for monument compression",
        shotType: "Slow dolly past the three surviving monuments",
        angleNote: "Best shot point: Between the Serpent Column and the Egyptian Obelisk, facing N. This is precisely where Byzantine chariots rounded the southern turn of the track."
      },
      images: {
        primary: { src: "img/locations/hippodrome.jpg", alt: "Hippodrome square with Egyptian Obelisk", caption: "Hippodrome (Sultanahmet Square) — Egyptian Obelisk and Serpent Column" },
        film:    { src: "img/films/inferno-hippodrome.jpg", alt: "Still from Inferno Hippodrome scene", caption: "Inferno (2016) — the historical palimpsest" }
      },
      quote: "Every square meter conceals another century.",
      texts: {
        brief: "The Hippodrome held 100,000 Byzantine spectators for chariot races. Today it's a public square with an Egyptian obelisk, a Greek serpent column, and tourists. Inferno treats it as a book waiting to be read.",
        mid:   "Inferno (2016) uses the Hippodrome — today Sultanahmet Square — as a meditation on historical layering. The ancient Roman chariot-racing circuit now hosts tourists photographing the Egyptian Obelisk and the Serpent Column. Robert Langdon's narration engages with these monuments directly, linking Dante's Inferno to Byzantine history. The scene treats Istanbul not as backdrop but as text — a city that must be read and interpreted. The Hippodrome was once the social and political center of Constantinople — capable of holding 100,000 spectators. Its transformation into a public square tracks the entire arc of the city's history.",
        long:  "The Hippodrome of Constantinople — today known in Turkish as At Meydanı ('Horse Square') and located within what is now Sultanahmet Meydanı — was originally constructed in 203 AD under the Roman Emperor Septimius Severus, and dramatically expanded by Constantine I in 324 AD when he refounded the city as the capital of the Eastern Roman Empire. Its dimensions were extraordinary for any era: approximately 450 metres long and 130 metres wide, with a track surface capable of accommodating four-horse chariot racing at Olympic-era intensities, and a seating capacity historians now estimate at 30,000–100,000 depending on period and configuration. For over a millennium, it was the social, political, and sporting centre of the Byzantine world — the site of the Nika Riots of 532 AD that nearly destroyed Justinian's reign, of triumphal processions for military victories, and of the 'Blues' and 'Greens' factional conflicts that prefigured modern football hooliganism by a thousand years. The Hippodrome's spectacular decline began in 1204, when the Fourth Crusade sacked Constantinople and looted most of its bronze monuments (including the famous Horses of Saint Mark, now in Venice). Ottoman redevelopment of the district after 1453 completed the physical transformation: the spina (central barrier) monuments were left standing as commemorative curiosities, but the surrounding track was repurposed for housing, gardens, and eventually the Blue Mosque complex (Sultan Ahmed I, 1609–1617). What remains visible today — the Egyptian Obelisk of Thutmose III (c. 1450 BC, transported to Constantinople 390 AD), the Serpent Column (commemorating the Greek victory at Plataea, 479 BC, re-erected here 324 AD), and the Walled Obelisk (10th century) — represents four distinct historical periods co-occupying the same 100 metres of public space. Ron Howard's use of the Hippodrome in Inferno (2016) is thematically exact. The film's plot concerns Robert Langdon racing to decode layered historical clues embedded in Dante's Inferno and its relationship to medieval and Byzantine symbolic history. The Hippodrome's physical form — monuments from ancient Egypt, classical Greece, imperial Rome, and Ottoman Istanbul compressed into a single modern tourist square — is the film's thesis statement made solid. Using it as a setting for a story about decoding hidden messages across centuries is almost too perfect. Inferno may be the first major Western production to fully recognize the Hippodrome's interpretive potential; earlier films had treated it simply as tourist backdrop."
      },
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
    { id: "sirkeci",          name: "Sirkeci Railway Station",       coordinates: [41.0133, 28.9782], films: ["From Russia with Love"],           narratives: ["espionage"] },
    { id: "basilica-cistern", name: "Basilica Cistern",              coordinates: [41.0083, 28.9783], films: ["Inferno"],                         narratives: ["espionage"] },
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
      legacy: "Established Istanbul as the premier spy-film location and created many of the tropes subsequent films would follow. Nearly every international production set in Istanbul since 1963 owes something to Terence Young's vision of the city.",
      sources: {
        imdb: "https://www.imdb.com/title/tt0057076/",
        wikipedia: "https://en.wikipedia.org/wiki/From_Russia_with_Love_(film)",
        distributor: "United Artists / Eon Productions"
      }
    },
    {
      id: "topkapi",
      title: "Topkapi",
      year: 1964,
      director: "Jules Dassin",
      genre: "Heist / Comedy-Thriller",
      synopsis: "A team of thieves plans an elaborate heist to steal a jeweled dagger from the Topkapi Palace Treasury. Based on Eric Ambler's novel 'The Light of Day,' the film balances comic characterization with genuine architectural tension.",
      istanbulRole: "Istanbul is the entire subject — not merely backdrop but structural logic. The city's Ottoman heritage is simultaneously obstacle, motive, and atmosphere. The film is essentially a love letter to the palace.",
      legacy: "Invented many conventions of the modern heist genre and established Topkapi Palace as a cinematic landmark. Inspired the Mission: Impossible franchise's approach to institutional theft.",
      sources: {
        imdb: "https://www.imdb.com/title/tt0058700/",
        wikipedia: "https://en.wikipedia.org/wiki/Topkapi_(film)",
        distributor: "United Artists"
      }
    },
    {
      id: "taken-2",
      title: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      genre: "Action Thriller",
      synopsis: "Bryan Mills and his family are targeted for revenge by the father of a kidnapper Mills killed in Paris. The pursuit unfolds across Istanbul's historic streets, bridges, and rooftops.",
      istanbulRole: "Istanbul is used primarily as action geography — bazaars, bridges, and rooftops as obstacle courses. The city's topography (hills, waterways, dense urban fabric) is exploited for kinetic cinema rather than cultural atmosphere.",
      legacy: "Brought Istanbul to a new generation of viewers and contributed to a significant surge in tourism following the film's release. Demonstrated that the city could serve contemporary action-cinema needs as effectively as its more contemplative uses.",
      sources: {
        imdb: "https://www.imdb.com/title/tt1397280/",
        wikipedia: "https://en.wikipedia.org/wiki/Taken_2",
        distributor: "20th Century Fox"
      }
    },
    {
      id: "skyfall",
      title: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      genre: "Spy / Action",
      synopsis: "The 23rd James Bond film opens with an extraordinary chase through Istanbul before moving to London and Scotland. Bond investigates a cyberterrorist who has obtained a list of undercover NATO agents.",
      istanbulRole: "The Grand Bazaar and Karaköy sequences establish the film's kinetic visual language. Istanbul appears briefly but memorably in the opening act — a compressed, high-intensity sequence that compresses the city into pure sensation.",
      legacy: "Skyfall's Istanbul sequence is considered one of the finest action openings in Bond history. The motorcycle chase across the Grand Bazaar's rooftops became an iconic image of contemporary Istanbul in global cinema.",
      sources: {
        imdb: "https://www.imdb.com/title/tt1074638/",
        wikipedia: "https://en.wikipedia.org/wiki/Skyfall",
        distributor: "Sony Pictures / Eon Productions"
      }
    },
    {
      id: "inferno",
      title: "Inferno",
      year: 2016,
      director: "Ron Howard",
      genre: "Mystery Thriller",
      synopsis: "Harvard professor Robert Langdon races through Istanbul, Florence, and Venice to prevent a bioterrorism plot, following clues hidden within Dante's Inferno.",
      istanbulRole: "The film's climax is entirely set in Istanbul. The Hagia Sophia, Basilica Cistern, and Hippodrome are central to Langdon's investigation — treated as readable texts rather than atmospheric props.",
      legacy: "Inferno represents the most recent major production to use Istanbul extensively and introduced the city's Byzantine underground to a wide global audience. It signals a new phase: Istanbul's hidden, ancient layers becoming as cinematically significant as its skyline.",
      sources: {
        imdb: "https://www.imdb.com/title/tt3062096/",
        wikipedia: "https://en.wikipedia.org/wiki/Inferno_(2016_film)",
        distributor: "Sony Pictures"
      }
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
