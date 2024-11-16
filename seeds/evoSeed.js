const mongoose = require('mongoose');
const Evolution = require('../model/evolution');

mongoose
	.connect('mongodb://localhost:27017/pokemonApp')
	.then(() => {
		console.log('MONGO CONNECTION OPEN');
	})
	.catch((err) => {
		console.log('MONGO Error:\n', err);
	});

const func = async () => {
	let seedEvos = [];

	let i = 1;
	while (i < 478) {
		// 478
		try {
			const response2 = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${i}/`);
			const evolData = await response2.json();

			let EVOLVE_ONE_BY_NAME = null;
			let EVOLVE_ONE_BY_URL = null;
			let EVOLVE_TWO_BY_NAME = null;
			let EVOLVE_TWO_BY_URL = null;
			let pointer = evolData.chain.evolves_to;
			let j = 1;
			while (pointer.length) {
				if (pointer[0].evolution_details[0].trigger && pointer[0].evolution_details[0].trigger.name === 'trade') {
					if (pointer[0].evolution_details[0].held_item) {
						const response4 = await fetch(pointer[0].evolution_details[0].held_item.url);
						if (j === 1) {
							EVOLVE_ONE_BY_NAME = 'Trade';
							EVOLVE_ONE_BY_URL = (await response4.json()).sprites.default;
						} else {
							EVOLVE_TWO_BY_NAME = 'Trade';
							EVOLVE_TWO_BY_URL = (await response4.json()).sprites.default;
						}
					} else {
						if (j === 1) {
							EVOLVE_ONE_BY_NAME = 'Trade';
							EVOLVE_ONE_BY_URL = 'https://cdn-icons-png.flaticon.com/512/9870/9870522.png';
						} else {
							EVOLVE_TWO_BY_NAME = 'Trade';
							EVOLVE_TWO_BY_URL = 'https://cdn-icons-png.flaticon.com/512/9870/9870522.png';
						}
					}
				} else if (pointer[0].evolution_details[0].held_item) {
					const response4 = await fetch(pointer[0].evolution_details[0].held_item.url);
					const data = await response4.json();
					if (j === 1) {
						EVOLVE_ONE_BY_NAME = pointer[0].evolution_details[0].held_item.name;
						EVOLVE_ONE_BY_URL = data.sprites.default;
					} else {
						EVOLVE_TWO_BY_NAME = pointer[0].evolution_details[0].held_item.name;
						EVOLVE_TWO_BY_URL = data.sprites.default;
					}
				} else if (pointer[0].evolution_details[0].item) {
					const response4 = await fetch(pointer[0].evolution_details[0].item.url);
					const data = await response4.json();
					if (j === 1) {
						EVOLVE_ONE_BY_NAME = pointer[0].evolution_details[0].item.name;
						EVOLVE_ONE_BY_URL = data.sprites.default;
					} else {
						EVOLVE_TWO_BY_NAME = pointer[0].evolution_details[0].item.name;
						EVOLVE_TWO_BY_URL = data.sprites.default;
					}
				} else if (pointer[0].evolution_details[0].trigger && pointer[0].evolution_details[0].trigger.name === 'level-up') {
					if (j === 1) {
						EVOLVE_ONE_BY_NAME = pointer[0].evolution_details[0].min_level ? `Level ${pointer[0].evolution_details[0].min_level}` : `Happiness`;
						EVOLVE_ONE_BY_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png';
					} else {
						EVOLVE_TWO_BY_NAME = pointer[0].evolution_details[0].min_level ? `Level ${pointer[0].evolution_details[0].min_level}` : `Happiness`;
						EVOLVE_TWO_BY_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png';
					}
				} else if (pointer[0].evolution_details[0].trigger && pointer[0].evolution_details[0].trigger.name === 'other') {
					if (j === 1) {
						EVOLVE_ONE_BY_NAME = '';
						EVOLVE_ONE_BY_URL = 'https://www.clipartmax.com/png/middle/34-343202_black-arrow-clip-art-photo-medium-size-black-arrow-clipart.png';
					} else {
						EVOLVE_TWO_BY_NAME = '';
						EVOLVE_TWO_BY_URL = 'https://www.clipartmax.com/png/middle/34-343202_black-arrow-clip-art-photo-medium-size-black-arrow-clipart.png';
					}
				}
				j++;
				pointer = pointer[0].evolves_to;
			}

			seedEvos.push({
				id: i,
				pokemon_one: evolData.chain.species.name,
				evolve_one_by: {
					name: EVOLVE_ONE_BY_NAME,
					imgUrl: EVOLVE_ONE_BY_URL,
				},
				pokemon_two: evolData.chain.evolves_to.length ? evolData.chain.evolves_to[0].species.name : null,
				evolve_two_by: {
					name: EVOLVE_TWO_BY_NAME,
					imgUrl: EVOLVE_TWO_BY_URL,
				},
				pokemon_three: evolData.chain.evolves_to.length && evolData.chain.evolves_to[0].evolves_to.length ? evolData.chain.evolves_to[0].evolves_to[0].species.name : null,
			});

			console.log(i, seedEvos[seedEvos.length - 1].pokemon_one, seedEvos[seedEvos.length - 1].evolve_one_by.name, seedEvos[seedEvos.length - 1].pokemon_two, seedEvos[seedEvos.length - 1].evolve_two_by.name, seedEvos[seedEvos.length - 1].pokemon_three);
			i++;
		} catch (error) {
			i++;
			continue;
		}
	}

	await Evolution.insertMany(seedEvos);
	console.log('Insertion Complete');
};
func();
