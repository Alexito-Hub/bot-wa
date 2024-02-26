const mongoose = require('mongoose');

const groupConfigSchema = new mongoose.Schema({
    groupId: {
        type: String,
        unique: true,
        required: true,
    },
    antilink: {
        type: Boolean,
        default: false,
    },
},  { collection: 'GroupConfig', versionKey: false });

const GroupConfig = mongoose.model('GroupConfig', groupConfigSchema);

module.exports = GroupConfig;
