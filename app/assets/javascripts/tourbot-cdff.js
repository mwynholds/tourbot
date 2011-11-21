//= require_self
//= require tourbot

var _tourconfig = {
  source: 'cdff',
  pages:
          [
            {
              path: '/',
              steps:
                      [
                        { name: '1', inbound: 'td.header_bg_image a', offset: { x: -20, y: -7 }, type: 'clickable', message: 'Click Me!!' }
                      ]
            },
            {
              path: '/registration.php',
              steps:
                      [
                        { name: '2', inbound: '#username', outbound: '#terms', type: 'text', message: 'Fill out this form' },
                        { name: '3', inbound: 'td.iam input:image', type: 'clickable', message: 'Click here and you\'re done!' }
                      ]
            }

          ]
};
