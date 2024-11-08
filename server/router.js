const controllersC = require('./controllers/indexCat.js');
const controllersD = require('./controllers/index.js');

const router = (app) => {
  app.get('/page1', controllersC.page1);
  app.get('/page2', controllersC.page2);
  app.get('/page3', controllersD.page3);
  app.get('/getName', controllersC.getName);
  app.get('/getDogName', controllersD.getDogName);
  app.get('/findByName', controllersC.searchName);
  app.get('/findByDogName', controllersD.searchDogName);

  app.get('/', controllersC.index);

  app.get('/*', controllersC.notFound);

  app.post('/setName', controllersC.setName);
  app.post('/setDogName', controllersD.setDogName);

  app.post('/updateLast', controllersC.updateLast);
  app.post('/updateLastDog', controllersD.updateLastDog);
};

// export the router function
module.exports = router;
