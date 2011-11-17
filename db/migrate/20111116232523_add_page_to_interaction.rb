class AddPageToInteraction < ActiveRecord::Migration
  def change
    change_table :interactions do |t|
      t.integer :page
    end
  end
end
