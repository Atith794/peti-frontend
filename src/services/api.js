import axios from 'axios';

const api = axios.create({
//   baseURL: 'http://localhost:5000/api'
baseURL:'http://192.168.1.100:5000/api' //Jiofy Hotspot
// baseURL:'http://192.168.110.35:5000/api' //Samsung Galaxy
// baseURL:'http://192.168.93.35:5000/api' // Oneplus Nord
});

export default api;