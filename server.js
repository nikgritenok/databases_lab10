const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Article = require('./models/article');

const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/scientific-journal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Настройка middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Маршруты
app.get('/', (req, res) => {
    res.render('index');
});

// API для получения всех статей
app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find({}, 'title authors publicationDate');
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API для поиска по названию
app.get('/api/articles/search', async (req, res) => {
    try {
        const searchQuery = req.query.title;
        const articles = await Article.find(
            { title: { $regex: searchQuery, $options: 'i' } },
            'title authors publicationDate'
        );
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API для поиска по автору
app.get('/api/articles/author/:author', async (req, res) => {
    try {
        const articles = await Article.find(
            { authors: req.params.author },
            'title authors publicationDate'
        );
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API для получения списка всех авторов
app.get('/api/authors', async (req, res) => {
    try {
        const authors = await Article.distinct('authors');
        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Новый маршрут для отдельной статьи
app.get('/article/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Статья не найдена');
        }
        res.render('article', { article });
    } catch (err) {
        res.status(500).send('Ошибка сервера');
    }
});

// API для удаления статьи
app.delete('/api/articles/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API для создания новой статьи
app.post('/api/articles', async (req, res) => {
    try {
        const article = new Article(req.body);
        await article.save();
        res.json(article);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API для получения топ статей
app.get('/api/articles/top', async (req, res) => {
    try {
        const articles = await Article.aggregate([
            {
                $addFields: {
                    averageRating: {
                        $avg: "$reviews.rating"
                    },
                    reviewCount: {
                        $size: "$reviews"
                    }
                }
            },
            {
                $sort: {
                    averageRating: -1,
                    reviewCount: -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    title: 1,
                    authors: 1,
                    publicationDate: 1,
                    reviewCount: 1,
                    averageRating: 1
                }
            }
        ]);
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API для поиска по диапазону дат
app.get('/api/articles/date-range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const articles = await Article.find({
            publicationDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }, 'title authors publicationDate');
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
