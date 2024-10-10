const express = require('express');
const router = express.Router();
const fs = require('fs');

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
        })
        res.render('index.ejs', {
            keyInfo: keyInfo,
            words: JSON.stringify(words)
        });
    });
});

router.get('/search/:word', function(req, res, next){
    try{
        fs.readFile('views/operationary.json', 'utf8', (err, data)=>{
            if (err){
                console.err(err);
                return res.status(500).send('Error reading JSON file');
            }
            const word = req.params.word;
            const jsonData = JSON.parse(data);
            const firstLetter = word.charAt(0);
            const wordData = jsonData[firstLetter][word];
            const examples = wordData.Examples;
            console.log(examples)
    
            res.render('search.ejs',{
                word: word,
                definition: wordData.Definition,
                phonetic: wordData.Phonetic,
                examples: examples,
                source: wordData.Source,
                uploadedBy: wordData.UploadedBy
            });
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
