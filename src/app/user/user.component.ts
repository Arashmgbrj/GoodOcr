import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user_edit: any = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  data: any[] = []; // Array of any objects
  user: any = {}; // Object to store user data
  token_count: number = 0;
  tokens: { id: string,token:string }[] = []; // Array of objects with an `id` property

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.checkCookie();
    this.profilepage();
    
  }

  readCookie(name: string): string | null {
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

  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    console.log(`Cookie deleted: ${name}`);
  }

  async checkCookie(): Promise<void> {
    const chk = this.readCookie("token");
    if (chk !== null) {
      try {
        const response = await axios.get(`http://localhost:5000/validate_token/${chk}`);
        if (response.status !== 200) {
          this.router.navigate(['/register']);
        } else {
          this.data = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      this.router.navigate(['/register']);
    }
  }

  logout(): void {
    this.deleteCookie("token");
    this.router.navigate(['/register']);
  }

  async profilepage(): Promise<void> {
    const token = this.readCookie("token");
    try {
      const response = await axios.get(`http://localhost:5000/profile_page/${token}`);
      if (response.status === 200) {
        this.token_count = response.data['token_count'];
        if (response.data['tokens'] === false) {  
          this.tokens = []; // Set to an empty array if no tokens are available
        } else {
          this.tokens = response.data['tokens']; // Assign the tokens array
          console.log(this.tokens[0].id); // Access the `id` property of the first token
        }
        this.user = this.data[0]; // Assign the first object in the array to user
      } else {
        alert("fail");
      }
    } catch (error) {
      alert("fail");
    }
  }

  async generatetoken() {
    const result = window.confirm("Are You sure create new token? ");
    if (result) {
      try {
        const token = this.readCookie("token");
        const response = await axios.get(`http://localhost:5000/generate_token/${token}`);
        if (response.status === 201) {
          alert("Success");
          this.router.navigate(['/profile']);
        }
        if (response.status === 200) {
          alert("Maximum token taken");
        }
        if (response.status === 202) {
          this.deleteCookie("token");
          this.router.navigate(["/register"]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  async deletetoken(id:string){
    const res = window.confirm("Are you sure delete?");
    if(res)
    {
      try {
        const response = await axios.get(`http://localhost:5000/deletetoken/${id}`)
        if(response.status === 200)
        {
          alert("delete sucssus ");
          window.location.reload();
        }
      } catch (error) {
        alert("fail delete")
        
      }

    }


  }


  async onSubmit(){
    // Handle form submission
    console.log('Form submitted:', this.user);
    try {
      const response = await axios.post("http://localhost:5000/edituser",this.user)
      if(response.status === 200)
      {
        alert("edit succsuss");
        
      }
      else{
        alert("fail")
      }
      
    } catch (error) {
      
    }

    // Example: Send updated data to an API
    // this.saveUserData(this.user);
  }
}