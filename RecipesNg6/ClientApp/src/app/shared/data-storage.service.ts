import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  getRecipes() {
    return this.http.get<Recipe[]>('http://localhost:5000/api/Recipe');
  }

  addRecipe(recipe: Recipe) {
    return this.http.post('http://localhost:5000/api/Recipe', recipe);
  }
}
