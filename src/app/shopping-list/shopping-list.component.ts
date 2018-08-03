import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  
  ingredients: Ingredient[];

  private subscription: Subscription;

  constructor(private shoppingListSvc: ShoppingListService) { }

  ngOnInit() {

    this.ingredients = this.shoppingListSvc.getIngredients();

    this.subscription = this.shoppingListSvc.ingredientListChanged
      .subscribe(() => {
        this.ingredients = this.shoppingListSvc.getIngredients();
      });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
