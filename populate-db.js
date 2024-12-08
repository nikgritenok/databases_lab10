const mongoose = require('mongoose');
const Article = require('./models/article');

mongoose.connect('mongodb://localhost:27017/scientific-journal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleArticles = [
    {
        title: "Квантовая запутанность в многочастичных системах",
        authors: ["Иванов А.П.", "Петров С.В."],
        content: "Исследование квантовой запутанности в многочастичных системах показывает...",
        tags: ["квантовая физика", "запутанность", "квантовая механика"],
        reviews: [
            {
                name: "Михаил",
                message: "Отличная статья, очень информативно!",
                rating: 9
            }
        ]
    },
    {
        title: "Новые методы машинного обучения",
        authors: ["Сидорова Е.А."],
        content: "В данной статье рассматриваются современные подходы к машинному обучению...",
        tags: ["машинное обучение", "искусственный интеллект", "нейронные сети"],
        reviews: [
            {
                name: "Анна",
                message: "Интересный подход к проблеме",
                rating: 8
            }
        ]
    },
    {
        title: "Исследование климатических изменений",
        authors: ["Петров С.В.", "Климов Д.И."],
        content: "Анализ данных показывает значительные изменения в климатической системе...",
        tags: ["климат", "экология", "глобальное потепление"],
        reviews: []
    },
    {
        title: "Развитие квантовых вычислений",
        authors: ["Иванов А.П."],
        content: "Прогресс в области квантовых вычислений открывает новые возможности...",
        tags: ["квантовые вычисления", "квантовые компьютеры"],
        reviews: []
    },
    {
        title: "Биоинформатика в медицине",
        authors: ["Сидорова Е.А.", "Климов Д.И."],
        content: "Применение методов биоинформатики в медицинских исследованиях...",
        tags: ["биоинформатика", "медицина", "генетика"],
        reviews: [
            {
                name: "Павел",
                message: "Очень полезная информация",
                rating: 10
            }
        ]
    }
];

async function populateDb() {
    try {
        // Очистка коллекции перед добавлением новых данных
        await Article.deleteMany({});
        
        // Добавление новых статей
        await Article.insertMany(sampleArticles);
        
        console.log('База данных успешно заполнена');
        mongoose.connection.close();
    } catch (error) {
        console.error('Ошибка при заполнении базы данных:', error);
        mongoose.connection.close();
    }
}

populateDb();
