import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { Observable, ReplaySubject } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  
  constructor(private http: HttpClient, private cache: CacheService) { }

  getRecipes(refresh?: boolean): Observable<Recipe[]> {

    let req = this.http.get<Recipe[]>('http://localhost:5000/api/Recipe');

    return this.cache.getOrAdd('getRecipes', req, refresh);
  }

  addRecipe(recipe: Recipe) : Observable<Recipe> {
    return this.http.post<Recipe>('http://localhost:5000/api/Recipe', recipe);
  }

  updateRecipe(recipe: Recipe) {
    return this.http.put('http://localhost:5000/api/Recipe/' + recipe.id, recipe);
  }

  removeRecipe(recipe: Recipe) {
    return this.http.delete('http://localhost:5000/api/Recipe/' + recipe.id);
  }


}
