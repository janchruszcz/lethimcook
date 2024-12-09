require 'pagy/extras/metadata'
require 'pagy/extras/headers'

Pagy::DEFAULT[:limit] = 9
Pagy::DEFAULT[:metadata] = [:page, :items, :count, :pages]