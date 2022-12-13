const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userid:{ require: true, type:String },

    economy: {
        wallet: { type:Number, default: 500 },
        bank: { type:Number, default: 0 },
    },


    job: {
        type: {
            lastUsed: { type:Date },
            job: { 
                name: { type: String, required: false },
                description: { type: String, required: false },
                reuse: {
                    type: Number,
                    default: 30,
                }
            }
        },

        default: {}
    }
});

module.exports = model("user", guildSchema, "users");