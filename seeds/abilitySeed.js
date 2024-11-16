const mongoose = require('mongoose');
const Ability = require('../model/ability');

mongoose
	.connect('mongodb://localhost:27017/pokemonApp')
	.then(() => {
		console.log('MONGO CONNECTION OPEN');
	})
	.catch((err) => {
		console.log('MONGO Error:\n', err);
	});

const func = async () => {
	let seedAbility = [];

	let i = 1;
	while (i < 308) {
		// 308
		const response1 = await fetch(`https://pokeapi.co/api/v2/ability/${i}`);
		const data1 = await response1.json();

		let description;
		for (let entry of data1.flavor_text_entries) {
			if (entry.language.name === 'en') {
				description = entry.flavor_text;
			}
		}

		let pokeList = [];
		for (let pokemon of data1.pokemon) {
			pokeList.push({
				name: pokemon.pokemon.name,
				dex_num: Number.parseInt(pokemon.pokemon.url.split('/')[pokemon.pokemon.url.split('/').length - 2]),
			});
		}

		seedAbility.push({
			name: data1.name,
			desc: description,
			pokemon: pokeList,
		});
		console.log(i, data1.name);
		i++;
	}

	await Ability.insertMany(seedAbility);
	console.log('Insertion Complete');
};
func();
