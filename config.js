const tmdbApiKey = process.env.TMDBAPIKEY || '473523253ce1a6744f253c14043dec4f';
const omdbApiKey = process.env.OMDBAPIKEY || '8b0b451';

const dbUrl = process.env.DBURL || 'mongodb://localhost:27017/moviesapp';
// const dbUrl = 'mongodb+srv://shivam:shivam@cluster0-bfppm.mongodb.net/moviesapp?retryWrites=true&w=majority';

module.exports = {
	tmdbApiKey: tmdbApiKey,
	omdbApiKey: omdbApiKey,
	dbUrl: dbUrl
};
