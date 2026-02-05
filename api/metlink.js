export default async function handler(req, res) {
    const { url } = req.query;
    const API_KEY = 'dItDXPZfr0aeK9f8McupL3E4JiwkC8M3d1fj1ZZc';

    if (!url) {
        return res.status(400).send("No URL provided");
    }

    try {
        const response = await fetch(url, {
            headers: { 
                'x-api-key': API_KEY,
                'Accept': 'application/json, application/x-protobuf'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`Metlink API error: ${response.status}`);
        }

        // IMPORTANT: Handle Binary Data for Vehicle Positions
        if (url.includes('vehiclepositions')) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            res.setHeader('Content-Type', 'application/x-protobuf');
            res.setHeader('Cache-Control', 'no-store, max-age=0');
            return res.send(buffer);
        }

        // Handle JSON data for Routes, Stops, and Predictions
        const data = await response.json();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(data);

    } catch (e) {
        console.error("Proxy Error:", e.message);
        return res.status(500).json({ error: e.message });
    }
}