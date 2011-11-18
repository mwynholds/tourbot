def tourbot
  find('#tourbot')
end

def tourconfig
  json = tourbot.find('.config').text.gsub(/(\w+)\s*:/, '"\1":')
  JSON.parse( json )
end

def get_step(step)
  config = tourconfig
  uri = URI.parse(current_url)
  page = config['pages'].find { |p| p['path'] == uri.path }
  page['steps'][step]
end

When /^I go to demo (\w+)$/ do |demo|
  visit "/demos/#{demo}"
end

When /^I go to demo (\w+) with variant (\w+)$/ do |demo, variant|
  visit "/demos/#{demo}?variant=#{variant}"
end

When /^I start the tour$/ do
  tourbot.click
end

When /^I complete the (first|second|third|fourth|fifth) step$/ do |step_num|
  step = get_step(step_num)
  outbound = find(step['outbound'] || step['inbound'])
  type = step['type']
  if type == 'clickable'
    outbound.click
  elsif type == 'text'
    outbound.set('foo')
    find('div.intro').click
  end
end

Then /^I should (not )?see the tourbot tab$/ do |show|
  if show == 'not '
    assert ! page.has_css?('#tourbot')
  else
    assert page.has_css?('#tourbot')
  end
end

Then /^I should see the (first|second|third|fourth|fifth) step$/ do |step_num|
  assert tourbot['tourbot-step'] == (step_num).to_s
end

Then /^The tab should close$/ do
  assert tourbot['class'].split.include?('closed')
end

Transform /^(first|second|third|fourth|fifth)$/ do |n|
  %w(first second third fourth fifth).index(n)
end
