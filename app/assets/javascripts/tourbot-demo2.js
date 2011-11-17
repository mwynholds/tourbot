//= require_self
//= require jquery.cookies.2.2.0
//= require tourbot

var _tourconfig = {
  source: 'demo2',
  pages:
          [
            {
              path: '/demos/two',
              steps:
                      [
                        { name: '1', inbound: '#first-name', outbound: '#last-name', type: 'text', message: 'Tell me your name' },
                        { name: '2', inbound: 'input:submit', type: 'clickable', message: 'Click here to go to the next page' }
                      ]
            },
            {
              path: '/demos/two2',
              steps:
                      [
                        { name: '3', inbound: 'input.gender', offset: { x: 100, y: 0 }, type: 'clickable', message: 'Tell me whether you\'re a boy or girl' },
                        { name: '4', inbound: 'fieldset.submit input', type: 'clickable', message: 'Now click this button!' }
                      ]
            }
          ]
};