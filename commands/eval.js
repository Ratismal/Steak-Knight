const serv = require("../server.js");
const bot = serv.bot;
let alexia = "cute";
module.exports = {
  func: async (msg, args) => {
   if ( process.env.ids.includes(msg.author.id)
 
    ) {
      let toExecute;
      let code = args.join(" ");
      if (code.split("\n").length === 1)
        toExecute = eval(`async () => ${code}`);
      else toExecute = eval(`async () => { ${code} }`);
      toExecute.bind(this);
      try {
        msg.channel.createMessage(await toExecute());
      } catch (err) {
        msg.channel.createMessage(err.stack);
      }
    }
  },

  options: {
    description: "Owner-only eval",
    fullDescription: "You don't get to use this unless you're me",
    usage: "`sk eval`"
  },
  name: "eval"
};
