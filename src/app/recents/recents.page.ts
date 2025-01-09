import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recents',
  templateUrl: './recents.page.html',
  styleUrls: ['./recents.page.scss'],
})
export class RecentsPage implements OnInit {
  // Inicialização diretamente aqui
  travelForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
  });

  showForm: boolean = false;
  travelEvents: any[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // A inicialização foi movida para o construtor
  }

  addEvent() {
    if (this.travelForm.valid) {
      this.travelEvents.push(this.travelForm.value);
      this.travelForm.reset();
      this.showForm = false;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    }
  }
