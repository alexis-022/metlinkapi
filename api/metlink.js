export default async function handler(req, res) {
    const { url } = req.query;
    // Note: I'm putting the key here so the browser never sees it
    const API_KEY = 'dItDXPZfr0aeK9f8McupL3E4JiwkC8M3d1fj1ZZc';

    if (!url) return res.status(400).send("No URL provided");

    try {
        const response = await fetch(url, {
            headers: { 
                'x-api-key': API_KEY,
                'Accept': 'application/json, application/x-protobuf'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send(`Metlink API responded with ${response.status}`);
        }

        // Handle the binary Protobuf data for vehicle positions
        if (url.includes('vehiclepositions')) {
            const buffer = await response.arrayBuffer();
            res.setHeader('Content-Type', 'application/x-protobuf');
            // We convert to Buffer for Vercel's response handling
            return res.send(Buffer.from(buffer));
        }

        // Handle standard JSON for routes/stops
        const data = await response.json();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
