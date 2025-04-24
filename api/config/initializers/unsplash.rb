Unsplash.configure do |config|
  config.application_access_key = ENV.fetch("UNSPLASH_ACCESS_KEY")
  config.application_secret = ENV.fetch("UNSPLASH_SECRET_KEY")
  # config.application_redirect_uri = ENV.fetch("UNSPLASH_REDIRECT_URI")
  config.utm_source = "lethimcook"
end
