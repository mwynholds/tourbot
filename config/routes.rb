Tourbot::Application.routes.draw do
  resources :interactions, :only => [:create, :show]
  resources :demos, :only => [:show]
  resources :diagnostics, :only => [:show]

  match '/proxy/:site(/*path)' => 'proxies#proxy', :via => [:get, :post], :constraints => { :path => /.*/ }
end
