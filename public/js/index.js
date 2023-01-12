let exit = false;
let synth = window.speechSynthesis;
let utterThis = new SpeechSynthesisUtterance();
utterThis.lang = 'de-DE'
utterThis.pitch = '0.9'
utterThis.rate = '0.9'
utterThis.voice = speechSynthesis.getVoices()[0];

let response = document.getElementById("result-text");
let first = true;


// Hier kunnen we de variabelen updaten. Ik heb de variabelen opgedeeld in 3 arrays
let apiCall = {
    "producten": "",
    "maten": "",
    "kleuren": "",
}
let producten = {
    "t-shirts": 't-shirts',
    "shirts": 'shirts',
    "jeans": 'jeans',
    "broek": 'broek',
    "schoenen": 'schoenen',
    "spijkerbroeken": 'spijkerbroeken',
    "trainingspakken": 'trainingspakken',
}

let maten = {
    "klein": 'klein',
    "small": 'small',
    "medium": 'medium',
    "groot": 'groot',
    "extra-groot": 'extra-groot',
    "XL": 'XL',
    "large": 'large',
}

let kleuren = {
    "rood": 'rood',
    "blauw": 'blauw',
    "groen": 'groen',
    "geel": 'geel',
    "paars": 'paars',
    "lila": 'lila',
}

let kleurenList = [
    "rood",
    "blauw",
    "groen",
    "geel",
    "paars",
    "lila",
]
let matenList = [
    "klein",
    "small",
    "medium",
    "groot",
    "extra-groot",
    "XL",
    "large",
]

let altTekstenProductAfbeeldingen = [
    // Change one two three into Dutch 
    "1 - Active Sport Legging: De Dolly Sportsleggings zijn gesneden uit een hoogwaardige Italiaanse sportstof en hebben een glanzende afwerking voor de ultieme 80's look. Dit high-rise paar heeft een brede tailleband die de kern gladstrijkt en ondersteunt. Draag ze met de Dolly Sports BH en sneakers. Je kunt echt gaan sporten maar ook de legging rocken voor een actieve dag. Het model draagt maat extra small en is 1m70.",
    "2 - Nylon Sports Sweater: Deze nylon sporttrui wordt je nieuwe favoriete item tijdens het stelen van de show tijdens een workout buiten of tijdens een drankje. Sportief en layback qua pasvorm, stijlvol qua uiterlijk, met ons DS logo op de borst en Dolly logo op de rug. Een verborgen zak is toegevoegd in de zijnaad om je waardevolle spullen te bewaren tijdens de training. Combineer met de Classic trackpants of de Active Sportslegging. Het model draagt maat small en is 1m77.",
    "3 - Team Dolly Trackpants: De DS joggingbroek is een klassieker in je garderobe. Draag hem thuis, naar de sportschool of in de stad. Voorzien van heupzakken, DS-borduursel en een elastische tailleband met een flexibel trekkoord voor een comfortabele pasvorm. Combineer hem met het DS sweatshirt voor de volledige Dolly-look of mix hem. Rol de broekspijpen op als de lengte te lang is of combineer hem met onze DS-sokken. Dit kledingstuk is geverfd waardoor het na verloop van tijd een verwassen, vintage look krijgt. Het model is 1,75 en draagt maat S. 100% katoen, binnenstebuiten wassen op max 40 graden, niet strijken, lage temperatuur drogen. Dit is een limited edition en wordt binnen 48 uur naar u verzonden. Omdat we een limited edition merk zijn hebben we geen voorraad. Daarom kunnen we niet altijd een omruiling in maat of kleur honoreren.",
    "Welk product nummer wil je bekijken?"
]
let productKeys = {
    "1": "1",
    "2": "2",
    "3": "3",
}
// let textToNumber = {
//     // Change one two three into Dutch 

//     "one": altTekstenProductAfbeeldingen[0],
//     "two": altTekstenProductAfbeeldingen[1],
//     "three": altTekstenProductAfbeeldingen[2],


// }

function createChatBotMessage(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("chat-box-body-send");
    let Textmessage = document.createElement("p");
    Textmessage.innerHTML = message;

    messageElement.appendChild(Textmessage);
    let chatBox = document.querySelector(".chat-box-body");
    chatBox.appendChild(messageElement);
}

function appendUserMessage(message) {
    let messageElement = document.createElement("div");
    messageElement.classList.add("chat-box-body-receive");
    let Textmessage = document.createElement("p");
    Textmessage.innerHTML = message;

    messageElement.appendChild(Textmessage);
    let chatBox = document.querySelector(".chat-box-body");
    chatBox.appendChild(messageElement);
}

