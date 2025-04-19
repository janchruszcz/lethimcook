class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # Skip methods or callbacks that rely on flash
  skip_before_action :verify_signed_out_user, only: :destroy

  def create    
    self.resource = warden.authenticate(:database_authenticatable)
    
    if resource
      sign_in(resource_name, resource)
      Rails.logger.info "User signed in successfully: #{current_user.inspect}"
      render json: {
        status: { code: 200, message: 'Logged in successfully' },
        data: resource
      }, status: :ok
    else
      Rails.logger.info "Authentication failed"
      render json: {
        status: { code: 401, message: 'Invalid credentials' }
      }, status: :unauthorized
    end
  end

  def respond_with(resource, _opts = {})
    if resource.persisted? && current_user
      render json: {
        status: { code: 200, message: 'Logged in successfully' },
        data: resource
      }, status: :ok
    else
      render json: {
        status: { code: 401, message: 'Invalid credentials' }
      }, status: :unauthorized
    end
  end

  def destroy    
    if warden.authenticated?(:user) 
      Rails.logger.info "User authenticated, attempting sign out: #{current_user.inspect}"
      sign_out(current_user)
      
      render json: {
        status: 200,
        message: "Logged out successfully"
      }, status: :ok
    else
      # No user signed in or session invalid
      Rails.logger.info "No active session found for logout"
      render json: {
        status: 401,
        message: "No active session"
      }, status: :unauthorized
    end
  end

  # Override methods that use flash
  def respond_to_on_destroy
    render json: {
      status: 200,
      message: "Logged out successfully"
    }, status: :ok
  end

  private

  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end
end

