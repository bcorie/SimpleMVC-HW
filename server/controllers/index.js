// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const { Cat, Dog } = models;

const hostIndex = async (req, res) => {
  let name = 'unknown';
  try {
    const doc = await Cat.findOne({}, {}, {
      sort: { createdDate: 'descending' },
    }).lean().exec();
    if (doc) {
      name = doc.name;
    }
  } catch (err) {
    console.log(err);
  }

  res.render('index', {
    currentName: name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const hostPage1 = async (req, res) => {
  try {
    // find {name: "name critera"}
    const docs = await Cat.find({}).lean().exec();
    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = async (req, res) => {
  try {
    // find {name: "name critera"}
    const docs = await Dog.find({}).lean().exec();
    return res.render('page4', { dogs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find dogs' });
  }
};

const getName = async (req, res) => {
  try {
    const doc = await Dog.findOne({})
      .sort({ createdDate: 'descending' }).lean().exec();
    if (!doc) {
      return res.status(404).json({ error: 'No dog found' });
    }
    return res.json({ name: doc.name });
  } catch (err) {
    console.log(err);
    return res.status(500).json(
      { error: 'Something went wrong contacting the database' },
    );
  }
};

const setName = async (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({
      error: 'name, breed, and age are all required',
    });
  }

  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);
  console.log(newDog);

  try {
    // waits at await until action is complete
    // must be in an async function
    await newDog.save();
    return res.status(201).json({
      name: newDog.name,
      breed: newDog.breed,
      age: newDog.age,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create dog' });
  }
};

const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }
  try {
    const doc = await Dog.findOne({ name: req.query.name }).select('name breed age').exec();
    // doc is null if nothing found, so create edge case for null value
    if (!doc) {
      return res.status(404).json({ error: 'No dog found' });
    }
    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const updateLast = (req, res) => {
  const updatePromise = Dog.findOneAndUpdate({}, { $inc: { age: 1 } }, {
    returnDocument: 'after',
    sort: {
      createdDate: 'descending',
    },
  }).lean().exec();
  updatePromise.then((doc) => res.json({
    name: doc.name,
    breed: doc.breed,
    age: doc.age,
  }));
  updatePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
};
