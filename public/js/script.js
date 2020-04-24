// const BACKEND_DOMAIN = "https://jonas-backend.herokuapp.com/api";
const BACKEND_DOMAIN = "http://localhost:3333/api";

function sendPsalm() {
  const pass = verifyDataStructure();

  const input = document.getElementById("user-input");
  const cipher = document.getElementById("cipher-checkbox");
  const info = document.getElementById("message-div");

  if (!pass) {
    info.innerText = "Formato Inválido";
    info.className = "fail";
    return;
  }

  const { title, stanzas, melody, metric, composer, harmonization, letter } = extractPsalmsElements();

  const psalmsElements = { title, stanzas };

  if (melody.length > 0) {
    psalmsElements.melody = melody;
  }
  if (metric.length > 0) {
    psalmsElements.metric = metric;
  }
  if (harmonization.length > 0) {
    psalmsElements.harmonization = harmonization;
  }
  if (composer.length > 0) {
    psalmsElements.composer = composer;
  }
  if (letter.length > 0) {
    psalmsElements.letter = letter;
  }

  console.log({ psalmsElements });

  axios
    .post(`${BACKEND_DOMAIN}/psalms`, psalmsElements)
    .then((response) => {
      console.log("psalm created");
      info.innerText = "Salmo enviado com sucesso !";
      info.className = "sucess";
    })
    .catch((error) => {
      console.log({ error });
      info.innerText = "Houve algum problema ...";
      info.className = "fail";
    });

  console.log("sendPsalm");
}

function verifyDataStructure() {
  return true;
}

function updateOutput() {
  const output = document.getElementById("user-output");
  const cipher = document.getElementById("cipher-checkbox");
  const info = document.getElementById("message-div");

  info.className = "hidden";

  const psalmsElements = extractPsalmsElements();

  const generatedHTML = generateHTML(psalmsElements, cipher.checked);

  output.innerHTML = generatedHTML;

  console.log(psalmsElements);
  // console.log(generatedHTML);
}

/**
 * Function which receives the psalm in the formatted code
 *
 * @param {formatted psalm} string
 * @param {cipher boolean variable which tells if there exists cipher notes} cipher
 */
const END_STANZA_MARKER = "---";
function extractPsalmsElements() {
  const string = document.getElementById("user-input").value;
  const cipher = document.getElementById("cipher-checkbox").checked;
  const melody = document.getElementById("melody").value;
  const metric = document.getElementById("metric").value;
  const composer = document.getElementById("composer").value;
  const harmonization = document.getElementById("harmonization").value;
  const letter = document.getElementById("letter").value;

  const lines = string.split("\n");

  const title = lines[0];

  const stanzas = [];
  let currentStanza = [];

  for (let k = 1; k < lines.length; k++) {
    const line = lines[k];

    if (line.length === 0) {
      continue;
    } else if (line.slice(0, 3) === END_STANZA_MARKER) {
      stanzas.push(currentStanza);
      currentStanza = [];
    } else {
      // add new verse to stanza
      if (cipher) {
        currentStanza.push(extractVerse(line, lines[k + 1]));
        k++;
      } else {
        currentStanza.push(extractVerse(undefined, line));
      }
    }
  }

  // remove first stanza which in this case it's the title
  stanzas.shift();

  return {
    title,
    stanzas,
    melody,
    metric,
    harmonization,
    composer,
    letter,
  };
}

function extractVerse(cipher, text) {
  if (!cipher) {
    return { text };
  }

  if (text.length > cipher.length) {
    cipher = cipher.padEnd(text.length, " ");
  } else {
    text = text.padEnd(cipher.length, " ");
  }

  return { cipher, text };
}

/**
 * Function which generate the formatted HTML to be displayed
 * @param {object containing the title and stanzas properties} psalmsElements
 */
function generateHTML(psalmsElements) {
  const { title, stanzas, melody, metric, composer, harmonization, letter } = psalmsElements;

  let html = "";

  html += `<div class='title'>${title}</div>`;

  html += melody.length > 0 ? `<div class='meta-info'>Melodia: ${melody}</div>` : "";
  html += metric.length > 0 ? `<div class='meta-info'>Métrica: ${metric}</div>` : "";
  html += composer.length > 0 ? `<div class='meta-info'>Compositor: ${composer}</div>` : "";
  html += harmonization.length > 0 ? `<div class='meta-info'>Harmonização: ${harmonization}</div>` : "";
  html += letter.length > 0 ? `<div class='meta-info'>Letra: ${letter}</div>` : "";

  for (let k = 0; k < stanzas.length; k++) {
    const stanza = stanzas[k];

    html += "<div class='stanza'>";

    for (let i = 0; i < stanza.length; i++) {
      const verse = stanza[i];
      const { cipher, text } = verse;

      html += "<div class='verse'>";

      for (let j = 0; j < text.length; j++) {
        html += "<div class='element'>";

        if (cipher) {
          html += `<p class='cipher'>${cipher[j]}</p>`;
        }
        html += `<p class='text'>${text[j]}</p>`;

        html += "</div>";
      }

      html += "</div>";
    }

    html += "</div>";
  }

  return html;
}

updateOutput();
