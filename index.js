const PocketBase = require('pocketbase/cjs')
require('cross-fetch/polyfill')
const axios = require('axios')

const client = new PocketBase('https://pb.xoma-star.tk');



async function main(){
    for(let i = 0; i < 1000000; i++){
        try{
            const movie = (await axios.get(`https://api.themoviedb.org/3/movie/${i}`, {params: {api_key: 'c8ae8a04674ddb8d64d4cb06205be86d', language: 'ru-RU'}})).data
            if(movie){
                movie.screens = (await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/images?include_image_language=en,null`, {params: {api_key: 'c8ae8a04674ddb8d64d4cb06205be86d'}})).data.backdrops
                if(movie.screens.length < 1) continue
                const toPaste = {
                    imdb_id: movie.imdb_id,
                    tmdb_id: movie.id,
                    genres: movie.genres.map(x => x.name),
                    overview: movie.overview,
                    release_date: movie.release_date,
                    screens: movie.screens.map(x => `https://image.tmdb.org/t/p/original${x.file_path}`),
                    title: movie.title,
                    companies: movie.production_companies.map(x => x.name),
                    countries: movie.production_countries.map(x => x.name),
                    rating: movie.vote_average,
                    budget: movie.budget,
                    popularity: movie.popularity,
                    runtime: movie.runtime
                }
                // console.log(toPaste)
                await client.records.create('movies', toPaste)
                console.log(`pasted ${movie.title} into Pocket`)
            }
        }catch (e) {}
    }
}

main()