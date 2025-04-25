class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include Pagy::Backend

  # Enable CSRF protection for API, except in test environment
  protect_from_forgery with: :exception, unless: -> { Rails.env.test? }

  before_action :set_csrf_cookie

  respond_to :json

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  # rescue_from StandardError, with: :standard_error

  private

  def set_csrf_cookie
    # Only set the cookie if protection is actually enabled for the current request
    cookies['CSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def render_error(status, code, title, detail)
    numeric_status = Rack::Utils::SYMBOL_TO_STATUS_CODE[status] || 500 # Default to 500 if symbol unknown
    render json: {
      success: false,
      errors: [
        {
          status: numeric_status.to_s, 
          code: code.to_s,
          title: title,
          detail: detail
        }
      ]
    }, status: status
  end

  def record_not_found(exception)
    render_error(:not_found, :record_not_found, 'Record not found', exception.message)
  end

  def record_invalid(exception)
    errors = exception.record.errors.map do |error|
      {
        status: "422", 
        code: :record_invalid,
        title: "Validation error: #{error.attribute.to_s.humanize}",
        detail: error.full_message
      }
    end

    render json: { success: false, errors: errors }, status: :unprocessable_entity
  end

  def parameter_missing(exception)
    render_error(:bad_request, :parameter_missing, 'Parameter missing', "Missing required parameter: #{exception.param}")
  end

  def standard_error(exception)
    render_error(:internal_server_error, :standard_error, 'Standard error', exception.message)
  end
end
