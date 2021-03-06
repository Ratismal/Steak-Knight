const serv = require("../server.js");
let client = serv.client;
let droll = serv.droll;
const guildcd = new Set();
module.exports = {
  func: async (msg, args) => {
   

    if (args[0] == "find"){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        client.query("Select * from players where player_id = $1",spoop).then(p => {
            if (typeof p.rows[0] == "undefined"){
                msg.channel.createMessage({embed:{description:"You haven't started your adventure yet! Use `sk rpg`"}})

            }
            else {
            if (p.rows[0].player_level < 3){
                snark[0] = "Steakgoblin"
            }
            else{
                snark[0] = "Steakorc"
            }
        
        snark[1] = 1234
        snark[2] = Math.ceil(p.rows[0].player_level / 2)
        snark[3] = msg.author.id
        snark[4] = 15 + 5 * Math.ceil(p.rows[0].player_level / 2)
        snark[5] = 1  * Math.ceil(p.rows[0].player_level / 2)
        
       
        

            client.query("SELECT * FROM monsters where player_id = $1",spoop).then(m => {
                let monster = m.rows[0];
                    if (typeof monster == "undefined"){
                client.query("INSERT INTO monsters (monster_name, monster_id, monster_level, player_id, hp,  atk ) values ($1, $2, $3, $4, $5, $6)", snark)
                msg.channel.createMessage({embed:{description:"You found a "+snark[0] +"! It is level "+snark[2]+", has " + snark[4]+ " health, and has an attack of 2d3+" + snark[5]+ "."}})
            }
            else {
                client.query("SELECT * FROM monsters where player_id = $1",spoop).then(m => {
                    let monster = m.rows[0];
                msg.channel.createMessage({embed:{description:"You are currently fighting a level "
                +monster.monster_level+ " " + monster.monster_name +
                 " with " +monster.hp+" hp, and  an attack of 2d3+"+monster.atk+"."}})
            })
            }
        
        })

    }
        })
    }
    if (args[0] == "fight"){
        if (guildcd.has(msg.channel.guild.id)) {
            msg.channel.createMessage("This command is on cooldown!");
    } else {
        client.query("SELECT * FROM monsters where player_id = $1",[msg.author.id]).then(m=> {
            let monster = m.rows[0];
            if (typeof monster == "undefined"){
                msg.channel.createMessage({embed:{description:"You haven't found a monster yet! Use `sk rpg find`"}})
                return;
            }
            else {
                client.query("SELECT * FROM players where player_id = $1",[msg.author.id]).then(p =>
                     {
                         let player = p.rows[0]
                let playerHit = droll.roll(`2d6+${player.player_atk}`).total;
                let monsterHit = droll.roll(`2d3+${monster.atk}`).total;
                let atkDesc = "You dealt the monster " + playerHit + " damage!\n"+
                "The monster dealt you " + monsterHit + " damage!"
                if ( 0 >= monster.hp - playerHit){
                    atkDesc = "You killed the monster! Hooray! You gained " + monster.monster_level * 20 + " xp! You also gained "+monster.monster_level*5+" <:steak:481449443204530197>!"
                    client.query("INSERT INTO currency (id, money) values ($1, $2) ON CONFLICT (id) DO UPDATE SET money = currency.money + $2 WHERE currency.id = $1", [player.player_id, monster.monster_level*5])
                    client.query("DELETE FROM monsters where player_id = $1",[player.player_id]);
                    if (player.player_xp + monster.monster_level*20 >= player.player_next_level){
                        client.query("UPDATE players SET (player_xp, player_hp, player_atk, player_level, player_next_level, player_maxhp) = (players.player_xp + $1, players.player_maxhp + 10 , players.player_atk + 1, players.player_level+1, players.player_next_level + 100, players.player_maxhp+10)   where player_id = $2", [monster.monster_level * 20, player.id]);
                   atkDesc += "\nAlso, you leveled up! You are now level " + (player.player_level + 1)
                    }
                    else{
                        client.query("UPDATE players SET player_xp = players.player_xp + $1 where player_id = $2", [monster.monster_level * 20, player.player_id]);
                    }
                }
                else if (0 >= player.player_hp - monsterHit){
                    atkDesc = "Oh no, you were killed by the monster! You'll have to find another one to fight!"
                    client.query("DELETE FROM monsters  where player_id = $1", [player.player_id]);
                    client.query("UPDATE players SET player_hp = $1 where player_id = $2", [player.player_maxhp, player.player_id]);
                }
                else {
                    client.query("UPDATE players SET player_hp = players.player_hp - $1 where player_id = $2",[monsterHit, player.player_id]);
                    client.query("UPDATE monsters SET hp = monsters.hp - $1 where player_id = $2",[playerHit, player.player_id]);
                }
                

                
                msg.channel.createMessage(
                                {
                                 embed:
                                        {
                                    description: atkDesc
                                        }
                                })
                
                


                        })
                }

        })


        guildcd.add(msg.channel.guild.id);
        setTimeout(() => {
          guildcd.delete(msg.channel.guild.id);
        }, 4000);
    }
        

    }
    if (args[0] == "help"){
        msg.channel.createMessage({embed:{description:"You can use `sk rpg` to check your stats, `sk rpg find` to find a monster to fight, and `sk rpg fight` to fight a monster! Please use `sk rpg` first!"}});
    }
    if (args[0] == null){
        let spoop = [];
        spoop[0] = msg.author.id
        let snark = [];
        snark[0] = msg.author.id
        snark[1] = 1
        snark[2] = 50
        snark[3] = 1
        snark[4] = 0
        snark[5] = 100
        snark[6] = 50
        client.query("SELECT * FROM players where player_id = $1",spoop).then(p => {
            let player = p.rows[0];
            if (typeof player == "undefined"){
                client.query("INSERT INTO players (player_id, player_level, player_hp, player_atk, player_xp, player_next_level, player_maxhp) values ($1, $2, $3, $4, $5, $6, $7)", snark)
                msg.channel.createMessage({embed:{description:"You are level 1, have 50 hp, and have an attack of 2d6+1. You haven't done anything yet, so you have 0xp."}})
            }
            else {
                msg.channel.createMessage({embed:{description:"You are level "+player.player_level+", have "+player.player_hp+" out of " +player.player_maxhp + " hp, and have an attack of 2d6+"+player.player_atk + ".\n"
                +"You have " + player.player_xp + " xp and you hit the next level at "+ player.player_next_level + " xp."}})
            }
        })
    }


    
   
},
  options: {
    description: "Rpg system (in development)!",
    fullDescription: "You can use `sk rpg` to check your stats, `sk rpg find` to find a monster to fight, and `sk rpg fight` to fight a monster! Please use `sk rpg` first!",
    usage: "`sk rpg`"
  },
  name: "rpg"
};
