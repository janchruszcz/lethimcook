class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include Pagy::Backend

  # Enable CSRF protection for API
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  before_action :set_csrf_cookie

  respond_to :json

  private

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end
end
