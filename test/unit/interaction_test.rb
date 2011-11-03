require 'test_helper'

class InteractionTest < ActiveSupport::TestCase
  test 'validation success' do
    interaction = Interaction.new :source => 'foo', :name => '1', :session_id => 'abc'
    interaction.save
    assert_equal 0, interaction.errors.count
  end

  test 'missing attribute' do
    interaction = Interaction.new :source => 'foo', :name => '1'
    interaction.save
    assert_equal 1, interaction.errors.count
  end
end