function welcomeMessage() {
    setTimeout(async () => {
        let url = `https://speech-to-speech-chatbot.netlify.app/audio-files/music.mp3`
        let audio = new Audio(url);
        audio.play().then(async () => {
            document.getElementsByClassName('chat-button')[0].click()
        });
        setTimeout(async () => {
            let speakAudio1 = new Audio('https://speech-to-speech-chatbot.netlify.app/audio-files/audio1.mp3');
            let speakAudio2 = new Audio('https://speech-to-speech-chatbot.netlify.app/audio-files/audio2.mp3');
            speakAudio1.volume = 1.0;
            speakAudio2.volume = 1.0;
            speakAudio1.play();
            speakAudio1.addEventListener('ended', function () {
                speakAudio2.play();
            });
            speakAudio2.addEventListener('ended', function () {
                isSpeaking = false;
                document.getElementsByClassName('btn-mic')[0].click()

            });
            let interval = setInterval(() => {
                audio.volume -= 0.01;
                if (audio.volume <= 0.04) {
                    clearInterval(interval);
                }
            }, 50);
        }, 10000);
    }, 0);
}


let isListening = false;
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'nl-NL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let filterBy = {
    "size": false,
    "color": false,
}
let productFound = false;
let isSpeaking = false;
let isSelectingProduct = false;
let isSelectingColor = false;
let isSelectingSize = false;
let speakText = {
    'speakAudio1': 'audio1.mp3',
    'speakAudio2': 'audio2.mp3',
    'speakAudio3': 'audio3.mp3',
    'speakAudio4': 'audio4.mp3',
    'speakAudio5': 'audio5.mp3',
    'speakAudio6': 'audio6.mp3',
    'speakAudio7': 'audio7.mp3',
    'speakAudio8': 'audio8.mp3',
    'speakAudio9': 'audio9.mp3',
    'productAudio1': 'audio 1 sample.mp3',
    'productAudio2': 'audio 2 sample.mp3',
    'productAudio3': 'audio 3 sample.mp3',
    'notFound': 'audio niet verstaan.mp3',
    'backgroundMusic': 'music.mp3',
}
async function playAudio(speakAudio) {
    return new Promise(resolve => {
        let url = `https://speech-to-speech-chatbot.netlify.app/audio-files/${speakText[speakAudio]}`
        let audio = new Audio(url);
        audio.play();
        audio.onended = () => {
            return resolve();
        }
    })
}
async function alternateSpeak(speakAudio, isStart) {
    await playAudio(speakAudio).then(() => {
        if (isStart) {
            recognition.start();
        }
    })
}
async function speak(text) {
    context = new AudioContext();
    request = new XMLHttpRequest();
    request.open("GET", `https://speech-to-speech-chatbot.netlify.app/speak?speaktext=${text.text}&filename='test'`, true);
    request.responseType = "arraybuffer";

    request.onerror = (error) => {
        console.log("error", error);
    }

    await request.send();
    return new Promise(resolve => {
        return request.onload = () => {
            context.decodeAudioData(request.response, (buffer) => {
                source = context.createBufferSource();
                source.buffer = buffer;
                source.connect(context.destination);
                // autoplay
                source.start(0); // start was previously noteOn
                source.onended = () => {
                    return resolve();
                };
            });

        };
    });

}
let matchFound = false;

