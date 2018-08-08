import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Observable<Recipe[]>;
  recipeListSubscription: Subscription;

  constructor(private recipeSvc: RecipeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipes = this.recipeSvc.getRecipes();

    //this.recipeListSubscription = this.recipeSvc.recipeListChanged.subscribe(x => {
    //  this.recipes = this.recipeSvc.getRecipes();
    //});
  }

  ngOnDestroy() {
    this.recipeListSubscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

}
