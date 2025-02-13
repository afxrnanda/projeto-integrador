const Nossa_chave = '9ab2a85cf7af47cd36504729e28e212d'; // Chave da API
const ApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const pollutionIndex = document.getElementById('pollution-index');
const humidity = document.getElementById('humidity');
const quality = document.getElementById('quality');

// Função para buscar coordenadas da cidade
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

// Função para buscar a qualidade do ar
async function BuscarQualidade(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${Nossa_chave}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar dados de qualidade do ar.');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar qualidade do ar:', error);
        alert('Erro ao buscar dados de qualidade do ar.');
        return null;
    }
}

// Função para o PopUp
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("emailPopup");
    const closePopup = document.getElementById("closePopup");
    const submitEmail = document.getElementById("submitEmail");
    const emailInput = document.getElementById("emailInput");

    // Função para fechar o pop-up
    function closePopupFunction() {
        popup.classList.add("hidden"); // Adiciona a classe "hidden" para esconder o pop-up
    }

    // Fechar o pop-up ao clicar no botão "Fechar"
    closePopup.addEventListener("click", closePopupFunction);

    // Fechar o pop-up ao clicar no botão "Inscrever-se" (após validação)
    submitEmail.addEventListener("click", () => {
        const email = emailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(email)) {
            alert("Obrigado por se inscrever!");
            closePopupFunction(); // Fecha o pop-up
        } else {
            alert("Por favor, insira um e-mail válido.");
        }
    });
});

// Função para gerar recomendações baseadas no índice de qualidade do ar
function GerarRecomendacao(aqi) {
    let recomendacao = '';
    switch (aqi) {
        case 1:
            recomendacao = 'A qualidade do ar está boa. Você pode realizar atividades ao ar livre sem preocupações.';
            break;
        case 2:
            recomendacao = 'A qualidade do ar está moderada. Pessoas sensíveis devem limitar atividades físicas ao ar livre.';
            break;
        case 3:
            recomendacao = 'A qualidade do ar está ruim. Reduza atividades ao ar livre, especialmente pessoas com problemas respiratórios.';
            break;
        case 4:
            recomendacao = 'A qualidade do ar está muito ruim. Evite sair e mantenha janelas fechadas.';
            break;
        case 5:
            recomendacao = 'A qualidade do ar está perigosa. Fique em ambientes fechados e use máscara ao sair.';
            break;
        default:
            recomendacao = 'Não foi possível determinar a qualidade do ar.';
    }
    return recomendacao;
}

// Atualizar os dados no HTML
function Atualizar(data) {
    if (!data || !data.list) return;

    const pollutionData = data.list[0];
    const aqi = pollutionData.main.aqi;

    pollutionIndex.innerText = aqi;
    quality.innerText = GerarRecomendacao(aqi);
}

// Evento ao clicar no botão de pesquisa
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
    humidity.innerText = `${coordData.humidity} %`;

    // Passo 2: Buscar qualidade do ar usando lat e lon
    const data = await BuscarQualidade(coordData.lat, coordData.lon);
    if (data) Atualizar(data);
});
