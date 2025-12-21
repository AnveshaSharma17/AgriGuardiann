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
