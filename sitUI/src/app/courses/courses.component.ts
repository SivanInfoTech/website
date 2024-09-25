import { Directive, Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserService } from 'src/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/models/user.model';
import { CourseService } from 'src/service/course.service';
import { ScreenSizeService } from '../screen-size.service';


import {base64StringToBlob} from 'blob-util';
import { saveAs } from 'file-saver';
import * as AOS from 'aos';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import splitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {

  tiles: string[] = ['Tile 1', 'Tile 2', 'Tile 3']; // Declare the tiles property with some sample data

  @ViewChild('pinCourseNavSection') courseNavPin: ElementRef; 
  @ViewChild('pinCourseNavSectionTrigger') courseNavPinTrigger: ElementRef; 

  isMobile: boolean;
  isSticky: Boolean = false
  enquiryref: MatDialogRef<EnquiryComponent>;
  courseid: string;
  selectedcoursedetails: any
  skillSet1: any;
  skillSet2: any;
  currentUser$: Observable<User | null>;
  batchtoenroll: any;
  selectedSection: string = 'section-name-benefits';

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    @Inject(DOCUMENT) document: Document,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private courseService: CourseService,
    private toastr: ToastrService,
    private screenSizeService: ScreenSizeService,
    // public dialogRef: MatDialogRef<CoursesComponent>
  ) { }

  sections = [
    { name: 'Benefits', id: 'benefits' },
    { name: 'Related Job Roles', id: 'jobroles' },
    { name: 'Skills Covered', id: 'skillscovered' },
    { name: 'Key Highlights', id: 'keyhighlights' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Enquiry', id: 'enquiry' },
    { name: 'Upcoming Batches', id: 'upcomingbatches' },
    { name: 'FAQ', id: 'syllabus' }
  ]

  enquirystatus: any;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    let outer = document.getElementById('b-menuarea-sticky');
    let inner = document.getElementById('benefits');

    if (outer && inner) {
      if (window.pageYOffset > inner.offsetTop) {
        outer.style.position = "fixed"
        outer.style.top = "0"
      }
      else
        outer.style.position = "relative"
    }
  }

  scrollTo(sectionId: string): void {
    const element = this.el.nativeElement.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      document.getElementById(this.selectedSection)?.classList.remove('section-highligted');
      document.getElementById(`section-name-${sectionId}`)?.classList.add('section-highligted');
      this.selectedSection = `section-name-${sectionId}`;
    }
  }

  ngOnInit() {
    console.log("in ngoninit");
    this.animateTileEffect();


    this.attachScrollEventListener();
    AOS.init({offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,});
    this.currentUser$ = this.userService.currentUser;

    this.route.queryParams
      .subscribe(params => {
        this.courseid = params.id;
        this.courseService.getcoursedetails(this.courseid).subscribe((res: any) => {
          this.selectedcoursedetails = res.details
          this.batchtoenroll = this.selectedcoursedetails.batches[0]
          this.skillSet1 = this.selectedcoursedetails.skillscovered.slice(0, this.selectedcoursedetails.skillscovered.length/2);
          this.skillSet2 = this.selectedcoursedetails.skillscovered.slice(this.selectedcoursedetails.skillscovered.length/2);
        })
        console.log(this.selectedcoursedetails);
        console.log(this.selectedcoursedetails.skillscovered + " :: " + this.skillSet1 + " :: " + this.skillSet2);
        console.log("resetting");
        setTimeout(() => this.resetKeyHighlightsZipSection(), 200);
  
      console.log("done resetting");
      });


    this.screenSizeService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });

    // Call the methods to initialize the scroll effects
    this.drawLine();
    this.positionTheDot();
  
    // Listen for scroll events and update the scroll effects
    window.addEventListener('scroll', () => {
      this.drawLine();
      this.positionTheDot();
    });
  }
  ngAfterViewInit() {
    this.drawLine();
    this.positionTheDot();
  }

  resetKeyHighlightsZipSection() {

    for (let i = 0; ; i++) {
      const element = document.getElementById(`leftText${i}`);
      const element2 = document.getElementById(`leftImg${i}`);
      const element3 = document.getElementById(`rightText${i}`);
      const element4 = document.getElementById(`rightImg${i}`);

      if (element3) {
        element3.classList.remove('left-transform');
        element4 && element4.classList.remove('left-transform');
        element && element.classList.remove('right-transform');
        element2 && element2.classList.remove('right-transform');
      }
      else if (element) {
        element.classList.remove('right-transform');
        element2 && element2.classList.remove('right-transform');
      }
      else {
        break;
      }
    }
  }

  attachScrollEventListener() {
    window.addEventListener('scroll', () => {
      // this.handleScroll();
      this.pinCourseNavSection();
      this.keyHighlightsZipSection();
    });
  }

  pinCourseNavSection(){
    
    if( this.courseNavPin.nativeElement.getBoundingClientRect().top <= (document.documentElement.clientHeight*0.03) ){
      this.courseNavPin.nativeElement.style.position = "fixed";
      this.courseNavPin.nativeElement.style.top = "0vh";
      this.courseNavPin.nativeElement.style.marginLeft= this.isMobile ? "2.5vw" : "auto";
      this.courseNavPin.nativeElement.style.marginRigft= this.isMobile ? "2.5vw" : "auto";

    }
    if(this.courseNavPinTrigger.nativeElement.getBoundingClientRect().bottom >= 0){
      this.courseNavPin.nativeElement.style.position = "absolute";
      this.courseNavPin.nativeElement.style.top = "auto";
    }
  }

  keyHighlightsZipSection(){
    for (let i = 0; ; i++) {
      const element = document.getElementById(`leftText${i}`);
      const element2 = document.getElementById(`leftImg${i}`);

      const element3 = document.getElementById(`rightText${i}`);
      const element4 = document.getElementById(`rightImg${i}`);

      if (element3 && element4) {
        if(element3.getBoundingClientRect().top <= (document.documentElement.clientHeight*0.5)){
          element3.classList.add('left-transform');
          element4.classList.add('left-transform');
          // element2.classList.add('transformed');
        }
      } else {
        break;
      }

      // if (element4) {
      //   if(element4.getBoundingClientRect().top <= (document.documentElement.clientHeight*0.5)){
      //     element4.classList.add('left-transform');
      //     // element2.classList.add('transformed');
      //   }
      // } else {
      //   break;
      // }

      if (element && element2) {
        if(element.getBoundingClientRect().top <= (document.documentElement.clientHeight*0.5)){
          element.classList.add('right-transform');
          element2.classList.add('right-transform');
          // element2.classList.add('transformed');
        }
      } else {
        break;
      }

      // if (element2) {
      //   if(element2.getBoundingClientRect().top <= (document.documentElement.clientHeight*0.5)){
      //     element2.classList.add('right-transform');
      //     // element2.classList.add('transformed');
      //   }
      // } else {
      //   break;
      // }

  }

  }

  openenquiryform() {
    this.enquiryref = this.dialog.open(EnquiryComponent, {
      width: '40vw',
      data: { ispopup: true }
    });
  }

  enrollcourse(userloggedin: Boolean) {
    if (userloggedin) {
      let req_body = {
        courseid: this.courseid,
        courseshortform: this.selectedcoursedetails.courseshortform,
        coursetitle: this.selectedcoursedetails.title,
        batchtoenroll: this.batchtoenroll
      }
      this.courseService.enrollcourse(req_body).subscribe((res: any) => {
        this.toastr.success(res['Message']);
      }, (error) => {
        console.log(error)
        this.toastr.error('Enrollment failed, please try after sometime');
      })
    }
    else {
      this.router.navigate(["/login"]);
    }
  }
  
  downloaddoc(courseid: string) {
    this.courseService.getCoursesyllabusDoc(courseid).subscribe((res: any) => {
      console.log(res)
      let blob = base64StringToBlob(res.details, 'application/pdf');
      saveAs(blob, `${res.courseid}-syllabus.pdf`)
    }, (e) => {
      console.log(e)
      if (e.error.Message) this.toastr.error(e.error.Message)
      else this.toastr.error(e.error)
    })
  }

  animateTileEffect(): void {
    // Your GSAP animation logic goes here
    gsap.from('.tile', { opacity: 0, scale: 0, stagger: 0.2, duration: 1, ease: 'elastic.out(1, 0.3)' });
  }


  drawLine() {
    const scrollSectionBottom = document.getElementById('detail-section')?.getBoundingClientRect().bottom || 0;
    const scrollSectionHeight = document.getElementById('detail-section')?.getBoundingClientRect().height || 1;
    if(scrollSectionBottom < (scrollSectionHeight*1.5)) {
      console.log("innnn");
    const path = this.el.nativeElement.querySelector('#path');
    const pathLength = path.getTotalLength();
    // const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;


    // const scrollSection = this.el.nativeElement.querySelector('.checked-patten');
      const percentDone = ((scrollSectionHeight * 1.2) - scrollSectionBottom ) / scrollSectionHeight;
      console.log("length " + pathLength + "percent done " + percentDone);
      const length = percentDone * pathLength;
      path.style.strokeDasharray = `${length} ${pathLength}`;
    }
    
    // const percentDone = window.scrollY / maxScrollTop;
    // const length = percentDone * pathLength;
    // path.style.strokeDasharray = `${length} ${pathLength}`;
  }

  positionTheDot() {
//     const scrollSection = this.el.nativeElement.querySelector('.checked-patten');
// const scrollPercentage = (scrollSection.scrollTop) / 
//   (scrollSection.scrollHeight - scrollSection.clientHeight);

    // const scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / 
    //   (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    // const path = this.el.nativeElement.querySelector('#path');
    // const pathLen = path.getTotalLength();
    // const pt = path.getPointAtLength(scrollPercentage * pathLen);
    // const dot = this.el.nativeElement.querySelector('#dot');
    // dot.setAttribute('transform', `translate(${pt.x},${pt.y + 5})`);


    const scrollSectionBottom = document.getElementById('detail-section')?.getBoundingClientRect().bottom || 0;
    const scrollSectionHeight = document.getElementById('detail-section')?.getBoundingClientRect().height || 1;
    if(scrollSectionBottom < (scrollSectionHeight*1.5)) {
      const path = this.el.nativeElement.querySelector('#path');
      const pathLength = path.getTotalLength();
      const percentDone = ((scrollSectionHeight * 1.2) - scrollSectionBottom ) / scrollSectionHeight;
      const pt = path.getPointAtLength(percentDone * pathLength);
      console.log("points :: " + pt.x + " :: " + pt.y);
      const dot = this.el.nativeElement.querySelector('#dot');
      dot.setAttribute('transform', `translate(${pt.x},${pt.y + 5})`);
    }
  }

  rad2deg(rad: any) {
    return 180 * rad / Math.PI;
  }

}
