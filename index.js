import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 8080;

express
  .get('*', (req, res) => res.render('dist/index.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))