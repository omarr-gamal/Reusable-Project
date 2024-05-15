import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-panel',
  templateUrl: './custom-panel.component.html',
  styleUrl: './custom-panel.component.css'
})
export class CustomPanelComponent {
  @Input() title: string = '';
}
