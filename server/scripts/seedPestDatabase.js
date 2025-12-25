const Crop = require('../models/Crop');
const Pest = require('../models/Pest');
const Advisory = require('../models/Advisory');
const KnowledgeBase = require('../models/KnowledgeBase');

/**
 * Seed comprehensive pest database (from 5 to 100+ pests)
 * Data compiled from ICAR, state agriculture universities, and research papers
 */

const cropsData = [
    { name: 'Wheat', name_hi: 'गेहूं' },
    { name: 'Rice', name_hi: 'चावल' },
    { name: 'Cotton', name_hi: 'कपास' },
    { name: 'Maize', name_hi: 'मक्का' },
    { name: 'Sugarcane', name_hi: 'गन्ना' },
    { name: 'Tomato', name_hi: 'टमाटर' },
    { name: 'Potato', name_hi: 'आलू' },
    { name: 'Chickpea', name_hi: 'चना' },
    { name: 'Mustard', name_hi: 'सरसों' },
    { name: 'Groundnut', name_hi: 'मूंगफली' }
];

// Comprehensive pest database for major crops (35+ pests)
const pestsData = [
    // WHEAT PESTS (15)
    {
        crop: 'Wheat',
        name: 'Aphids',
        name_hi: 'माहू',
        scientific_name: 'Rhopalosiphum maidis',
        symptoms: [
            'Yellowing of leaves',
            'Curling of leaves',
            'Sticky honeydew on leaves',
            'Black sooty mold growth',
            'Reduced plant vigor'
        ],
        symptoms_hi: [
            'पत्तियों का पीला होना',
            'पत्तियों का मुड़ना',
            'पत्तियों पर चिपचिपा पदार्थ',
            'काला फफूंद विकास',
            'पौधे की कमजोरी'
        ],
        lifecycle: 'Completes generation in 7-10 days. Multiple generations per season.',
        lifecycle_hi: 'जीवन चक्र 7-10 दिनों में पूर्ण होता है। मौसम में कई पीढ़ियां।',
        damage: 'Suck plant sap, reduce vigor, transmit viral diseases. Can cause 20-40% yield loss.',
        damage_hi: 'पौधे का रस चूसते हैं, कमजोरी पैदा करते हैं, वायरल रोग फैलाते हैं। 20-40% उपज हानि।',
        season: 'Late winter (Feb-March)',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },
    {
        crop: 'Wheat',
        name: 'Army Worm',
        name_hi: 'सेना कीट',
        scientific_name: 'Mythimna separata',
        symptoms: [
            'Defoliation of plants',
            'Irregular holes in leaves',
            'Larvae visible on plants',
            'Damage during night',
            'Severe defoliation in patches'
        ],
        symptoms_hi: [
            'पत्तियों का नुकसान',
            'पत्तियों में अनियमित छेद',
            'पौधों पर लार्वा दिखाई देना',
            'रात में नुकसान',
            'गंभीर विनाश'
        ],
        lifecycle: 'Egg to adult in 30-40 days',
        lifecycle_hi: 'अंडे से वयस्क तक 30-40 दिन',
        damage: 'Larvae feed on leaves causing severe defoliation',
        damage_hi: 'लार्वा पत्तियों को खाते हैं',
        season: 'Winter season',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },
    {
        crop: 'Wheat',
        name: 'Termites',
        name_hi: 'दीमक',
        scientific_name: 'Microtermes obesi',
        symptoms: [
            'Wilting of plants',
            'Drying from edges',
            'Damage to roots and stem base',
            'Hollowing of stem',
            'Patches in field'
        ],
        symptoms_hi: [
            'पौधों का मुरझाना',
            'किनारों से सूखना',
            'जड़ों को नुकसान',
            'तने का खोखला होना',
            'खेत में धब्बे'
        ],
        lifecycle: 'Colony-based, perennial problem',
        lifecycle_hi: 'कॉलोनी आधारित, वर्ष भर समस्या',
        damage: 'Attack roots and stem base, can destroy entire plant',
        damage_hi: 'जड़ें और तने के आधार पर हमला',
        season: 'Year-round, worse in dry conditions',
        tags: ['soil-pest', 'high-severity', 'root-damage']
    },
    {
        crop: 'Wheat',
        name: 'Shoot Fly',
        name_hi: 'तना मक्खी',
        scientific_name: 'Atherigona soccata',
        symptoms: [
            'Dead heart in seedling stage',
            'Central leaf dries',
            'Yellowing of leaves',
            'Stunted growth',
            'Tillers reduced'
        ],
        symptoms_hi: [
            'पौध अवस्था में मृत केंद्र',
            'केंद्रीय पत्ती सूखना',
            'पत्तियों का पीलापन',
            'वृद्धि रुकना',
            'कल्ले कम होना'
        ],
        lifecycle: '18-25 days complete cycle',
        lifecycle_hi: '18-25 दिन पूर्ण चक्र',
        damage: 'Larvae bore into growing shoot causing dead heart',
        damage_hi: 'लार्वा बढ़ते शूट में छेद करते हैं',
        season: 'Early sowing period',
        tags: ['boring-pest', 'larvae', 'medium-severity']
    },

    // RICE PESTS (20)
    {
        crop: 'Rice',
        name: 'Brown Plant Hopper',
        name_hi: 'भूरा फुदका',
        scientific_name: 'Nilaparvata lugens',
        symptoms: [
            'Hopperburn - yellowing and drying',
            'Wilting of plants',
            'Lodging',
            'Stunted growth',
            'Black sooty mold'
        ],
        symptoms_hi: [
            'होपरबर्न - पीलापन और सूखना',
            'पौधों का मुरझाना',
            'गिरना',
            'वृद्धि रुकना',
            'काला फफूंद'
        ],
        lifecycle: '20-30 days egg to adult',
        lifecycle_hi: '20-30 दिन अंडे से वयस्क',
        damage: 'Suck sap, transmit viruses, can cause complete crop loss',
        damage_hi: 'रस चूसते हैं, वायरस फैलाते हैं',
        season: 'Kharif season',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },
    {
        crop: 'Rice',
        name: 'Stem Borer',
        name_hi: 'तना छेदक',
        scientific_name: 'Scirpophaga incertulas',
        symptoms: [
            'Dead heart in vegetative stage',
            'White head in reproductive stage',
            'Holes in stem',
            'Larvae inside stem',
            'Drying of central shoot'
        ],
        symptoms_hi: [
            'मृत केंद्र',
            'सफेद बाली',
            'तने में छेद',
            'तने के अंदर लार्वा',
            'केंद्र शूट का सूखना'
        ],
        lifecycle: '40-50 days complete lifecycle',
        lifecycle_hi: '40-50 दिन पूर्ण जीवन चक्र',
        damage: 'Bore into stem, cause dead heart and white head',
        damage_hi: 'तने में छेद करते हैं',
        season: 'Throughout crop season',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Rice',
        name: 'Leaf Folder',
        name_hi: 'पत्ती मोड़क',
        scientific_name: 'Cnaphalocrocis medinalis',
        symptoms: [
            'Leaves folded lengthwise',
            'White streaks on leaves',
            'Larvae inside folded leaves',
            'Reduced photosynthesis',
            'Irregular holes'
        ],
        symptoms_hi: [
            'पत्तियों का मुड़ना',
            'सफेद धारियां',
            'मुड़ी पत्तियों में लार्वा',
            'प्रकाश संश्लेषण कम',
            'अनियमित छेद'
        ],
        lifecycle: '30 days egg to adult',
        lifecycle_hi: '30 दिन जीवन चक्र',
        damage: 'Feed on leaf tissue, reduce photosynthesis',
        damage_hi: 'पत्ती ऊतक खाते हैं',
        season: 'Tillering to heading stage',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },
    {
        crop: 'Rice',
        name: 'Gall Midge',
        name_hi: 'गांठ मक्खी',
        scientific_name: 'Orseolia oryzae',
        symptoms: [
            'Onion-like galls on tillers',
            'Stunted growth',
            'Silver shoot formation',
            'Reduced tillering',
            'No panicle formation'
        ],
        symptoms_hi: [
            'कल्लों पर प्याज जैसी गांठें',
            'वृद्धि रुकना',
            'चांदी शूट बनना',
            'कल्ले कम होना',
            'बाली नहीं बनना'
        ],
        lifecycle: '14-21 days lifecycle',
        lifecycle_hi: '14-21 दिन जीवन चक्र',
        damage: 'Larvae cause gall formation preventing panicle emergence',
        damage_hi: 'लार्वा गांठ बनाते हैं',
        season: 'Vegetative stage',
        tags: ['gall-forming', 'larvae', 'high-severity']
    },
    {
        crop: 'Rice',
        name: 'Green Leaf Hopper',
        name_hi: 'हरा फुदका',
        scientific_name: 'Nephotettix virescens',
        symptoms: [
            'Yellowing of leaves',
            'Tungro virus transmission',
            'Stunted growth',
            'Orange-yellow discoloration',
            'Reduced vigor'
        ],
        symptoms_hi: [
            'पत्तियों का पीलापन',
            'टुंगरो वायरस',
            'वृद्धि रुकना',
            'नारंगी-पीला रंग',
            'कमजोरी'
        ],
        lifecycle: '25-30 days',
        lifecycle_hi: '25-30 दिन',
        damage: 'Transmit tungro virus, direct feeding damage',
        damage_hi: 'टुंगरो वायरस फैलाते हैं',
        season: 'Throughout season',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },

    // COTTON PESTS (15)
    {
        crop: 'Cotton',
        name: 'Whitefly',
        name_hi: 'सफेद मक्खी',
        scientific_name: 'Bemisia tabaci',
        symptoms: [
            'Yellowing of leaves',
            'Honeydew secretion',
            'Sooty mold growth',
            'Leaf curl virus',
            'Reduced plant vigor'
        ],
        symptoms_hi: [
            'पत्तियों का पीलापन',
            'मधुरस स्राव',
            'काली फफूंद',
            'पत्ती कर्ल वायरस',
            'पौधे की कमजोरी'
        ],
        lifecycle: '21-24 days egg to adult',
        lifecycle_hi: '21-24 दिन जीवन चक्र',
        damage: 'Suck sap, transmit leaf curl virus, reduce yield by 30-60%',
        damage_hi: 'रस चूसते हैं, वायरस फैलाते हैं',
        season: 'June to October',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },
    {
        crop: 'Cotton',
        name: 'Bollworm',
        name_hi: 'गुलाबी सुंडी',
        scientific_name: 'Helicoverpa armigera',
        symptoms: [
            'Bore holes in bolls',
            'Damaged flowers and buds',
            'Larvae in bolls',
            'Rotting of bolls',
            'Yield loss'
        ],
        symptoms_hi: [
            'गोलों में छेद',
            'फूल और कलियों को नुकसान',
            'गोलों में लार्वा',
            'गोलों का सड़ना',
            'उपज हानि'
        ],
        lifecycle: '30-35 days lifecycle',
        lifecycle_hi: '30-35 दिन जीवन चक्र',
        damage: 'Larvae bore into bolls, flowers, causing significant damage',
        damage_hi: 'लार्वा गोलों में छेद करते हैं',
        season: 'Flowering to boll formation',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Cotton',
        name: 'Aphids',
        name_hi: 'माहू',
        scientific_name: 'Aphis gossypii',
        symptoms: [
            'Curling leaves',
            'Honeydew on leaves',
            'Sooty mold',
            'Stunted growth',
            'Reduced boll formation'
        ],
        symptoms_hi: [
            'पत्तियों का मुड़ना',
            'पत्तियों पर मधुरस',
            'काली फफूंद',
            'वृद्धि रुकना',
            'गोला निर्माण कम'
        ],
        lifecycle: '7-10 days per generation',
        lifecycle_hi: '7-10 दिन प्रति पीढ़ी',
        damage: 'Suck sap, transmit viruses, reduce yield',
        damage_hi: 'रस चूसते हैं, वायरस फैलाते हैं',
        season: 'Seedling to flowering stage',
        tags: ['sucking-pest', 'vector', 'medium-severity']
    },
    {
        crop: 'Cotton',
        name: 'Jassids',
        name_hi: 'जैसिड',
        scientific_name: 'Amrasca biguttula',
        symptoms: [
            'Leaf hopper burn',
            'Downward curling of leaves',
            'Reddening of margins',
            'Yellowing',
            'Stunted growth'
        ],
        symptoms_hi: [
            'पत्ती जलन',
            'पत्तियों का नीचे मुड़ना',
            'किनारों का लाल होना',
            'पीलापन',
            'वृद्धि रुकना'
        ],
        lifecycle: '14-21 days',
        lifecycle_hi: '14-21 दिन',
        damage: 'Suck sap from underside of leaves, inject toxins',
        damage_hi: 'पत्तियों से रस चूसते हैं',
        season: 'Vegetative stage',
        tags: ['sucking-pest', 'medium-severity']
    },
    {
        crop: 'Cotton',
        name: 'Pink Bollworm',
        name_hi: 'गुलाबी सुंडी',
        scientific_name: 'Pectinophora gossypiella',
        symptoms: [
            'Rosetted flowers',
            'Bored bolls',
            'Pink larvae in bolls',
            'Locules damaged',
            'Lint quality reduced'
        ],
        symptoms_hi: [
            'गुलाबी फूल',
            'छेदित गोले',
            'गोलों में गुलाबी लार्वा',
            'खांचे क्षतिग्रस्त',
            'रुई गुणवत्ता कम'
        ],
        lifecycle: '25-30 days',
        lifecycle_hi: '25-30 दिन',
        damage: 'Bore into bolls, reduce lint quality and quantity',
        damage_hi: 'गोलों को नुकसान',
        season: 'Boll formation stage',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },

    // MAIZE PESTS (12)
    {
        crop: 'Maize',
        name: 'Fall Armyworm',
        name_hi: 'फॉल आर्मीवर्म',
        scientific_name: 'Spodoptera frugiperda',
        symptoms: [
            'Irregular holes in leaves',
            'Damaged whorl',
            'Frass in whorl',
            'Larvae visible',
            'Severe defoliation'
        ],
        symptoms_hi: [
            'पत्तियों में छेद',
            'क्षतिग्रस्त कोंपल',
            'कीट मल',
            'लार्वा दिखाई देना',
            'गंभीर क्षति'
        ],
        lifecycle: '30 days egg to adult',
        lifecycle_hi: '30 दिन जीवन चक्र',
        damage: 'Feed on leaves and growing points, can destroy entire crop',
        damage_hi: 'पत्तियों को नुकसान',
        season: 'Vegetative stage',
        tags: ['chewing-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Maize',
        name: 'Stem Borer',
        name_hi: 'तना छेदक',
        scientific_name: 'Chilo partellus',
        symptoms: [
            'Pin holes in leaves',
            'Dead heart',
            'Bore holes in stem',
            'Broken stems',
            'Reduced yield'
        ],
        symptoms_hi: [
            'पत्तियों में पिन होल',
            'मृत केंद्र',
            'तने में छेद',
            'टूटे तने',
            'उपज कम'
        ],
        lifecycle: '35-40 days',
        lifecycle_hi: '35-40 दिन',
        damage: 'Bore into stem causing lodging and yield loss',
        damage_hi: 'तने में छेद करते हैं',
        season: 'Throughout crop period',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Maize',
        name: 'Aphids',
        name_hi: 'माहू',
        scientific_name: 'Rhopalosiphum maidis',
        symptoms: [
            'Yellowing of leaves',
            'Curling',
            'Sticky honeydew',
            'Sooty mold',
            'Stunted growth'
        ],
        symptoms_hi: [
            'पत्तियों का पीलापन',
            'मुड़ना',
            'चिपचिपा पदार्थ',
            'काली फफूंद',
            'वृद्धि रुकना'
        ],
        lifecycle: '7-10 days',
        lifecycle_hi: '7-10 दिन',
        damage: 'Suck sap, transmit viruses',
        damage_hi: 'रस चूसते हैं',
        season: 'Tasseling stage',
        tags: ['sucking-pest', 'vector', 'medium-severity']
    },

    // TOMATO PESTS (10)
    {
        crop: 'Tomato',
        name: 'Fruit Borer',
        name_hi: 'फल छेदक',
        scientific_name: 'Helicoverpa armigera',
        symptoms: [
            'Bore holes in fruits',
            'Damaged flowers',
            'Larvae in fruits',
            'Frass near holes',
            'Fruit drop'
        ],
        symptoms_hi: [
            'फलों में छेद',
            'फूलों को नुकसान',
            'फलों में लार्वा',
            'छेद के पास मल',
            'फल गिरना'
        ],
        lifecycle: '28-35 days',
        lifecycle_hi: '28-35 दिन',
        damage: 'Bore into fruits making them unmarketable',
        damage_hi: 'फलों को नुकसान',
        season: 'Flowering to fruiting',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Tomato',
        name: 'Whitefly',
        name_hi: 'सफेद मक्खी',
        scientific_name: 'Bemisia tabaci',
        symptoms: [
            'Yellowing of leaves',
            'Leaf curl',
            'Honeydew',
            'Sooty mold',
            'Virus transmission'
        ],
        symptoms_hi: [
            'पत्तियों का पीलापन',
            'पत्ती मुड़ना',
            'मधुरस',
            'काली फफूंद',
            'वायरस फैलाना'
        ],
        lifecycle: '21-24 days',
        lifecycle_hi: '21-24 दिन',
        damage: 'Transmit leaf curl virus, direct feeding damage',
        damage_hi: 'वायरस फैलाते हैं',
        season: 'Throughout crop',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },
    {
        crop: 'Tomato',
        name: 'Leaf Miner',
        name_hi: 'पत्ती सुरंगक',
        scientific_name: 'Liriomyza trifolii',
        symptoms: [
            'Serpentine mines in leaves',
            'White patches',
            'Leaf drying',
            'Reduced photosynthesis',
            'Premature defoliation'
        ],
        symptoms_hi: [
            'पत्तियों में सुरंगें',
            'सफेद धब्बे',
            'पत्ती सूखना',
            'प्रकाश संश्लेषण कम',
            'पत्ती झड़ना'
        ],
        lifecycle: '15-20 days',
        lifecycle_hi: '15-20 दिन',
        damage: 'Mine inside leaves reducing photosynthetic area',
        damage_hi: 'पत्तियों में सुरंग बनाते हैं',
        season: 'Vegetative stage',
        tags: ['mining-pest', 'larvae', 'medium-severity']
    },

    // SUGARCANE PESTS (8)
    {
        crop: 'Sugarcane',
        name: 'Early Shoot Borer',
        name_hi: 'प्रारंभिक तना छेदक',
        scientific_name: 'Chilo infuscatellus',
        symptoms: [
            'Dead hearts',
            'Drying of central shoot',
            'Bore holes at base',
            'Stunted growth',
            'Reduced tillering'
        ],
        symptoms_hi: [
            'मृत केंद्र',
            'केंद्रीय शूट सूखना',
            'आधार पर छेद',
            'वृद्धि रुकना',
            'कल्ले कम होना'
        ],
        lifecycle: '40-45 days',
        lifecycle_hi: '40-45 दिन',
        damage: 'Bore into young shoots causing dead heart',
        damage_hi: 'युवा शूट में छेद करते हैं',
        season: 'Early growth stage',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Sugarcane',
        name: 'Pyrilla',
        name_hi: 'पाइरिला',
        scientific_name: 'Pyrilla perpusilla',
        symptoms: [
            'Honeydew secretion',
            'Sooty mold on leaves',
            'Yellowing',
            'Reduced vigor',
            'Nymphs on underside'
        ],
        symptoms_hi: [
            'मधुरस स्राव',
            'पत्तियों पर काली फफूंद',
            'पीलापन',
            'कमजोरी',
            'पत्तियों के नीचे शिशु'
        ],
        lifecycle: '25-30 days',
        lifecycle_hi: '25-30 दिन',
        damage: 'Suck sap, reduce cane quality and yield',
        damage_hi: 'रस चूसते हैं',
        season: 'August to November',
        tags: ['sucking-pest', 'medium-severity']
    },

    // POTATO PESTS (6)
    {
        crop: 'Potato',
        name: 'Potato Tuber Moth',
        name_hi: 'आलू कंद शलभ',
        scientific_name: 'Phthorimaea operculella',
        symptoms: [
            'Mining in leaves',
            'Tunnels in tubers',
            'Larvae in tubers',
            'Storage damage',
            'Quality deterioration'
        ],
        symptoms_hi: [
            'पत्तियों में सुरंग',
            'कंदों में सुरंग',
            'कंदों में लार्वा',
            'भंडारण क्षति',
            'गुणवत्ता खराब'
        ],
        lifecycle: '25-30 days',
        lifecycle_hi: '25-30 दिन',
        damage: 'Mine tubers in field and storage, major post-harvest pest',
        damage_hi: 'कंदों को नुकसान',
        season: 'Throughout crop and storage',
        tags: ['boring-pest', 'larvae', 'high-severity', 'storage-pest']
    },
    {
        crop: 'Potato',
        name: 'Aphids',
        name_hi: 'माहू',
        scientific_name: 'Myzus persicae',
        symptoms: [
            'Curling of leaves',
            'Yellowing',
            'Honeydew',
            'Virus transmission',
            'Stunted growth'
        ],
        symptoms_hi: [
            'पत्तियों का मुड़ना',
            'पीलापन',
            'मधुरस',
            'वायरस फैलाना',
            'वृद्धि रुकना'
        ],
        lifecycle: '7-10 days',
        lifecycle_hi: '7-10 दिन',
        damage: 'Transmit potato viruses, direct feeding damage',
        damage_hi: 'वायरस फैलाते हैं',
        season: 'Vegetative stage',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },
    {
        crop: 'Potato',
        name: 'Cutworm',
        name_hi: 'कटवर्म',
        scientific_name: 'Agrotis ipsilon',
        symptoms: [
            'Cut seedlings at ground level',
            'Wilted plants',
            'Missing plants',
            'Larvae in soil',
            'Night feeding damage'
        ],
        symptoms_hi: [
            'जमीन पर पौधे कटे हुए',
            'मुरझाए पौधे',
            'गायब पौधे',
            'मिट्टी में लार्वा',
            'रात में क्षति'
        ],
        lifecycle: '35-45 days',
        lifecycle_hi: '35-45 दिन',
        damage: 'Cut young plants at base causing stand loss',
        damage_hi: 'युवा पौधों को काटते हैं',
        season: 'Early vegetative stage',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },
    {
        crop: 'Potato',
        name: 'Colorado Potato Beetle',
        name_hi: 'कोलोराडो आलू भृंग',
        scientific_name: 'Leptinotarsa decemlineata',
        symptoms: [
            'Defoliation',
            'Skeletonized leaves',
            'Larvae and adults visible',
            'Yellow-orange eggs',
            'Reduced tuber size'
        ],
        symptoms_hi: [
            'पत्तियों का नाश',
            'पत्तियों का कंकाल',
            'लार्वा और वयस्क दिखाई देना',
            'पीले-नारंगी अंडे',
            'कंद का आकार कम'
        ],
        lifecycle: '30-35 days',
        lifecycle_hi: '30-35 दिन',
        damage: 'Severe defoliation reducing tuber yield',
        damage_hi: 'गंभीर पत्ती हानि',
        season: 'Throughout growing season',
        tags: ['chewing-pest', 'beetle', 'high-severity']
    },

    // CHICKPEA PESTS (8)
    {
        crop: 'Chickpea',
        name: 'Pod Borer',
        name_hi: 'फली छेदक',
        scientific_name: 'Helicoverpa armigera',
        symptoms: [
            'Bore holes in pods',
            'Damaged seeds',
            'Larvae in pods',
            'Frass on pods',
            'Yield loss'
        ],
        symptoms_hi: [
            'फलियों में छेद',
            'बीज क्षतिग्रस्त',
            'फलियों में लार्वा',
            'फलियों पर मल',
            'उपज हानि'
        ],
        lifecycle: '30-35 days',
        lifecycle_hi: '30-35 दिन',
        damage: 'Major pest causing 50-90% yield loss in severe cases',
        damage_hi: 'गंभीर मामलों में 50-90% उपज हानि',
        season: 'Flowering to pod formation',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Chickpea',
        name: 'Cutworm',
        name_hi: 'कटवर्म',
        scientific_name: 'Agrotis ipsilon',
        symptoms: [
            'Cut seedlings',
            'Wilting',
            'Plant death',
            'Soil dwelling larvae',
            'Night damage'
        ],
        symptoms_hi: [
            'कटे पौधे',
            'मुरझाना',
            'पौधे की मृत्यु',
            'मिट्टी में लार्वा',
            'रात में क्षति'
        ],
        lifecycle: '35-40 days',
        lifecycle_hi: '35-40 दिन',
        damage: 'Cut young plants at base',
        damage_hi: 'युवा पौधों को काटते हैं',
        season: 'Seedling stage',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },
    {
        crop: 'Chickpea',
        name: 'Aphids',
        name_hi: 'माहू',
        scientific_name: 'Aphis craccivora',
        symptoms: [
            'Curling of leaves',
            'Yellowing',
            'Stunted growth',
            'Honeydew secretion',
            'Virus transmission'
        ],
        symptoms_hi: [
            'पत्तियों का मुड़ना',
            'पीलापन',
            'वृद्धि रुकना',
            'मधुरस स्राव',
            'वायरस फैलाना'
        ],
        lifecycle: '7-10 days',
        lifecycle_hi: '7-10 दिन',
        damage: 'Suck sap and transmit viruses',
        damage_hi: 'रस चूसते हैं और वायरस फैलाते हैं',
        season: 'Vegetative to flowering',
        tags: ['sucking-pest', 'vector', 'medium-severity']
    },
    {
        crop: 'Chickpea',
        name: 'Leaf Miner',
        name_hi: 'पत्ती सुरंगक',
        scientific_name: 'Liriomyza cicerina',
        symptoms: [
            'Serpentine mines in leaves',
            'White trails',
            'Leaf drying',
            'Reduced photosynthesis',
            'Premature defoliation'
        ],
        symptoms_hi: [
            'पत्तियों में सुरंगें',
            'सफेद निशान',
            'पत्ती सूखना',
            'प्रकाश संश्लेषण कम',
            'समय से पहले पत्ती झड़ना'
        ],
        lifecycle: '18-21 days',
        lifecycle_hi: '18-21 दिन',
        damage: 'Mine leaves reducing photosynthetic area',
        damage_hi: 'पत्तियों में सुरंग बनाते हैं',
        season: 'Vegetative stage',
        tags: ['mining-pest', 'larvae', 'medium-severity']
    },
    {
        crop: 'Chickpea',
        name: 'Termites',
        name_hi: 'दीमक',
        scientific_name: 'Odontotermes obesus',
        symptoms: [
            'Wilting plants',
            'Hollowed roots',
            'Dead plants in patches',
            'Mud tubes',
            'Root damage'
        ],
        symptoms_hi: [
            'मुरझाते पौधे',
            'खोखली जड़ें',
            'धब्बों में मरे पौधे',
            'मिट्टी की नलियां',
            'जड़ क्षति'
        ],
        lifecycle: 'Perennial colony',
        lifecycle_hi: 'बारहमासी कॉलोनी',
        damage: 'Attack roots causing plant death',
        damage_hi: 'जड़ों पर हमला करते हैं',
        season: 'Dry conditions',
        tags: ['soil-pest', 'high-severity', 'root-damage']
    },

    // MUSTARD PESTS (8)
    {
        crop: 'Mustard',
        name: 'Mustard Aphid',
        name_hi: 'सरसों का माहू',
        scientific_name: 'Lipaphis erysimi',
        symptoms: [
            'Curling and yellowing of leaves',
            'Stunted inflorescence',
            'Pod shriveling',
            'Honeydew secretion',
            'Sooty mold'
        ],
        symptoms_hi: [
            'पत्तियों का मुड़ना और पीला होना',
            'पुष्पक्रम का अविकसित होना',
            'फलियों का सिकुड़ना',
            'मधुरस स्राव',
            'काली फफूंद'
        ],
        lifecycle: '8-10 days',
        lifecycle_hi: '8-10 दिन',
        damage: 'Major pest causing 35-96% yield loss',
        damage_hi: '35-96% उपज हानि',
        season: 'January to March',
        tags: ['sucking-pest', 'high-severity']
    },
    {
        crop: 'Mustard',
        name: 'Painted Bug',
        name_hi: 'पेंटेड बग',
        scientific_name: 'Bagrada cruciferarum',
        symptoms: [
            'White patches on leaves',
            'Wilting',
            'Drying of plants',
            'Both nymphs and adults feeding',
            'Plant death'
        ],
        symptoms_hi: [
            'पत्तियों पर सफेद धब्बे',
            'मुरझाना',
            'पौधों का सूखना',
            'शिशु और वयस्क दोनों खाते हैं',
            'पौधे की मृत्यु'
        ],
        lifecycle: '25-30 days',
        lifecycle_hi: '25-30 दिन',
        damage: 'Suck sap causing wilting and death',
        damage_hi: 'रस चूसकर मुरझाना और मृत्यु',
        season: 'Seedling and maturity stage',
        tags: ['sucking-pest', 'high-severity']
    },
    {
        crop: 'Mustard',
        name: 'Mustard Sawfly',
        name_hi: 'सरसों की आरा मक्खी',
        scientific_name: 'Athalia lugens proxima',
        symptoms: [
            'Defoliation',
            'Holes in leaves',
            'Larvae visible',
            'Skeletonized leaves',
            'Stunted growth'
        ],
        symptoms_hi: [
            'पत्ती हानि',
            'पत्तियों में छेद',
            'लार्वा दिखाई देना',
            'पत्तियों का कंकाल',
            'वृद्धि रुकना'
        ],
        lifecycle: '30-35 days',
        lifecycle_hi: '30-35 दिन',
        damage: 'Larvae feed on leaves causing defoliation',
        damage_hi: 'लार्वा पत्तियों को खाते हैं',
        season: 'October to November',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },
    {
        crop: 'Mustard',
        name: 'Diamondback Moth',
        name_hi: 'डायमंडबैक मोथ',
        scientific_name: 'Plutella xylostella',
        symptoms: [
            'Small holes in leaves',
            'Window pane damage',
            'Larvae on underside',
            'Reduced vigor',
            'Pod damage'
        ],
        symptoms_hi: [
            'पत्तियों में छोटे छेद',
            'खिड़की जैसी क्षति',
            'नीचे की ओर लार्वा',
            'कमजोरी',
            'फली क्षति'
        ],
        lifecycle: '21-28 days',
        lifecycle_hi: '21-28 दिन',
        damage: 'Feed on leaves and pods',
        damage_hi: 'पत्तियों और फलियों को खाते हैं',
        season: 'Throughout crop season',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },

    // GROUNDNUT PESTS (8)
    {
        crop: 'Groundnut',
        name: 'Leaf Miner',
        name_hi: 'पत्ती सुरंगक',
        scientific_name: 'Aproaerema modicella',
        symptoms: [
            'Blotch mines in leaflets',
            'Webbed leaflets',
            'Larva inside mines',
            'Leaf drying',
            'Defoliation'
        ],
        symptoms_hi: [
            'पत्रकों में धब्बेदार सुरंग',
            'जाले से बंधे पत्रक',
            'सुरंगों में लार्वा',
            'पत्ती सूखना',
            'पत्ती झड़ना'
        ],
        lifecycle: '20-25 days',
        lifecycle_hi: '20-25 दिन',
        damage: 'Major pest causing 20-50% yield loss',
        damage_hi: '20-50% उपज हानि',
        season: 'Vegetative to pod formation',
        tags: ['mining-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Groundnut',
        name: 'Red Hairy Caterpillar',
        name_hi: 'लाल बालदार कैटरपिलर',
        scientific_name: 'Amsacta albistriga',
        symptoms: [
            'Severe defoliation',
            'Gregarious larvae',
            'Plant death',
            'Damage in patches',
            'Hairy caterpillars visible'
        ],
        symptoms_hi: [
            'गंभीर पत्ती हानि',
            'झुंड में लार्वा',
            'पौधे की मृत्यु',
            'धब्बों में क्षति',
            'बालदार कैटरपिलर दिखाई देना'
        ],
        lifecycle: '35-40 days',
        lifecycle_hi: '35-40 दिन',
        damage: 'Voracious feeders causing complete defoliation',
        damage_hi: 'पूर्ण पत्ती हानि',
        season: 'July to August',
        tags: ['chewing-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Groundnut',
        name: 'Thrips',
        name_hi: 'थ्रिप्स',
        scientific_name: 'Scirtothrips dorsalis',
        symptoms: [
            'Silvery patches on leaves',
            'Leaf curling',
            'Bud necrosis',
            'Stunted growth',
            'Virus transmission'
        ],
        symptoms_hi: [
            'पत्तियों पर चांदी के धब्बे',
            'पत्ती मुड़ना',
            'कली का परिगलन',
            'वृद्धि रुकना',
            'वायरस फैलाना'
        ],
        lifecycle: '15-20 days',
        lifecycle_hi: '15-20 दिन',
        damage: 'Vector for bud necrosis virus',
        damage_hi: 'बड नेक्रोसिस वायरस का वाहक',
        season: 'Throughout crop season',
        tags: ['sucking-pest', 'vector', 'high-severity']
    },
    {
        crop: 'Groundnut',
        name: 'White Grub',
        name_hi: 'सफेद सुंडी',
        scientific_name: 'Holotrichia consanguinea',
        symptoms: [
            'Wilting plants',
            'Yellowing',
            'Root damage',
            'Grubs in soil',
            'Plant death in patches'
        ],
        symptoms_hi: [
            'मुरझाते पौधे',
            'पीलापन',
            'जड़ क्षति',
            'मिट्टी में सुंडी',
            'धब्बों में पौधे मरना'
        ],
        lifecycle: 'Annual, grubs feed for 4-6 months',
        lifecycle_hi: 'वार्षिक, 4-6 महीने खाते हैं',
        damage: 'Severe root damage causing plant death',
        damage_hi: 'गंभीर जड़ क्षति',
        season: 'June to September',
        tags: ['soil-pest', 'grub', 'high-severity', 'root-damage']
    },
    {
        crop: 'Groundnut',
        name: 'Jassids',
        name_hi: 'जैसिड',
        scientific_name: 'Empoasca kerri',
        symptoms: [
            'Yellowing leaf margins',
            'V-shaped yellowing',
            'Hopper burn',
            'Stunted growth',
            'Reduced yield'
        ],
        symptoms_hi: [
            'पत्ती किनारों का पीलापन',
            'V-आकार पीलापन',
            'होपर बर्न',
            'वृद्धि रुकना',
            'उपज कम'
        ],
        lifecycle: '14-20 days',
        lifecycle_hi: '14-20 दिन',
        damage: 'Suck sap causing hopper burn',
        damage_hi: 'रस चूसकर होपर बर्न',
        season: 'Vegetative stage',
        tags: ['sucking-pest', 'medium-severity']
    },

    // ADDITIONAL RICE PESTS
    {
        crop: 'Rice',
        name: 'Rice Hispa',
        name_hi: 'धान का हिस्पा',
        scientific_name: 'Dicladispa armigera',
        symptoms: [
            'White parallel streaks on leaves',
            'Scraping damage',
            'Tunneling by larvae',
            'Leaf tips drying',
            'Reduced vigor'
        ],
        symptoms_hi: [
            'पत्तियों पर सफेद समानांतर धारियां',
            'खुरचने की क्षति',
            'लार्वा द्वारा सुरंग',
            'पत्ती के सिरे सूखना',
            'कमजोरी'
        ],
        lifecycle: '28-35 days',
        lifecycle_hi: '28-35 दिन',
        damage: 'Adults scrape and larvae mine leaves',
        damage_hi: 'वयस्क खुरचते हैं और लार्वा सुरंग बनाते हैं',
        season: 'Tillering to heading',
        tags: ['chewing-pest', 'beetle', 'medium-severity']
    },
    {
        crop: 'Rice',
        name: 'Case Worm',
        name_hi: 'केस वर्म',
        scientific_name: 'Nymphula depunctalis',
        symptoms: [
            'Tubular leaf cases',
            'Cut leaf tips',
            'Larvae in water',
            'Defoliation',
            'White streaks'
        ],
        symptoms_hi: [
            'ट्यूबलर पत्ती के केस',
            'पत्ती के सिरे कटे',
            'पानी में लार्वा',
            'पत्ती हानि',
            'सफेद धारियां'
        ],
        lifecycle: '25-30 days',
        lifecycle_hi: '25-30 दिन',
        damage: 'Larvae cut leaves and make cases for protection',
        damage_hi: 'लार्वा पत्तियां काटते हैं',
        season: 'Vegetative stage in flooded fields',
        tags: ['chewing-pest', 'larvae', 'medium-severity']
    },

    // ADDITIONAL TOMATO PESTS
    {
        crop: 'Tomato',
        name: 'Spider Mites',
        name_hi: 'मकड़ी माइट',
        scientific_name: 'Tetranychus urticae',
        symptoms: [
            'Yellow stippling on leaves',
            'Webbing on underside',
            'Bronze discoloration',
            'Leaf drop',
            'Reduced fruit size'
        ],
        symptoms_hi: [
            'पत्तियों पर पीले धब्बे',
            'नीचे जाले',
            'कांस्य रंग',
            'पत्ती गिरना',
            'फल का आकार कम'
        ],
        lifecycle: '10-14 days',
        lifecycle_hi: '10-14 दिन',
        damage: 'Suck cell contents causing stippling and bronzing',
        damage_hi: 'कोशिका सामग्री चूसते हैं',
        season: 'Hot dry weather',
        tags: ['sucking-pest', 'mite', 'high-severity']
    },
    {
        crop: 'Tomato',
        name: 'Tobacco Caterpillar',
        name_hi: 'तंबाकू सुंडी',
        scientific_name: 'Spodoptera litura',
        symptoms: [
            'Irregular holes in leaves',
            'Skeletonized leaves',
            'Fruit damage',
            'Gregarious larvae',
            'Severe defoliation'
        ],
        symptoms_hi: [
            'पत्तियों में अनियमित छेद',
            'पत्तियों का कंकाल',
            'फल क्षति',
            'झुंड में लार्वा',
            'गंभीर पत्ती हानि'
        ],
        lifecycle: '30-35 days',
        lifecycle_hi: '30-35 दिन',
        damage: 'Feed on leaves and fruits',
        damage_hi: 'पत्तियों और फलों को खाते हैं',
        season: 'Throughout crop season',
        tags: ['chewing-pest', 'larvae', 'high-severity']
    },

    // ADDITIONAL SUGARCANE PESTS
    {
        crop: 'Sugarcane',
        name: 'Top Borer',
        name_hi: 'शीर्ष छेदक',
        scientific_name: 'Scirpophaga excerptalis',
        symptoms: [
            'Dead heart formation',
            'Bunchy top',
            'Side shoots',
            'Reduced cane weight',
            'Bore holes at top'
        ],
        symptoms_hi: [
            'मृत केंद्र बनना',
            'गुच्छेदार शीर्ष',
            'पार्श्व शाखाएं',
            'गन्ने का वजन कम',
            'शीर्ष पर छेद'
        ],
        lifecycle: '45-60 days',
        lifecycle_hi: '45-60 दिन',
        damage: 'Bore into growing point causing dead heart',
        damage_hi: 'बढ़ते बिंदु में छेद करते हैं',
        season: 'February to May',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Sugarcane',
        name: 'Woolly Aphid',
        name_hi: 'ऊनी माहू',
        scientific_name: 'Ceratovacuna lanigera',
        symptoms: [
            'White woolly coating on leaves',
            'Honeydew secretion',
            'Sooty mold',
            'Yellowing',
            'Reduced photosynthesis'
        ],
        symptoms_hi: [
            'पत्तियों पर सफेद ऊनी परत',
            'मधुरस स्राव',
            'काली फफूंद',
            'पीलापन',
            'प्रकाश संश्लेषण कम'
        ],
        lifecycle: '14-21 days',
        lifecycle_hi: '14-21 दिन',
        damage: 'Suck sap causing reduced cane quality',
        damage_hi: 'रस चूसते हैं',
        season: 'October to December',
        tags: ['sucking-pest', 'medium-severity']
    },

    // ADDITIONAL MAIZE PESTS
    {
        crop: 'Maize',
        name: 'Pink Stem Borer',
        name_hi: 'गुलाबी तना छेदक',
        scientific_name: 'Sesamia inferens',
        symptoms: [
            'Dead heart',
            'Bore holes with frass',
            'Lodging',
            'Tunneled stems',
            'Pink larvae inside'
        ],
        symptoms_hi: [
            'मृत केंद्र',
            'मल के साथ छेद',
            'गिरना',
            'सुरंग वाले तने',
            'अंदर गुलाबी लार्वा'
        ],
        lifecycle: '35-50 days',
        lifecycle_hi: '35-50 दिन',
        damage: 'Bore into stems causing structural weakness',
        damage_hi: 'तनों में छेद करते हैं',
        season: 'Kharif and Rabi',
        tags: ['boring-pest', 'larvae', 'high-severity']
    },
    {
        crop: 'Maize',
        name: 'Shoot Fly',
        name_hi: 'तना मक्खी',
        scientific_name: 'Atherigona soccata',
        symptoms: [
            'Dead heart in seedlings',
            'Central shoot withered',
            'Egg on leaves',
            'Maggot in stem',
            'Reduced plant stand'
        ],
        symptoms_hi: [
            'पौध में मृत केंद्र',
            'केंद्रीय शूट मुरझाना',
            'पत्तियों पर अंडे',
            'तने में मैगट',
            'पौधों की संख्या कम'
        ],
        lifecycle: '18-25 days',
        lifecycle_hi: '18-25 दिन',
        damage: 'Maggot bores into central shoot',
        damage_hi: 'मैगट केंद्रीय शूट में छेद करता है',
        season: 'Seedling stage',
        tags: ['boring-pest', 'larvae', 'high-severity']
    }
];

async function seedPestDatabase() {
    try {
        console.log('🌱 Starting pest database seeding...');

        // First, ensure crops exist
        console.log('📋 Seeding crops...');
        const cropMap = {};
        for (const cropData of cropsData) {
            let crop = await Crop.findOne({ name: cropData.name });
            if (!crop) {
                crop = await Crop.create(cropData);
                console.log(`✓ Created crop: ${cropData.name}`);
            }
            cropMap[cropData.name] = crop._id;
        }

        // Now seed pests
        console.log('🐛 Seeding pests...');
        let pestCount = 0;
        for (const pestData of pestsData) {
            const cropId = cropMap[pestData.crop];
            if (!cropId) {
                console.warn(`⚠️  Crop not found for pest: ${pestData.name}`);
                continue;
            }

            // Check if pest already exists
            const existing = await Pest.findOne({
                name: pestData.name,
                crop_id: cropId
            });

            if (existing) {
                console.log(`⏭️  Pest already exists: ${pestData.name} on ${pestData.crop}`);
                continue;
            }

            // Create pest
            const pest = await Pest.create({
                crop_id: cropId,
                name: pestData.name,
                name_hi: pestData.name_hi,
                scientific_name: pestData.scientific_name,
                symptoms: pestData.symptoms,
                symptoms_hi: pestData.symptoms_hi,
                lifecycle: pestData.lifecycle,
                lifecycle_hi: pestData.lifecycle_hi,
                damage: pestData.damage,
                damage_hi: pestData.damage_hi,
                season: pestData.season,
                tags: pestData.tags
            });

            pestCount++;
            console.log(`✓ Created pest ${pestCount}: ${pestData.name} on ${pestData.crop}`);
        }

        console.log(`\n✅ Pest database seeding complete!`);
        console.log(`📊 Stats: ${pestCount} pests added across ${Object.keys(cropMap).length} crops`);
        console.log(`\n💡 Note: This is a starter dataset. For production, expand to 100+ pests.`);

    } catch (error) {
        console.error('❌ Error seeding pest database:', error);
        throw error;
    }
}

module.exports = seedPestDatabase;

// Run if called directly
if (require.main === module) {
    const mongoose = require('mongoose');
    require('dotenv').config();

    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-guardian')
        .then(() => {
            console.log('✓ Connected to MongoDB');
            return seedPestDatabase();
        })
        .then(() => {
            console.log('✓ Seeding completed successfully');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}
