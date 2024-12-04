class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  # Enable CSRF protection for API
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  respond_to :json
end
