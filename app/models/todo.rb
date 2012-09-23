class Todo < ActiveRecord::Base
  validates :title, :presence => true, :length => {minimum: 5}
  attr_accessible :title
end
