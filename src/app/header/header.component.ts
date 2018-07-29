import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output()
  featureSelected = new EventEmitter<string>();


  constructor() { }

  ngOnInit() {
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

}
