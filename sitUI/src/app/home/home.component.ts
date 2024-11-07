import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { ADSService } from 'src/service/ads.service';
import * as AOS from 'aos';
import { ScreenSizeService } from '../screen-size.service';

import  splitType from "split-type";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NgxUiLoaderService } from 'ngx-ui-loader';
gsap.registerPlugin(ScrollTrigger);

declare const Application: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  isMobile: boolean;

  @ViewChild('myVideo') myVideoElement: ElementRef;
  @ViewChild('pinsection') leftSection1Ref: ElementRef;
  @ViewChild('pinsectionBreak') pinsectionBreakPoint: ElementRef;

  cardTags= ['Security', 'Mobility', 'Provisioning', 'Automation', 'Cost', 'Scalability', 'Customizable', 'Elasticity',  'Resilience', 'Availability', 'Opex', 'Backup']
  flashads: string[] = []
 // flashads = ['Free AWS certification training , 50% off on Azure certification training , New advanced modules added in Python curriculum']
  classRoomTimeId = 0
  whypoints = ["Sivan Info Tech which is primarily focused on cloud computing & leading technology training such as Kubernetes and Cloud Accelerator development. So, the students can be hired by us for our cloud products development.",
    "SIT is not only concentrating on delivering the theory & practical sessions, but we will also sit along with the candidate and mould him/her from the scratch such as resume preparation, guiding on uploading it in leading job portal.",
    "15 capstone projects to the students, so upon that the completion of all those projects, students will get the exposure of L1 and L2 Cloud engineers, where that exposure help them to answers the interview questions in a better and unique way.",
    "There will be a separate session to the students for understanding the Cloud engineer responsibility and day to day operations.",
    "Real-time interview questions will be cascaded with the students so that it can be helpful for them to clear both on-campus & off-campus interviews.",
    "We will schedule the Mock interviews with each student and review them their takeaway from the courses.",
    "By having all these aspects such as 15 capstone projects, teaching the required cloud components from the basics, real-time day to day activities, 100’s of interview questions and multiple mock sessions we are most happy and pride to claim that we have a capability to provide this training courses in more productive way. "]
   
  features = [{
    title: "Real Time Experts as Trainers",
    description: "Sivan Info Tech which is primarily focused on cloud computing & leading technology training such as Kubernetes and Cloud Accelerator development. So, the students can be hired by us for our cloud products development.",
    icon: "access_time",
    iconcolor: "#0e35f7"
  },
  {
    title: "Live Project",
    description: "15 capstone projects to the students, so upon that the completion of all those projects, students will get the exposure of L1 and L2 Cloud engineers, where that exposure help them to answers the interview questions in a better and unique way.",
    icon: "desktop_windows",
    iconcolor: "#00ff2b"
  },
  {
    title: "Certification",
    description: "15 capstone projects to the students, so upon that the completion of all those projects, students will get the exposure of L1 and L2 Cloud engineers, where that exposure help them to answers the interview questions in a better and unique way.",
    icon: "school",
    iconcolor: "#be0ef7"
  },
  {
    title: "Affordable Fees",
    description: "15 capstone projects to the students, so upon that the completion of all those projects, students will get the exposure of L1 and L2 Cloud engineers, where that exposure help them to answers the interview questions in a better and unique way.",
    icon: "monetization_on",
    iconcolor: "#00ff2b"
  },
  {
    title: "Flexibility",
    description: "15 capstone projects to the students, so upon that the completion of all those projects, students will get the exposure of L1 and L2 Cloud engineers, where that exposure help them to answers the interview questions in a better and unique way.",
    icon: "tune",
    iconcolor: "#ff00008f"
  },
  {
    title: "Placement Support",
    description: "15 capstone projects to the students, so upon that the completion of all those projects, students will get the exposure of L1 and L2 Cloud engineers, where that exposure help them to answers the interview questions in a better and unique way.",
    icon: "business_center",
    iconcolor: "#00f7ff"
  }]
  enquiryref: MatDialogRef<EnquiryComponent>;
  
