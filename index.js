const Discord = require('discord.js');
const client = new Discord.Client();
var scramble = false;
var selectedtime = 0;
var winner;
var choice1;
var choice2;
var numbergame = false;
var chosennumber = '';
const prefix = '>';
var chosen = '';
var guess = [];
var nue = [];
var ret;
var set;
var time;
var count = 0;
client.on('ready', ()=>{
});
function shufflearray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
client.on("message", async message => {
    if(message.author.bot) return;
    const pureargs = message.content.trim().split(/ +/g);
    var args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(message.channel.type != 'dm' && message.channel.type != 'groupdm'){
        if(scramble == true){
            if(message.content.toLowerCase().indexOf(chosen) != -1){
                if(time == 30000 && count >= 20){
                    var messa = "you had only " + 30-count + " seconds left!";
                }
                else if(time == 30000 && count <= 10){
                    var messa = "that round lasted only " + count + " seconds!";
                }
                else if(time == 30000 && count < 20 && count > 10){
                    var messa = "that round lasted " + count + " seconds!";
                }
                else if(time > 40000 && count >= (time/1000)-15){
                    var messa = "you had only " + ((time/1000)-count) + " seconds left!";
                }
                else if(time > 40000 && count <= 15){
                    var messa = "that round lasted only " + count + " seconds!"; 
                }
                else if(time > 40000 && count <= (time/1000)-15 && count >= 15){
                    var messa = "that round lasted " + count + " seconds!";
                }
                scramble = false;
                clearTimeout(ret);
                clearInterval(set);
                message.react('✅').catch(function(error){
                    if(error) throw error;
                });
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: 'victory!',
                        icon_url: message.client.user.avatarURL,
                    },
                    fields: [{
                        name: 'word',
                        value: chosen,
                        inline: true,
                    }, {
                        name: 'winner',
                        value: message.author + "",
                        inline: true,
                    }],
                    footer: {
                        text: messa
                    }
                });chosen = '';
                count = 0;
                guess = [];
                return;
            } else {
                message.react('❌').catch(function(error){
                    if(error) throw error;
                });
                guess.push({guess: message.content.toString(), auth: (message.member.displayName)})
            }
        }
        if(numbergame == true){
            if(!Number.isNaN(parseInt(message.content))){
            if(parseInt(message.content) == chosennumber){
                
                numbergame = false;
                if(selectedtime-1 == 1){
                    var eeee = `you had 1 guess left!`
                }
                else if(selectedtime-1 == 0){
                    var eeee = `you got it on your last guess!`
                }
                else {
                    var eeee = `you had ${selectedtime-1} guesses left!`
                }
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: 'victory!',
                        icon_url: client.user.displayAvatarURL
                    },
                    fields: [{
                        name: 'number',
                        value: chosennumber,
                        inline: true,
                    }, {
                        name: 'winner',
                        value: message.author + "",
                        inline: true,
                    }],
                    footer: {
                        text: eeee
                    }
                });
                chosennumber = '';
                selectedtime=0;
                nue = [];
                return;
            }
            }
            else {
                selectedtime = selectedtime - 1;
                if(selectedtime != 0){
                    if(parseInt(message.content) > chosennumber){ nue.push({num: parseInt(message.content) - chosennumber, auth: message.author.username, og: parseInt(message.content)});return message.reply('\`too high!\`')};
                    if(parseInt(message.content) < chosennumber){ nue.push({num: chosennumber - parseInt(message.content), auth: message.author.username, og: parseInt(message.content)}); return message.reply('\`too low!\`')};
                }
                else if(selectedtime == 0){
                    numbergame = false;
                    selectedtime = 0;
                    if(parseInt(message.content) > chosennumber){ nue.push({num: parseInt(message.content) - chosennumber, auth: message.author.username, og: parseInt(message.content)})};
                    if(parseInt(message.content) < chosennumber){ nue.push({num: chosennumber - parseInt(message.content), auth: message.author.username, og: parseInt(message.content)})};
                    nue.sort(function(a,b){
                        return b.num - a.num;
                    });
                    nue = nue.reverse();
                    var closestguess = nue[0].num;
                    var closestauth = nue[0].auth;
                    var closest = nue[0].og;
                    message.channel.sendEmbed({
                        color: 0xffe23c,
                        author: {
                            name: 'game over...',
                            icon_url: client.user.displayAvatarURL
                        },
                        fields: [{
                            name: 'number',
                            value: chosennumber,
                            inline: true,
                        }, {
                            name: 'winner',
                            value: 'nobody',
                            inline: true,
                        }],
                        footer: {
                            text: `closest guess: ${closestauth} with ${closest}`
                        }
                    })
                    chosennumber = '';
                    nue = [];
                    return;
                }
            }
        }
        if((message.content.indexOf(prefix) == 0)){
            if(command === "scramble"){
            if(scramble == true) return message.reply("there is already a scramble game happening right now!");
                if(numbergame == true) return message.reply("there is already another game happening right now!");
            var words = ["trick","cheese", "tomato", "pizza", "tasty", "square", "spirit", "single", "turtle", "shadow", "napkin", "sauce", "toast", "remove", "honey", "food", "normal", "forget", "short", "italy", "mexico", "echo", "cola", "pepsi", "drink", "teddy", "skiing", "wooden", "broken", "blank", "mitten", "casino", "money", "clouds", "hostage", "panda", "sprint", "ache", "disable", "prank", "flame", "oven", "snake", "brain", "heart", "online", "flag", "range", "ocean", "report", "super", "insect", "horse", "explode", "candy", "self", "sleep", "awake", "riddle", "pain", "seven", "video", "avatar", "station", "eagle", "english", "cheat", "photo", "slime", "solar", "soup", "pasta", "china", "stolen", "danger", "friend", "alert", "cousin", "creepy", "sister", "knife", "frog", "older", "summer", "winter", "month", "guess", "autumn", "bucket", "energy", "basket", "spring", "laugh", "light", "north", "south", "east", "west", "sight", "minute", "flea", "bells", "music", "random", "lucky", "wisdom", "extend", "moon", "earth", "space", "poison", "dream", "drown", "death", "number", "alive", "animal", "secret", "tech", "scar", "clown", "memory", "middle", "clean", "urban", "twin", "wires", "spike", "family", "force", "word", "paper", "appear", "radar", "rotten", "custom", "volcano", "side", "shape", "volume", "horror", "mirror", "logic", "scream", "mask", "melt", "locked", "step", "stairs", "length", "world", "famous", "night", "speak", "hungry", "water", "burger", "breath", "party", "coat", "dizzy", "camera", "blind", "enable", "guitar", "piano", "flute", "bubble", "splash", "trouble", "teeth", "title", "loud", "subway", "envy", "upset", "circle", "devil", "siren", "trash", "crime", "police", "tomb", "truth", "clock", "time", "nature", "create", "chat", "reason", "problem", "street", "quake", "quiet", "change", "plane", "flight", "flying", "anger", "throat", "upload", "artist", "stupid", "america", "blood", "string", "breeze", "nation", "fresh", "candle", "soda", "country", "chips", "forest", "climb", "cliff", "tower", "senior", "cookie", "cream", "charge", "spark", "silly", "smart", "empty", "fruit", "burst", "steam", "smoke", "giant", "midget", "young", "fence", "sleeve", "knot", "zero", "lying", "fluid", "thief", "shift", "japan", "close", "defend", "dinner", "lunch", "almost", "never", "season", "storm", "simple", "float", "admin", "cyber", "casual", "divide", "piece", "nearly", "bounce", "watch", "human","frozen", "waste", "phone", "screen", "shield", "person", "around", "fraud", "murder", "colour", "pilot", "radio", "field", "chord", "creek", "before", "story", "yellow", "valley", "planet", "system", "decide", "hatred", "golden", "feral", "travel", "mobile", "bandit", "smelly", "magic", "lonely", "alone", "along", "dial", "fake", "serious", "respond", "future", "graph", "dart", "player", "winner", "tiny", "blend", "cloak", "select", "record", "weird", "begin", "center", "enough", "panic", "wing", "fallen", "cheer", "miracle", "confuse", "measure", "grass", "rest", "liquid", "abuse", "extra", "idiot", "discord", "believe", "parrot", "damage", "pumpkin", "clap", "mother", "", "deliver", "stone", "league", "pork", "method", "screw", "silent", "hound", "count", "sound", "fine", "history", "year", "mint", "disc", "stuff", "crust", "costume", "stain", "special", "place", "direct", "leader", "slice", "river", "streak", "mute", "shark", "stripe", "dots", "twitch", "turn", "fern", "bait", "offline", "real", "escape", "science", "haunted",  "brother", "request", "pretend", "private", "picture", "puzzle", "jigsaw", "machine", "scratch", "account", "failure", "success", "emotion", "disease", "cent", "holiday", "strange", "nothing", "thought", "website", "wonder", "welcome", "destroy", "correct", "warning", "general", "connect", "glasses", "musical"];
                words = shufflearray(words);
                chosen = words[Math.round(Math.random()*(words.length-1))].toString();
                time = ((chosen.split('').length)*15000)-30000;
                if(chosen.split('').length == 7){
                    time = 120000;
                }
                else if(chosen.split('').length == 8){
                    time = 240000;
                }
                var output = chosen.shuffle();
                scramble = true;
                while(output == chosen){
                    output = chosen.shuffle();
                }
                setTimeout(function(){
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: 'scramble!',
                        icon_url: message.client.user.avatarURL,
                    },
                    fields: [{
                        name: 'word',
                        value: output,
                        inline: true,
                    }, {
                        name: 'time',
                        value: `${time/1000} seconds`,
                        inline: true
                    }],
                    footer: {
                        text: 'type your answers in chat!'
                    }
                })
            },200);
            set = setInterval(function(){
                count++;
                if(time/1000 == 30){
                    if(count == 15){
                        message.channel.send("*15 seconds left!*");
                    }
                    else if(count == 25){
                        message.channel.send("*5 seconds left!*");
                    }
                }
                else if(time/1000 == 45){
                    if(count == 15){
                        message.channel.send("*30 seconds left!*");
                    }
                    if(count == 30){
                        message.channel.send("*15 seconds left!*");
                    }
                    else if(count == 40){
                        message.channel.send("*5 seconds left!*");
                    }
                }
                else if(time/1000 == 60){
                    if(count == 15){
                        message.channel.send("*45 seconds left!*");
                    }
                    if(count == 30){
                        message.channel.send("*30 seconds left!*");
                    }
                    else if(count == 45){
                        message.channel.send("*15 seconds left!*");
                    }
                    else if(count == 55){
                        message.channel.send("*5 seconds left!*");
                    }
                }else if(time/1000 == 120){
                    if(count == 30){
                        message.channel.send("*90 seconds left!*");
                    }
                    else if(count == 60){
                        message.channel.send("*60 seconds left!*");
                    }
                    else if(count == 90){
                        message.channel.send("*30 seconds left!*");
                    }
                    else if(count == 105){
                        message.channel.send("*15 seconds left!*");
                    }
                    else if(count == 115){
                        message.channel.send("*5 seconds left!*");
                    }
                }
            }, 1000);
                ret = setTimeout(function(){
                    if(scramble == true){
                        var best;
                        var bargs = [];
                        if(guess.length == 0){
                            var mess = "nobody even tried to guess the word!";
                        }else {
                        guess.forEach(c => {
                            var num = 0;
                            var am = chosen.toString().split('');
                            var cm = c.guess.toString().split('');
                            var fm = c.auth;
                            for(var i = 0; i < am.length; i++){
                                if(am[i].toString() === cm[i]){
                                    num++;
                                }
                            }
                            bargs.push({gue: cm.join(""), num: num, auth: fm});
                        });
                        bargs.sort(function(a,b){
                            return b.num - a.num;
                        });
                        var closest = bargs[0].gue.toString();
                        var auth = bargs[0].auth.toString();
                        console.log(closest);
                        console.log(auth);
                        var mess = "closest guess: " + auth + " with \"" + closest + "\"";
                    }
                    clearInterval(set);
                    count = 0;
                    scramble = false;
                    
                    message.channel.sendEmbed({
                        color: 0xffe23c,
                        author: {
                            name: 'game over...',
                            icon_url: message.client.user.avatarURL,
                        },
                        fields: [{
                            name: 'word',
                            value: chosen,
                            inline: true,
                        }, {
                            name: 'winner',
                            value: 'nobody',
                            inline: true,
                        }],
                        footer: {
                            text: mess
                        }
                    });
                    guess = [];
                    chosen = '';
                    return;
                    }
                },time);
            }
            if(command === "number"){
                if(numbergame == true)return message.reply("there is already a game of guess the number happening right now!");
                if(scramble == true) return message.reply("there is already another game happening right now!");
                var times = [6, 8, 10, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18];
                var nums = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
                if(!args[0] || (nums.indexOf(parseInt(args[0])) == -1)){
                    var randmode = Math.round(Math.random()*(nums.length-1));
                    selectedtime = times[randmode];
                    var selectedgame = nums[randmode];
                }
                else {
                    var randmode = nums.indexOf(parseInt(args[0]));
                    selectedtime = times[randmode];
                    var selectedgame = nums[randmode];
                }
                chosennumber = Math.round(Math.random()*(selectedgame));
                numbergame = true;
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: 'guess the number!',
                        icon_url: client.user.displayAvatarURL
                    },
                    fields: [{
                        name: 'number between',
                        value: `0 and ${selectedgame}`,
                        inline: true,
                    }, {
                        name: 'guesses',
                        value: selectedtime,
                        inline: true,
                    }]
                })
               
            }
            if(command === "rps"){
                var member1 = message.member;
                var member2 = message.mentions.members.first();
                if(!args[1] || parseInt(args[1]<1)) var rec = 1;
                else var rec = parseInt(args[1]);
                if(!member2) return message.reply("usage: `>rps [user] [number]`");
                if(member2 == member1) return message.reply("you cannot duel yourself!");
                if(rec == 1){
                rps(member1,member2);
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: 'rock, paper, scissors!',
                        icon_url: client.user.avatarURL,
                    }
                });
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    fields: [{
                        name: "winner",
                        value: winner,
                        inline: true,
                    }]
                })
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    fields: [{
                        name: member1.user.username + " chose",
                        value: choice1,
                    },
        {
                        name: member2.user.username + " chose",
                        value: choice2,
                    }]
                });
                winner = '';
            }
            else if(rec > 1){
                var t1 = 0;
                var t2 = 0;
                for(var i = 0; i < rec; i++){
                    rps(member1,member2);
                    if(winner == member1.user.username + "#" + member1.user.discriminator){
                        t1++;
                    }
                    else if(winner == member2.user.username + "#" + member2.user.discriminator){
                        t2++;
                    }
                    winner = '';
                }
                if(t1 > t2){
                    var newwin = member1.user.username + "#" + member1.user.discriminator;
                }else if(t1 < t2){
                    var newwin = member2.user.username + "#" + member2.user.discriminator
                }
                else if(t1==t2){
                    var newwin = "nobody";
                }
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: 'rock, paper, scissors!',
                        icon_url: client.user.avatarURL,
                    }
                });
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    fields: [{
                        name: "winner",
                        value: newwin,
                        inline: true,
                    }]
                })
                message.channel.sendEmbed({
                    color: 0xffe23c,
                    fields: [{
                        name: member1.user.username + "'s score",
                        value: t1,
                    },
        {
                        name: member2.user.username + "'s score",
                        value: t2,
                    }, {
                        name: 'ties',
                        value: (rec-(t1+t2))
                    }]
                });
                newwin = '';
                t1=0;
                t2=0;
            }
            }
            if(command === "8ball"){
                var answers = ["100% fam", "yep", "without a doubt <o/", "hell yeah fam", "you can count on it bby", "chances are \*burp\* pretty güd", "the phat gods say yes", "horse buoy approves of this", "for sure <o/", "of course boi", "the phat gods are unsure", "hmmmm... idk.", "ehh maybe?", "i have no clue tbh", "possibly???", "lmao nope", "the phat gods say no", "nah bruv", "i say no <o/", "definitely not"]
                answers = shufflearray(answers);
                if(!args[0]) return message.reply("usage: `>8ball [question]`");
               var num = Math.round(Math.round(Math.random()*59)/3);
               var selected = answers[num];
               if(!args.join(' ').endsWith("?")){
                   var ques = (args.join(" ")) + "?";
               }
               else if(args.join(' ').endsWith("?")){
                var ques = (args.join(" "));
            }
               message.channel.sendEmbed({
                   color: 0xffe23c,
                   author: {
                       name: `▶${ques}◀`,
                       icon_url: client.user.avatarURL
                   },
                   title: `🎱**\`${selected}\`**🎱`,
                   footer: {
                       text: `called by ${message.author.username}#${message.author.discriminator}`
                   }
               })
            }
            if(command === "ship"){
                if(!args[0]){
                    args = [message.author.username.toString(), message.guild.members.array()[Math.round(Math.random()*(message.guild.members.size-1))].user.username.toString()];
                }
                if(!args[1]){
                    args = [message.author.username.toString(), args[0]];
                }
                var thing1 = args[0].toString();
                var thing2 = args[1].toString()
                var matches = ["shadow teddy", "shadow teddy1424", "teddy shadow", "teddy1424 shadow", "happy teddy", "happy teddy1424", "teddy happy", "teddy1424 happy", "victoria teddy", "victoria teddy1424", "teddy victoria", "teddy1424 victoria", "michael bubba", "michael bubbaplayspiano", "michael taryn", "bubba michael", "bubbaplayspinao michael", "taryn michael", "paunda anya", "anya paunda", "ben anya", "anya ben"];
                if(matches.indexOf((thing1.toLowerCase().toString() + " " + thing2.toLowerCase().toString())) != -1){
                    return message.channel.sendEmbed({
                        color: 0xffe23c,
                        author: {
                            name: '❤matchmaking❤',
                            icon_url: client.user.avatarURL,
                        },
                        title: `💘\`${thing1}\` + \`${thing2}\`💘`,
                        description: `**101% \`██████████\`**`,
                        footer: {
                            text: "perfect👌"
                        }
                    })
                };
                var thing1a = thing1.split('');
                var thing2a = thing2.split('');
                var uuu = thing1a + thing2a;
                var ar = [thing1, thing2];
                console.log('before', ar);
                ar.sort(function(a,b){
                    if(a < b) return -1;
                    if(a > b) return 1;
                    return 0;
                });
                console.log('after',ar);
                console.log("aaa",ar);
                var combined = ar.join();
                var shiparray = [];
                var combinedarray = ar;
                combinedarray.join('').toString().split('').forEach(c => {
                    shiparray.push(c.toLowerCase().charCodeAt(0));
                });
                console.log("yyyy",shiparray.join(''))
                var shipnum = Math.round(Math.round(((parseInt(shiparray.join('')))) % 1001)/10);
                console.log(shiparray);
                console.log(combinedarray);
                if(shipnum == 0){
                    var perc = " ​ ​ ​ ​ ​ ​ ​ ​ ​ ​";
                    var mess = "lmao hell no fam"
                }
                else if(shipnum <= 10&&shipnum >0){
                    var perc = "█ ​ ​ ​ ​ ​ ​ ​ ​ ​";
                    var mess = "lmao hell no fam"
                }
                else if(shipnum > 10 && shipnum <= 20){
                    var perc = "██ ​ ​ ​ ​ ​ ​ ​ ​";
                    var mess = "you tried..."
                }
                else if(shipnum > 20 && shipnum <= 30){
                    var perc = "███ ​ ​ ​ ​ ​ ​ ​";
                    var mess = "uhh... no thanks.";
                }
                else if(shipnum > 30 && shipnum <= 40){
                    var perc = "████ ​ ​ ​ ​ ​ ​";
                    var mess = "it's probably safe to give up on this one...";
                }
                else if(shipnum > 40 && shipnum <= 50){
                    var perc = "█████ ​ ​ ​ ​ ​";
                    var mess = "ehh... maybe?"
                }
                else if(shipnum > 50 && shipnum <= 60){
                    var perc = "██████ ​ ​ ​ ​";
                    var mess = "close enough, i guess..."
                }
                else if(shipnum > 60 && shipnum <= 70){
                    var perc = "███████ ​ ​ ​";
                    var mess = "\*click\* noice"
                }
                else if(shipnum > 70 && shipnum <= 80){
                    var perc = "████████ ​ ​";
                    var mess = "ooh, not bad 😏";
                }
                else if(shipnum > 80 && shipnum <= 90){
                    var perc = "█████████ ​";
                    var mess = "ayy.. that's pretty good";
                }
                else if(shipnum > 90 && shipnum <= 100){
                    var perc = "██████████";
                    var mess = "almost as good as #sheddy";
                }
                return message.channel.sendEmbed({
                    color: 0xffe23c,
                    author: {
                        name: '❤matchmaking❤',
                        icon_url: client.user.avatarURL,
                    },
                    title: `💘\`${thing1}\` + \`${thing2}\`💘`,
                    description: `**${shipnum}% \`${perc}\`**`,
                    footer: {
                        text: mess,
                    }
                })
            }
        }
    }
});
function count(){
    if(scramble == true){
        set = setInterval(function(){
            count++;
        }, 1000)
    }
}
function rps(member1,member2){
    var rand1 = Math.round(Math.random()*298)+1;
    var rand2 = Math.round(Math.random()*298)+1;
    if(rand1 <= 100){
        choice1 = "paper";
    }
    else if(rand1 > 100 && rand1 <= 200){
        choice1 = "scissors";
    }
    else if(rand1 > 200 && rand1 <= 300){
        choice1 = "rock";
    }
    if(rand2 <= 100){
        choice2 = "paper";
    }
    else if(rand2 > 100 && rand2 <= 200){
        choice2 = "scissors";
    }
    else if(rand2 > 200 && rand2 <= 300){
        choice2 = "rock";
    }
    if(choice1 == "paper" && choice2 == "scissors"){
        winner = member2.user.username + "#" + member2.user.discriminator;
    }
    else if(choice1 == "paper" && choice2 == "rock"){
        winner = member1.user.username + "#" + member1.user.discriminator;
    }
    else if(choice1 == "rock" && choice2 == "scissors"){
        winner = member1.user.username + "#" + member1.user.discriminator;
    }
    else if(choice1 == "rock" && choice2 == "paper"){
        winner = member2.user.username + "#" + member2.user.discriminator;
    }
    else if(choice1 == "scissors" && choice2 == "paper"){
        winner = member1.user.username + "#" + member1.user.discriminator;
    }
    else if(choice1 == "scissors" && choice2 == "rock"){
        winner = member2.user.username + "#" + member2.user.discriminator;
    }
    else if(choice1 == choice2){
        winner = "nobody";
    }
}
client.login(process.env.BOT_TOKEN);
