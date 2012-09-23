ReactionTodos::Application.routes.draw do

  mount_reaction

  resources :todos do
  end

  root :to => 'home#index'

end
