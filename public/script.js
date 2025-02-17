const Nossa_chave = '9ab2a85cf7af47cd36504729e28e212d'; // Chave da API
const ApiUrl = 'https://api.openweathermap.org/data/2.5/weather'; //url do site

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

// Função para o funcionamento do PopUp
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("PopUpEmail");
    const closePopup = document.getElementById("closePopup");
    const submitEmail = document.getElementById("submitEmail");
    const emailInput = document.getElementById("emailInput");
    const searchBtn = document.getElementById("search-btn");
    const citySearch = document.getElementById("city-search");

    // Lista de e-mails já cadastrados (simulação)
    let emailsCadastrados = [];

    // Função para fechar o pop-up
    function closePopupFunction() {
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
        emailInput.value = ''; // Limpa o campo de e-mail ao fechar
    }

    // Função para abrir o pop-up
    function openPopupFunction() {
        popup.style.visibility = 'visible';
        popup.style.opacity = '1';
    }

    // Fechar o pop-up ao clicar no botão "Fechar"
    closePopup.addEventListener("click", () => {
        closePopupFunction();
    });

    // Fechar o pop-up ao clicar no botão "Inscrever-se" (após validação)
    submitEmail.addEventListener("click", (e) => {
        e.preventDefault(); // Evita o envio do formulário

        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            alert("Por favor, insira um e-mail.");
            return;
        }

        if (!emailPattern.test(email)) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }

        // Verifica se o e-mail já está cadastrado
        if (emailsCadastrados.includes(email)) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        // Adiciona o e-mail à lista de cadastrados (simulação)
        emailsCadastrados.push(email);
        console.log("E-mails cadastrados:", emailsCadastrados); // Para depuração

        alert("Obrigado por se inscrever!");
        closePopupFunction();
    });

    // Função de pesquisa
    searchBtn.addEventListener("click", () => {
        const city = citySearch.value.trim();

        if (city) {
            console.log(`Pesquisando por: ${city}`);
            openPopupFunction(); // Abre o pop-up após a pesquisa
        } else {
            alert("Por favor, digite o nome da cidade.");
        }
    });
});


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
