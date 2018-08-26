import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe.model';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ingredient } from './ingredient.model';
import { tap, first } from 'rxjs/operators';

const RECIPE_EP: string = 'Recipe';
const INGREDIENT_EP: string = 'Ingredient';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  
  private inflightRequests: Map<string, Subject<any>> = new Map();


  constructor(private http: HttpClient) { }

  // *********************************
  // Recipes
  // *********************************

  getRecipes(): Observable<Recipe[]> {

    let req = this.http.get<Recipe[]>(environment.apiUrl + RECIPE_EP);

    return this.checkRequestIsInFlight("getRecipes", req);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(environment.apiUrl + RECIPE_EP, recipe);
  }

  updateRecipe(id: number, recipe: Recipe) {
    return this.http.put(environment.apiUrl + RECIPE_EP + '/' + id, recipe);
  }

  removeRecipe(id: number) {
    return this.http.delete(environment.apiUrl + RECIPE_EP + '/' + id);
  }

  // *********************************
  // Ingredients
  // *********************************

  getIngredients(): Observable<Ingredient[]> {

    let req = this.http.get<Ingredient[]>(environment.apiUrl + INGREDIENT_EP);

    return this.checkRequestIsInFlight("getIngredients", req);
  }

  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(environment.apiUrl + INGREDIENT_EP, ingredient);
  }

  updateIngredient(id: number, ingredient: Ingredient) {
    return this.http.put(environment.apiUrl + INGREDIENT_EP + '/' + id, ingredient);
  }

  removeIngredient(id: number) {
    return this.http.delete(environment.apiUrl + INGREDIENT_EP + '/' + id);
  }


  // *****************************

  private checkRequestIsInFlight<T>(key: string, fallback: Observable<T>): Observable<T> | Subject<T> {
    if (this.inflightRequests.has(key))
      return this.inflightRequests.get(key);

     this.inflightRequests.set(key, new Subject<T>());

    return fallback.pipe(
      first(),
      tap(val => this.inFlightReqReceived(key, val))
    )


  }

  private inFlightReqReceived<T>(key: string, val: T): void {
    if (!this.inflightRequests.has(key)) return;

    const inflight = this.inflightRequests.get(key);
    const observers = inflight.observers.length;

    if (observers) {

      console.log(`Notifying ${observers} subscribers for ${key}`);

      inflight.next(val);
    }

    inflight.complete();

    this.inflightRequests.delete(key);
  }

}
