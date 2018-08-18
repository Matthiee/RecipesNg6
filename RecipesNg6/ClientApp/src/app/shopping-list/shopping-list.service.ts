import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { flatMap, filter, first } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private _ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject([]);

  //public ingredientListChanged = new Subject<Ingredient[]>();
  public editingStateChanged = new Subject<Ingredient>();

  constructor(private db: DataStorageService, private toast: NotifierService) {
    this.init();
  }

  private init(): void {
    this.db.getIngredients().pipe(first()).subscribe(
      ingredients => {

        this._ingredients.next(ingredients);

        this.toast.notify('info', `Loaded ${ingredients.length} ingredients!`);

      },
      error => this.showError(error, 'Unable to load the ingredients'));
  }

  private showError(error: any, msg: string) {

    this.toast.notify('error', msg);

    this._ingredients.error(error);

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

            ingredients.push(result);

            this._ingredients.next(ingredients);

            this.toast.notify('success', `Added '${ingredient.name}'!`);
          },
          err => this.showError(err, 'Unable to add ingredient'));

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
          ingredients[idx] = ingredient;

          this._ingredients.next(ingredients);

          this.toast.notify('success', `Updated '${ingredient.name}'!`);
        },
        err => this.showError(err, 'Unable to update ingredient'));

  }

  public addIngredients(ingredients: Ingredient[]) {

    ingredients.forEach((i: Ingredient) => this.addNewOrExistingIngredient(i));
  }

  public removeIngredient(id: number) {

    this.db.removeIngredient(id)
      .pipe(
        first())
      .subscribe(
        result => {
          let ingredients = this._ingredients.value;

          const idx = ingredients.findIndex(r => r.id === id);

          const removedIngredients = ingredients.splice(idx, 1);

          if (!!removedIngredients && removedIngredients.length > 0)
            this._ingredients.next(ingredients);

          this.toast.notify('success', "Ingredient removed!");
        },
        err => this.showError(err, 'Unabel to remove ingredient'));
  }
}
