require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@serverdatadb.39fv13g.mongodb.net/bot-wa?retryWrites=true&w=majority`);
