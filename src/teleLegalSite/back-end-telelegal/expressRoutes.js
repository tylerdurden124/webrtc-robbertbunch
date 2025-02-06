//all our express stuff happens (routes)
const app = require("./server").app;

app.get('/', (req, res)=> {
  res.json('this is the default route');
})

app.get('/test', (req, res)=>{
  res.json('this is a test route');
})