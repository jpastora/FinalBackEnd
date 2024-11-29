const mongoose = require('mongoose');

const uri = "mongodb+srv://uservibe:vive1717@cluster0.fztdd.mongodb.net/VibeTickets?retryWrites=true&w=majority";

async function connectDB() {
    try {
        await mongoose.connect(uri, {});
        console.log("Conectado exitosamente a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;