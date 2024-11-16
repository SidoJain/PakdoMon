const mongoose = require('mongoose');
const Evolution = require('../model/evolution');

mongoose.connect('mongodb://localhost:27017/pokemonApp')
	.then(() => {
		console.log('MONGO CONNECTION OPEN');
	})
	.catch((err) => {
		console.log('MONGO Error:\n', err);
	});

const func = async () => {
    const data = (await Evolution.findOne({id: 2})).evolution_chain;
    console.log(data.name, data.evolves_by.name, data.evolves_to.name, data.evolves_to.evolves_by.name, data.evolves_to.evolves_to.name, data.evolves_by.url)
}
func();