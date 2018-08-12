import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { flatMap, filter, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private _ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject([]);

  //public ingredientListChanged = new Subject<Ingredient[]>();
  public editingStateChanged = new Subject<Ingredient>();

  constructor(private db: DataStorageService) {
    this.init();
  }

  private init(): void {
    this.db.getIngredients().pipe(first()).subscribe(
      ingredients => {

        console.info(`Loaded ${ingredients.length} ingredients`);

        this._ingredients.next(ingredients);

      },
      error => this._ingredients.error(error));
  }

  public getIngredients(): Observable<Ingredient[]> {
    return this._ingredients.asObservable();
  }

  public getIngredient(id: number): Observable<Ingredient> {
    return this._ingredients.pipe(flatMap(_ => _), filter(_ => _.id === id));
  }

  public addIngredient(ingredient: Ingredient) {
    
    this.addNewOrExistingIngredient(ingredient);
  }

  private addNewOrExistingIngredient(ingredient: Ingredient) {

    let ingredients = this._ingredients.value;
    const idx = ingredients.findIndex(i => i.name === ingredient.name);

    if (idx > -1) {
      
      this.db.addIngredient(ingredient)
        .pipe(
          first())
        .subscribe(
          result => {
            
            console.info(`Added ${ingredient.name} in the DB!`);
            
            ingredients.push(result);

            this._ingredients.next(ingredients);
          },
          err => this._ingredients.error(err));

    } else {

      const id = ingredients[idx].id;

      this.updateIngredient(id, ingredient);

    }
      
  }

  public updateIngredient(id: number, ingredient: Ingredient) {

    let ingredients = this._ingredients.value;
    ingredient.id = id;

    const idx = ingredients.findIndex(i => i.id === id);

    this.db.updateIngredient(id, ingredient)
      .pipe(
        first())
      .subscribe(
      result => {

          console.info(`Updated #${id} ${ingredient.name} in the DB!`);

          ingredients[idx] = ingredient;

          this._ingredients.next(ingredients);
        },
        err => this._ingredients.error(err));

  }

  public addIngredients(ingredients: Ingredient[]) {

    ingredients.forEach((i: Ingredient) => this.addNewOrExistingIngredient(i));
  }

  public removeIngredient(ingredient: Ingredient) {

    this.db.removeIngredient(ingredient);
  }
}
