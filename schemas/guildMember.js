const { Schema, model } = require("mongoose");

const guildMemberSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userid:{ require: true, type:String },

    level: {
        level: { type:Number, default: 0 },
        experience: { type:Number, default: 0 },
    },

    warns: {
        type:[
            { 
                reason: { 
                    type:String,
                    required: true 
                }, 
                date: { 
                    type:Date,
                    required: true
                } 
            }
        ],
        default: [],
    }
});

module.exports = model("user", guildMemberSchema, "users");