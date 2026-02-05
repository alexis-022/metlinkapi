export default async function handler(req, res) {
    const { url } = req.query;
    // Your API Key is safe here; it's never sent to the user's browser
    const API_KEY = 'dItDXPZfr0aeK9f8McupL3E4JiwkC8M3d1fj1ZZc';

    if (!url) return res.status(400).json({ error: "Missing URL" });

    try {
        const response = await fetch(url, {
            headers: { 'x-api-key': API_KEY }
        });

        // If it's the vehicle positions (Protobuf binary data)
        if (url.includes('vehiclepositions')) {
            const buffer = await response.arrayBuffer();
            res.setHeader('Content-Type', 'application/x-protobuf');
            return res.send(Buffer.from(buffer));
        }

        // For all other JSON data
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}