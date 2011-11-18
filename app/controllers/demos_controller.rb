class DemosController < ApplicationController

  def show
    @params = params[:demo]
    render :template => "demos/#{params[:id]}"
  end

end