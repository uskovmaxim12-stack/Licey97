const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// API для получения данных
app.get('/api/news', (req, res) => {
  try {
    const newsData = JSON.parse(fs.readFileSync('./data/news.json', 'utf8'));
    res.json(newsData);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки новостей' });
  }
});

app.get('/api/documents', (req, res) => {
  try {
    const docsData = JSON.parse(fs.readFileSync('./data/docs.json', 'utf8'));
    res.json(docsData);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки документов' });
  }
});

app.get('/api/schedule', (req, res) => {
  try {
    const scheduleData = JSON.parse(fs.readFileSync('./data/schedule.json', 'utf8'));
    res.json(scheduleData);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка загрузки расписания' });
  }
});

// API для администратора (имитация CMS)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Здесь должна быть реальная проверка из БД
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ error: 'Неверные учетные данные' });
  }
});

app.post('/api/news', upload.none(), (req, res) => {
  const newNews = req.body;
  try {
    const newsData = JSON.parse(fs.readFileSync('./data/news.json', 'utf8'));
    newNews.id = Date.now();
    newNews.date = new Date().toLocaleDateString('ru-RU');
    newsData.unshift(newNews);
    fs.writeFileSync('./data/news.json', JSON.stringify(newsData, null, 2));
    res.json({ success: true, news: newNews });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сохранения новости' });
  }
});

// Загрузка файлов документов
app.post('/api/upload', upload.single('document'), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    originalname: req.file.originalname,
    path: `/uploads/${req.file.filename}`
  });
});

// Статические файлы
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Сайт доступен по адресу: http://localhost:${PORT}`);
});
