const fetch = require('node-fetch');

const API_KEY = '9ab2a85cf7af47cd36504729e28e212d'; // Sua chave da API OpenWeather
const API_URL = 'https://api.openweathermap.org/data/2.5';

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

// teste