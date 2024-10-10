const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const fs = require('fs');
const dictionaryFile = 'operationary.json';

let dictionary = {};

function readDictionary() {
  try {
    const data = fs.readFileSync(dictionaryFile, 'utf8');
    dictionary = JSON.parse(data);
  } catch (err) {
    console.log('No existing operationary file found. Starting a new one.');
  }
}

function writeDictionary() {
  const jsonData = JSON.stringify(dictionary, null, 2);
  fs.writeFileSync(dictionaryFile, jsonData, 'utf8');
}

function addWord() {
  readline.question('Enter the word: ', (word) => {
    readline.question('Enter the definition: ', (definition) => {
      readline.question('Enter the IPA Phonetic spelling: ', (phonetic)=>{
        readline.question('Enter any example(s): ', (example) => {
          readline.question('Enter synonyms (comma-separated): ', (synonyms) => {
            readline.question('Enter the source (optional): ', (source) => {
              readline.question('Enter uploaded by (optional): ', (uploadedBy) => {
                const newEntry = {
                  Definition: definition,
                  Phonetic: phonetic,
                  Examples: example.split(',').map(ex => ex.trim()),
                  Synonyms: synonyms.split(',').map(concept => concept.trim()),
                  Antonyms: [""],
                  Source: source,
                  UploadedBy: uploadedBy
                };
  
                const firstLetter = word.charAt(0).toUpperCase();
  
                if (!dictionary[firstLetter]) {
                  dictionary[firstLetter] = {};
                }
  
                // Insert the word into the section
                dictionary[firstLetter][word] = newEntry;
  
                // Sort words within the letter section (Correct approach)
                dictionary[firstLetter] = sortWordsInSection(dictionary[firstLetter]);
  
                // Sort letter sections alphabetically (already correct)
                dictionary = sortLetterSections(dictionary);
  
                writeDictionary();
                console.log(`New Word "${word}" added successfully!`);
                readline.close();
              });
            });
          });
        });
      });
    });
  });
}

// Correct sorting function:
function sortWordsInSection(section) {
  // Convert the section object into an array of key-value pairs
  const entries = Object.entries(section);

  // Sort the array based on the word (first element of each pair)
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  // Convert the sorted array back into an object
  return Object.fromEntries(entries);
}

function sortLetterSections(dict) {
  const sortedLetters = Object.keys(dict).sort();
  const sortedDictionary = {};
  sortedLetters.forEach(letter => {
    sortedDictionary[letter] = dict[letter];
  });
  return sortedDictionary;
}

readDictionary();
addWord();