const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ProjetoMesaDB';
    
    console.log(`🔄 Conectando ao MongoDB: ${mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Erro ao conectar no MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

