const { MessageEmbed, Message } = require("discord.js");
const FiltersSettings = require("../../botconfig/filters.json");
const { check_if_dj } = require("../../handlers/functions");
module.exports = {
	name: "remove",
	description: "Removes a filter from the queue",
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [
		{
			"String": {
				name: "filters",
				description: "Add all filters with a space between, to remove!",
				required: true
			}
		},
	],
	run: async (client, interaction) => {
		try {
			const { member, guildId, options } = interaction;
			const { guild } = member;
			const { channel } = member.voice;
			let color = client.settings.get(guild.id, `color`);
			let emoji = client.settings.get(guild.id, `emoji`);
			if (!channel) {
			return interaction.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setDescription(`You have to be in a voice channel to use this command!`)
			.setTitle(`${emoji} NOT IN A VOICE CHANNEL!`)
			],
			ephemeral: true
			});
			}
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
			return interaction.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setDescription(`You must be in the same voice channel as me - <#${guild.me.voice.channel.id}>`)
			.setTitle(`${emoji} NOT IN SAME VOICE!`)
			],
			ephemeral: true
			});
			}
			try {
			let newQueue = client.distube.getQueue(guildId);
			if (!newQueue || !newQueue.songs || newQueue.songs.length == 0){
			return interaction.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setDescription(`There's currently nothing playing right now`)
			.setTitle(`${emoji} NOTHING PLAYING!`)
			],
			ephemeral: true
			});
			}
			if (check_if_dj(client, member, newQueue.songs[0])) {
			return interaction.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setTitle(`${emoji} NOT THE SONG AUTHOR!`)
			.setDescription(`
			Hmm... You don't seem to be a DJ or the song author
			You need this **dj roles:** ${check_if_dj(client, member, newQueue.songs[0])}
			`)
			],
			ephemeral: true
			});
			}
			let filters = options.getString("filters").toLowerCase().split(" ");
			if (!filters) filters = [options.getString("filters").toLowerCase()]
			if (filters.some(a => !FiltersSettings[a])) {
			return interaction.reply({
			embeds: [
			new MessageEmbed()
			.setColor(color)
			.setTitle(`${emoji} ONE FILTER IS INVALID!`)
			.setDescription(`
			To define Multiple default Filters add a SPACE (" ") in between! them
			All Valid Filters: ${newQueue.filters.map(f => `\`${f}\``).join(", ")}
			**NOTE:** All filters, starting with custom are having there own command.\nPlease use them to define what custom amount you want to add **(¬‿¬)**
			`)
			],
			ephemeral: true
			});
			}
			let toRemove = [];
			filters.forEach((f) => {
			if (newQueue.filters.includes(f)) {
			toRemove.push(f)
			}
			});
			if (!toRemove || toRemove.length == 0) {
			return interaction.reply({
			embeds: [
			new MessageEmbed()
			.setColor(color)
			.setTitle(`${emoji} FILTER IS NOT IN THE LIST!`)
		    .setDescription(`The filter you added is not in the filters list\nAll valid filters: ${newQueue.filters.map(f => `\`${f}\``).join(", ")}`)
			],
			ephemeral: true
			});
			}
			await newQueue.setFilter(toRemove);
			interaction.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setTitle(`${emoji} FILTER REMOVED`)
			.setDescription(`Successfully removed \`${toRemove.length}\` \`${toRemove.length == filters.length ? "filters": `of ${filters.length}\` filters! The rest wasn't a part of the filters list!`}`)
		    ],
			ephemeral: true
			});
			} catch (e) {
			console.log(e.stack ? e.stack : e)
			interaction.editReply({
			embeds: [
			new MessageEmbed()
			.setColor("#e63064")
			.setTitle("<:errorcode:868245243357712384> AN ERROR OCCURED!")
			.setDescription(`\`\`\`${e.stack.toString().substr(0, 800)}\`\`\``)
			.setFooter("Error in code: Report this error to kotlin0427")
			],
			ephemeral: true
			});
			}
		} catch (e) {
			console.log(String(e.stack))
		}
	}
}