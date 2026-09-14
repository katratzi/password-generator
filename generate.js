// for luck
console.log("hello world");

// now I know my abc's
const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const symbols = ["!", "@", "$", "%", "^", "&", "*", "(", ")", "?", "#", ";", "+"];
const vowels = ["a", "e", "i", "o", "u"];
// Sounds have separate roles: a word ending is never used before another syllable.
const saySounds = {
    consonants: ["b", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v", "w", "z"],
    clusters: ["bl", "br", "ch", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "sh", "sk", "sl", "sm", "sn", "sp", "st", "sw", "th", "tr", "tw"],
    endings: ["b", "d", "f", "k", "l", "m", "n", "p", "r", "s", "t", "z"],
    endingClusters: ["ch", "ck", "sh", "th", "ld", "lt", "mp", "nd", "ng", "nk", "nt", "rd", "rk", "rt", "st"]
};


// we have different types of passwords.  a constant random string. a-snake-case-type. easy to say
let currentGen = "snake";
let copyStatusTimer;
// options for characters
let useUppercase = true;
let useLowercase = true;
let useSymbols = false;
let useNumbers = false;

const useSpecial = () => useSymbols || useNumbers;
const useSpecialOnly = () => ((useSymbols || useNumbers) && (!useLowercase && !useUppercase));


// slider and its value
const slider = document.getElementById("passwordLength");
const sliderText = document.getElementById("passwordLengthValue");
const passwordElement = document.getElementById('password');

// Initialize only if elements exist
if (slider && sliderText && passwordElement) {
    updateSliderText();
    regenerate();
} else {
    console.error("Required DOM elements not found");
}

// Update the current slider value (each time you drag the slider handle)
// and also regenerate
if (slider) {
    slider.oninput = function () {
        regenerate();
    }
}

// radio button for generator type clicked
function changeGen(radio) {

    // check if we have a change in generator type (can click same radio twice)
    if (currentGen !== radio.value) {

        // keep the slider from jumping about when using snake
        const normalValue = slider.value / slider.max;
        currentGen = radio.value;

        // change slider min/max based on gen type
        slider.max = currentGen === "snake" ? 5 : 32;
        slider.value = normalValue * slider.max;
        updateSliderText();
        updateCheckDisabled();
        // regen if we change type
        regenerate();
    }
}

function changeOpt(option) {

    // what are we toggling
    if (option.value === "lowercase") {
        useLowercase = option.checked;
    }
    else if (option.value === "uppercase") {
        useUppercase = option.checked;
    }
    else if (option.value === "symbols") {
        useSymbols = option.checked;
    }
    else if (option.value === "numbers") {
        useNumbers = option.checked;
    }

    regenerate();
}

// get a new random password
function regenerate() {
    resetCopyStatus();
    let password = "";
    if (currentGen === "constant") {
        password = rengerateConstant();
    }
    else if (currentGen === "snake") {
        password = rengerateSnake();
    }
    else if (currentGen === "say") {
        password = rengerateSay();
    }

    // change in the password text 
    passwordElement.innerText = password;
    updateSliderText();
    easterEgg();
}

// we ignore symbols and number on easy to say, so disable these to illustrate that
function updateCheckDisabled() {
    var numCheck = document.querySelector("input[type='checkbox'][value='numbers']");
    var symCheck = document.querySelector("input[type='checkbox'][value='symbols']");
    numCheck.disabled = currentGen === "say";
    symCheck.disabled = currentGen === "say";
}

// regen a constant string, no dashes
function rengerateConstant() {
    let random = "";

    for (let i = 0; i < slider.value; i++) {
        random += randomUserChar();
    }

    // modify final string upper/lower
    if (!useLowercase && useUppercase) { random = random.toUpperCase(); }
    if (useLowercase && useUppercase) { random = randomUppercase(random); }

    return random;
}

// regen a snake-case-password
function rengerateSnake() {
    let random = "";
    for (let i = 0; i < slider.value; i++) {
        for (let j = 0; j < 5; j++) {
            // ok, we'll allow symbols
            random += randomUserChar();
        }
        // hyphen seperators except at end
        if (i !== (slider.value - 1)) {
            random += '-';
        }
    }

    // modify final string upper/lower
    if (!useLowercase && useUppercase) { random = random.toUpperCase(); }
    if (useLowercase && useUppercase) { random = randomUppercase(random); }

    return random;
}

// Plan the exact length before choosing letters. Each internal syllable ends
// in a vowel, so joining syllables cannot create a pile-up of consonants.
function generateSay(length) {
    if (!Number.isInteger(length) || length < 1 || length > 32) {
        throw new RangeError("Easy-to-say length must be an integer from 1 to 32");
    }
    if (length === 1) return randomChar(vowels);

    // Optional opening vowel and final consonant(s), surrounding CV / CCV
    // syllables. Any body length >= 2 can be composed from lengths 2 and 3.
    const plans = [];
    for (const opening of [0, 1]) {
        for (const ending of [0, 1, 2]) {
            const body = length - opening - ending;
            if (body >= 2) plans.push({ opening, ending, body });
        }
    }
    const plan = randomChar(plans);
    const pattern = [];
    let remaining = plan.body;
    while (remaining > 0) {
        // Prefer single consonants, and never leave one unfillable character.
        const choices = [2, 2, 3].filter(size =>
            remaining >= size && remaining - size !== 1);
        const size = randomChar(choices);
        pattern.push(size);
        remaining -= size;
    }

    let result = plan.opening ? randomChar(vowels) : "";
    for (const size of pattern) {
        result += randomChar(size === 2 ? saySounds.consonants : saySounds.clusters);
        result += randomChar(vowels);
    }
    if (plan.ending) {
        result += randomChar(plan.ending === 1 ? saySounds.endings : saySounds.endingClusters);
    }
    return result;
}

function rengerateSay() {
    let random = generateSay(Number(slider.value));
    if (!useLowercase && useUppercase) { random = random.toUpperCase(); }
    if (useLowercase && useUppercase) { random = randomUppercase(random); }
    return random;
}

// random char from the options set by the user
function randomUserChar() {
    let r = "";
    // what special chanacters might we use
    let tempSpecial = [];
    if (useSymbols) { tempSpecial = [...symbols]; }
    if (useNumbers) { tempSpecial = [...tempSpecial, ...numbers]; }

    if (useSpecialOnly())
        r = randomChar(tempSpecial);
    else if (useSpecial()) // 1 in 6 chance of special char
        r = rollDice(6) === 0 ? randomChar(tempSpecial) : randomChar(letters);
    else
        r = randomChar(letters);

    return r;
}

// random one of the given characters
function randomChar(chars) {
    if (!chars || chars.length === 0) return '';
    return chars[rollDice(chars.length)];
}

// random roll between 0 and sides
function rollDice(sides) {
    // Reject the uneven remainder so every outcome is equally likely.
    const limit = 2 ** 32 - (2 ** 32 % sides);
    const value = new Uint32Array(1);
    do {
        crypto.getRandomValues(value);
    } while (value[0] >= limit);
    return value[0] % sides;
}

// flip ramdonly to uppercase
function randomUppercase(chars) {
    let altered = "";
    for (let i = 0; i < chars.length; i++) {
        let char = chars[i];
        // if we're a letter and small chance to be upper
        if (letters.includes(char) && rollDice(3) === 0) {
            char = char.toUpperCase();
        }
        altered += char;
    }
    return altered;
}

// show slider value with emoji for password length
function updateSliderText() {
    const passwordLength = passwordElement.innerText.length;
    let emoji = '';
    if (passwordLength < 8) {
        emoji = '😖 bad'
    }
    else if (passwordLength < 12) {
        emoji = '😐 meh'
    }
    else if (passwordLength < 20) {
        emoji = '😌 yes'
    }
    else {
        emoji = '😎 rad'
    }

    // Display the default slider value
    sliderText.innerHTML = slider.value + " " + emoji;

}

function resetCopyStatus() {
    clearTimeout(copyStatusTimer);
    const status = document.getElementById("copyStatus");
    status.classList.remove("is-faded");
    status.textContent = "";
}

function showCopySuccess() {
    const status = document.getElementById("copyStatus");
    clearTimeout(copyStatusTimer);
    status.classList.remove("is-faded");
    status.textContent = "Copied to clipboard!";
    copyStatusTimer = setTimeout(() => {
        status.classList.add("is-faded");
    }, 4000);
}

async function copyToClipboard() {
    const text = passwordElement.innerText;
    const status = document.getElementById("copyStatus");
    resetCopyStatus();
    try {
        await navigator.clipboard.writeText(text);
        showCopySuccess();
    } catch {
        // Support browsers where the clipboard API is unavailable or denied.
        const tempInput = document.createElement("input");
        tempInput.value = text;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        const previousFocus = document.activeElement;
        try {
            document.body.appendChild(tempInput);
            tempInput.select();
            tempInput.setSelectionRange(0, text.length);
            const copied = document.execCommand("copy");
            if (copied) {
                showCopySuccess();
            } else {
                status.textContent = "Couldn't copy. Please select and copy the password manually.";
            }
        } catch {
            status.textContent = "Couldn't copy. Please select and copy the password manually.";
        } finally {
            tempInput.remove();
            if (previousFocus) previousFocus.focus();
        }
    }
}

function easterEgg() {
    if (!useLowercase && !useUppercase && !useSymbols && !useNumbers) {
        passwordElement.innerText = "¯\\_(ツ)_/¯";
        sliderText.innerHTML = slider.value + ' 😵';
    }

}
