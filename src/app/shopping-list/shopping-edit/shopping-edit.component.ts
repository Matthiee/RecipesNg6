import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditingState } from '../../shared/editing-state';

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
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListSvc: ShoppingListService) { }

  ngOnInit() {

    this.editingStateChangedSubscription = this.shoppingListSvc.editingStateChanged
      .subscribe((state: EditingState) => {

        this.editMode = state.editing;

        if (!this.editMode)
          return;

        this.editedItemIndex = state.id;

        this.editedIngredient = this.shoppingListSvc.getIngredient(state.id);

        this.frmShoppingList.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      });

  }

  onAddItem(form: NgForm) {

    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.shoppingListSvc.updateIngredient(this.editedItemIndex, ingredient);
      this.shoppingListSvc.editingStateChanged.next({ editing: false, id: -1 });
    }
    else
      this.shoppingListSvc.addIngredient(ingredient);
  }

  ngOnDestroy() {
    this.editingStateChangedSubscription.unsubscribe();
  }

}
