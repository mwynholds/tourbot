class InteractionsController < ApplicationController

  def create
    interaction = Interaction.new(params[:interaction])
    if interaction.valid?
      interaction.save
      render :nothing => true, :status => :created, :location => interaction_url(interaction)
    else
      render :nothing => true, :status => :unprocessable_entity
    end

  end

end
