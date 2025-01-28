import { Anon, AnonSocksClient} from "@anyone-protocol/anyone-client";
import 'dotenv/config';

let anonSocksClient: AnonSocksClient | null = null;
let anon: Anon | null = null;

async function initializeAnon() {
    try {
        anon = new Anon({ displayLog: false, socksPort: 9050, controlPort: 9051});
        await anon.start();
        anonSocksClient = new AnonSocksClient(anon);
        return true;
    } catch (error) {
        console.error('Error initializing Anon:', error);
        return false;
    }
}

export async function getAnonSocksClient(): Promise<AnonSocksClient> {
    if (!anonSocksClient) {
        const initialized = await initializeAnon();
        if (!initialized || !anonSocksClient) {
            throw new Error('Failed to initialize Anon client');
        }
    }
    return anonSocksClient;
}


// Add shutdown handler for graceful cleanup
process.on('SIGINT', async () => {
    console.log('\nGracefully shutting down Anon...');
    try {
        await anon?.stop();
        console.log('Anon stopped successfully');
    } catch (error) {
        console.error('Error stopping Anon:', error);
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nGracefully shutting down Anon...');
    if (anonSocksClient) {
        try {
            await anon?.stop();
            console.log('Anon stopped successfully');
        } catch (error) {
            console.error('Error stopping Anon:', error);
        }
    }
    process.exit(0);
});

// Initialize Anon when the module is imported
initializeAnon().catch(error => {
    console.error('Failed to initialize Anon:', error);
});