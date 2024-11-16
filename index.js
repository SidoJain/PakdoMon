const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Type = require('./model/typing');
const Move = require('./model/move');
const Pokemon = require('./model/pokemon');
const Evolution = require('./model/evolution');
const Ability = require('./model/ability');

mongoose.connect('mongodb://localhost:27017/pokemonApp')
	.then(() => {
		console.log('MONGO CONNECTION OPEN');
	})
	.catch((err) => {
		console.log('MONGO Error:\n', err);
	});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/pokemon', (req, res) => {
    const {offset} = req.query ? req.query : 0;
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`)
        .then(response => {
            if (!response)
                throw new Error('ERROR! Could not Fetch API');
            return response.json();
        })
        .then(pokeData => res.render(`pokemon`, {pokeData}))
        .catch(error => console.log(error));
})

app.get('/pokemon/:pokeName',  async (req, res) => {
    const {pokeName} = req.params;
    try {
        const pokeData = await Pokemon.findOne({name: pokeName});
        let moveData = [];

        for (let move of pokeData.moves) {
            const moveDataFromDB = await Move.findOne({name: move.name});
            moveDataFromDB.level_learned_at = move.level_learned_at;
            moveData.push(moveDataFromDB);
        }
        const evolData = await Evolution.findOne({id: pokeData.species});

        res.render('pokeDetails', {pokeData, evolData, moveData});
    } catch (error) {
        console.log(error);
        res.render('notFound');
    }
})

app.get('/types', async (req, res) => {
    const allTypes = await Type.find({});
    res.render(`types`, {allTypes});
})

app.get('/ability/:abilityName', async (req, res) => {
    const {abilityName} = req.params;
    const abilityData = await Ability.findOne({name: abilityName});
    res.render(`ability`, {abilityData})
})

app.get('/nature', (req, res) => {
    res.render(`nature`);
})

app.listen('8080', () => {
    console.log('LISTENING ON PORT 8080');
})