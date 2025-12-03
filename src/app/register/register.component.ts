import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  myFormRegister: FormGroup;
  signInForm: FormGroup;

  msg: string = "";
  msg_succus: string = "";
  code: number[] = [0, 0, 0, 0, 0]; // Array to hold the 5 digits
  showTimer: boolean = false;
  timerValue: number = 30; // Timer value in seconds
  timerInterval: any;
  is_active: boolean = false; // Initially inactive

  constructor(private fb: FormBuilder,private router: Router) {
    // Initialize the registration form
    this.myFormRegister = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Initialize the sign-in form
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Custom validator to compare password and confirm_password
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirm_password')?.value
      ? null : { mismatch: true };
  }

  ngOnInit():void {
    this.checkCookie();
  }

  // Handle input for the 5-digit code
  onInput(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    this.code[index] = Number(target.value);

    // Move focus to the next input field if the current field is filled
    if (target.value.length > 0 && index < 4) {
      (document.getElementsByTagName('input')[index + 1] as HTMLInputElement).focus();
    }
  }

  // Handle registration form submission
  async onSubmitRegister() {
    if (this.myFormRegister.valid) {
      try {
        const response = await axios.post("http://localhost:5000/create_user", this.myFormRegister.value);
        console.log(response.data);
        if (response.status === 201) {
          alert("Registration successful!");
          this.msg_succus = "User created successfully.";
          this.msg = "";
          // Start the timer after submission
          this.startTimer();
          this.showTimer = true;
          this.is_active = true; // Activate the code input section after successful registration
        } else {
          this.msg = response.data['message'] || "An error occurred.";
          this.msg_succus = "";
          this.is_active = false;
        }
      } catch (error) {
        this.msg = "Network error. Please try again.";
        this.is_active = false;
        this.msg_succus = "";
      }
    } else {
      console.log('Form is invalid');
      this.myFormRegister.markAllAsTouched(); // Trigger validation messages for all fields
    }
  }

  // Handle sign-in form submission
  async onSignInSubmit() {
    if (this.signInForm.valid) {
      try {
        console.log(this.signInForm.value);
        
        const response = await axios.post("http://localhost:5000/Login", this.signInForm.value);
        console.log(response.data['user']);
        if (response.status === 200) {
          alert("Sign in successful!");
          this.deleteCookie("token");
          this.createCookie("token",response.data['user'],7);
          this.router.navigate(["/profile"])

          // Handle successful sign-in (e.g., redirect to dashboard)
        } else {
          alert(response.data['error']);
        }
      } catch (error) {
        alert("Network error. Please try again.");
      }
    } else {
      console.log('Form is invalid');
      // this.signInForm.markAllAsTouched(); // Trigger validation messages for all fields
    }

  }

  // Handle the submission logic for the 5-digit code
  async onSubmit() {
    const enteredCode = this.code.join('');
    const reversedStr = enteredCode.split('').reverse().join('');
    const ac_code = parseInt(reversedStr, 10); // Converts to integer in base 10

    try {
      const response = await axios.get(`http://localhost:5000/active_account/${ac_code}`);
      if (response.status === 200) {
        alert("Account activated successfully!");
      } else {
        alert("Error activating account.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  }

  // Start the timer for the activation code
  startTimer() {
    this.showTimer = true;
    this.timerValue = 30;

    this.timerInterval = setInterval(() => {
      this.timerValue--;
      // Clear interval when the timer reaches 0
      if (this.timerValue <= 0) {
        clearInterval(this.timerInterval);
        this.showTimer = false;
        this.resetCode(); // Reset the code after the timer
        this.is_active = false; // Optionally deactivate the input section after the timer
      }
    }, 1000);
  }
  createCookie(name: string, value: string, daysToExpire: number) {
    let expires = "";
    if (daysToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
    console.log(`Cookie created: ${name}=${value}`);
  }
  
  // Function to read a cookie
  readCookie(name:string) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
  }
  
  // Function to delete a cookie
  deleteCookie(name:string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`Cookie deleted: ${name}`);
  }
  

  // Reset the 5-digit code
  resetCode() {
    this.code = [0, 0, 0, 0, 0]; // Reset the input fields
  }
  async checkCookie(){
    
    
    const chk = this.readCookie("token");
    console.log(chk);
    if(chk !== null)
    {
       try {
         const response = await axios.get(`http://localhost:5000/validate_token/${chk}`);
         console.log(response.data);
         
         if(response.status === 200)
          {
            console.log(`status:${response.status}`);
            
            this.router.navigate(['/profile']); 
            
          } 
          
       } catch (error) {
        
       }
    }
    



  }
  
}


