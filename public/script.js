const Nossa_chave = '9ab2a85cf7af47cd36504729e28e212d';  // Essa é a nossa Chave da API key
const ApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const pollutionIndex = document.getElementById('pollution-index');
const humidity = document.getElementById('humidity');
const quality = document.getElementById('quality');

// A API do OpenWeather fornece dados de qualidade do ar a partir de coordenadas geográficas (latitude e longitude). No entanto, ao buscar informações apenas pelo nome da cidade, surgiu uma dificuldade, já que a API exige as coordenadas para fornecer os dados de qualidade do ar. Para resolver isso, foi desenvolvida uma função que, ao encontrar uma cidade, retorna suas coordenadas geográficas.

async function BuscarCoordenadas(cidade) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${Nossa_chave}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar coordenadas da cidade');
        const data = await response.json();
        const { coord, main } = data;
        return {
            lat: coord.lat,
            lon: coord.lon,
            humidity: main.humidity  
        };
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        alert('Cidade não encontrada. Verifique o nome.');
        return null;
    }
}

// Função para buscar a qualidade do ar com base nas coordenadas (lat, lon) que foram encontradas na função Buscar Coordenadas
async function BuscarQualidade(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${Nossa_chave}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        alert('Erro ao buscar dados de qualidade do ar.');
        return null; // Retorna null caso haja erro
    }

    const data = await response.json();
    return data;
}

// Função para atualizar os dados no HTML
function Atualizar(data) {
    if (!data || !data.list) return;

    const pollutionData = data.list[0];
    pollutionIndex.innerText = pollutionData.main.aqi;
    if (pollutionData.main.aqi <= 2) {
        quality.innerText = 'Sim, está boa!';
    } else {
        quality.innerText = 'Não, evite sair.';
    }
}

// Ao clicar no botão de pesquisa
searchBtn.addEventListener('click', async () => {
    const cidade = cityInput.value.trim();
    if (!cidade) {
        alert('Por favor, digite o nome de uma cidade.');
        return;
    }

    // Passo 1: Buscar coordenadas e umidade
    const coordData = await BuscarCoordenadas(cidade);
    if (!coordData) return;

    // Exibir umidade no HTML
    humidity.innerText = `${coordData.humidity} %`;  // Exibir a umidade

    // Passo 2: Buscar qualidade do ar usando lat e lon
    const data = await BuscarQualidade(coordData.lat, coordData.lon);
    if (data) Atualizar(data);
});
