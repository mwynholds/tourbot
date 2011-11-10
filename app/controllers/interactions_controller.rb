class InteractionsController < ApplicationController

  def create
    interaction = Interaction.new(params[:interaction])
    if interaction.valid?
      interaction.save
      render :nothing => true, :status => :created, :location => interaction_url(interaction)
    else
      p interaction.errors
      render :nothing => true, :status => :unprocessable_entity
    end

  end

end
