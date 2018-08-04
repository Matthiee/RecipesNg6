import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  
  public ingredientListChanged = new Subject<Ingredient[]>();
  public editingStateChanged = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10)
  ];

  constructor() { }

  public getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  public getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  public addIngredient(ingredient: Ingredient) {

    this.addNewOrExistingIngredient(ingredient);

    this.ingredientListChanged.next(this.ingredients.slice());
  }

  private addNewOrExistingIngredient(ingredient: Ingredient) {
    let existingIngredient: Ingredient = this.ingredients.find(i => i.name === ingredient.name);

    if (!existingIngredient)
      this.ingredients.push(ingredient);
    else
      existingIngredient.amount = +existingIngredient.amount + +ingredient.amount;
  }

  public updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientListChanged.next(this.ingredients.slice());
  }

  public addIngredients(ingredients: Ingredient[]) {

    ingredients.forEach((i: Ingredient) => this.addNewOrExistingIngredient(i));

    this.ingredientListChanged.next(this.ingredients.slice());
  }

  removeIngredient(ingredient: Ingredient) {
    let index = this.ingredients.findIndex(i => i.name === ingredient.name);

    if (index < 0) return;

    this.ingredients.splice(index, 1);

    this.ingredientListChanged.next(this.ingredients.slice());
  }
}
