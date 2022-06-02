import dotenv from 'dotenv';
import client from 'mongoose';
dotenv.config({ path: "./config.env" })
var _db;

export default {
    connectToServer: async function(callback) {
        _db = await client.connect(process.env.ATLAS_URI);
        if (_db) {
            console.log("Succesfully connected to MongoDB.");
            /*client.connection.db.listCollections().toArray(function (err, names) {
                console.log(names);
            });*/
        }
    },

    connection: function() {
        return _db;
    }
};