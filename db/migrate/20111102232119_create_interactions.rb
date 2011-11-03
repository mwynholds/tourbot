class CreateInteractions < ActiveRecord::Migration
  def change
    create_table :interactions do |t|
      t.string :source
      t.string :name
      t.boolean :final
      t.string :session_id

      t.timestamps
    end
  end
end
