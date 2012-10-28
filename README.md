# Todo
A todo list built on the [Reaction][1] framework. This is intended to be a minimal example.
The annotated source is available [here][6].

## Install and Run

1. Clone.

  ```bash
  $> git clone https://github.com/jimjh/reaction-todos
  ```

1. Install.

  ```bash
  $> bundle install
  ```

1. Migrate.

  ```bash
  $> rake db:setup
  ```

1. Run.

  ```bash
  $> bundle exec rails server
  ```

Open up two different browsers (I tried this in Chrome and Safari) and point
them to [http://localhost:3000](http://localhost:3000).  Changes made in one
browser are immediately updated in the other.

## Reaction
Except for the following places, Todos is just a regular Rails app.

* `Gemfile` - added the reaction and thin gems
* [config/routes.rb][5] - added `mount_reaction` to start the push server
* [app/controllers/todos_controller.rb][7] - included `Reaction::Rails::Publisher` and used
  `respond_with` in every action
* [app/assets/javascripts/application.js][8] - imported backbone, amplify, and
  reaction

Finally, [app/assets/javascripts/init.js][9] contains a regular Backbone app,
adapted from the Backbone [tutorial][4].  The templates are in
[app/views/home/index.html.erb][0].

## Credits
Special thanks to [Sindre Sorhus][2] and [TodoMVC][3] for the great-looking
todo list.

  [1]: https://github.com/jimjh/reaction
  [2]: https://github.com/sindresorhus
  [3]: http://todomvc.com
  [4]: http://backbonejs.org/docs/todos.html
  [5]: http://jimjh.github.com/reaction-todos/config/routes.html
  [6]: http://jimjh.github.com/reaction-todos
  [7]: http://jimjh.github.com/reaction-todos/app/controllers/todos_controller.html
  [8]: http://jimjh.github.com/reaction-todos/app/assets/javascripts/application.js
  [9]: http://jimjh.github.com/reaction-todos/app/assets/javascripts/init.html
  [0]: http://jimjh.github.com/reaction-todos/app/views/home/index.html.html
