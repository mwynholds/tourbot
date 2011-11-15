module ApplicationHelper
  def pretty_time(time)
    time.localtime.strftime '%m/%e/%Y %l:%M%P'
  end
end
