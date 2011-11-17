//= require_self
//= require tourbot

var _tourconfig = {
  source: 'demo1',
  pages:
          [
            {
              path: '/demos/one',
              steps:
                      [
                        { name: '1', inbound: '#first-name', outbound: '#last-name', type: 'text', message: 'Tell me your name' },
                        { name: '2', inbound: 'input.gender', offset: { x: 100, y: 0 }, type: 'clickable', message: 'Tell me whether you\'re a boy or girl' },
                        { name: '3', inbound: 'fieldset.submit input', type: 'clickable', message: 'Now click this button!' }
                      ]
            }
          ]
};