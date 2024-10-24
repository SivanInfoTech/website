import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ADSService } from 'src/service/ads.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ads-configuration',
  templateUrl: './ads-configuration.component.html',
  styleUrls: ['./ads-configuration.component.css']
})
export class AdsConfigurationComponent implements OnInit {
  flashnewslist: FormGroup;

  constructor(private fb: FormBuilder, private AdsService: ADSService, private toastr: ToastrService,) {
  }

  ngOnInit() {
    // we will initialize our form here
    this.getflashnews();
    this.flashnewslist = this.fb.group({
      flashnews: this.fb.array([
        // this.initflashnews()
      ])
    });
  }

  trackByFn(index: number, item: any) {
    return item.trackingId;
  }

  getflashnews() {
    this.AdsService.getflashAds().subscribe((res: any) => {
      console.log(res)
      let adsdata = res;
      if(adsdata.details && adsdata.details.flashadslist && adsdata.details.flashadslist.length > 0) {
        adsdata.details.flashadslist.forEach((add:any) => {
          this.addGroup(add);
        })
      }
    })
  }

  initflashnews() {
    return this.fb.group({
      adsTitle: this.fb.control('', Validators.required),
      adsContent: this.fb.control('', Validators.required),
    });
  }

  addGroup(add : any) {
    // add address to the list
    const control = <FormArray>this.flashnewslist.controls['flashnews'];
    if(add) control.push(this.initflashnewswithadd(add))
    else control.push(this.initflashnews());
  }

  initflashnewswithadd(add: any) {
    return this.fb.group({
      adsTitle: this.fb.control(add.adsTitle, Validators.required),
      adsContent: this.fb.control(add.adsContent, Validators.required),
    });
  }

  removeGroup(i: number) {
    // remove address from the list
    const control = <FormArray>this.flashnewslist.controls['flashnews'];
    control.removeAt(i);
  }

  onSubmit() {
    console.log('value: ', this.flashnewslist.value);
    console.log('valid: ', this.flashnewslist.valid);
    let req_obj = {
      flashadslist: this.flashnewslist.value.flashnews,
      adsType: "flashadd",
    };
    this.AdsService.saveflashAds(req_obj).subscribe(res => {
      console.log(res);
      this.toastr.success("Saved Ads Configuration succesfully")
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }
}
