require 'test_helper'

class DemosControllerTest < ActionController::TestCase
  tests DemosController

  test 'show demo' do
    post :show, :id => 'one'
    assert_response 200
    assert_template 'demos/one'
  end

end
