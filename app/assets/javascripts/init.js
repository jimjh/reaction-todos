/*jshint strict:true unused:true*/
/*global _:true Backbone:true Reaction:true $:true*/

init = function() {

  'use strict';

  var TodoView = Backbone.View.extend({

    tagName: 'li',

    template: _.template($('#item-template').html()),

    events: {
      'click button.destroy': 'deleteOnClick',
      'dblclick .view': 'editOnDoubleClick',
      'blur .edit'      : 'close',
      'keypress .edit'  : 'updateOnEnter'
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.input = this.$('.edit');
      return this;
    },

    deleteOnClick: function() {
      this.model.destroy({wait: true});
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

  var AppView = Backbone.View.extend({

    el: $('#todoapp'),

    events: {
      'keypress #new-todo': 'createOnEnter'
    },

    initialize: function() {

      this.input = $('input#new-todo');
      var collection = new Reaction.Collection({
        controller_name: 'todos',
        model_name: 'todo'
      });

      collection.bind('add', this.addOne, this);
      collection.bind('reset', this.addAll, this);
      collection.bind('remove', this.remove, this);

      this.collection = collection;
      collection.fetch();

    },

    addOne: function(todo) {
      var view = new TodoView({model: todo, id: 'todo-' + todo.id});
      $('ul#todo-list').append(view.render().el);
    },

    addAll: function() {
      this.collection.each(this.addOne);
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;
      this.collection.create({title: this.input.val()}, {wait: true});
      this.input.val('');
    },

    remove: function(todo) {
      this.$el.find('#todo-' + todo.id).remove();
    }

  });

  new AppView();

};
