const API_KEY = 'b69828e9c9bbee654768979d71ae781f';
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

// Função para buscar filmes populares
const fetchMovies = async () => {
    try {
        const moviesResponsePage1 = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: LANGUAGE,
                page: 1,
            }
        });

        const moviesResponsePage2 = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: LANGUAGE,
                page: 2,
            }
        });

        const movies = [
            ...moviesResponsePage1.data.results,
            ...moviesResponsePage2.data.results.slice(0, 4)  // Pega 5 filmes da segunda página
        ];

        displayMovies(movies);
    } catch (error) {
        console.error('Erro ao buscar filmes:', error);
    }
};

// Função para buscar séries bem avaliadas e populares
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
            ...seriesResponsePage2.data.results.slice(0, 4)  // Pega 5 séries da segunda página
        ];

        displaySeries(series);
    } catch (error) {
        console.error('Erro ao buscar séries:', error);
    }
};

// Função para converter a avaliação para estrelas (de 1 a 5) com meia estrela
const convertRatingToStars = (rating) => {
    // A avaliação vai de 0 a 10, então precisamos converter para 5 estrelas
    const starRating = rating / 2; // Converte de 0-10 para 0-5 estrelas
    return starRating;
};

// Função para exibir filmes no HTML
const displayMovies = (movies) => {
    const container = document.getElementById('movie-container');
    container.innerHTML = ''; // Limpar o conteúdo atual

    movies.forEach(movie => {
        // Converte a avaliação para 5 estrelas
        const starRating = convertRatingToStars(movie.vote_average);
        
        // Gerar as estrelas (representação de 5 estrelas)
        let starsHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < starRating) {
                starsHTML += `<span class="text-yellow-500">★</span>`; // Estrela preenchida
            } else {
                starsHTML += `<span class="text-gray-400">★</span>`; // Estrela vazia
            }
        }
        // Gerar as estrelas (representação de 5 estrelas)

        const movieHTML = `
            <div class="w-[100%] h-18 flex flex-col justify-center items-center">
                <img class="w-full h-full rounded-md" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="flex items-center justify-between w-[97%]">
                    <span class="text-white text-xs my-2 font-bold">${movie.title}</span>
                    <div class="flex">${starsHTML}</div>
                </div>
            </div>
        `;
        container.innerHTML += movieHTML;
    });
};

// Função para exibir séries no HTML
const displaySeries = (series) => {
    const container = document.getElementById('series-container');
    container.innerHTML = ''; // Limpar o conteúdo atual

    series.forEach(show => {
        
         // Converte a avaliação para 5 estrelas
         const starRating = convertRatingToStars(show.vote_average);
        
         // Gerar as estrelas (representação de 5 estrelas)
         let starsHTML = '';
         for (let i = 0; i < 5; i++) {
             if (i < starRating) {
                 starsHTML += `<span class="text-yellow-500">★</span>`; // Estrela preenchida
             } else {
                 starsHTML += `<span class="text-gray-400">★</span>`; // Estrela vazia
             }
         }

        const seriesHTML = `
            <div class="w-[100%] h-18 flex flex-col justify-center items-center">
                <img class="w-full h-full rounded-md" src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
                <div class="flex items-center justify-between w-[97%]">
                    <span class="text-white text-xs my-2 font-bold">${show.name}</span>
                    <div class="flex">${starsHTML}</div>
                </div>
            </div>
        `;
        container.innerHTML += seriesHTML;
    });
};

// Chamar as funções para carregar filmes e séries
fetchMovies();
fetchSeries();
