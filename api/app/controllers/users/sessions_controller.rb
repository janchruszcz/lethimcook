module Users
  class SessionsController < Devise::SessionsController
    respond_to :json

    def destroy
      user_was_logged_in = current_user.present?
      
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      
      if user_was_logged_in
        render json: {
          status: 200,
          message: "Logged out successfully"
        }, status: :ok
      else
        render json: {
          status: 401,
          message: "Couldn't find an active session."
        }, status: :unauthorized
      end
    end

    private

    def respond_with(resource, _opts = {})
      render json: {
        status: { code: 200, message: 'Logged in successfully' },
        data: resource.to_json
      }, status: :ok
    end
  end
end
