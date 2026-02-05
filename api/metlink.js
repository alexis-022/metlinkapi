export default async function handler(req, res) {
    const { url } = req.query;
    const API_KEY = 'dItDXPZfr0aeK9f8McupL3E4JiwkC8M3d1fj1ZZc';

    if (!url) return res.status(400).send("No URL provided");

    try {
        const response = await fetch(url, {
            headers: { 'x-api-key': API_KEY, 'Accept': 'application/x-protobuf' }
        });

        if (!response.ok) return res.status(response.status).send("Metlink Error");

        if (url.includes('vehiclepositions')) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // Convert to Base64 to prevent Vercel from messing with binary bytes
            const base64Data = buffer.toString('base64');
            
            res.setHeader('Content-Type', 'text/plain');
            return res.status(200).send(base64Data);
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}