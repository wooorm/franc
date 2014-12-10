require(['../../dist/franc.js'], function (franc) {
    if (franc() === 'und') {
      document.title = '(✓) Passed';
    }
});
