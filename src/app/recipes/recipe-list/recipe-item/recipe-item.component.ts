import { Component, OnInit, Input, Inject } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input()
  recipe: Recipe;

  @Input()
  index: number;

  @Inject(RouterLinkActive)
  active: RouterLinkActive;

  constructor() { }

  ngOnInit() {
  }

}
