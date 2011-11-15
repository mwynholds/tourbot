class Diagnostic
  attr_reader :interactions, :sessions

  def self.find_by_id(id, opts = {})
    interactions = self.send("find_#{id}".to_sym, opts)
    new(interactions)
  end

  def initialize(interactions)
    @interactions = interactions
    groups = interactions.group_by { |i| i.session_id }
    @sessions = groups.values.map { |g| Session.new(g) }
    @sessions.sort! { |s| s.first_interaction.created_at <=> s.last_interaction.created_at }
  end

  private

  def self.find_all(opts = {})
    if opts[:source]
      Interaction.find_all_by_source opts[:source]
    else
      Interaction.all
    end
  end
end