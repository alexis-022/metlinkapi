export default async function handler(req, res) {
    const { url } = req.query;
    const API_KEY = 'dItDXPZfr0aeK9f8McupL3E4JiwkC8M3d1fj1ZZc';

    if (!url) return res.status(400).send("No URL provided");

    try {
        const response = await fetch(url, {
            headers: { 
                'x-api-key': API_KEY,
                'Accept': 'application/x-protobuf, application/json',
                'Accept-Encoding': 'identity' // Asks Metlink NOT to zip it, making it easier to proxy
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`Metlink error: ${response.status}`);
        }

        // --- BINARY HANDLING (Vehicle Positions) ---
        if (url.includes('vehiclepositions')) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // Set strict binary headers
            res.setHeader('Content-Type', 'application/x-protobuf');
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            
            // Use .end() instead of .send() to prevent Vercel from stringifying
            return res.status(200).end(buffer);
        }

        // --- JSON HANDLING (Routes/Stops) ---
        const data = await response.json();
        return res.status(200).json(data);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}