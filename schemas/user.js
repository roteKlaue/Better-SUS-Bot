const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userid:{ require: true, type:String },

    level: {
        xp: { type:Number, default: 0 },
        level: { type:Number, default: 0 },
    },

    economy: {
        wallet: { type:Number, default: 500 },
        bank: { type:Number, default: 0 },
    }
});

module.exports = model("user", guildSchema, "users");