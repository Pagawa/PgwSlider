Package.describe({
  name: 'pagawa:pgwslider',
  version: '2.3.1',
  summary: 'Responsive and lightweight Slider plugin for jQuery / Zepto',
  git: 'https://github.com/rgnevashev/PgwSlider.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['jquery@1.11.4']);
  api.addFiles([
    "pgwslider.css",
    "pgwslider.js"
  ], 'client');
});
