function updateOutput() {
  const input = document.getElementById("user-input");
  const output = document.getElementById("user-output");
  const cipher = document.getElementById("cipher-checkbox");

  const psalmsElements = extractPsalmsElements(input.value, cipher.checked);

  const generatedHTML = generateHTML(psalmsElements, cipher.checked);

  output.innerHTML = generatedHTML;

  console.log(extractPsalmsElements(input.value));
  console.log(generatedHTML);
}

/**
 * Function which receives the psalm in the formatted code
 *
 * @param {formatted psalm} string
 * @param {cipher boolean variable which tells if there exists cipher notes} cipher
 */
const END_STANZA_MARKER = "---";
function extractPsalmsElements(string, cipher) {
  const lines = string.split("\n");

  const title = lines[0];

  const stanzas = [];
  let currentStanza = [];

  for (let k = 0; k < lines.length; k++) {
    const line = lines[k];

    if (line.length === 0) {
      continue;
    } else if (line.slice(0, 3) === END_STANZA_MARKER) {
      stanzas.push(currentStanza);
      currentStanza = [];
    } else {
      // add new verse to stanza
      if (cipher) {
        currentStanza.push({
          cipher: line,
          text: lines[k + 1],
        });
        k++;
      } else {
        currentStanza.push({
          text: line,
        });
      }
    }
  }

  // remove first stanza which in this case it's the title
  stanzas.shift();

  return { title, stanzas };
}

/**
 * Function which generate the formatted HTML to be displayed
 * @param {object containing the title and stanzas properties} psalmsElements
 */
function generateHTML(psalmsElements) {
  let html = "";

  const { title, stanzas } = psalmsElements;

  html += `<div class='title'>${title}</div>`;

  for (let k = 0; k < stanzas.length; k++) {
    const stanza = stanzas[k];

    html += "<div class='stanza'>";

    for (let i = 0; i < stanza.length; i++) {
      const verse = stanza[i];
      const { cipher, text } = verse;

      html += "<div class='verse'>";

      html += cipher
        ? `<p class='cipher'>${cipher}</p><p class='text'>${text}</p>`
        : `<p class='text'>${text}</p>`;

      html += "</div>";
    }

    html += "</div>";
  }

  return html;
}
