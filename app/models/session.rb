class Session
  attr_reader :interactions

  def initialize(interactions)
    if interactions.map(&:session_id).uniq.length > 1
      raise "Cannot pass multi-session interactions in to a Session object"
    end
    if interactions.map(&:source).uniq.length > 1
      raise "Cannot have multi-source interactions within a session (how did that even happen?)"
    end
    if interactions.map(&:variant).uniq.length > 1
      raise "Cannot have multi-variant interactions within a session (how did that even happen?)"
    end
    @interactions = interactions.sort { |a,b| a.created_at <=> b.created_at }
  end

  def id
    @interactions.first.session_id
  end

  def source
    @interactions.first.source
  end

  def first_interaction
    @interactions.first
  end

  def last_interaction
    @interactions.last
  end

  def pages
    @interactions.map(&:page).uniq.join(", ")
  end

  def variant
    @interactions.first.variant
  end

  def started?
    zero = @interactions.find { |i| i.name == '0' }
    ! zero.nil?
  end

  def completed?
    complete = @interactions.find { |i| i.final }
    ! complete.nil?
  end
end