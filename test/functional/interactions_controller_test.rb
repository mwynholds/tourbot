require 'test_helper'

class InteractionsControllerTest < ActionController::TestCase
  tests InteractionsController

  test 'create interaction success' do
    post :create, :interaction => { :source => 'carbonfive.com', :name => '1', :session_id => 'abc' }
    assert_response 201
    assert_not_nil @response.header['Location']
  end

  test 'create interaction failure' do
    post :create, :interaction => { :source => 'carbonfive.com', :name => '1' } # missing session_id
    assert_response 422
  end

end
