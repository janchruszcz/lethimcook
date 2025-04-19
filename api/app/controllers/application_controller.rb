class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include Pagy::Backend

  # Enable CSRF protection for API, except in test environment
  protect_from_forgery with: :exception, unless: -> { Rails.env.test? }

  before_action :set_csrf_cookie

  respond_to :json

  private

  def set_csrf_cookie
    # Only set the cookie if protection is actually enabled for the current request
    cookies['CSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end
end
