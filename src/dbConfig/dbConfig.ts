import mongoose from "mongoose";

export async function connect() {
    try {
        // Check if there's already an active connection
        if (mongoose.connection.readyState === 1) {
            console.log("Using existing database connection");
            return mongoose.connection;
        }

        // Establish new connection with optimized settings for static generation
        const connection = await mongoose.connect(process.env.MONGODB_URI!, {
            // Connection Pool Settings - optimized for static generation
            maxPoolSize: 20,       // Increased for static generation
            minPoolSize: 5,        // Increased minimum connections
            waitQueueTimeoutMS: 10000, // Increased wait time for static generation
            maxIdleTimeMS: 300000, // 5 minutes - longer idle time
            
            // Timeout Settings - more lenient for static generation
            serverSelectionTimeoutMS: 10000,  // Increased timeout
            connectTimeoutMS: 60000,         // Increased connection timeout
            socketTimeoutMS: 90000,          // Increased socket timeout
            
            // Buffering Settings
            bufferCommands: true,  // Enable command buffering
            bufferMaxEntries: 0,   // Disable buffer limit
            
            // Replication/Sharding Settings
            retryWrites: true,      // Auto-retry write operations
            retryReads: true,       // Auto-retry read operations
            
            // Other Optimizations
            heartbeatFrequencyMS: 30000, // Less frequent heartbeats
            autoIndex: false,        // Disable automatic index creation
        });

        // Get the connection instance
        const db = mongoose.connection;

        // Event listeners for connection status
        db.on("connected", () => {
            console.log("MongoDB successfully connected");
        });

        db.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            // Don't exit on connection error during static generation
            if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
                console.warn("Connection error during static generation, continuing...");
            } else {
                process.exit(1);
            }
        });

        db.on("disconnected", () => {
            console.warn("MongoDB connection lost");
        });

        return connection;

    } catch (error) {
        console.error("Database connection failed:", error);
        // Don't exit on connection failure during static generation
        if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
            console.warn("Database connection failed during static generation, continuing...");
            return null;
        } else {
            process.exit(1);
        }
    }
}