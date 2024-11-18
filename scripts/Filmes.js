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

// Função para buscar trailer de um filme
const fetchTrailer = async (movieId) => {
    try {
        const trailerResponse = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
            params: {
                api_key: API_KEY,
                language: LANGUAGE
            }
        });

        const trailer = trailerResponse.data.results.find(video => video.type === 'Trailer');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
        console.error('Erro ao buscar trailer:', error);
    }
};

// Função para converter a avaliação para 5 estrelas
const convertRatingToStars = (rating) => {
    // Converte a avaliação de 0 a 10 para uma escala de 0 a 5 estrelas
    return Math.round(rating / 2);  // Avaliação de 0-10 para 0-5
};

// Função para exibir filmes na estrutura HTML
const displayMovies = (movies) => {
    const container = document.getElementById('movie-container');
    container.innerHTML = ''; // Limpar o conteúdo atual

    // Adicionar filmes
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

        const movieHTML = `
            <div class="w-[100%] h-18 flex flex-col justify-center items-center cursor-pointer" onclick="openModal('${movie.id}', '${movie.title}')">
                <img class="w-full h-full rounded-md" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <div class="flex items-center justify-between w-[97%]">
                   <span class="text-white text-base my-2 font-bold">${movie.title}</span>
                    <div class="flex">${starsHTML}</div>
                </div>
            </div>
        `;
        container.innerHTML += movieHTML;
    });
};

// Função para abrir o modal com o trailer
const openModal = async (movieId, nameFilme) => {
    const trailerURL = await fetchTrailer(movieId);
    
    

    if (trailerURL) {
        const iframe = document.getElementById('trailer-iframe');
        iframe.src = trailerURL;
        
        const body = document.body;
        body.classList.add('overflow-hidden');

        // Atualizar o título do filme no modal
        const title = document.getElementById('trailer-title');
        title.innerText = nameFilme;
        
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden');  // Remover a classe 'hidden' para mostrar o modal
        modal.classList.add('flex'); // Adicionar a classe 'flex' para tornar o modal visível
    } else {
        alert('Trailer não encontrado.');
    }
};

// Função para fechar o modal
const closeModal = () => {
    const body = document.body;
    body.classList.remove('overflow-hidden');

    const modal = document.getElementById('modal');
    modal.classList.remove('flex');  // Remover a classe 'flex' para esconder o modal
    modal.classList.add('hidden');  // Adicionar a classe 'hidden' para esconder o modal

    const iframe = document.getElementById('trailer-iframe');
    iframe.src = ''; // Limpar o vídeo
};

// Chamar a função para carregar os filmes
fetchMovies();
