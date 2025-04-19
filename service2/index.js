const express = require('express');
const app = express();
const port = 3001;

app.get('/data', (req, res) => {
    console.error('Service 2: Luôn trả về lỗi');
    res.status(500).send('Lỗi từ Service 2');
  });

  
app.listen(port, () => {
  console.log(`Service 2 đang lắng nghe tại http://localhost:${port}`);
});

// http://localhost:3000/getDataFromService2