whyCloudDataList:any=[
  { title : 'Security' , image :"../../assets/images/cloud_security.png"},
  { title : 'Mobility' , image :"../../assets/images/Mobility.png"},
  { title : 'Provisioning' , image :"../../assets/images/cloud-Provisioning.png"},
  { title : 'Automation' , image :"../../assets/images/cloud-automation.png"},
  { title : 'Cost' , image :"../../assets/images/cloud-cost.png"},
  { title : 'Scalability' ,image :"../../assets/images/cloud-scalability.png"},
  { title : 'Customizable' , image :"../../assets/images/cloud_security.png"},
  { title : 'Elasticity' , image :"../../assets/images/cloud-Elasticity.png"},
  // { title : 'Capex' , image :"../../assets/images/capex.png"},
  { title :  'Resilience' , image :"../../assets/images/Resilience.png"},
  { title : 'Availability' , image :"../../assets/images/Availability.png"},
  { title : 'Opex' , image :"../../assets/images/opex.png"},
  // { title : 'Carbon Footprint' ,image :"../../assets/images/cloud_security.png"},
  { title : 'Backup' , image :"../../assets/images/cloud_security.png"},]
  // { title : 'DR' , image :"../../assets/images/cloud_security.png"}, ]


  firstGroup: any[] = [];
  secondGroup: any[] = [];
  // thirdGroup: any[] = [];
  constructor(
    public dialog: MatDialog,
    private AdsService: ADSService,
    private screenSizeService: ScreenSizeService,
    private ngxLoader: NgxUiLoaderService,
  ) { }

  // ngOnInit() {
  //   this.attachScrollEventListener();
  //   AOS.init({offset: 200,
  //     duration: 600,
  //     easing: 'ease-in-sine',
  //     delay: 100,});
  //   this.getflashnews();

  //   this.screenSizeService.isMobile$.subscribe((isMobile) => {
  //     this.isMobile = isMobile;
  //   });
  // }

  attachScrollEventListener() {
    window.addEventListener('scroll', () => {
      this.pinningScroll();
    });
  }

  pinningScroll(){
    // Mobile
    if(this.isMobile){
      let screenHeight = document.documentElement.clientHeight;
      let offsetHeight = document.documentElement.clientHeight * 0.1;
      let bottomOffset = screenHeight * 0.8;
      let scrollingTop = this.pinsectionBreakPoint.nativeElement.getBoundingClientRect().top ;
      let scrollingBottom = this.pinsectionBreakPoint.nativeElement.getBoundingClientRect().bottom ;

      if(scrollingBottom <= bottomOffset) {
        this.leftSection1Ref.nativeElement.style.position = "absolute";
        this.leftSection1Ref.nativeElement.style.bottom = '-60vh';
        this.leftSection1Ref.nativeElement.style.top = "auto";
      }
      else if(scrollingTop <= screenHeight) {
        this.leftSection1Ref.nativeElement.style.position = "fixed";
        this.leftSection1Ref.nativeElement.style.top = '0vh';
        this.leftSection1Ref.nativeElement.style.bottom = "auto";
      }
      else {
        this.leftSection1Ref.nativeElement.style.position = "relative";
        this.leftSection1Ref.nativeElement.style.top = "auto";
        this.leftSection1Ref.nativeElement.style.bottom = "auto";
      }

    }
    // Laptop
    else {
      let offsetHeight = document.documentElement.clientHeight * 0.3;
      let thresholdHeight = this.leftSection1Ref.nativeElement.getBoundingClientRect().height + offsetHeight;
      let scrollingBottom = this.pinsectionBreakPoint.nativeElement.getBoundingClientRect().bottom ;

      if(scrollingBottom <= thresholdHeight){
        this.leftSection1Ref.nativeElement.style.position = "absolute";
        this.leftSection1Ref.nativeElement.style.bottom = '0';
        this.leftSection1Ref.nativeElement.style.top = "auto";
        console.log('con1');
      }

      else if(this.pinsectionBreakPoint.nativeElement.getBoundingClientRect().top <= offsetHeight){
          this.leftSection1Ref.nativeElement.style.position = "fixed";
          this.leftSection1Ref.nativeElement.style.top = `${offsetHeight}px`;
          this.leftSection1Ref.nativeElement.style.zIndex = 1;
          console.log('con2');
      }
    
      else {
        this.leftSection1Ref.nativeElement.style.position = "relative";
        this.leftSection1Ref.nativeElement.style.bottom = 'auto';
        this.leftSection1Ref.nativeElement.style.top = "auto";
        console.log('con3');
      }
    }
  }

  handleScroll() { 
    
    if (this.isElementInViewport(this.myVideoElement.nativeElement)) {
      this.myVideoElement.nativeElement.style.display = 'block'; // Show the video
      this.myVideoElement.nativeElement.play();
      
      window.removeEventListener('scroll', this.handleScroll);
      console.log(this.myVideoElement.nativeElement.currentTime);
    }
  }

  isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }


  isElementNotInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom < 0 || rect.top > window.innerHeight
    );
  }
  

  ngOnInit() {
    this.ngxLoader.start();
    this.firstGroup = this.whyCloudDataList.slice(0, 8);
    this.secondGroup = this.whyCloudDataList.slice(8, 14);
    // this.thirdGroup = this.whyCloudDataList.slice(11, 15);
    this.attachScrollEventListener();
    AOS.init({offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,});
    this.getflashnews();

    this.screenSizeService.isMobile$.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  // ngAfterViewInit() {
    gsap.to('.bigCard', {
      scale: 1.07, 
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.bigCard',
        start: 'top center', 
        end: 'bottom top',
        scrub: 0.5
      },
    });

    const animation1 =  gsap.to('.circle', {
      width: "15vmin",
      height: "15vmin",
      scale: 10,
      transform: this.isMobile ? 'translateY(35vh)' : "",
      ease: 'power2.out',
      // borderRadius: 0,
      scrollTrigger: {
        trigger: '.circle',
        start: 'bottom 50%', 
        end: 'bottom top',
        scrub: 0.5,
      },
      duration: 1,
    });

    animation1.eventCallback('onStart', () => {
      gsap.to('.benefits', {
        opacity:1,
        letterSpacing: this.isMobile ? '0px' :"1px",
        wordSpacing: "1px",
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.benefits',
          start: 'top 50%', 
          end: 'bottom 40%',
          scrub: 0.5,
        },
        duration: 1,
      });
    });

      gsap.from('.head_by', {
        duration: 1.5,
        y: -10,
        opacity: 0,
        onComplete: () => {
          gsap.set('.head_by', { clearProps: 'all' });
        }
      });

      gsap.from('.h2head', {
        duration: 1.5,
        y: -10,
        opacity: 0, 
        onComplete: () => {
          gsap.set('.h2head', { clearProps: 'all' }); 
        }
      });


    gsap.from('.classNameToggle', {
      duration: 1.5,
      y: -10,
      opacity: 0, 
      onComplete: () => {
        gsap.set('.classNameToggle', { clearProps: 'all' });
      }
    });
    gsap.fromTo('.class-name-1', { width: 0 }, { width: '55%', duration: 2, onComplete: () => {
        gsap.fromTo('.class-name-2', { width: 0 }, { width: '100%', duration: 3,})
    } });
    gsap.fromTo(".class-name", { width: 0}, {
      duration: 2, 
      width: '100%', 
      ease: "power2.out", 
      stagger: 1 // Staggered delay between animations
    });

    // gsap.to('.homepage', {

    //   background: "rgb(245,100,135)",
    //   ease: 'power2.out',
    //   scrollTrigger: {
    //     trigger: '.top-courses-section',
    //     start: 'top 50%', 
    //     end: 'bottom 50%', // Adjusted end position
    //     scrub: 0.5,
    //     onLeave: () => {
    //       gsap.to('.homepage', {
    //         background: "",
    //         ease: 'power2.out',
    //         duration: 1
    //       });
    //     }
    //   },
    //   duration: 1
    // });

    

    const classesToAnimatepopUp = ['".top-course-title"'];


    // const classesToAnimate = ['.classNameToggle', '.head_by', '.h2head', '.red', '.phone'];

    // classesToAnimate.forEach(className => {
    //   gsap.from(className, {
    //     scrollTrigger: {
    //       trigger: className,
    //       scrub: true,
    //       toggleClass: 'active',
    //       start: 'top center',
    //     },
    //     duration: 1,
    //     y: -100,
    //   });
    // });


    const classesToAnimatecards = ['.card1', '.card2', '.card3', '.card4'];

    classesToAnimatecards.forEach(className => {
      gsap.to(className, {
        x: 0, // Start position at -400px
        // transform: "perspective(500px) rotateX(10deg)",
        // scale:1.08,
        duration: 1, // Duration of the animation
        ease: 'power2.out', // Easing function
        rotateX:0,
        scrollTrigger: {
          trigger: className,
          start: 'top 70%', // Start the animation when the div reaches the top center of the viewport
          end: 'bottom 60%', // End the animation when the div reaches the bottom center of the viewport
          scrub: true, // Smoothly animate as you scroll,
        },
      });

    });

    

