import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f')
  frmShoppingList: NgForm;

  editingStateChangedSubscription: Subscription;
  editMode: boolean = false;
  editedItemId: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListSvc: ShoppingListService) { }

  ngOnInit() {

    this.editingStateChangedSubscription = this.shoppingListSvc.editingStateChanged
      .subscribe(item => {

        this.editMode = true;

        this.editedIngredient = item;
        this.editedItemId = item.id;

        this.frmShoppingList.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      });

  }

  onAddItem() {

    const value = this.frmShoppingList.value;
    const ingredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.shoppingListSvc.updateIngredient(this.editedItemId, ingredient);
    }
    else
      this.shoppingListSvc.addIngredient(ingredient);

    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.frmShoppingList.reset();
  }

  onDelete() {

    this.shoppingListSvc.removeIngredient(this.editedIngredient);

    this.onClear();
  }

  ngOnDestroy() {
    this.editingStateChangedSubscription.unsubscribe();
  }

}
