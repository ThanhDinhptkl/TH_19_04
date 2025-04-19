// // const express = require('express');
// // const CircuitBreaker = require('./circuitBreaker'); 
// // const app = express();
// // const port = 3000;
// // const service2Url = 'http://localhost:3001/data';

// // const circuitBreaker = new CircuitBreaker({ failureThreshold: 5, recoveryTimeout: 3000 });

// // app.get('/getDataFromService2', async (req, res) => {
// //   try {
// //     const data = await circuitBreaker.callService(service2Url);
// //     res.json(data);
// //   } catch (error) {
// //     console.error(`Lỗi từ Circuit Breaker: ${error.message}`);
// //     res.status(503).send({ error: error.message });
// //   }
// // });

// // app.listen(port, () => {
// //   console.log(`Service 1 đang lắng nghe tại http://localhost:${port}`);
// // });

// const express = require('express');
// const CircuitBreaker = require('./circuitBreaker');
// const app = express();
// const port = 3000;
// const service2Url = 'http://localhost:3001/data';

// const requestTimestamps = [];
// const RATE_LIMIT = 3; 
// const TIME_WINDOW = 20;

// const circuitBreaker = new CircuitBreaker({ failureThreshold: 5, recoveryTimeout: 3000 });

// app.get('/getDataFromService2', async (req, res) => {
//   try {
//     const now = Date.now();
//     while (requestTimestamps.length > 0 && now - requestTimestamps[0] > TIME_WINDOW) {
//       requestTimestamps.shift();
//     }

//     if (requestTimestamps.length >= RATE_LIMIT) {
//       console.error('Quá giới hạn 3 yêu cầu/giây');
//       return res.status(429).send({ error: 'Quá giới hạn 3 yêu cầu/giây' });
//     }

//     requestTimestamps.push(now);
//     console.log('Yêu cầu được phép (dưới giới hạn 5 rpm)');

//     const data = await circuitBreaker.callService(service2Url);
//     res.json(data);
//   } catch (error) {
//     console.error(`Lỗi từ Circuit Breaker: ${error.message}`);
//     res.status(503).send({ error: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Service 1 đang lắng nghe tại http://localhost:${port}`);
// });

const express = require('express');
const CircuitBreaker = require('./circuitBreaker');
const app = express();
const port = 3000;
const service2Url = 'http://localhost:3001/data';

const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  recoveryTimeout: 3000,
  timeout: 1000 // Timeout 
});

app.get('/getDataFromService2', async (req, res) => {
  try {
    const data = await circuitBreaker.callService(service2Url);
    res.json(data);
  } catch (error) {
    console.error(`Lỗi từ Circuit Breaker: ${error.message}`);
    res.status(503).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Service 1 đang lắng nghe tại http://localhost:${port}`);
});