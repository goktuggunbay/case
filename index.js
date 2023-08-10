const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/save', (req, res) => {
    const dataArray = req.body;
    const filePath = path.join(__dirname, 'public', 'js', 'orders.json');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        jsonData.orders.push(dataArray);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Veri dosyaya yazılırken bir hata oluştu:', err);
                res.status(500).send('Veri kaydedilirken bir hata oluştu.');
            } else {
                console.log('Veri başarıyla dosyaya yazıldı.');
                res.send('Veri başarıyla kaydedildi.');
                console.log(dataArray);
            }
        });
    } catch (err) {
        const jsonData = {
            orders: [dataArray]
        };

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Veri dosyaya yazılırken bir hata oluştu:', err);
                res.status(500).send('Veri kaydedilirken bir hata oluştu.');
            } else {
                console.log('Veri başarıyla dosyaya yazıldı.');
                res.send('Veri başarıyla kaydedildi.');
                console.log(dataArray);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
