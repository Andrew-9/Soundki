const { MessageEmbed, MessageButton } = require("discord.js");
const Discord = require("discord.js")
let cpuStat = require("cpu-stat");
let os = require("os");
module.exports = {
    name: "botinfo",
    category: "Info",
    usage: "botinfo",
    aliases: ["info",],
    cooldown: 5,
    description: "Shows Information about the Bot",
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, message, args) => {
        try {
            let color = client.settings.get(message.guild.id, `color`);
            let emoji = client.settings.get(message.guild.id, `emoji`);
            let react = client.settings.get(message.guild.id, `react`);
            let pointer = client.settings.get(message.guild.id, `pointer`);
            cpuStat.usagePercent(function (e, percent, seconds) {
                try {
                    if (e) return console.log(String(e.stack));
                    let connectedchannelsamount = 0;
                    let guilds = client.guilds.cache.map((guild) => guild);
                    for (let i = 0; i < guilds.length; i++) {
                    if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
                    }
                    if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;
                    // let inviteme = new MessageButton().setStyle('PRIMARY').setCustomId('1').setLabel(`⏩ Skip`)
                    // let support = new MessageButton().setStyle('DANGER').setCustomId('2').setLabel(`⏹ Stop`)
                    // var buttonarray = [inviteme, support]  
                    const botinfo = new MessageEmbed()
                    .setColor(color)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTitle(`${emoji} GENERAL INFORMATION`)
                    .setDescription(`
                    ${pointer} **STATS**
                    ${pointer} **Users** - \`${client.users.cache.size}\`
                    ${pointer} **Servers** - \`${client.guilds.cache.size}\`
                    ${pointer} **Uptime** - \`${duration(client.uptime).map(i=> `${i}`).join(", ")}\`
                    ${pointer} **Arch** - \`${os.arch()}\`
                    ${pointer} **Node** - \`${process.version}\`
                    ${pointer} **Platform** - \`${os.platform()}\`
                    ${pointer} **Discord.js** - \`v${Discord.version}\`
                    ${pointer} **API Latency** - \`${client.ws.ping}ms\`
                    ${pointer} **Connections** - \`${connectedchannelsamount} Connections\`
                    ${pointer} **Voice-Channels** - \`${client.channels.cache.filter((ch) => ch.type === "GUILD_VOICE" || ch.type === "GUILD_STAGE_VOICE").size}\`
                    ${pointer} **CPU usage** - \`${percent.toFixed(2)}%\`
                    ${pointer} **Memory Usage** - \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\`
                    ${pointer} **CPU Process** - \`${os.cpus().map((i) => `${i.model}`)[0]}\`     
                    `)
                    .setFooter(`${client.user.username.toUpperCase()} Crafted By kotlin#0427 & _destroyer_#1574`, client.user.displayAvatarURL());
                    message.react(react);
                    message.reply({
                        embeds: [botinfo]
                    });

                } catch (e) {
                    console.log(e)
                    let connectedchannelsamount = 0;
                    let guilds = client.guilds.cache.map((guild) => guild);
                    for (let i = 0; i < guilds.length; i++) {
                    if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
                    }
                    if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;
                    // let inviteme = new MessageButton().setStyle('PRIMARY').setCustomId('1').setLabel(`⏩ Skip`)
                    // let support = new MessageButton().setStyle('DANGER').setCustomId('2').setLabel(`⏹ Stop`)
                    // var buttonarray = [inviteme, support]  
                    const botinfo = new MessageEmbed()
                    .setColor(color)
                    .setTitle(`${emoji} GENERAL INFORMATION`)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`
                    ${pointer} **STATS**
                    ${pointer} **Users** - \`${client.users.cache.size}\`
                    ${pointer} **Servers** - \`${client.guilds.cache.size}\`
                    ${pointer} **Uptime** - \`${duration(client.uptime).map(i=> `${i}`).join(", ")}\`
                    ${pointer} **Arch** - \`${os.arch()}\`
                    ${pointer} **Node** - \`${process.version}\`
                    ${pointer} **Platform** - \`${os.platform()}\`
                    ${pointer} **Discord.js** - \`v${Discord.version}\`
                    ${pointer} **API Latency** - \`${client.ws.ping}ms\`
                    ${pointer} **Connections** - \`${connectedchannelsamount} Connections\`
                    ${pointer} **Voice-Channels** - \`${client.channels.cache.filter((ch) => ch.type === "GUILD_VOICE" || ch.type === "GUILD_STAGE_VOICE").size}\`
                    ${pointer} **CPU usage** - \`${percent.toFixed(2)}%\`
                    ${pointer} **Memory Usage** - \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\`
                    ${pointer} **CPU Process** - \`${os.cpus().map((i) => `${i.model}`)[0]}\` 
                    `)
                    .setFooter(`${client.user.username.toUpperCase()} Crafted By kotlin#0427 & _destroyer_#1574`, client.user.displayAvatarURL());
                    message.reply({
                        embeds: [botinfo]
                    });
                }
            })

            function duration(duration, useMilli = false) {
                let remain = duration;
                let days = Math.floor(remain / (1000 * 60 * 60 * 24));
                remain = remain % (1000 * 60 * 60 * 24);
                let hours = Math.floor(remain / (1000 * 60 * 60));
                remain = remain % (1000 * 60 * 60);
                let minutes = Math.floor(remain / (1000 * 60));
                remain = remain % (1000 * 60);
                let seconds = Math.floor(remain / (1000));
                remain = remain % (1000);
                let milliseconds = remain;
                let time = {
                    days,
                    hours,
                    minutes,
                    seconds,
                    milliseconds
                };
                let parts = []
                if (time.days) {
                    let ret = time.days + ' Day'
                    if (time.days !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (time.hours) {
                    let ret = time.hours + ' Hr'
                    if (time.hours !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (time.minutes) {
                    let ret = time.minutes + ' Min'
                    if (time.minutes !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)

                }
                if (time.seconds) {
                    let ret = time.seconds + ' Sec'
                    if (time.seconds !== 1) {
                        ret += 's'
                    }
                    parts.push(ret)
                }
                if (useMilli && time.milliseconds) {
                    let ret = time.milliseconds + ' ms'
                    parts.push(ret)
                }
                if (parts.length === 0) {
                    return ['instantly']
                } else {
                    return parts
                }
            }
            return;
        } catch (e) {
            console.log(e)
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
    }
}