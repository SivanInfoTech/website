import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as AOS from 'aos';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);



@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css'],
})
export class AboutusComponent implements OnInit {

  constructor(private router: Router) {}
  testimonals = [
    {
      name: "Manikanta",
      reveiw: "I express my gratitude towards SIT (Sivan Info Tech) for enabling me to establish a firm groundwork in AWS Cloud computing, refine my technical proficiencies, and offer me an internship opportunity where I can put my knowledge and skills to practical use."
    },
    {
      name: "Vignesh",
      reveiw: "I joined this institute to take training for AWS Solution Architect – professional level. My all over experience is very good. The knowledge given by the trainers are very helpful to me & during training they solve thought related the topic. Thank you."
    },
    {
      name: "Indrani",
      reveiw: "Provided in depth knowledge about the topics. Shown most of the topics practically which help in visualizing the topic. Providing training video is a plus."
    },
    {
      name: "Praveen",
      reveiw: "Training was excellent with good interaction. Knowledge sharing is good. Recording facility is excellent for revising. Course was practically and informative. Trainer Kavitha is enthusiastic and aware of what she is explaining. The course helped to build confidence, Valuable experiences, and learning. She mapped all info’s to real-time world, where it’s helped a lot for me to understand easily."
    }
  ]

  ngOnInit() { 
    AOS.init({offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,});
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Re-trigger ScrollTrigger on route change
        (gsap as any).refresh();
      }
    });
  gsap.to('.who-are-we-header', {
    ease: 'power2.out',
    backgroundImage: "linear-gradient(349deg, #fa5853 1.83%, #f46692 52% 53.68%, #ffc444 106.48%)",
    color: "white",
   y:15,
  //  markers:true,
    scrollTrigger: {
      trigger: '.who-are-we-header',
      start: 'bottom 30%', 
      end: 'bottom top',
      scrub: 0.5,
    },
    duration: 1,
  });

  gsap.to('.who-are-we', {
    ease: 'power2.out',
   y:15,
    scrollTrigger: {
      trigger: '.who-are-we',
      start: 'bottom 40%', 
      end: 'bottom top',
      scrub: 0.5,
    },
    duration: 1,
  });

  gsap.to('.our-services-header', {
    ease: 'power2.out',
    backgroundImage: "linear-gradient(349deg, #fa5853 1.83%, #f46692 52% 53.68%, #ffc444 106.48%)",
    color: "white",
   y:15,
    scrollTrigger: {
      trigger: '.our-services-header',
      start: 'bottom 30%', 
      end: 'bottom top',
      scrub: 0.5,
    },
    duration: 1,
  });

  gsap.to('.service', {
    ease: 'power2.out',
   y:15,
    scrollTrigger: {
      trigger: '.service',
      start: 'bottom 30%', 
      end: 'bottom top',
      scrub: 0.5,
    },
    duration: 1,
  });
  
  }
}

