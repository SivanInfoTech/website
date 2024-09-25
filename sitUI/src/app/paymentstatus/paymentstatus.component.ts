import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from  '../../environments/environment'

@Component({
  selector: 'app-paymentstatus',
  templateUrl: './paymentstatus.component.html',
  styleUrls: ['./paymentstatus.component.css']
})
export class PaymentstatusComponent implements OnInit {
  payPageResponse: any;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const transactionId = params['transaction_id'];
      this.http.get<any>(`${environment.baseurl}/callback/${transactionId}`)
        .subscribe(data => {
          this.payPageResponse = data;
          // Handle payment status and navigate accordingly
          if (this.payPageResponse.success) {
            this.router.navigate(['/payment-success']);
          } else {
            this.router.navigate(['/payment-failure']);
          }
        });
    });
  }
}

