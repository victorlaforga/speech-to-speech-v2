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
    'Rood Jeans Product',
    'Purple Jeans ',
    'Geel Jeans',

]
let productKeys = {
    "one": "one",
    "two": "two",
    "three": "three",
    "four": "four",
    "five": "five",
    "six": "six",
}
let textToNumber = {
    // Change one two three into Dutch 

    "one": altTekstenProductAfbeeldingen[0],
    "two": altTekstenProductAfbeeldingen[1],
    "three": altTekstenProductAfbeeldingen[2],


}

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
        utterThis.text = "Hallo daar! Wij zijn Team Dolly en wij laten je elke dag als een trofee schijnen! Klik op de tab toets om te starten";
        await alternateSpeak('speakAudio2').then(() => {
            document.getElementsByClassName('chat-button')[0].click();

        });
    }, 100);

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

}
async function alternateSpeak(speakAudio) {
    return new Promise(resolve => {
        let url = `http://localhost:3000/audio-files/${speakText[speakAudio]}`
        let audio = new Audio(url);
        audio.play();
        audio.onended = () => {
            return resolve();
        }
    })
}
async function speak(text) {
    context = new AudioContext();
    request = new XMLHttpRequest();
    request.open("GET", `http://localhost:3000/speak?speaktext=${text.text}&filename='test'`, true);
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
                    console.log("Context ended");
                    return resolve();
                };
            });

        };
    });
    // isSpeaking = true;
    // console.log(text.text);
    // utterThis.text = text.text;
    // synth.speak(utterThis);
    // utterThis.onstart = function (event) {
    //     console.log("Started speaking");
    // }
    // return new Promise(resolve => {
    //     utterThis.onend = () => {
    //         synth.cancel();
    //         isSpeaking = false;
    //         return resolve();
    //     };

    // });
}

async function startSpeechRecognition() {
    recognition.start();
    recognition.onresult = async function (event) {

        const speechResult = event.results[0][0].transcript.toLowerCase();
        appendUserMessage(speechResult);
        // response.value = response.value + "\n" + speechResult;

        let splitText = speechResult.split(" ");
        let matchFound = false;

        for (let j = 0; j < splitText.length; j++) {



            if (!isSelectingSize && splitText.includes('maat') || splitText.includes('maten') || splitText.includes('opmaat')) {
                console.log("IsSelecting Size " + isSelectingSize);
                utterThis.text =
                    `Welke maat heb normaal? ${matenList.toString()}`;
                apiCall.maten = maten[splitText[j]];
                createChatBotMessage(utterThis.text);
                recognition.stop();
                await alternateSpeak('speakAudio3');
                matchFound = true;
                filterBy.size = true;
                isSelectingSize = true;
            }

            if (splitText.includes(maten[splitText[j]]) && filterBy.size == true) {
                // List the products
                utterThis.text = `We hebben ${altTekstenProductAfbeeldingen.length} producten voor je gevonden.`;
                createChatBotMessage(utterThis.text);
                await alternateSpeak('speakAudio4');

                for (let i = 0; i < altTekstenProductAfbeeldingen.length; i++) {
                    utterThis.text = altTekstenProductAfbeeldingen[i];
                    createChatBotMessage(utterThis.text);
                    // Do we need to speak the product name?
                    // await speak(utterThis);
                }

                utterThis.text = `Welk product nummer wil je bekijken?`;
                createChatBotMessage(utterThis.text);
                await alternateSpeak('speakAudio5');
                apiCall.maten = maten[splitText[j]];
                matchFound = true;
                productFound = true;
            }

            if (!isSelectingColor && speechResult.includes("kleuren") || speechResult.includes("kleur") || speechResult.includes("color")) {
                console.log("IsSelecting Color " + isSelectingColor);
                utterThis.text = `Wij hebben deze mooie kleuren: ${kleurenList.toString()} ! Welke is voor jou?`;
                createChatBotMessage(utterThis.text);
                recognition.stop();
                await alternateSpeak('speakAudio6');
                filterBy.color = true;
                console.log("Setting filterBy.color to true");
                matchFound = true;
            }
            if (speechResult.includes(kleuren[splitText[j]]) && filterBy.color == true) {
                // List the products
                utterThis.text = `We hebben ${altTekstenProductAfbeeldingen.length} producten voor je gevonden.`;
                createChatBotMessage(utterThis.text);
                // Audio file is not given for this step
                // await speak(utterThis);

                for (let i = 0; i < altTekstenProductAfbeeldingen.length; i++) {
                    utterThis.text = altTekstenProductAfbeeldingen[i];
                    createChatBotMessage(utterThis.text);
                    // Audio file is not given for this step
                    // await speak(utterThis);
                }

                utterThis.text = `Welk product nummer wil je bekijken?`;
                createChatBotMessage(utterThis.text);
                await alternateSpeak('speakAudio7');
                apiCall.kleuren = kleuren[splitText[j]];
                matchFound = true;
                productFound = true;


            }
            console.log("productFound: " + textToNumber[splitText[j]], splitText[j]);

            if (speechResult.includes(productKeys[splitText[j]]) || altTekstenProductAfbeeldingen.includes(splitText) && productFound == true) {
                utterThis.text = "Top! Wil je naar de productpagina?"
                createChatBotMessage(utterThis.text);
                await alternateSpeak('speakAudio8');
                recognition.stop();
                matchFound = true;
            }
            if (speechResult.includes("yes") || speechResult.includes("ja") && (apiCall
                .kleuren != "" || apiCall.maten != "")) {
                // Move to product page exit code follows
                // This code only runs if product, size and color is selected by user and the item is available
                utterThis.text = "Top! Ik breng je naar de productpagina."
                createChatBotMessage(utterThis.text);
                await alternateSpeak('speakAudio9');
                recognition.stop();
                exit = true;
                matchFound = true;
                window.open('https://www.dollysports.com/products/nylon-sports-sweater-2', '_blank');
            }

        }
        if (!matchFound) {
            utterThis.text = "Dat heb ik niet verstaan, kun je het alsjeblieft nog een keer zeggen."
            createChatBotMessage(utterThis.text);
            // Audio file is not given for this step
            // await speak(utterThis);
            matchFound = false;
        }
    }

    recognition.onspeechend = function () {
        recognition.stop();
        document.getElementById("mic").classList.add("fa-microphone-slash");
        document.getElementById("mic").classList.remove("fa-microphone");
        isListening = false;
    }

    recognition.onerror = function (event) {

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
    await alternateSpeak('speakAudio1').then(() => {
        isListening = true;
        startSpeechRecognition();
    });

});

document.getElementById("mic").onclick = async () => {
    if (isSpeaking) return;
    if (isListening) {
        if (document.getElementById("mic").classList.contains("fa-microphone")) {
            document.getElementById("mic").classList.remove("fa-microphone");
            document.getElementById("mic").classList.add("fa-microphone-slash");
            isListening = true;
            console.log("Setting true");
            recognition.stop();
        }

    }
    else {
        if (document.getElementById("mic").classList.contains("fa-microphone-slash")) {
            document.getElementById("mic").classList.remove("fa-microphone-slash");
            document.getElementById("mic").classList.add("fa-microphone");
            isListening = false;
            console.log("Setting false");
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
    if (e.keyCode == 32) {
        document.getElementById("mic").click();
    }
}
