import('./main.mjs')
  .then(module => {
    // ES module loaded
  })
  .catch(err => {
    console.error('Error loading main.mjs:', err);
  });
