import mongoose from "mongoose";

export async function connect() {
    try {
        // Check if there's already an active connection
        if (mongoose.connection.readyState === 1) {
            console.log("Using existing database connection");
            return mongoose.connection;
        }

        // Establish new connection with optimized settings
        const connection = await mongoose.connect(process.env.MONGODB_URI!, {
            // Connection Pool Settings
            maxPoolSize: 10,       // Maximum number of simultaneous connections
            minPoolSize: 2,        // Minimum number of maintained connections
            waitQueueTimeoutMS: 5000, // Max wait time for a connection from pool
            
            // Timeout Settings
            serverSelectionTimeoutMS: 5000,  // Timeout for server selection
            connectTimeoutMS: 30000,         // Timeout for initial connection
            socketTimeoutMS: 45000,          // Timeout for individual operations
            
            // Buffering Settings
            bufferCommands: true,  // Enable command buffering to prevent connection issues
            
            // Replication/Sharding Settings
            retryWrites: true,      // Auto-retry write operations
            retryReads: true,       // Auto-retry read operations
            
            // Other Optimizations
            heartbeatFrequencyMS: 10000, // How often to check connection status
            autoIndex: false,        // Automatic index creation (disable in production) defalut true
            maxIdleTimeMS: 60000    // Close idle connections after 60s
        });

        // Get the connection instance
        const db = mongoose.connection;

        // Event listeners for connection status
        db.on("connected", () => {
            console.log("MongoDB successfully connected");
        });

        db.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            // Graceful shutdown on connection error
            process.exit(1); 
        });

        db.on("disconnected", () => {
            console.warn("MongoDB connection lost");
        });

        return connection;

    } catch (error) {
        console.error("Database connection failed:", error);
        // Exit with error code if initial connection fails
        process.exit(1);
    }
}