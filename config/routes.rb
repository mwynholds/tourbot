Tourbot::Application.routes.draw do
  resources :interactions, :only => [:create, :show]
  resources :demos, :only => [:show]
  resources :diagnostics, :only => [:show]
end
