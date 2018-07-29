import { Component, OnInit, Input } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  @Input()
  recipe: Recipe;

  constructor() { }

  ngOnInit() {
  }

  onRecipeChanged(recipe: Recipe) {
    this.recipe = recipe;
  }

}
