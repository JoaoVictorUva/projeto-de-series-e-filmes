const API_KEY = 'b69828e9c9bbee654768979d71ae781f';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

// Função para buscar séries
const fetchSeries = async () => {
    try {
        // Buscar séries bem avaliadas na página 1
        const seriesResponsePage1 = await axios.get(`${BASE_URL}/tv/top_rated`, {
            params: {
                api_key: API_KEY,
                language: LANGUAGE,  // Português (Brasil)
                page: 1,
                region: 'BR',        // Região Brasil
                with_original_language: 'pt',  // Filtrando para séries em português
                'vote_average.gte': 8.5,  // Apenas séries com média de voto 8.5 ou maior
            }
        });

        // Buscar séries bem avaliadas na página 2
        const seriesResponsePage2 = await axios.get(`${BASE_URL}/tv/top_rated`, {
            params: {
                api_key: API_KEY,
                language: LANGUAGE,  // Português (Brasil)
                page: 2,
                region: 'BR',        // Região Brasil
                with_original_language: 'pt',  // Filtrando para séries em português
                'vote_average.gte': 8.5,  // Apenas séries com média de voto 8.5 ou maior
            }
        });

        // Combina séries das duas páginas
        const series = [
            ...seriesResponsePage1.data.results,
            ...seriesResponsePage2.data.results.slice(0, 20)  // Pega 20 séries da segunda página
        ];

        // Exibir séries no HTML
        displaySeries(series);
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
    }
};

// Função para converter a avaliação para estrelas (de 1 a 5) com meia estrela
const convertRatingToStars = (rating) => {
    const starRating = rating / 2; // Converte de 0-10 para 0-5 estrelas
    return starRating;
};

// Função para exibir séries na estrutura HTML
const displaySeries = (series) => {
    const container = document.getElementById('series-container');
    container.innerHTML = ''; // Limpar o conteúdo atual

    // Adicionar séries
    series.forEach(tvShow => {
        // Converte a avaliação para 5 estrelas
        const starRating = convertRatingToStars(tvShow.vote_average);
        
        // Gerar as estrelas (representação de 5 estrelas)
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < starRating) {
                starsHTML += `<span class="text-yellow-500">★</span>`; // Estrela preenchida
            } else {
                starsHTML += `<span class="text-gray-400">★</span>`; // Estrela vazia
            }
        }

        const tvShowHTML = `
            <div class="w-[100%] h-18 flex flex-col justify-center items-center" >
                <img class="w-full h-full rounded-md cursor-pointer" src="https://image.tmdb.org/t/p/w500${tvShow.poster_path}" alt="${tvShow.name}" onclick="openModal('${tvShow.id}', '${tvShow.name}')">
                <div class="flex items-center justify-between w-[97%]">
                    <span class="text-white text-base my-2 font-bold">${tvShow.name}</span>
                    <div class="flex">${starsHTML}</div>
                </div>
            </div>
        `;
        container.innerHTML += tvShowHTML;
    });
};

// Função para buscar trailer de uma série
const fetchTrailer = async (tvShowId) => {
    try {
        const trailerResponse = await axios.get(`${BASE_URL}/tv/${tvShowId}/videos`, {
            params: {
                api_key: API_KEY,
                language: LANGUAGE
            }
        });

        const trailer = trailerResponse.data.results.find(video => video.type === 'Trailer');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
        console.error('Erro ao buscar trailer da série:', error);
    }
};

// Função para abrir o modal com o trailer
const openModal = async (tvShowId, nameSerie) => {
    const trailerURL = await fetchTrailer(tvShowId);
    

    if (trailerURL) {
        const body = document.body;
        body.classList.add('overflow-hidden');

        const title = document.getElementById('trailer-title');
        title.innerText = ': ' + nameSerie;
        
        const modal = document.getElementById('modal');
        modal.classList.add('flex'); 
        modal.classList.remove('hidden');
        
        const iframe = document.getElementById('trailer-iframe');
        iframe.src = trailerURL;
    } else {
        alert('Trailer não encontrado.');
    }
};

// Função para fechar o modal
const closeModal = () => {
    const body = document.body;
    body.classList.remove('overflow-hidden');

    const modal = document.getElementById('modal');
    modal.classList.remove('flex'); 
    modal.classList.add('hidden');

    const iframe = document.getElementById('trailer-iframe');
    iframe.src = ''; // Limpar o vídeo
};

// Chamar a função para carregar as séries
fetchSeries();
