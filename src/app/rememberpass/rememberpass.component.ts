import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-rememberpass',
  templateUrl: './rememberpass.component.html',
  styleUrls: ['./rememberpass.component.css']
})
export class RememberpassComponent implements OnInit {
  signInForm: FormGroup;

  msg: string = "";
  msg_succus: string = "";
  
  constructor(private fb: FormBuilder) {
    // Initialize the sign-in form (only with email)
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {}

  // Handle sign-in form submission
  async onSignInSubmit() {
    if (this.signInForm.valid) {
      const formData = this.signInForm.value;
      console.log(formData); // Log form data

      try {
        const response = await axios.post('http://localhost:5000/Remmemberpass', formData);
        console.log(response.data); // Handle the response
        if(response.status === 200)
        {
          alert("Succsuss")

        }
        else{
          alert(response.data['error']);
        }
      } catch (error) {
        console.error('Error during password recovery:', error);
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
