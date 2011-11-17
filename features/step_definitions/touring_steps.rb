def tourbot
  find('#tourbot')
end

When /^I go to demo (\w+)$/ do |demo|
  visit "/demos/#{demo}"
end

When /^I start the tour$/ do
  tourbot.click
end

Then /^I should (not )?see the tourbot tab$/ do |show|
  if show == 'not '
    assert ! page.has_css?('#tourbot')
  else
    assert page.has_css?('#tourbot')
  end
end

Then /^I should see the (first|second|third|fourth|fifth) step$/ do |step|
  nums = %w(first second third fourth fifth)
  step "I should see step #{nums.index(step)}"
end

Then /^I should see step (\d+)$/ do |step|
  assert tourbot['tourbot-step'] == step.to_s
end
