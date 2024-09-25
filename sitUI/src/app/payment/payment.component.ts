import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from  '../../environments/environment'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  constructor(private http: HttpClient) {}

  otherAmount = 0;

  initiatePayment(amount: number) {

    const gstAmount = (amount * 18 ) / 100;
    const totalAmount = amount + gstAmount;
    console.log("Payment initiated for amount:", totalAmount)
    
    const paymentData = {
      amount: totalAmount, 
      user_name : '123',
    };

    // Sending a POST request to initiate payment
    this.http.post<any>(`${environment.baseurl}/initiate-payment`, paymentData).subscribe(
      response => {
        // Success handling - You can redirect the user to the pay page URL
        console.log('Payment initiated successfully:', response.pay_page_url);
        window.location.href = response.pay_page_url; 
      },
      error => {
       
        console.error('Error initiating payment:', error);
        
      }
    );
  }
}