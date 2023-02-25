const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = 'YourBotToken';

function catchErr (err, message) {
    message.channel.send("An error has occurred: ```" + err + "```");
}

client.on('ready', () => { // Bot State
    console.log(`Bot ${client.user.username} is running!`);

    let statuses = [
        `you`,
        `t!help`,
        `commands`
    ]

    setInterval(function(){
        let statuse = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(statuse, {type: 'LISTENING'}).catch(console.error);
        
    }, 3000)
})


client.on("message", async message => {
    if(message.author.bot || message.type=="dm")return;
    var arg = message.content.toLowerCase().split(" ");
    try {

        if(arg[0]!='?ticket') return;
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")||!message.guild.me.hasPermission("MANAGE_ROLES")){
            message.channel.send("Not enough permissions I require the `MANAGE_CHANNELS` and `MANAGE_ROLES` permission!");
            return;
        }
        const TicketCategory = message.guild.channels.cache.find(c => c.type === 'category' && c.name.toLowerCase() === 'Open Tickets');

        if(!TicketCategory) return message.reply("Please create a `Open Tickets` category.");
        if(TicketCategory == null || !TicketCategory) {
            await message.guild.channels.create('Open Tickets', {
                type: 'category',
                permissionOverwrites: [{
                    id: message.guild.id,
                    deny: ['READ_MESSAGES']
                }]
            })
            .then(t => TicketCategory = t)
            .catch(console.error);
        }
        switch (arg[1]) {
            case "create":
                if(arg.length<=2){
                    message.reply("Incorrect usage! pls type `?ticket create (reason)`");
                    return;
                }
                let reason = arg.slice(2).join(" ");
                reason = new Discord.MessageEmbed()
                .setTitle("User "+message.author.username+" issued a ticket!")
                .setDescription(reason)
                .setFooter("Pls solve as quickly as possible!")
                .setColor('#32cd32');
                if(reason.length>=1800){
                    message.reply("Pls describe your problem in less words")
                    return;
                }
                let roles = message.guild.roles.cache.filter(x => x.permissions.has("MANAGE_CHANNELS"));
                let perms=[];
                roles.forEach(role => {
                perms.push( 
                        {
                            id:role.id,
                            allow:["READ_MESSAGES"]
                        }
                    )
                });
                perms.push(
                        {
                            id:message.guild.id,
                            deny: ["READ_MESSAGES"]
                        },
                        {
                            id: message.author.id,
                            allow:["READ_MESSAGES"]
                        }
                );
                message.guild.channels.create(`${message.author.username}'s ticket`, {
                    type: 'text',
                    parent: TicketCategory.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: message.author.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                    ],
                })
                  .then(channel => {
                    // Send a confirmation message
                    channel.send(`Welcome to your ticket, ${message.author}!`);
                  })
                  .catch(console.error);
                
                break;
            case "delete":
                if(!message.channel.name.endsWith("ticket")){
                    message.reply("You must type this command in a open ticket");
                    break;
                }
                message.reply("Are you sure you want to close this ticket?\nType `confirm` to confirm.");
                
                const collector = message.channel.createMessageCollector(
                    m=>m.content.toLowerCase().startsWith("confirm")&&m.author.id==message.author.id,
                    {time:20000,max:1}
                );
                collector.on('collect', m => {
                    if(!m.channel.deletable)message.reply("Something's wrong. I can't delete this ticket!");
                    else m.channel.delete();
                });
                break;
            case "help":
                const help = new Discord.MessageEmbed()
                    .setTitle("Hello "+message.author.username+"!")
                    .setDescription("How to create a ticket? Use the commands in any channel of the discord server.")
                    .addField("?ticket create <reason>","Create a private channel with you and staff to solve to issuse together!")
                    .addField("?ticket delete","Issue is solved? then you can delete the channel with ticket delete")
                    .addField("creator:","darrenefecto")
                    .setColor('#32cd32');
                message.channel.send(help);
                break;
            default:
                break;
        }
    }  
    catch(err)
    {
        catchErr(err, message);
    } 
});


client.login(TOKEN)