class DemosController < ApplicationController

  def show
    render :template => "demos/#{params[:id]}"
  end

end