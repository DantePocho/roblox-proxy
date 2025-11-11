const fetch = require('node-fetch');
const USER_API = 'https://users.roblox.com/v1/users/';

module.exports = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const apiResponse = await fetch(`${USER_API}${id}`);
        if (!apiResponse.ok) {
            throw new Error(`Roblox API responded with ${apiResponse.status}`);
        }
        const data = await apiResponse.json();
        
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        
        res.status(200).json({
            userId: data.id,
            followersCount: data.followersCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error or invalid user' });
    }
};
