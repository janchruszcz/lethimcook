class RecipeFilterQuery
  def initialize(params, scope = Recipe.all, user = nil)
    @params = params
    @scope = scope
    @user = user
  end

  def call
    apply_user_filters
    apply_ingredient_filters
    @scope
  end

  private
  
  def apply_user_filters
    @scope = @scope.where(user: @user) if @params[:my_recipes] == 'true' && @user
    @scope = @scope.joins(:favorites).where(favorites: { user: @user }) if @params[:favorites] == 'true' && @user
  end

  def apply_ingredient_filters
    if @params[:ingredients].present?
      ingredient_names = @params[:ingredients].split(',').map(&:strip)
      if @params[:exact] == 'true'
        @scope = @scope.with_exact_ingredients(ingredient_names)
      else
        @scope = @scope.search_by_ingredient_entries(ingredient_names)
      end
    end
  end
end
