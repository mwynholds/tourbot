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
                        { name: '1', inbound: 'td.header_bg_image a', offset: { x: -20, y: -7 }, message: 'Click me to sign up!!' }
                      ]
            },
            {
              path: '/registration.php',
              steps:
                      [
                        { name: '2', inbound: '#username', message: 'This is how people will see you on the site.' },
                        { name: '3', inbound: '#password', outbound: '#re_password', offset: { x: 0, y: 12 },
                                     message: 'Make sure you choose a good password, and enter it twice.' },
                        { name: '4', inbound: '#email', outbound: '#re_email', offset: { x: 0, y: 12 },
                                     message: 'Same deal with your email address.' },
                        { name: '5', inbound: '#month', outbound: '#year', offset: { x: 120, y: 0 },
                                     message: 'We need to know when you were born to find you the right matches!' },
                        { name: '6', inbound: 'input[name="gender"]', offset: { x: 90, y: 0 },
                                     message: 'Ummm... it\'s pretty obvious why we need to know this! :-)' },
                        { name: '7', inbound: '#u_ethnicity', message: 'This helps us match you up.' },
                        { name: '8', inbound: '#u_country', outbound: '#u_postalcode',
                                     message: 'We don\'t want you to have to travel too far to meet your soulmate!' },
                        { name: '9', inbound: 'input[name="conf_num2"]', outbound: '#terms',
                                     message: 'Sorry... this is to make sure you\'re not a hacker.' },
                        { name: '10', inbound: 'td.iam input:image', message: 'Click here and you\'re done!' }
                      ]
            }

          ]
};
