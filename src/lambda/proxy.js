import axios from "axios";

exports.handler = async (event, context) => {
    const { path, queryStringParameters } = event;
    const endpoint = path.replace("/proxy", "");

    try {
        const response = await axios.get(`https://api.genius.com${endpoint}`, {
            headers: {
                Authorization: `Bearer ${process.env.AUTH_TOKEN}`
            },
            params: queryStringParameters
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error("ERROR", error);
        return {
            statusCode: 500,
            body: error.message
        };
    }
};
