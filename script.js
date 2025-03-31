var map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var salutations = {
    "France": "Bonjour",
    "Espagne": "Hola",
    "Allemagne": "Guten Tag",
    "Japon": "こんにちは (Konnichiwa)",
    "Chine": "你好 (Nǐ hǎo)",
    "Russie": "Здравствуйте (Zdravstvuyte)",
    "Brésil": "Olá",
    "Italie": "Ciao",
    "Inde": "नमस्ते (Namaste)",
    "Tunisie": "أهلاً (Ahlan)",
    "Algérie": "سلام (Salam)",
    "Maroc": "السلام عليكم (As-salāmu ʿalaykum)",
    "Libye": "مرحباً (Marhaban)",
    "Égypte": "أهلاً وسهلاً (Ahlan wa sahlan)",
    "États-Unis": "What's up?",
    "Canada": "Hey, how's it going?",
    "Mexique": "¡Qué onda!",
    "Australie": "G'day mate!",
    "Royaume-Uni": "Alright mate?",
    "Irlande": "Dia dhuit (Hello in Irish)",
    "Corée du Sud": "안녕하세요 (Annyeonghaseyo)",
    "Nigeria": "How far?",
    "Pays-Bas": "Hoi!",
    "Finlande": "Moi!",
    "Argentine": "¡Che, qué tal!",
    "Colombie": "¿Qué más?",
    "Portugal": "Olá, tudo bem?",
    "Pologne": "Cześć!",
    "Grèce": "Γειά σας (Yia sas)",
    "Islande": "Halló!",
    "Venezuela": "¿Qué tal?",
    "Philippines": "Kumusta!"
};

// Ajout des marqueurs 
for (var pays in salutations) {
    L.marker(getCoordinates(pays)).addTo(map)
        .bindPopup(`<b>${pays}</b><br>${salutations[pays]}`)
        .on('click', function (e) {
            var country = this.getPopup().getContent().split("<br>")[0].replace("<b>", "").replace("</b>", "");
            var language = getLanguageForCountry(country);
            document.getElementById('salutation').innerText = "Dans " + country + ", on dit : " + salutations[country];
            document.getElementById('speakBtn').style.display = "inline-block"; 
            document.getElementById('speakBtn').onclick = function () {
                speakText(salutations[country], language); 
            };
        });
}

function getCoordinates(country) {
    var coords = {
        "France": [48.8566, 2.3522],
        "Espagne": [40.4168, -3.7038],
        "Allemagne": [52.5200, 13.4050],
        "Japon": [35.6895, 139.6917],
        "Chine": [39.9042, 116.4074],
        "Russie": [55.7558, 37.6173],
        "Brésil": [-15.8267, -47.9218],
        "Italie": [41.9028, 12.4964],
        "Inde": [28.6139, 77.2090],
        "Tunisie": [33.8869, 9.5375],
        "Algérie": [36.7528, 3.0420],
        "Maroc": [34.020882, -6.84165],
        "Libye": [32.8872, 13.1913],
        "Égypte": [30.802498, 29.818724],
        "États-Unis": [37.0902, -95.7129],
        "Canada": [56.1304, -106.3468],
        "Mexique": [23.6345, -102.5528],
        "Australie": [-25.2744, 133.7751],
        "Royaume-Uni": [51.5074, -0.1278],
        "Irlande": [53.3498, -6.2603],
        "Corée du Sud": [35.9078, 127.7669],
        "Nigeria": [9.082, 8.6753],
        "Pays-Bas": [52.3794, 4.9009],
        "Finlande": [61.9241, 25.7482],
        "Argentine": [-38.4161, -63.6167],
        "Colombie": [4.5709, -74.2973],
        "Portugal": [39.3999, -8.2245],
        "Pologne": [51.9194, 19.1451],
        "Grèce": [39.0742, 21.8243],
        "Islande": [64.9631, -19.0208],
        "Venezuela": [6.4238, -66.5897],
        "Philippines": [12.8797, 121.7740]
    };
    return coords[country];
}

// speech service 
function initializeSpeechService(language) {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("uLNOpO3U7fQlqIesUiA256thChD7isuuc4bpY134GbYs109jS3SSJQQJ99BCACYeBjFXJ3w3AAAYACOGZbJf", "eastus");
    let voiceName = "";
    switch(language) {
        case "fr-FR":
            voiceName = "fr-FR-HenriNeural";
            break;
        case "es-ES":
            voiceName = "es-ES-AlvaroNeural";
            break;
        case "de-DE":
            voiceName = "de-DE-KatjaNeural";
            break;
        case "ja-JP":
            voiceName = "ja-JP-NanamiNeural";
            break;
        case "zh-CN":
            voiceName = "zh-CN-XiaoxiaoNeural";
            break;
        case "ru-RU":
            voiceName = "ru-RU-DaryaNeural";
            break;
        case "pt-BR":
            voiceName = "pt-BR-AntonioNeural";
            break;
        case "it-IT":
            voiceName = "it-IT-GiorgioNeural";
            break;
        case "hi-IN":
            voiceName = "hi-IN-AditiNeural";
            break;
        case "en-US":
            voiceName = "en-US-GuyNeural";
            break;
        default:
            voiceName = "en-US-GuyNeural";
            break;
    }
    speechConfig.speechSynthesisVoiceName = voiceName;
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    return synthesizer;
}
// azure speech
function speakText(salutation, language) {
    const synthesizer = initializeSpeechService(language);
    synthesizer.speakTextAsync(
        salutation,
        function (result) {
            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.log("Le discours a été synthétisé avec succès.");
            } else {
                console.error("Erreur lors de la synthèse vocale : " + result.errorDetails);
            }
        },
        function (error) {
            console.error("Erreur Azure Speech Service : " + error.details);
            alert("Une erreur est survenue avec le service de synthèse vocale Azure : " + error.details);
        }
    );
}
function getLanguageForCountry(country) {
    const languages = {
        "France": "fr-FR",
        "Espagne": "es-ES",
        "Allemagne": "de-DE",
        "Japon": "ja-JP",
        "Chine": "zh-CN",
        "Russie": "ru-RU",
        "Brésil": "pt-BR",
        "Italie": "it-IT",
        "Inde": "hi-IN",
        "Tunisie": "fr-FR",
        "Algérie": "fr-FR",
        "Maroc": "fr-FR",
        "Libye": "ar-LY",
        "Égypte": "ar-EG",
        "États-Unis": "en-US",
        "Canada": "en-CA",
        "Mexique": "es-MX",
        "Australie": "en-AU",
        "Royaume-Uni": "en-GB",
        "Irlande": "en-IE",
        "Corée du Sud": "ko-KR",
        "Nigeria": "en-NG",
        "Pays-Bas": "nl-NL",
        "Finlande": "fi-FI",
        "Argentine": "es-AR",
        "Colombie": "es-CO",
        "Portugal": "pt-PT",
        "Pologne": "pl-PL",
        "Grèce": "el-GR",
        "Islande": "is-IS",
        "Venezuela": "es-VE",
        "Philippines": "tl-PH"
    };
    return languages[country] || "en-US";
}
