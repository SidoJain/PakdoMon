const mongoose = require('mongoose');
const Move = require('../model/move');

mongoose.connect('mongodb://localhost:27017/pokemonApp')
	.then(() => {
		console.log('MONGO CONNECTION OPEN');
	})
	.catch((err) => {
		console.log('MONGO Error:\n', err);
	});

const func = async () => {
    let seedMoves = []
    let i = 1
    while (i < 920) {
        await fetch(`https://pokeapi.co/api/v2/move/${i}`)
        .then(response => { return response.json() })
        .then(moveData => {
            console.log(i, moveData.name)
            seedMoves.push({
                name: moveData.name,
                typing: moveData.type.name,
                damage_class: moveData.damage_class.name,
                power: moveData.power,
                accuracy: moveData.accuracy,
                pp: moveData.pp
            })

            i++;
        })
        .catch(error => {
            console.log(error);
        })
    }

    await Move.insertMany(seedMoves);
    console.log('Insertion Complete');
}
func();