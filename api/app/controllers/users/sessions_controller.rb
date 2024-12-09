class Users::SessionsController < Devise::SessionsController
  respond_to :json
  #skip_before_action :verify_authenticity_token
  #before_action :configure_sign_in_params, only: [:create]

  def create
    Rails.logger.info "Login attempt for email: #{params.dig(:user, :email)}"
    
    self.resource = warden.authenticate!(:database_authenticatable)
    Rails.logger.info "Authentication result: #{resource.inspect}"
    
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
    Rails.logger.info "Respond_with called with resource: #{resource.inspect}"
    Rails.logger.info "Current user: #{current_user.inspect}"
    
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
    Rails.logger.info "Destroy action called"
    Rails.logger.info "Current user before sign out: #{current_user.inspect}"

    # Get the current signed-in user before we sign them out
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    
    if signed_out
      render json: {
        status: 200,
        message: "Logged out successfully"
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "No active session"
      }, status: :unauthorized
    end
  end

  private

  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
  end
end

