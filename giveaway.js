const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
 info: {
  name: "giveaway",
  description: "To create a giveaway",
  usage: "[time] [channel] [prize]",
  aliases: ["g", "create", "gstart"],
 },
  
  run: async (bot, message, args) => {
  
    if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")) {
    return message.channel.send(':x: You need to have the manage messages permissions to start giveaways.');
  }
    
    if (!args[0]) return message.channel.send(`You did not specify your time!`);
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m")
    )
      return message.channel.send(
        `You did not use the correct formatting for the time!`
      );
    if (isNaN(args[0][0])) return message.channel.send(`That is not a number!`);
    
    let channel = message.mentions.channels.first();
    if (!channel)
      return message.channel.send(
        `I could not find that channel in the guild!`
      );
    let serverid = message.guild.id;
    let channelid = channel.id;
    
    let prize = args.slice(2).join(" ");
    if (!prize) return message.channel.send(`No prize specified!`);
     
    let Embed = new MessageEmbed()
      .setTitle(`:tada:GIVEAWAY:tada:`)
      .setDescription(
        `React 🎉 To Enter Giveaway!!\nThe Prize Is **${prize}**\nGiveaway Will End **In ${args[0]}**\nHosted By ${message.author}`)
      .setTimestamp(Date.now() + ms(args[0]))
      .setFooter(`Ends at`)
      .setColor(`RANDOM`);
    let m = await channel.send(Embed);
    let messageid = m.id;
    
    m.react("🎉");
    
    message.channel.send(`**Giveaway created in ${channel}\nLink: https://discordapp.com/channels/${serverid}/${channelid}/${messageid}\n\`\`\`\nPrize: ${prize}\nTime: ${args[0]}\nHost: @${message.author.tag}\n\`\`\`**`);
    setTimeout(() => {
    if (m.reactions.cache.get("🎉").count <= 1) {
     let Embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`:tada:GIVEAWAY ENDED:tada:`)
      .setDescription(`Not Enough Participants To Determine The Giveaway Winner!\nHosted By ${message.author}`)
      .setTimestamp(Date.now() + ms(args[0]))
      .setFooter(`Ended at`)
      m.edit(Embed)
      return channel.send(`No Participants Joined The Giveaway, So There Are No Winners In The Giveaway!\nhttps://discordapp.com/channels/${serverid}/${channelid}/${messageid}`);
      }

      let winner = m.reactions.cache
        .get("🎉")
        .users.cache.filter((u) => !u.bot)
        .random();
  
      let Embed = new MessageEmbed()
     .setColor("RANDOM")
     .setTitle(`:tada:GIVEAWAY ENDED:tada:`)
     .setDescription(`Giveaway Winner is ${winner}\nThe Prize is **${prize}**\nHosted By ${message.author}`)
     .setTimestamp(Date.now() + ms(args[0]))
     .setFooter("Ended at")
     m.edit(Embed)
      
      channel.send(
        `Congratulations ${winner}! You Won The **${prize}**!\nhttps://discordapp.com/channels/${serverid}/${channelid}/${messageid}`
      );
    }, ms(args[0]));
  },
};
