// Comprueba si la autenticación está habilitada
const isAuthEnabled = process.env.AUTH_ENABLED === "true";

// Imports condicionales para evitar cargar módulos de server en el cliente
let MongoClient;
let mongoose;
let client;
let clientPromise;

// Solo importamos MongoDB si estamos en el servidor
if (typeof window === 'undefined') {
  // Estamos en el servidor
  // Importaciones seguras de módulos de servidor
  MongoClient = require("mongodb").MongoClient;
  mongoose = require("mongoose");

  // Solo realiza la verificación y configuración de MongoDB si la autenticación está habilitada
  if (isAuthEnabled && !process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dummy";
  const options = {};

  // Solo inicializa la conexión si la autenticación está habilitada
  if (isAuthEnabled) {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  }
}

// conectar con Mongoose
export const connectMongoDB = async () => {
  // Si estamos en el cliente, o la autenticación está deshabilitada, no hacer nada
  if (typeof window !== 'undefined' || !isAuthEnabled) {
    return null;
  }
  
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    return await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

// Exportamos un objeto vacío para el cliente, o clientPromise para el servidor
export default typeof window === 'undefined' && isAuthEnabled ? clientPromise : null;
