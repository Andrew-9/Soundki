const { MessageEmbed, MessageButton } = require("discord.js");
const { check_if_dj } = require("../../handlers/functions")
const FiltersSettings = require("../../botconfig/filters.json");
module.exports = {
	name: "remove-filter",
	category: "Filter",
	usage: "remove-filter <Filter1 Filter2>",
	aliases: ["removefilters", "remove", "removef", "rf", "removefilter"],
	description: "Removes a Filter from the Queue",
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			const { member, guildId, guild } = message;
			const { channel } = member.voice;
			let color = client.settings.get(message.guild.id, `color`);
			let emoji = client.settings.get(message.guild.id, `emoji`);
			let react = client.settings.get(message.guild.id, `react`);
			if (!channel) {
			return message.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setDescription(`You have to be in a voice channel to use this command!`)
			.setTitle(`${emoji} NOT IN A VOICE CHANNEL!`)
			],
			});
			}
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
			return message.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setDescription(`You must be in the same voice channel as me - <#${guild.me.voice.channel.id}>`)
			.setTitle(`${emoji} NOT IN SAME VOICE!`)
			],
			});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
				return message.reply({
				embeds: [new MessageEmbed()
				.setColor(color)
				.setDescription(`There's currently nothing playing right now`)
				.setTitle(`${emoji} NOTHING PLAYING!`)
				],
				});
				}
				if (check_if_dj(client, member, newQueue.songs[0])) {
				return message.reply({
				embeds: [new MessageEmbed()
				.setColor(color)
				.setTitle(`${emoji} NOT THE SONG AUTHOR!`)
				.setDescription(`
				Hmm... You don't seem to be a **DJ** or the song author
				You need this **dj roles:** ${check_if_dj(client, member, newQueue.songs[0])}
				`)
				],
				});
				}
				let filters = args;
				if (filters.some(a => !FiltersSettings[a])) {
				return message.reply({
				embeds: [new MessageEmbed()
				.setColor(color)
				.setTitle(`${emoji} NOT THE SONG AUTHOR!`)
				.setDescription(`
				Hmm... You don't seem to be a DJ or the song author
				This are the **DJ Roles:** you need ${check_if_dj(client, member, newQueue.songs[0])}
				`)
				],
				});
				}
				let toRemove = [];
				//add new filters    bassboost, clear    --> [clear] -> [bassboost]   
				filters.forEach((f) => {
					if (newQueue.filters.includes(f)) {
						toRemove.push(f)
					}
				})
				if (!toRemove || toRemove.length == 0) {
					return message.reply({
						embeds: [
							new MessageEmbed()
							.setColor(color)
							.setTitle(`${emoji} ONE FILTER IS INVALID!`)
							.setDescription(`
							To define Multiple default Filters add a SPACE (" ") in between! them
							All valid filters: ${newQueue.filters.map(f => `\`${f}\``).join(", ")}
							**NOTE:** All filters, starting with custom are having there own command.\nPlease use them to define what custom amount you want to add **(¬‿¬)**
							`)
						],
					});
				}
				message.react(react);
				await newQueue.setFilter(toRemove);
				message.reply({
				embeds: [new MessageEmbed()
				.setColor(color)
				.setTitle(`${emoji} FILTER REMOVED`)
				.setDescription(`Successfully removed \`${toRemove.length}\` \`${toRemove.length == filters.length ? "filters": `of ${filters.length}\` filters! The rest wasn't a part of the filters list!`}`)]
				});
			} catch (e) {
			console.log(e.stack ? e.stack : e)
			message.reply({
			embeds: [
			new MessageEmbed()
			.setColor("#e63064")
			.setTitle("<:errorcode:868245243357712384> AN ERROR OCCURED!")
			.setDescription(`\`\`\`${e.stack.toString().substr(0, 800)}\`\`\``)
			.setFooter("Error in code: Report this error to kotlin0427 or _destroyer_#1574")
			],
			});
			}
		} catch (e) {
			console.log(String(e.stack))
		}
	}
}