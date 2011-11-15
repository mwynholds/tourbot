module ApplicationHelper
  def pretty_time(time)
    (time.utc? ? time.localtime : time).strftime '%m/%e/%Y %l:%M%P'
  end
end
