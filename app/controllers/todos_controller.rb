class TodosController < ApplicationController

  # Including the Reaction publisher adds a new mime type for `.reaction`
  # requests.
  include Reaction::Rails::Publisher

  # Every action below ends with `respond_with`, which is a Rails method that
  # determines the response format. Reaction requests use the reaction mime
  # type, which is just JSON with a schema.

  def index
    @todos = Todo.all
    respond_with(@todos)
  end

  # When a new todo is created, we need to broadcast the change to all
  # listening clients.
  def create
    @todo = Todo.new(params[:todo])
    broadcast create: @todo if @todo.save
    respond_with(@todo)
  end

  # When a todo is updated, we need to broadcast the change to all listening
  # clients.
  def update
    @todo = Todo.find(params[:id])
    filtered = params[:todo].select { |k| ['title', 'completed'].include? k }
    broadcast update: @todo if @todo.update_attributes(filtered)
    respond_with(@todo)
  end

  # Similarly, when a todo is destroyed, we broadcast the change to everybody.
  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy
    broadcast destroy: @todo
    respond_with(@todo)
  end


end
