// loading.component.ts

import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Hide the loading component once the entire website has finished loading
    window.addEventListener('load', () => {
      const loadingElement = document.getElementById('loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }
    });
  }
}


// import { Component, OnInit, AfterViewInit } from '@angular/core';

// @Component({
//   selector: 'app-loading',
//   templateUrl: './loading.component.html',
//   styleUrls: ['./loading.component.scss']
// })
// export class LoadingComponent implements OnInit, AfterViewInit {

//   public showLoading: boolean = true;

//   ngOnInit(): void {
//     // Simulate an asynchronous operation (e.g., API call, data loading)
//     // In a real application, you can replace this with your actual loading logic.
//     setTimeout(() => {
//       this.showLoading = false;  // Set showLoading to false when the loading is complete
//     }, 1000); // Adjust the timeout based on your needs
//   }

//   ngAfterViewInit(): void {
//     // Optionally, you can perform additional actions after the view has been initialized
//   }
// }
