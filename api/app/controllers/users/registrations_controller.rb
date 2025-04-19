module Users
  class RegistrationsController < Devise::RegistrationsController
    respond_to :json

    # Skip methods or callbacks that rely on flash
    skip_before_action :verify_signed_out_user, only: :destroy, raise: false

    def create
      build_resource(sign_up_params)
      resource.save
      respond_with(resource)
    end

    # Override methods that use flash
    def respond_with(resource, _opts = {})
      if resource.persisted?
        render json: {
          email: resource.email
        }, status: :ok
      else
        render json: {
          errors: resource.errors.full_messages
        }, status: :unprocessable_entity
      end
    end

    private

    def sign_up_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end
end