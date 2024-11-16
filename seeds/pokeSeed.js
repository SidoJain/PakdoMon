const mongoose = require('mongoose');
const Pokemon = require('../model/pokemon');

mongoose
	.connect('mongodb://localhost:27017/pokemonApp')
	.then(() => {
		console.log('MONGO CONNECTION OPEN');
	})
	.catch((err) => {
		console.log('MONGO Error:\n', err);
	});

const func = async () => {
	let seedPokemon = [];

	let i = 1;
	while (i < 906) {
		const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
		const data1 = await response1.json();

		const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
		const data2 = await response2.json();

		let typeList = [];
		for (let type of data1.types) {
			typeList.push(type.type.name);
		}

		let abilityList = [];
		for (let ability of data1.abilities) {
			abilityList.push(ability.ability.name);
		}

		let statList = [];
		for (let stat of data1.stats) {
			statList.push({
				name: stat.stat.name,
				base_stat: stat.base_stat,
			});
		}

		let moveList = [];
		for (let move of data1.moves) {
			for (let details of move.version_group_details) {
				if (details.version_group.name === 'sword-shield') {
					if (details.level_learned_at === 0) {
						continue;
					}
					moveList.push({
						name: move.move.name,
						level_learned_at: details.level_learned_at,
					});
				}
			}
		}
		let moveGen = 'sword-shield';
		if (moveList.length === 0) {
			moveGen = 'scarlet-violet';
			for (let move of data1.moves) {
				for (let details of move.version_group_details) {
					if (details.version_group.name === 'scarlet-violet') {
						if (details.level_learned_at === 0) {
							continue;
						}
						moveList.push({
							name: move.move.name,
							level_learned_at: details.level_learned_at,
						});
					}
				}
			}
		}
		if (moveList.length === 0) {
			moveGen = 'ultra-sun-ultra-moon';
			for (let move of data1.moves) {
				for (let details of move.version_group_details) {
					if (details.version_group.name === 'ultra-sun-ultra-moon') {
						if (details.level_learned_at === 0) {
							continue;
						}
						moveList.push({
							name: move.move.name,
							level_learned_at: details.level_learned_at,
						});
					}
				}
			}
		}
		if (moveList.length === 0) {
			moveGen = 'x-y';
			for (let move of data1.moves) {
				for (let details of move.version_group_details) {
					if (details.version_group.name === 'x-y') {
						if (details.level_learned_at === 0) {
							continue;
						}
						moveList.push({
							name: move.move.name,
							level_learned_at: details.level_learned_at,
						});
					}
				}
			}
		}
		moveList.sort((a, b) => a.level_learned_at - b.level_learned_at);

		let megaList = [];
		for (let form of data2.varieties) {
			if (form.pokemon.name.includes('mega')) {
				megaList.push(form.pokemon.name);
			}
		}

		seedPokemon.push({
			dex_num: i,
			name: data1.name,
			species: Number.parseInt(data2.evolution_chain.url.split('/')[data2.evolution_chain.url.split('/').length - 2]),
			typing: typeList,
			abilities: abilityList,
			stats: statList,
			moves: moveList,
			moves_updated_to: moveGen,
			megas: megaList,
			sprite: `https://img.pokemondb.net/artwork/${data1.name}.jpg`,
		});
		console.log(i, data1.name);
		i++;
	}

	await Pokemon.insertMany(seedPokemon);
	console.log('Insertion Complete');
};
func();