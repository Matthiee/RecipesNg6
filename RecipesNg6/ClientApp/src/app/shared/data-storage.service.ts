import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { Observable, ReplaySubject } from 'rxjs';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';
import { Ingredient } from './ingredient.model';

const RECIPE_EP: string = 'Recipe';
const INGREDIENT_EP: string = 'Ingredient';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  


  constructor(private http: HttpClient, private cache: CacheService) { }

  // *********************************
  // Recipes
  // *********************************

  getRecipes(refresh?: boolean): Observable<Recipe[]> {

    let req = this.http.get<Recipe[]>(environment.apiUrl + RECIPE_EP);

    return this.cache.getOrAdd('getRecipes', req, refresh);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(environment.apiUrl + RECIPE_EP, recipe);
  }

  updateRecipe(id: number, recipe: Recipe) {
    return this.http.put(environment.apiUrl + RECIPE_EP + '/' + id, recipe);
  }

  removeRecipe(recipe: Recipe) {
    return this.http.delete(environment.apiUrl + RECIPE_EP + '/' + recipe.id);
  }

  // *********************************
  // Ingredients
  // *********************************

  getIngredients(refresh?: boolean): Observable<Ingredient[]> {

    let req = this.http.get<Ingredient[]>(environment.apiUrl + INGREDIENT_EP);

    return this.cache.getOrAdd('getIngredients', req, refresh);
  }

  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(environment.apiUrl + INGREDIENT_EP, ingredient);
  }

  updateIngredient(id: number, ingredient: Ingredient) {
    return this.http.put(environment.apiUrl + INGREDIENT_EP + '/' + id, ingredient);
  }

  removeIngredient(ingredient: Ingredient) {
    return this.http.delete(environment.apiUrl + INGREDIENT_EP + '/' + ingredient.id);
  }


}
