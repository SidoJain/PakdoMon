require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Type = require('./model/typing');
const Move = require('./model/move');
const Pokemon = require('./model/pokemon');
const Evolution = require('./model/evolution');
const Ability = require('./model/ability');

const mongoDBRun = async () => {
    await mongoose.connect(process.env.dbURL)
        .then(() => {
            console.log('MONGO CONNECTION OPEN');
        })
        .catch((err) => {
            console.log('MONGO Error:\n', err);
        });
}
const app = express();
mongoDBRun();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/pokemon', async (req, res) => {
    let {offset} = req.query;
    if (!offset) offset = 0;
    offset = Number.parseInt(offset);

    let pokeData = await Pokemon.find({dex_num: {$gt: offset, $lt: offset + 21}}, {name: 1, sprite: 1, dex_num: 1}, {limit: 20});
    pokeData.sort((a, b) => a.dex_num - b.dex_num);
    res.render('pokemon', {pokeData, offset});
})

app.get('/pokemon/search', async (req, res) => {
    const pokeData = await Pokemon.find({dex_num: {$gt: 0, $lt: 906}}, {dex_num: 1, name: 1, display_name: 1, sprite: 1});
    pokeData.sort((a, b) => a.dex_num - b.dex_num);
    res.render('search', {pokeData})
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
        if (evolData.pokemon_one) {
            const data1 = await Pokemon.find({name: evolData.pokemon_one}, {sprite: 1})
            if (data1.length) {
                evolData.pokemon_one_url = data1[0].sprite;
            }
        }
        if (evolData.pokemon_two) {
            const data2 = await Pokemon.find({name: evolData.pokemon_two}, {sprite: 1})
            if (data2.length) {
                evolData.pokemon_two_url = data2[0].sprite;
            }
        }
        if (evolData.pokemon_three) {
            const data3 = await Pokemon.find({name: evolData.pokemon_three}, {sprite: 1});
            if (data3.length) {
                evolData.pokemon_three_url = data3[0].sprite;
            }
        }
        if (pokeData.altForms && pokeData.altForms.length)
            pokeData.altForms = await filterInPokeDB(pokeData.altForms);

        const nextPoke = await Pokemon.find({dex_num: (pokeData.dex_num + 1)}, {name: 1});
        const prevPoke = await Pokemon.find({dex_num: (pokeData.dex_num - 1)}, {name: 1});
        const nextPrevPoke = {
            nextPoke: nextPoke[0] ? nextPoke[0].name : null,
            prevPoke: prevPoke[0] ? prevPoke[0].name : null
        }

        res.render('pokeDetails', {pokeData, evolData, moveData, nextPrevPoke});
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

    abilityData.pokemon = await filterInPokeDB(abilityData.pokemon);
    abilityData.pokemon.sort((a, b) => a.dex_num - b.dex_num);

    res.render(`ability`, {abilityData})
})

app.get('/nature', (req, res) => {
    res.render(`nature`);
})

app.use((req, res) => {
    res.status(404).render(`notFound`);
})

app.listen('8080', () => {
    console.log('LISTENING ON PORT 8080');
})

async function filterInPokeDB(pokemons) {
    let filteredPoke = [];
    for (let pokemon of pokemons) {
        const response = await Pokemon.findOne({name: pokemon.name});
        if (response === null) continue;
        filteredPoke.push(pokemon);
    }
    return filteredPoke;
}