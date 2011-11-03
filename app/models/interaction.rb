class Interaction < ActiveRecord::Base
  validates :source, :presence => true
  validates :name, :presence => true
  validates :session_id, :presence => true
end
