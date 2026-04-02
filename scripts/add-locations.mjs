/**
 * One-time script to add location data to post JSON files.
 * Run with: node scripts/add-locations.mjs
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '..', 'content', 'posts');

const locations = {
  "aaliyah": { locationName: "Marsh Harbour, Abaco Islands, Bahamas", lat: 26.5412, lng: -77.0636, mapsUrl: "https://www.google.com/maps/search/Marsh+Harbour+Abaco+Islands+Bahamas" },
  "abraham-lincoln": { locationName: "Alexander Gardner's Studio, Washington, D.C.", lat: 38.8951, lng: -77.0253, mapsUrl: "https://www.google.com/maps/search/511+7th+Street+NW+Washington+DC" },
  "albert-einstein": { locationName: "112 Mercer Street, Princeton, NJ", lat: 40.3487, lng: -74.6593, mapsUrl: "https://www.google.com/maps/search/112+Mercer+Street+Princeton+NJ" },
  "amy-winehouse": { locationName: "30 Camden Square, London", lat: 51.5394, lng: -0.1427, mapsUrl: "https://www.google.com/maps/search/30+Camden+Square+London+NW1" },
  "andrei-karlov": { locationName: "Cagdas Sanatlar Merkezi, Ankara, Turkey", lat: 39.9208, lng: 32.8541, mapsUrl: "https://www.google.com/maps/search/Cagdas+Sanatlar+Merkezi+Ankara+Turkey" },
  "benazir-bhutto": { locationName: "Liaquat National Bagh, Rawalpindi, Pakistan", lat: 33.5977, lng: 73.0479, mapsUrl: "https://www.google.com/maps/search/Liaquat+National+Bagh+Rawalpindi+Pakistan" },
  "bob-marley": { locationName: "56 Hope Road, Kingston, Jamaica", lat: 18.0130, lng: -76.7861, mapsUrl: "https://www.google.com/maps/search/Bob+Marley+Museum+56+Hope+Road+Kingston+Jamaica" },
  "bradley-nowell": { locationName: "Phoenix Theater, Petaluma, CA", lat: 38.2332, lng: -122.6367, mapsUrl: "https://www.google.com/maps/search/Phoenix+Theater+201+Washington+St+Petaluma+CA" },
  "buddy-holly": { locationName: "Surf Ballroom, Clear Lake, Iowa", lat: 43.1380, lng: -93.3802, mapsUrl: "https://www.google.com/maps/search/Surf+Ballroom+460+North+Shore+Drive+Clear+Lake+Iowa" },
  "chris-benoit": { locationName: "American Bank Center, Corpus Christi, TX", lat: 27.8114, lng: -97.3910, mapsUrl: "https://www.google.com/maps/search/American+Bank+Center+Corpus+Christi+Texas" },
  "christopher-mccandless": { locationName: "Bus 142, Stampede Trail, Alaska", lat: 63.8676, lng: -149.7692, mapsUrl: "https://www.google.com/maps/search/Stampede+Trail+Bus+142+Denali+Alaska" },
  "chuck-norris": { locationName: "Navasota, Texas", lat: 30.3880, lng: -96.0878, mapsUrl: "https://www.google.com/maps/search/Navasota+Texas" },
  "cliff-burton": { locationName: "Solnahallen, Stockholm, Sweden", lat: 59.3589, lng: 17.9889, mapsUrl: "https://www.google.com/maps/search/Solnahallen+Solna+Sweden" },
  "dale-earnhardt": { locationName: "Daytona International Speedway, Daytona Beach, FL", lat: 29.1856, lng: -81.0706, mapsUrl: "https://www.google.com/maps/search/Daytona+International+Speedway+Daytona+Beach+FL" },
  "diana-princess-of-wales": { locationName: "Ritz Paris, 15 Place Vendome, Paris", lat: 48.8682, lng: 2.3292, mapsUrl: "https://www.google.com/maps/search/Ritz+Paris+15+Place+Vendome+Paris" },
  "dolores-o-riordan": { locationName: "London Hilton on Park Lane, London", lat: 51.5029, lng: -0.1510, mapsUrl: "https://www.google.com/maps/search/London+Hilton+on+Park+Lane+22+Park+Lane+London" },
  "elvis-presley": { locationName: "Graceland, Memphis, TN", lat: 35.0477, lng: -90.0261, mapsUrl: "https://www.google.com/maps/search/Graceland+3764+Elvis+Presley+Blvd+Memphis+TN" },
  "franklin-d-roosevelt": { locationName: "Little White House, Warm Springs, GA", lat: 32.8874, lng: -84.6930, mapsUrl: "https://www.google.com/maps/search/Little+White+House+401+Little+White+House+Road+Warm+Springs+GA" },
  "freddie-mercury": { locationName: "Garden Lodge, 1 Logan Place, Kensington, London", lat: 51.4958, lng: -0.1963, mapsUrl: "https://www.google.com/maps/search/Garden+Lodge+1+Logan+Place+Kensington+London" },
  "george-harrison": { locationName: "Los Angeles, California", lat: 34.0622, lng: -118.4410, mapsUrl: "https://www.google.com/maps/search/Los+Angeles+California" },
  "gerald-ford": { locationName: "Rancho Mirage, California", lat: 33.7375, lng: -116.4194, mapsUrl: "https://www.google.com/maps/search/Rancho+Mirage+California" },
  "henry-fonda": { locationName: "Bel Air, Los Angeles, CA", lat: 34.0836, lng: -118.4631, mapsUrl: "https://www.google.com/maps/search/Bel+Air+Los+Angeles+California" },
  "ian-curtis": { locationName: "High Hall, Birmingham University, England", lat: 52.4475, lng: -1.9301, mapsUrl: "https://www.google.com/maps/search/Birmingham+University+High+Hall+Birmingham" },
  "james-dean": { locationName: "Blackwells Corner, Lost Hills, CA", lat: 35.7374, lng: -119.9468, mapsUrl: "https://www.google.com/maps/search/Blackwells+Corner+Lost+Hills+California" },
  "james-gandolfini": { locationName: "Hotel Boscolo Exedra, Rome, Italy", lat: 41.9030, lng: 12.4963, mapsUrl: "https://www.google.com/maps/search/Anantara+Palazzo+Naiadi+Rome+Hotel+Piazza+della+Repubblica" },
  "janis-joplin": { locationName: "Sunset Sound Recorders, Hollywood, CA", lat: 34.0981, lng: -118.3364, mapsUrl: "https://www.google.com/maps/search/Sunset+Sound+Recorders+6650+Sunset+Blvd+Hollywood+CA" },
  "jeff-buckley": { locationName: "Wolf River Harbor, Memphis, TN", lat: 35.1530, lng: -90.0561, mapsUrl: "https://www.google.com/maps/search/Wolf+River+Harbor+Memphis+Tennessee" },
  "jennie-rivera": { locationName: "Arena Monterrey, Monterrey, Mexico", lat: 25.6778, lng: -100.2871, mapsUrl: "https://www.google.com/maps/search/Arena+Monterrey+Monterrey+Mexico" },
  "jim-morrison": { locationName: "Saint-Leu-d'Esserent, France", lat: 49.2175, lng: 2.3953, mapsUrl: "https://www.google.com/maps/search/Saint-Leu-d'Esserent+France" },
  "jimi-hendrix": { locationName: "Samarkand Hotel, 22 Lansdowne Crescent, London", lat: 51.5131, lng: -0.2006, mapsUrl: "https://www.google.com/maps/search/22+Lansdowne+Crescent+Notting+Hill+London" },
  "joan-marie-laurer-aka-chyna": { locationName: "Redondo Beach, California", lat: 33.8492, lng: -118.3884, mapsUrl: "https://www.google.com/maps/search/Redondo+Beach+California" },
  "john-f-kennedy": { locationName: "Dealey Plaza, Dallas, TX", lat: 32.7789, lng: -96.8083, mapsUrl: "https://www.google.com/maps/search/Dealey+Plaza+Dallas+Texas" },
  "john-gotti": { locationName: "US Medical Center for Federal Prisoners, Springfield, MO", lat: 37.1897, lng: -93.2913, mapsUrl: "https://www.google.com/maps/search/United+States+Medical+Center+for+Federal+Prisoners+Springfield+Missouri" },
  "john-lennon": { locationName: "The Dakota, 1 W 72nd St, New York, NY", lat: 40.7763, lng: -73.9762, mapsUrl: "https://www.google.com/maps/search/The+Dakota+1+West+72nd+Street+New+York" },
  "johnny-carson": { locationName: "Malibu, California", lat: 34.0259, lng: -118.7798, mapsUrl: "https://www.google.com/maps/search/Point+Dume+Malibu+California" },
  "keith-moon": { locationName: "9 Curzon Place, Mayfair, London", lat: 51.5074, lng: -0.1490, mapsUrl: "https://www.google.com/maps/search/Curzon+Square+Mayfair+London" },
  "kim-jong-il": { locationName: "Pyongyang, North Korea", lat: 39.0392, lng: 125.7625, mapsUrl: "https://www.google.com/maps/search/Pyongyang+North+Korea" },
  "kobe-bryant": { locationName: "Staples Center, Los Angeles, CA", lat: 34.0430, lng: -118.2673, mapsUrl: "https://www.google.com/maps/search/Crypto.com+Arena+Los+Angeles+California" },
  "korey-stringer": { locationName: "Minnesota State University, Mankato, MN", lat: 44.1453, lng: -93.9994, mapsUrl: "https://www.google.com/maps/search/Minnesota+State+University+Mankato+Vikings+Training+Camp" },
  "kurt-cobain": { locationName: "171 Lake Washington Blvd E, Seattle, WA", lat: 47.6192, lng: -122.2822, mapsUrl: "https://www.google.com/maps/search/171+Lake+Washington+Blvd+E+Seattle+Washington" },
  "layne-staley": { locationName: "Spokane Arena, Spokane, WA", lat: 47.6624, lng: -117.4040, mapsUrl: "https://www.google.com/maps/search/Spokane+Arena+Spokane+Washington" },
  "lucille-ball": { locationName: "Shrine Auditorium, Los Angeles, CA", lat: 34.0186, lng: -118.2816, mapsUrl: "https://www.google.com/maps/search/Shrine+Auditorium+665+W+Jefferson+Blvd+Los+Angeles" },
  "lyndon-b-johnson": { locationName: "LBJ Ranch, Stonewall, TX", lat: 30.2377, lng: -98.6263, mapsUrl: "https://www.google.com/maps/search/LBJ+Ranch+1472+State+Park+Rd+52+Stonewall+TX+78671" },
  "marilyn-monroe": { locationName: "12305 Fifth Helena Dr, Brentwood, Los Angeles, CA", lat: 34.0499, lng: -118.4685, mapsUrl: "https://www.google.com/maps/search/12305+Fifth+Helena+Drive+Brentwood+Los+Angeles" },
  "matthew-perry": { locationName: "Pacific Palisades, Los Angeles, CA", lat: 34.0459, lng: -118.5302, mapsUrl: "https://www.google.com/maps/search/Pacific+Palisades+Los+Angeles+CA" },
  "michael-hutchence": { locationName: "Ritz-Carlton, Double Bay, Sydney, Australia", lat: -33.8768, lng: 151.2430, mapsUrl: "https://www.google.com/maps/search/Ritz+Carlton+Double+Bay+Sydney" },
  "nancy-spungen": { locationName: "Hotel Chelsea, 222 W 23rd St, New York, NY", lat: 40.7439, lng: -73.9981, mapsUrl: "https://www.google.com/maps/search/Hotel+Chelsea+222+West+23rd+Street+New+York" },
  "paramahansa-yogananda": { locationName: "Biltmore Hotel, 506 S Grand Ave, Los Angeles, CA", lat: 34.0487, lng: -118.2551, mapsUrl: "https://www.google.com/maps/search/Millennium+Biltmore+Hotel+506+S+Grand+Ave+Los+Angeles" },
  "paul-walker": { locationName: "Always Evolving, Valencia, CA", lat: 34.3942, lng: -118.5631, mapsUrl: "https://www.google.com/maps/search/Always+Evolving+Valencia+Santa+Clarita+CA" },
  "queen-elizabeth-ii": { locationName: "Balmoral Castle, Aberdeenshire, Scotland", lat: 57.0396, lng: -3.2285, mapsUrl: "https://www.google.com/maps/search/Balmoral+Castle+Aberdeenshire+Scotland" },
  "rms-titantic": { locationName: "Cobh (Queenstown), Cork Harbour, Ireland", lat: 51.8503, lng: -8.2943, mapsUrl: "https://www.google.com/maps/search/Cobh+Harbour+Cork+Ireland" },
  "robin-williams": { locationName: "Paradise Cay, Tiburon, CA", lat: 37.8913, lng: -122.4573, mapsUrl: "https://www.google.com/maps/search/Paradise+Cay+Tiburon+CA" },
  "ronald-reagan": { locationName: "668 St Cloud Rd, Bel Air, Los Angeles, CA", lat: 34.0826, lng: -118.4612, mapsUrl: "https://www.google.com/maps/search/668+St+Cloud+Road+Bel+Air+Los+Angeles" },
  "ryan-dunn": { locationName: "Barnaby's of America, West Chester, PA", lat: 39.9607, lng: -75.6055, mapsUrl: "https://www.google.com/maps/search/Barnabys+of+America+West+Chester+PA" },
  "scott-weiland": { locationName: "Medina Entertainment Center, Medina, MN", lat: 45.0358, lng: -93.5813, mapsUrl: "https://www.google.com/maps/search/Medina+Entertainment+Center+500+Highway+55+Medina+MN" },
  "shannon-hoon": { locationName: "Tipitina's, 501 Napoleon Ave, New Orleans, LA", lat: 29.9197, lng: -90.1268, mapsUrl: "https://www.google.com/maps/search/Tipitinas+501+Napoleon+Ave+New+Orleans+LA" },
  "space-shuttle-challenger-crew": { locationName: "Kennedy Space Center, Launch Complex 39B, FL", lat: 28.6272, lng: -80.6208, mapsUrl: "https://www.google.com/maps/search/Kennedy+Space+Center+Launch+Complex+39B+Florida" },
  "steve-irwin": { locationName: "Batt Reef, Port Douglas, Queensland, Australia", lat: -16.1500, lng: 145.8700, mapsUrl: "https://www.google.com/maps/search/Batt+Reef+Port+Douglas+Queensland+Australia" },
  "steve-jobs": { locationName: "2101 Waverley St, Palo Alto, CA", lat: 37.4419, lng: -122.1515, mapsUrl: "https://www.google.com/maps/search/2101+Waverley+St+Palo+Alto+CA" },
  "steve-mcqueen": { locationName: "Santa Paula, CA", lat: 34.3542, lng: -119.0593, mapsUrl: "https://www.google.com/maps/search/Santa+Paula+Airport+Santa+Paula+CA" },
  "the-ultimate-warrior": { locationName: "Smoothie King Center, New Orleans, LA", lat: 29.9490, lng: -90.0821, mapsUrl: "https://www.google.com/maps/search/Smoothie+King+Center+1501+Dave+Dixon+Drive+New+Orleans" },
  "tim-russert": { locationName: "NBC News Bureau, 4001 Nebraska Ave NW, Washington, D.C.", lat: 38.8951, lng: -77.0148, mapsUrl: "https://www.google.com/maps/search/NBC+News+Washington+Bureau+4001+Nebraska+Ave+Washington+DC" },
  "tiny-tim": { locationName: "Woman's Club of Minneapolis, MN", lat: 44.9666, lng: -93.2873, mapsUrl: "https://www.google.com/maps/search/Womans+Club+of+Minneapolis+410+Oak+Grove+St+Minneapolis+MN" },
  "tupac-shakur": { locationName: "MGM Grand, Las Vegas, NV", lat: 36.1025, lng: -115.1702, mapsUrl: "https://www.google.com/maps/search/MGM+Grand+Las+Vegas" },
  "whitney-houston": { locationName: "Beverly Hilton Hotel, Beverly Hills, CA", lat: 34.0643, lng: -118.4157, mapsUrl: "https://www.google.com/maps/search/Beverly+Hilton+Hotel+9876+Wilshire+Blvd+Beverly+Hills+CA" },
};

let updated = 0;
for (const [slug, loc] of Object.entries(locations)) {
  const jsonPath = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(jsonPath)) {
    console.log(`SKIP ${slug} — file not found`);
    continue;
  }
  const post = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  post.location = {
    name: loc.locationName,
    lat: loc.lat,
    lng: loc.lng,
    mapsUrl: loc.mapsUrl,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + '\n');
  console.log(`Updated ${slug}: ${loc.locationName}`);
  updated++;
}

console.log(`\nDone! Updated ${updated} posts.`);
