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
                        { name: '1', inbound: 'td.header_bg_image a', offset: { x: -20, y: -7 }, message: 'Click Me!!' }
                      ]
            },
            {
              path: '/registration.php',
              steps:
                      [
                        { name: '2', inbound: '#username', message: 'Enter the username you would like' },
                        { name: '3', inbound: '#password', message: 'And now your password' },
                        { name: '4', inbound: '#re_password', outbound: '#terms', message: 'And now everything else...' },
                        { name: '5', inbound: 'td.iam input:image', message: 'Click here and you\'re done!' }
                      ]
            }

          ]
};
