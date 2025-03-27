import axios from 'axios';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1/flights';

export const getFlights = async (req, res) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: { access_key: API_KEY }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching flights', error });
    }
};

