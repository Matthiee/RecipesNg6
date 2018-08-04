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

  startEditingSubscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListSvc: ShoppingListService) { }

  ngOnInit() {

    this.startEditingSubscription = this.shoppingListSvc.startedEditing
      .subscribe(id => {

        this.editMode = true;
        this.editedItemIndex = id;

        this.editedIngredient = this.shoppingListSvc.getIngredient(id);

        this.frmShoppingList.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
    });

  }

  onAddItem(form: NgForm) {

    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);

    this.shoppingListSvc.addIngredient(ingredient);
  }

  ngOnDestroy() {
    this.startEditingSubscription.unsubscribe();
  }

}
