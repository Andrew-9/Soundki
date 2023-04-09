const { MessageEmbed, Message } = require("discord.js");
module.exports = {
	name: "status",
	description: "Shows queue status and the current playing song",
	cooldown: 10,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, interaction) => {
		try {
			const { member, channelId, guildId, options } = interaction;
			const { guild } = member;
			const { channel } = member.voice;
			let color = client.settings.get(guild.id, `color`);
			let emoji = client.settings.get(guild.id, `emoji`);
			let pointer = client.settings.get(guild.id, `pointer`);
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
			if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) {
			return interaction.reply({
			embeds: [new MessageEmbed()
			.setColor(color)
			.setDescription(`There's currently nothing playing right now`)
			.setTitle(`${emoji} NOTHING PLAYING!`)
			],
			ephemeral: true
			});
			}
			var djs = client.settings.get(newQueue.id, `djroles`);
			if(!djs || !Array.isArray(djs)) djs = [];
			else djs = djs.map(r => `<@&${r}>`);
			if(djs.length == 0 ) djs = "`not setup`";
			else djs.slice(0, 15).join(", ");
			let newTrack = newQueue.songs[0];
			let songtitle = newTrack.name;
			let songName
			if (songtitle.length > 20) songName = songtitle.substr(0, 35) + "...";
			let embed = new MessageEmbed()
			.setColor(color)
			.setAuthor(newTrack.user.tag.toUpperCase(), newTrack.user.displayAvatarURL({ dynamic: true}))
			.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
			.setDescription(`
			${pointer} **PLAYING SONG**
			${pointer} **Song** - \`${songName}\`
			${pointer} **Loop** - ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${emoji}\` Queue\`` : `${emoji} \`Song\`` : `Off`}
			${pointer} **Duration** - \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\`
			${pointer} **Queue** - \`${newQueue.songs.length} song(s)\` : \`${newQueue.formattedDuration}\`
			${pointer} **Volume** - \`${newQueue.volume}%\`
			${pointer} **Autoplay** -  ${newQueue.autoplay ? `${emoji}` : `Off`}
			${pointer} **Filter${newQueue.filters.length > 0 ? "s": ""}** - ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `Off`}
			${pointer} **DJ-Role${client.settings.get(newQueue.id, "djroles").length > 1 ? "s": ""}** - ${djs}
			${pointer} **Requested by** -  ${newTrack.user}
			${pointer} **Download Song** - [\`Click here\`](${newTrack.streamURL})
			${pointer} **Watch Music Video** - [\`Watch here\`](${newTrack.url})
			`)
			interaction.reply({
			embeds: [embed]
			});
			} catch (e) {
			console.log(e.stack ? e.stack : e);
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