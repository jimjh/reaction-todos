class TodosController < ApplicationController

  include Reaction::Rails::Publisher

  def index
    @todos = Todo.all
    respond_with(@todos)
  end

  def create
    @todo = Todo.new(params[:todo])
    broadcast create: @todo if @todo.save
    respond_with(@todo)
  end

  def update
    @todo = Todo.find(params[:id])
    filtered = params[:todo].select { |k| k == 'title' }
    broadcast update: @todo if @todo.update_attributes(filtered)
    respond_with(@todo)
  end

  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy
    broadcast destroy: @todo
    respond_with(@todo)
  end


end
