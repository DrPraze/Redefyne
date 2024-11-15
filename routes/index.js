const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', function (req, res, next) {
    fs.readFile('views/operationary.json', 'utf8', (err, data)=>{
        if (err){
            console.err(err);
            return res.status(500).send('Error reading JSON file');
        }
        const jsonData = JSON.parse(data)
        const keyInfo = [];
        const words = [];
        Object.keys(jsonData).forEach(key => {
            const value = jsonData[key];
            //if the value is an object, get it's keys
            if (typeof value === 'object' && value !== null){
                const nestedKeys = Object.keys(value);
                nestedKeys.forEach(i =>{
                    words.push(`${i}`);
                });
                keyInfo.push({key, nestedKeys});
            }
        });
        res.render('index.ejs', {
            keyInfo: keyInfo,
            words: JSON.stringify(words)
        });
    });
});


// Helper function to dynamically link recognized words
function linkText(text, recognizedWords) {
    const pattern = new RegExp(`\\b(${recognizedWords.join('|')})\\b`, 'gi');
    // Replace matched words with a hyperlink format and capitalize the first letter
    return text.replace(pattern, (match) => {
        const capitalizedMatch = match.charAt(0).toUpperCase() + match.slice(1);
        return `<a href="/search/${capitalizedMatch}">${capitalizedMatch}</a>`;
    });
}

// Route to handle search
router.get('/search/:word', function (req, res, next) {
    try {
        const filePath = "views\\operationary.json";

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading JSON file');
            }

            const word = req.params.word.trim();
            const jsonData = JSON.parse(data);
            const firstLetter = word.charAt(0).toUpperCase();

            // Check if the word exists in the JSON
            if (!jsonData[firstLetter] || !jsonData[firstLetter][word]) {
                return res.status(404).send('Word not found');
            }

            const wordData = jsonData[firstLetter][word];

            // Extract all recognized words from the Operationary
            const recognizedWords = [];
            Object.values(jsonData).forEach((category) => {
                recognizedWords.push(...Object.keys(category));
            });

            // Sort all recognized words alphabetically
            recognizedWords.sort();

            // Link words in Definition and Examples
            const linkedDefinition = linkText(wordData.Definition, recognizedWords);
            const linkedExamples = wordData.Examples.map((example) => linkText(example, recognizedWords));

            // Determine Previous and Next words
            const currentIndex = recognizedWords.indexOf(word);
            const previousWord = recognizedWords[(currentIndex - 1 + recognizedWords.length) % recognizedWords.length];
            const nextWord = recognizedWords[(currentIndex + 1) % recognizedWords.length];

            // Render the response with navigation links
            res.render('search.ejs', {
                word: word,
                definition: linkedDefinition,
                phonetic: wordData.Phonetic,
                examples: linkedExamples,
                source: wordData.Source,
                uploadedBy: wordData.UploadedBy,
                previousWord: previousWord,
                nextWord: nextWord
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;



/*
// Build Redefyne API here
router.post('/api', function(req, res, next){
    fs.readFile('views/operationary.json', 'utf8', (err, data)=>{
        if (err){
            console.log(err);
            return res.status(500).send('Error reading JSON file');
        }
    });
});
*/

module.exports = router;
