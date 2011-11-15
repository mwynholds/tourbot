class DiagnosticsController < ApplicationController

  def show
    @diagnostic = Diagnostic.find_by_id params[:id], { :source => params[:source] }
  end

end