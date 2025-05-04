class Result
  attr_reader :value
  
  def initialize(value)
    @value = value
  end
  
  def success?
    is_a?(Success)
  end
  
  def failure?
    is_a?(Failure)
  end
end

class Success < Result; end
class Failure < Result; end
