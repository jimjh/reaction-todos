/*jshint strict:true unused:true*/
/*global _:true Backbone:true Reaction:true $:true*/

// # Todo App
// `init` creates the app view and configures the model-view bindings.
init = function() {

  'use strict';

  // ## TodoView
  // Each TodoView displays a single todo model. Changes to the model are
  // automatically reflected in the view via bindings.
  var TodoView = Backbone.View.extend({

    // Each todo is displayed in a `li` tag.
    tagName: 'li',

    template: _.template($('#item-template').html()),

    // ### Events
    // Here is a list of events that TodoView responds to.
    events: {
      'click button.destroy': 'deleteOnClick',
      'click .toggle': 'toggleOnClick',
      'dblclick .view': 'editOnDoubleClick',
      'blur .edit'      : 'close',
      'keypress .edit'  : 'updateOnEnter'
    },

    // ### Initialization
    // When a TodoView is constructed, the `render` method is bound to the
    // `change` event.
    initialize: function() {
      this.model.bind('change', this.render, this);
    },

    // ### Rendering
    // When the todo is added or updated, this method is invoked to create a
    // new todo view using the template defined in `views/home/index.html.erb`.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('completed', !!this.model.get('completed'));
      this.input = this.$('.edit');
      return this;
    },

    // ### Callbacks
    // The following methods are invoked when the todo is deleted, toggled,
    // double-clicked, or edited. They simply map UI interactions to
    // Model#destroy and Model#save.

    deleteOnClick: function() {
      this.model.destroy({wait: true});
    },

    toggleOnClick: function() {
      if (this.model.get('completed')) {
        this.model.save({completed: false}, {wait: true});
      } else {
        this.model.save({completed: true}, {wait: true});
      }
    },

    editOnDoubleClick: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    close: function() {
      var value = this.input.val();
      if (!value) return;
      this.model.save({title: value}, {wait: true});
      this.$el.removeClass('editing');
    },

    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    }

  });

  // ## AppView
  // The entire app has one AppView, which, in this case, displays the
  // collection of todos.
  var AppView = Backbone.View.extend({

    el: $('#todoapp'),

    // ### Events
    // The AppView only responds to the 'enter' event and creates a new todo.
    // The other events are handled by TodoView.
    events: {
      'keypress #new-todo': 'createOnEnter'
    },

    // ### Initialization
    // When the AppView is constructed, a new reactive collection is created.
    // The `addOne`, `addAll`, and `remove` methods are bound to the `add`,
    // `reset`, and `remove` events respectively. Note that these events are
    // also fired when changes are received from the server (not just when the
    // user interacts with the UI.)
    initialize: function() {

      this.input = $('input#new-todo');
      var collection = new Reaction.Collection({
        controller_name: 'todos', // Must correspond to rails controller name
        model_name: 'todo'        // Must correspond to rails model name
      });

      collection.bind('add', this.addOne, this);
      collection.bind('reset', this.addAll, this);
      collection.bind('remove', this.remove, this);

      this.collection = collection;
      collection.fetch();

    },

    // #### addOne
    // Invoked when a new todo model is added to the collection. Adds a new
    // TodoView to the list.
    addOne: function(todo) {
      var view = new TodoView({model: todo, id: 'todo-' + todo.id});
      $('ul#todo-list').append(view.render().el);
      this.$el.find('#todo-count > strong').html(this.collection.length);
    },

    // #### addAll
    // Invoked when the collection first fetches a set of records from the
    // server. Adds each todo individually to the list.
    addAll: function() {
      this.collection.each(_.bind(this.addOne, this));
    },

    // #### createOnEnter
    // Invoked when the user creates a new todo. Maps it to Collection#create.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;
      this.collection.create({title: this.input.val()}, {wait: true});
      this.input.val('');
    },

    // #### remove
    // Invoked when a todo is destroyed. Removes the relevant todo from the
    // list.
    remove: function(todo) {
      this.$el.find('#todo-' + todo.id).remove();
      this.$el.find('#todo-count > strong').html(this.collection.length);
    }

  });

  new AppView();

};
