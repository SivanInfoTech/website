import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/models/user.model';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.css']
})
export class EnrollmentsComponent {
  @Input() userid = '';
  displayedColumns: string[] = ['position', 'course', 'enrollmentid', 'EnrolledOn', 'Status', 'Approved', 'Cerificate'];
  dataSource: User[];
  certurl: any;

  userdata: User;
  constructor(private userService: UserService, private toastr: ToastrService,
    private router: Router) {
  }

  ngOnInit() {
    this.getenrollments()
  }

  updateenrollmentstatus(status: string, enrollmentID: string) {
    this.userService.updateenrollmentstatus(this.userid, enrollmentID, status, '').subscribe((res: any) => {
      console.log(res)
      this.getenrollments()
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }


  getenrollments() {
    this.userService.getenrollmentslist(this.userid).subscribe((res: any) => {
      console.log(res)
      this.dataSource = res['user']['enrollments']
      this.userdata = res['user']
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }

  generatecertID(enrollmentID: string, courseShortForm: string) {
    this.userService.updateenrollmentstatus(this.userid, enrollmentID, 'Certified', courseShortForm).subscribe((res: any) => {
      console.log(res)
      this.getenrollments()
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }


  downloadcert(certid: string) {
    // this.certurl = `http://127.0.0.1:5000/downloadCertificate?userid=${this.userdata.email}&certificationID=${certid}`
    this.userService.downloadcert(this.userdata.email, certid).subscribe((res: any) => {
      let myWindows = window.open('', 'PRINT', 'height=605.499987,width=864.92');
      myWindows!.document.write(res);
      myWindows!.document.close();
      // myWindows!.focus();
      
      setTimeout(function () {
        myWindows!.print();
        // let data = myWindows!.document.getElementById("page-container");
        // console.log(data);
        // html2canvas(data!).then(canvas => {
        //   const contentDataURL = canvas.toDataURL('image/jpeg')
        //   console.log(contentDataURL);
        //   let pdf = new jspdf('l', 'pt', 'a4'); //Generates PDF in landscape mode
        //   // let pdf = new jspdf('p', 'cm', 'a4'); //Generates PDF in portrait mode
        //   pdf.addFileToVFS("ff1.ttf", 'd09GRgABAAAAAAsIAA8AAAAAEpQAAQACAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAK7AAAABwAAAAcfStT7kdERUYAAArQAAAAHAAAAB4AJwBhT1MvMgAAAdAAAABNAAAAYGbUiE5jbWFwAAACaAAAAIIAAAF6Iw8ui2N2dCAAAAL0AAAABAAAAAQAIQJ5Z2FzcAAACsgAAAAIAAAACAAAABBnbHlmAAADJAAABFwAAAX0KHQxD2hlYWQAAAFYAAAANgAAADYEGZrgaGhlYQAAAZAAAAAgAAAAJAXxA0tobXR4AAACIAAAAEcAAADcJkUCi2xvY2EAAAL4AAAAKgAAALh4XHnqbWF4cAAAAbAAAAAfAAAAIACfAG1uYW1lAAAHgAAAAfkAAAO0ivYws3Bvc3QAAAl8AAABSQAAA7MjC4BxcHJlcAAAAuwAAAAHAAAAB2gGjIUAAQAAAAEAg/6BGgRfDzz1AB8D6AAAAADMlUapAAAAANUyEA7/9v/yAykCzwAAAAgAAgAAAAAAAHicY2BkYGA6//8TAwNzwP9v/78yazIARVCAMAC2cgdAeJxjYGRgYIhmsGFgYgABEMnIABJzYNADCQAAEsIBDQB4nGNgZqpgnMDAysDA1MUUwcDA4A2hGeMYjBh1gHyQFAwwMiCBUO9wPwYHBgWGEqbz/z8B9Z9n4FNgYJgMkmM6xbQHSCkwMAIA+IQMBwAAAHicY8xhUGQAAkZfIPGLgYHZlEGX6cT/b0w/GGyYHIFYlsGGWZfBhjEISHsy6DIHMGiAxZcCxe4wWDFlMYiA9A1GAABE9AztAHicY2BgYGaAYBkGRgYQKAHyGMF8FoYIIC3EIAAUYWJQYHBmSGRIZkhjyGQoYCj5/x8oBxNLZchgyGMo+v///+P/B/8v+b/4/6L/C//P/T8HaiYaYGRjgEswMgEJJnQFECcRACx4ZVkZ2BjYORg4uUAcbh5eBj5+AcJm0g0AABrtGNgAALgB/4WwBI0AACECeXicY2Bg0ILCCIYJDLsYfjCaMTYwLmG8w/iPyYZpAtMxpl+DEQIAxspR6AAAeJxdVEtsG1UUffeNMxO/OB7bmRnbYzv2eDzjBidO8PhT0jhN0pAo4SPSH5VKlaKQhAVCiAoJUZQuEN0FVpWgKAiqqshNF4kXTSgQtQtI00BZtI0qgYToigVIEIlsqCe88S8GL8bv3rHPOffe8y7CSEEInsAXEYM4lFwG1N1X5Gzoj9Qy2/RzX5HB9IiWGSvdZKWLHAuP+4pg5Q234o4bblUB+2/r6/hiaUbBJygc6trdZkL4DgrQQGDVaBLS/WCkpDCoSVCjrEuKZDOGxIS+LLy5Mv3K0mvD892CXfzo1PvLK7DvKwIwee3W6Ss/XJnUwvNHJ78xH926+YUD0Q/e3aGPexQ7jKIIaYaoZoxUNt0NCscK0gGoxLk2ig/tAAaDN5t/tYuibcDcPmQTRfuG3d/DP9Ls4HD2mMmdtwkhAZ/j6qLDGyAkEsbyhFQ6F44AB4PIqqVvdxt/R/l8CNl0V9ZI7RXhTeWyOYNjVWDW1y+fnxXs0vmX3lv45Nwbz0y4mx0n11pvw+jt4fnjp66b91eY/NCFhQsVTFqDiO+iBEI5Ktad1hMQV+iJqk/rcdVt9EMejHqUsmiUzJisgS47ALTwGE8U7/cFIUjVC1c/HH9eJr3my0STcY9PIQ52zuOLgrkJQdH5KS8EwXwwNHiJVLnhYYUbygQJ+B9dQxv3lMFDEhTv1Qh1ufWnVqom7q+qwctHeSFkEQp8hXBX1sieHlSv+y/8NUrTyVnoyn+4kpCADFURZTn6Ro/re2E7lH+GVcppztbYQasdPoYw725IEs0PjFmSY4TEZNxZ+Tb/hpaYp9lSVXpgpWqawEs1eauzaFRRVTfWyKWX4WWcqIBSJFpn1fNBvIlUilf+L/UJNNSXcVOTGlDDZ4g/Bhy2l36J+dvutvljHCZYASvARdVfetyb9uAR0+lXCVFlzOV7XKUb8KeslmUjjPZRvg7qSw7xCHkikouN6C5PJOvSI6zLhGNbW+bi1g4IhYL5ewHf2TBvbGzAiMmvQufqqnm/Pg+e1t5h3VOOpU6OxjMSNXU2nbF01vpeHw+1goR5j3IkJPZ3jfXnBBaPHDxT7w0Ts/zQdPp1+KdTHw0SL3FFggNCzDZypLRY9UO3XyGzVe4lyn2Aclc85230ASWim6MdvO2MV7LGkbTFdTUjpWrq4jqQAS3ggPrUwXny1alRvsN1PC3JrSEllxjXAu8ILZFIs9z2boTFQ/t9eKF0zRISswaokenP3+I6pLNPiQLrJGElvOR3ROn2YaYFtenQYQaozt7dbbhE+xyj/tDTOYMVBamycfQ03QZeqi2tR1k6bktwVM8zvB3G8wcn4jezkxN6T9w+OPP0vm9TM8c6pzqcL3S1tOQnnj0TK6Y+mCZnu/cPz2jXk5/NBsrzEGhPXsQ/lndy+So29l91Qgi4TDsY5U0Rx89FvWv11q/Ra8aPh+Hwk4McwVM+FUqFskP9+ASoPjfMsQ6emQOE/gXpfTACeJyNUsFO20AUnDWB0kulnqreVu0hIAXLMQqXVAg1KFRCjVAQ5bwkm8TC3kW2MYVbP6IfwQX12kv/qP2GjtdLQ1uk1tauZ9+bN7Nv1wCe4Q4CzXOKLx4LPBcdjwO0xDuPV/BafPa4hZfiu8ereBN88ngNL4IfZIrWU67uXFWNBV6JdY8DrItdj1cwFO89biEWXz1excfgicdrCINvGMDiAtfIkWCOBUpI3HLEiNDlLDGCYlTBcGikjBwQZRwSG6wymFFjj98pVwUmXFVk5hxThG6dYRMd8q/IKOkiMWa2cKzK8SSG5BnnP3L6mqjN/dUON865DQzsxXWezBelvJVx1I3lSJXKKJ3KA5UpuZGYmd0z06SY2ErnehpObLbZkVdJuZBjXei80lM5tKZkYaZle5CYG53Wwg98JPb5rfedu94Tt0c0XLmvJzZXZVIx9JYci3MCazl32W7EN0YfJzjk5Y+IHko/JrzlDmOOS+YVM+iGURT3Tw5PR/3Gc2m5Ndbzy1Tl/7Nh+afuXw3IX2of3FUUrKwvQf7WyRGOGYncD7GMLsgsnaeh231FiB52mK1/j3Nq1pwZoymVz1jXcGKytzn3aKzzIrFGNj0fHcsoauDClhNrqjoR9nb6mTrXtpyFaXIWMxJ3t+Me/nm0jx7Asv/79n8C/lO22AAAAHicbc7JThtBGEXh/9hMJkwBAiQMISHMCdg1dTMHMMbEgAQIWGSVhZc8Hs8HKFLdFSW1dBZd9yur2P/z8mzO3jt/3z6sYlVbsaa1rG0X1rFLu7Fbu7N7e7BHKlTpoZc++hmgxiAfGGKYEUYZ4yPjTDDJJ6aYZobPfGGWOeZZ4CuLfOM7S/xgmRVWWWOdDTb5yS+22KZOA4cnEEkUlOywyx77HHDIEb855oRTmpzR4pw2F/yhM3D976l71d2q52jkcDlCjpgj5ShylDl2anmnrmqonMqrgiqqkqpQlSoZToaT4WQ4GU6Gk+FkOBlOhpPhZXgZXoaX4WV4GV6Gl+G1HLQctBy0HLQctBy0HLQctBz0+iAjyogyoowoI8qIMqKMKCPKiDKSjCQjyUgykowkI8lIMpKWC+0Vulvov0JvKXSj1FvK8Arml+B1AAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEwiggZgHzGAAHfACJAAAAAQAAAADbY/02AAAAAMyVRqkAAAAA1TIQDg==');
        //   pdf.addFont("ff1.ttf", "ff1", "normal");
        //   pdf.setFont('ff1', 'normal');
        //   pdf.addImage(contentDataURL, 'JPEG', 0, 0, 29.7, 20.0);
        //   pdf.save('Filename.pdf');
        // });
      }, 2000);
    })
  }

}



// let myWindows = window.open('', 'PRINT', 'height=595.499987,width=854.92');
//       //  myWindows!.document.write('</head><body>');
//       myWindows!.document.write(res);
//       // myWindows!.document.write('</body></html>');
//       myWindows!.document.close();
//       // myWindows!.focus();
//       setTimeout(function(){
//         myWindows!.print();
//       },2000);