async function startSpeechRecognition() {
    recognition.onresult = async function (event) {

        const speechResult = event.results[0][0].transcript.toLowerCase();
        appendUserMessage(speechResult);
        // response.value = response.value + "\n" + speechResult;

        let splitText = speechResult.split(" ");

        for (let j = 0; j < splitText.length; j++) {



            if (!isSelectingSize && splitText.includes('maten') || splitText.includes('opmaat') || splitText.includes('maat')) {
                utterThis.text =
                    `Welke van de volgende maten draag je normaliter voor kleding en broeken? Small, Medium, Large of Extra Large`;
                apiCall.maten = maten[splitText[j]];
                createChatBotMessage(utterThis.text);
                recognition.stop();
                await alternateSpeak('speakAudio3', true)
                matchFound = true;
                filterBy.size = true;
                isSelectingSize = true;
            }

            if (splitText.includes(maten[splitText[j]]) && filterBy.size == true) {
                // List the products
                utterThis.text = `We hebben 3 producten voor je gevonden.`;
                createChatBotMessage(utterThis.text);


                for (let i = 0; i < altTekstenProductAfbeeldingen.length; i++) {
                    utterThis.text = altTekstenProductAfbeeldingen[i];
                    createChatBotMessage(utterThis.text);
                }

                isSpeaking = true;
                await alternateSpeak('speakAudio4', false)

                isSpeaking = true;
                await alternateSpeak('productAudio1', false);

                isSpeaking = true;
                await alternateSpeak('productAudio2', false);

                isSpeaking = true;
                await alternateSpeak('productAudio3', false);
                utterThis.text = `Welk product nummer wil je bekijken?`;
                createChatBotMessage(utterThis.text);
                await alternateSpeak('speakAudio5', true)
                apiCall.maten = maten[splitText[j]];
                matchFound = true;
                productFound = true;
            }

            if (!isSelectingColor && speechResult.includes("kleuren") || speechResult.includes("kleur") || speechResult.includes("color")) {
                utterThis.text = `Wij hebben deze mooie zomer kleuren voor je gevonden naar welke kleur gaat je voorkeur naar uit? De kleuren zijn: rood, groen, geel, paars of lila`;
                createChatBotMessage(utterThis.text);
                recognition.stop();

                isSpeaking = true;
                await alternateSpeak('speakAudio6', true)
                filterBy.color = true;
                matchFound = true;
            }
            if (speechResult.includes(kleuren[splitText[j]]) && filterBy.color == true) {
                // List the products
                utterThis.text = `We hebben 3 producten voor je gevonden.`;
                createChatBotMessage(utterThis.text);

                for (let i = 0; i < altTekstenProductAfbeeldingen.length; i++) {
                    utterThis.text = altTekstenProductAfbeeldingen[i];
                    createChatBotMessage(utterThis.text);
                }
                utterThis.text = `Welk product nummer wil je bekijken?`;
                isSpeaking = true;
                await alternateSpeak('speakAudio4', false)

                isSpeaking = true;
                await alternateSpeak('productAudio1', false);

                isSpeaking = true;
                await alternateSpeak('productAudio2', false);

                isSpeaking = true;
                await alternateSpeak('productAudio3', false);
                createChatBotMessage(utterThis.text);

                isSpeaking = true;
                await alternateSpeak('speakAudio7', true)
                apiCall.kleuren = kleuren[splitText[j]];
                matchFound = true;
                productFound = true;

            }

            if (speechResult.includes(productKeys[splitText[j]]) || altTekstenProductAfbeeldingen.includes(splitText) && productFound == true) {
                utterThis.text = "Top! Wil je naar de productpagina?"
                createChatBotMessage(utterThis.text);

                isSpeaking = true;
                await alternateSpeak('speakAudio8', true)
                recognition.stop();
                matchFound = true;
            }
            if (speechResult.includes("yes") || speechResult.includes("ja") && (apiCall
                .kleuren != "" || apiCall.maten != "")) {
                // Move to product page exit code follows
                // This code only runs if product, size and color is selected by user and the item is available
                utterThis.text = "Top! Ik breng je naar de productpagina. Ik hoop je fijn geholpen te hebben vandaag, tot snel! Doei doei!"
                createChatBotMessage(utterThis.text);

                isSpeaking = true;
                await alternateSpeak('speakAudio9', true);
                recognition.stop();
                exit = true;
                matchFound = true;
                window.open('https://www.dollysports.com/products/nylon-sports-sweater-2', '_blank');
            }

        }
        if (!matchFound) {
            utterThis.text = "Dat heb ik niet verstaan, kun je antwoord geven op de vorige vraag."
            createChatBotMessage(utterThis.text);
            // Audio file is not given for this step
            // await speak(utterThis);
            await alternateSpeak('notFound', true)
            matchFound = false;
        }
    }

    recognition.onspeechend = function () {
        console.log('Speech ended');
        document.getElementById("mic").classList.add("fa-microphone-slash");
        document.getElementById("mic").classList.remove("fa-microphone");
        isSpeaking = false;
        isListening = false;
        if (!matchFound) {
            recognition.start();
        }
    }

    recognition.onerror = function (event) {
        console.log(event);
        recognition.start();
    }
}

$('.chat-button').on('click', async function () {
    $('.chat-button').css({ "display": "none" });
    $('.chat-box').css({ "visibility": "visible" });
    setTimeout(() => {
        document.getElementsByClassName('btn-mic')[0].focus();
    }, 1000);
    // utterThis.text = "Hallo! Welkom bij Dolly Sports. Hoe kunnen we je vandaag helpen?";
    // createChatBotMessage(utterThis.text);
    // await speak(utterThis).then(async () => {


    // });
    utterThis.text = "Zou je op maat of kleur naar je favoriete product willen zoeken?";
    createChatBotMessage(utterThis.text);


});

document.getElementsByClassName("btn-mic")[0].onclick = async () => {
    if (isSpeaking) return;
    if (document.getElementById("mic").classList.contains("fa-microphone")) {
        document.getElementById("mic").classList.remove("fa-microphone");
        document.getElementById("mic").classList.add("fa-microphone-slash");
        isListening = false;
        recognition.stop();
    }
    else {
        if (document.getElementById("mic").classList.contains("fa-microphone-slash")) {
            document.getElementById("mic").classList.remove("fa-microphone-slash");
            document.getElementById("mic").classList.add("fa-microphone");
            isListening = true;
            recognition.stop()
            startSpeechRecognition();
            recognition.start();
        }
    }
};
$('.chat-box .chat-box-header p').on('click', function () {
    if (isSpeaking) return;
    $('.chat-button').css({ "display": "block" });
    $('.chat-box').css({ "visibility": "hidden" });
    $('.chat-box-body').empty();
    recognition.stop();
})
document.onkeypress = function (e) {
    if (isSpeaking) return;
    e = e || window.event;
    let el = document.getElementsByClassName('chat-box')[0];
    let isOpen = window.getComputedStyle(el).visibility === "visible" ? true : false;
    if (e.keyCode == 77 && isOpen && !isSpeaking) {
        document.getElementById("mic").click();
    }
}