const ourText = new splitType('p.our-text', { types: 'chars' })
const chars = ourText.chars

    gsap.fromTo(
      chars,
      { 
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 1.75,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: chars, // The element that triggers the animation
          start: 'top 80%', // Start the animation when the top of the element is 80% in view
          end: 'bottom 40%', // End the animation when the bottom of the element is 20% in view
          toggleActions: 'play none none reverse',
        },
      }
    )
    
  }

  // const ourText1 = new splitType('.benefits', { types: 'chars' })
  // const chars1 = ourText1.chars

  //   gsap.fromTo(
  //     chars1,
  //     { 
  //       y: 0,
  //       opacity: 0
  //     },
  //     {
  //       y: 0,
  //       opacity: 1,
  //       stagger: 0.05,
  //       duration: 1.5,
  //       ease: 'power4.out',
  //       scrollTrigger: {
  //         trigger: chars1, // The element that triggers the animation
  //         start: 'top 80%', // Start the animation when the top of the element is 80% in view
  //         end: 'bottom 40%', // End the animation when the bottom of the element is 20% in view
  //         toggleActions: 'play none none reverse',
  //       },
  //     }
  //   )
    
  // }

  

  openenquiryform() {
    this.enquiryref = this.dialog.open(EnquiryComponent, {
      panelClass: 'enquireformpannelclass',
      
      data: { ispopup: true }
    });
  }

  ngOnDestroy() {

    if (this.classRoomTimeId) {

      clearInterval(this.classRoomTimeId);

    }

  }

  getflashnews() {
    this.AdsService.getflashAds().subscribe((res: any) => {
      // console.log(res)
      let adsdata = res;
      if(adsdata.details && adsdata.details.flashadslist && adsdata.details.flashadslist.length > 0) {
        adsdata.details.flashadslist.forEach((add:any,index:any) => {
          this.flashads.push(this.flashads + add.adsTitle + " " + add.adsContent + "  .  ");
        })
        console.log(this.flashads,"abcd")
        console.log( adsdata.details.flashadslist)
        
      }
    })
  }

  
}