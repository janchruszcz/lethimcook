class Api::V1::AiChefController < ApplicationController
  wrap_parameters false

  def generate_recipe
    job = GenerateRecipeJob.perform_later(params[:ingredients])
    render json: { jobId: job.job_id }
  end

  def recipe_status
    job = SolidQueue::Job.find_by(active_job_id: params[:job_id])
    
    if job.nil?
      render json: { status: 'failed', error: 'Job not found' }
    elsif job.finished_at.present?
      if job.failed_execution
        render json: { status: 'failed', error: job.failed_execution.error }
      else
        render json: { 
          status: 'completed',
          recipe: job.result
        }
      end
    else
      render json: { status: 'pending' }
    end
  end
end