/** 
 * Config file for nonsensitive data
 */

module.exports.christmasShit = ["christmas", "Weihnachten"];
module.exports.prefix = process.env.PREFIX;
module.exports.fetchData = require("./functions/fetchDataFromSave.js");
module.exports.embedFooter = (client) => ({ text: `Running as ${client.user.tag} on version ${require("./package.json")["version"]} of the Better-SUS-Bot by ${require("./package.json")["author"]}` });