⚙️ 1. BCH_NETWORK
This defines the blockchain network mode for the system. During development and code testing, it is set to `chipnet`, allowing the entire system to be tested using free test coins. For a hackathon or a live demonstration, simply changing this value to `mainnet` activates the actual BCH network. This allows the entire application environment to switch from a test setting to the main network by modifying just a single term.

🔑 2. BCH_XPUB
This is the Master Public Key for your digital wallet (e.g., a key obtained from an Electron Cash wallet). The backend uses this to generate a unique, distinct BCH deposit address for every new payment request. This ensures that payments from different users never get mixed up. It allows for the secure creation of an unlimited number of payment addresses without ever exposing your wallet's private keys.

🌐 3. CHAIN_API_URL
This serves as a blockchain data reader or validator node for your backend application (e.g., the Blockchair API). When a user visits the payment page, scans the QR code, and sends BCH, your backend queries this server to verify the transaction. Only after confirming that the payment has been successfully recorded on the blockchain and that the correct amount has been received does the system signal to unlock Gemini AI.

💰 4. PRICE_API_URL
This functions as a provider for real-time cryptocurrency exchange rates (e.g., the CoinGecko API). For every AI prompt, the system automatically calculates the equivalent amount in BCH (Bitcoin Cash) based on the dollar-denominated cost (e.g., $0.001 USD) at current market rates. Even though the price of BCH fluctuates constantly, this API ensures that users can always make payments using the precise, equivalent amount of cryptocurrency.