ReactionTodos::Application.routes.draw do

  # Here, we start the reaction push server ...
  mount_reaction

  # ... and map the usual REST actions for the TodosController.
  resources :todos do
  end

  # Finally, the homepage goes directly to our app.
  root :to => 'home#index'

end
