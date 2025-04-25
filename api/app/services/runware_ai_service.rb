class RunwareAiService
  require 'net/http'
  require 'json'
  require 'base64'
  require 'fileutils'
  require 'open-uri'

  def self.generate_image(prompt)
    url = "https://api.runware.ai/v1"
    uri = URI(url)
    
    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"
    request["Authorization"] = "Bearer #{ENV.fetch('RUNWARE_AI_API_KEY')}"
    
    # Generate a random UUID for task identification
    task_uuid = SecureRandom.uuid
    
    request.body = [
      {
        "taskType": "imageInference",
        "taskUUID": task_uuid,
        "positivePrompt": "Professional, appetizing food photography of #{prompt}, plated dish, restaurant quality, soft lighting, high resolution, 4k, detailed",
        "negativePrompt": "blurry, distorted, low quality, unrealistic",
        "width": 1024,
        "height": 1024,
        "numberResults": 1,
        "model": "runware:100@1"
      }
    ].to_json
    
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end
    
    if response.code == "200"
      result = JSON.parse(response.body)
      if result["data"] && result["data"].first && result["data"].first["imageURL"]
        return result["data"].first["imageURL"]
      else
        puts "No image URL in response: #{result}"
        return nil
      end
    else
      puts "Error from Runware AI: #{response.body}"
      return nil
    end
  end
end