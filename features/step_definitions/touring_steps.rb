def tourbot
  find('#tourbot')
end

def get_session_id
  tourbot.find('.session-id').text.strip
end

def get_variant
  tourbot.find('.variant').text.strip
end

def get_page
  uri = URI.parse(current_url)
  File.basename(uri.path)
end

def visit_demo(demo, variant)
  visit "/demos/#{demo}?variant=#{variant}"
  if variant == 'A'
    @session_id = get_session_id
    @variant = get_variant
  end
end

def blur(id)
  find('div.intro').click
end

When /^I view the simple demo$/ do
  @demo = 'one'
  visit_demo @demo, 'A'
end

When /^I view the multi-page demo$/ do
  @demo = 'two'
  visit_demo @demo, 'A'
end

When /^I am assigned variant (\w+)$/ do |variant|
  visit_demo @demo, variant
end

When /^I start the tour$/ do
  tourbot.click
end

When /^I complete the (first|second|third|fourth|fifth) step$/ do |step|
  demo_page = get_page

  if demo_page == 'one'
    if step == 0
      page.fill_in 'First Name', :with => 'First Name'
      page.fill_in 'Last Name', :with => 'Last Name'
      blur('#last-name')
    elsif step == 1
      find('input.gender').click
    elsif step == 2
      page.click_button 'Say Hello'
    end
  elsif demo_page == 'two'
    if step == 0
      page.fill_in 'First Name', :with => 'First Name'
      page.fill_in 'Last Name', :with => 'Last Name'
      blur('#last-name')
    elsif step == 1
      page.click_button 'Next Page'
    end
  elsif demo_page == 'two2'
    if step == 0
      find('input.gender').click
    elsif step == 1
      page.click_button 'Say Hello'
    end
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
  assert_equal step_num.to_s, tourbot['tourbot-step']
end

Then /^The tab should close$/ do
  assert tourbot['class'].split.include?('closed')
end

Then /^I should be viewing page (\w+)$/ do |page|
  assert_equal page, get_page
end

Then /^My session id should be the same$/ do
  assert_equal @session_id, get_session_id
end

Then /^My variant should be the same$/ do
  assert_equal @variant, get_variant
end

Transform /^(first|second|third|fourth|fifth)$/ do |n|
  %w(first second third fourth fifth).index(n)
end
