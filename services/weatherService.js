const fetch = require('node-fetch');

const API_KEY = '9ab2a85cf7af47cd36504729e28e212d'; // Sua chave da API OpenWeather
const API_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Busca as coordenadas (latitude e longitude) de uma cidade.
 * @param {string} cidade Nome da cidade
 * @returns {Promise<{lat: number, lon: number, humidity: number}>}
 */
async function buscarCoordenadas(cidade) {
    const url = `${API_URL}/weather?q=${cidade}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar coordenadas para ${cidade}`);
        
        const data = await response.json();
        return {
            lat: data.coord.lat,
            lon: data.coord.lon,
            humidity: data.main.humidity
        };
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/**
 * Busca a qualidade do ar com base na latitude e longitude.
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @returns {Promise<number>} Índice de qualidade do ar (AQI)
 */
async function buscarQualidadeDoAr(lat, lon) {
    const url = `${API_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar qualidade do ar');
        
        const data = await response.json();
        return data.list[0].main.aqi; // Retorna o índice de qualidade do ar
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

/**
 * Gera uma recomendação baseada no índice de qualidade do ar (AQI).
 * @param {number} aqi Índice de Qualidade do Ar
 * @returns {string} Mensagem de recomendação
 */
function gerarRecomendacao(aqi) {
    switch (aqi) {
        case 1: return 'A qualidade do ar está boa. Pode aproveitar ao ar livre!';
        case 2: return 'A qualidade do ar está moderada. Pessoas sensíveis devem evitar esforços físicos intensos.';
        case 3: return 'A qualidade do ar está ruim. Evite atividades ao ar livre por longos períodos.';
        case 4: return 'A qualidade do ar está muito ruim. Evite sair e mantenha as janelas fechadas.';
        case 5: return 'A qualidade do ar está perigosa. Saia apenas se for extremamente necessário.';
        default: return 'Não foi possível determinar a qualidade do ar.';
    }
}

module.exports = {
    buscarCoordenadas,
    buscarQualidadeDoAr,
    gerarRecomendacao
};
