ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/autorun"

# Include Warden test helpers
require 'warden'
include Warden::Test::Helpers

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml
  fixtures :all

  # Helper method for JSON parsing
  def json_response
    JSON.parse(response.body)
  end
end

class ActionDispatch::IntegrationTest
  # Remove or comment out Devise::Test::IntegrationHelpers if warden helpers are used
  # include Devise::Test::IntegrationHelpers

  # Setup block for integration tests
  setup do
    Warden.test_mode!
  end

  # Teardown block for integration tests
  teardown do
    Warden.test_reset!
  end
end